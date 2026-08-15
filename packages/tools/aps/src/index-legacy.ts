import * as fs from 'node:fs';
import * as path from 'node:path';
import { type Browser, chromium, type Page } from 'playwright';
import TurndownService from 'turndown';

// Initialize Turndown for HTML to Markdown conversion
const turndownService = new TurndownService();

// Define the common PermissionInfo interface
interface PermissionInfo {
  // Common Fields
  id: string;
  name: string;
  description: string;
  deprecated: boolean;
  replacement: string | null;
  categories: string[];

  // Deprecation (common structure)
  deprecationInfo?: {
    deprecatedSince?: string | number;
    removalPlan?: string | number;
    migrationGuide?: string;
    platforms?: {
      android?: { sinceApi: number; removalApi: number };
      ios?: { sinceVersion: string; removalVersion: string };
    };
  };

  // Required Conditions (common structure)
  required?: {
    mandatory?: boolean;
    autoInject?: boolean;
    conditions?: {
      android?: Array<{ ifFeature: string; requiredBy: string[] }>;
      ios?: Array<{ ifFeature?: string; requiredFrameworks?: string[] }>;
    };
  };

  // Platform-Specific Details
  platforms: {
    android?: {
      name: string;
      protectionLevel: string[];
      minSdk: number;
      constantValue: string;
    };
    ios?: {
      usageDescriptionKey: string;
      privacyDescription: string;
      requiredDeviceCapabilities: string[];
      minIosVersion: string;
    };
  };
}

// Generic scraper configuration interface
interface ScraperConfig {
  // URLs and base paths
  baseUrl: string;
  mainPagePath: string;

  // Output configuration
  outputFile: string;

  // Performance settings
  maxConcurrentRequests: number;
  requestDelay: number;
  batchDelay: number;

  // Browser settings
  headless: boolean;

  // Selectors
  mainContentSelector: string;

  // Category mapping
  categoryKeywords: Record<string, string>;
}

// Base class for permission scrapers
abstract class PermissionsScraper<T extends PermissionInfo> {
  protected config: ScraperConfig;
  protected permissions: T[] = [];
  protected browser: Browser | null = null;

  constructor(config: Partial<ScraperConfig>, defaultConfig: ScraperConfig) {
    // Merge provided config with defaults
    this.config = { ...defaultConfig, ...config };

    // Load existing permissions if file exists
    if (fs.existsSync(this.config.outputFile)) {
      try {
        this.permissions = JSON.parse(
          fs.readFileSync(this.config.outputFile, 'utf-8'),
        );
        console.log(
          `Loaded ${this.permissions.length} existing permissions from ${this.config.outputFile}`,
        );
      } catch (error) {
        console.error(
          `Error loading existing permissions from ${this.config.outputFile}:`,
          error,
        );
        this.permissions = [];
      }
    }
  }

  // Initialize the browser
  protected async initBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: this.config.headless,
      });
    }
    return this.browser;
  }

  // Close the browser
  protected async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // Extract categories from URL based on keywords
  protected getCategoryFromUrl(url: string): string[] {
    const categories: string[] = [];
    const urlParts = url.split('/');

    // Check for category keywords
    Object.entries(this.config.categoryKeywords).forEach(
      ([keyword, category]) => {
        if (url.includes(keyword)) {
          categories.push(category);
        }
      },
    );

    // If no specific category was found, use the last part of the URL path
    if (categories.length === 0 && urlParts.length > 0) {
      categories.push(urlParts[urlParts.length - 1].toLowerCase());
    }

    return categories;
  }

  // Helper to extract version numbers from text
  protected extractVersionFromText(text: string): string {
    const versionMatch = text.match(/(\d+(\.\d+)*)/);
    return versionMatch ? versionMatch[1] : '';
  }

  // Process a batch of URLs in parallel
  protected async processBatch(urls: string[]): Promise<T[]> {
    const browser = await this.initBrowser();
    const results = await Promise.allSettled(
      urls.map(async (url) => {
        const page = await browser.newPage();
        try {
          return await this.processPermissionPage(page, url);
        } catch (error) {
          console.error(`Error processing ${url}:`, error);
          return null;
        } finally {
          await page.close();
        }
      }),
    );

    // Filter out failed promises and nulls
    const validResults = results
      .filter(
        (result) => result.status === 'fulfilled' && result.value !== null,
      )
      .map((result) => (result as PromiseFulfilledResult<T>).value);

    return validResults;
  }

  // Save the results to a JSON file
  public saveToFile(filename?: string): void {
    const outputPath = path.resolve(
      process.cwd(),
      filename || this.config.outputFile,
    );
    fs.writeFileSync(outputPath, JSON.stringify(this.permissions, null, 2));
    console.log(`Results saved to ${outputPath}`);
  }

  // Abstract methods that must be implemented by platform-specific scrapers
  protected abstract permissionExists(key: string): boolean;
  protected abstract createPermissionId(key: string): string;
  protected abstract extractPermissionLinks(content: string): string[];
  protected abstract processPermissionPage(
    page: Page,
    url: string,
  ): Promise<T | null>;

  // The main scraping method - common implementation but calls abstract methods
  public async scrapePermissions(): Promise<T[]> {
    try {
      await this.initBrowser();
      console.log(
        `Fetching main page from ${this.config.baseUrl}${this.config.mainPagePath}...`,
      );

      const page = await this.browser?.newPage();
      const mainUrl = `${this.config.baseUrl}${this.config.mainPagePath}`;
      await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });

      // Extract HTML content and convert to markdown
      const html = await page.innerHTML(this.config.mainContentSelector);
      const content = turndownService.turndown(html);

      await page.close();

      console.log('Extracting permission links...');
      const allPermissionLinks = this.extractPermissionLinks(content);

      // Let each implementation filter out already processed permissions
      const newPermissionLinks =
        this.filterNewPermissionLinks(allPermissionLinks);

      console.log(
        `Found ${allPermissionLinks.length} permission links (${newPermissionLinks.length} new to process).`,
      );

      // Process permissions in parallel batches
      const batches = [];
      for (
        let i = 0;
        i < newPermissionLinks.length;
        i += this.config.maxConcurrentRequests
      ) {
        batches.push(
          newPermissionLinks.slice(i, i + this.config.maxConcurrentRequests),
        );
      }

      // Process all batches
      const newPermissions: T[] = [];
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(
          `Processing batch ${i + 1}/${batches.length} (${batch.length} URLs)...`,
        );
        const batchResults = await this.processBatch(batch);
        newPermissions.push(...batchResults);

        console.log(
          `Batch ${i + 1} completed. Processed ${batchResults.length} permissions in this batch.`,
        );

        // Add a small delay between batches to avoid overwhelming the server
        if (i < batches.length - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.config.batchDelay),
          );
        }
      }

      // Add all new permissions to the existing ones
      this.permissions.push(...newPermissions);

      // Now save everything to file once
      this.saveToFile();

      await this.closeBrowser();
      console.log(
        `Successfully processed ${newPermissions.length} new permissions. Total: ${this.permissions.length}`,
      );
      return this.permissions;
    } catch (error) {
      console.error('Error scraping permissions:', error);
      await this.closeBrowser();
      throw error;
    }
  }

  // Allow each implementation to determine which links are new
  protected abstract filterNewPermissionLinks(allLinks: string[]): string[];
}

// Apple-specific scraper configuration interface
interface AppleScraperConfig extends ScraperConfig {
  // RegEx patterns for content extraction
  patterns: {
    keyNameBullet: RegExp;
    keyNameHeader: RegExp;
    description: RegExp;
    deprecationNotice: RegExp;
    iosVersion: RegExp;
    privacyName: RegExp;
    discussion: RegExp;
    deviceCapabilities: RegExp;
    alternateDescription: RegExp;
  };

  // Default values
  defaults: {
    minIosVersion: string;
  };
}

// Apple-specific permissions implementation
class ApplePermissionsScraper extends PermissionsScraper<PermissionInfo> {
  private appleConfig: AppleScraperConfig;

  // Define Apple-specific defaults
  private static readonly DEFAULT_CONFIG: AppleScraperConfig = {
    baseUrl: 'https://developer.apple.com',
    mainPagePath: '/documentation/bundleresources/protected-resources',

    outputFile: 'apple-permissions.json',

    maxConcurrentRequests: 5,
    requestDelay: 500,
    batchDelay: 1000,

    headless: true,

    mainContentSelector: '#app-main',

    patterns: {
      keyNameBullet: /\*\s+([A-Z][A-Za-z0-9]+UsageDescription)\n/,
      keyNameHeader: /=+\n([A-Z][A-Za-z0-9]+UsageDescription)\n=+/,
      description:
        /=+\n[A-Z][A-Za-z0-9]+UsageDescription\n=+\n(.*?)(?:\n\w|\n-|\n\*|\n#)/s,
      deprecationNotice: /Deprecated[^\n]*\n\n([^\n#]+)/i,
      iosVersion: /iOS\s+(\d+(\.\d+)*)/i,
      privacyName: /Name\n(Privacy[^\n]+)\n/,
      discussion: /Discussion\]\([^)]+\)\n-+\n(.*?)(?:\n\[|\n#|\n$)/s,
      deviceCapabilities: /`([^`]+)`/g,
      alternateDescription: /A message that tells the user why the app[^.]+\./,
    },

    categoryKeywords: {
      location: 'location',
      bluetooth: 'bluetooth',
      camera: 'camera',
      microphone: 'microphone',
      photo: 'photos',
      media: 'media',
      health: 'health',
      contact: 'contacts',
      calendar: 'calendar',
      siri: 'siri',
      face: 'face',
      tracking: 'tracking',
    },

    defaults: {
      minIosVersion: '7.0',
    },
  };

  constructor(config: Partial<AppleScraperConfig> = {}) {
    // Merge with base config
    super(config, ApplePermissionsScraper.DEFAULT_CONFIG);

    // Store complete config with Apple-specific fields
    this.appleConfig = {
      ...ApplePermissionsScraper.DEFAULT_CONFIG,
      ...config,
    };

    // Deep merge for Apple-specific nested objects
    if (config.patterns) {
      this.appleConfig.patterns = {
        ...ApplePermissionsScraper.DEFAULT_CONFIG.patterns,
        ...config.patterns,
      };
    }
    if (config.defaults) {
      this.appleConfig.defaults = {
        ...ApplePermissionsScraper.DEFAULT_CONFIG.defaults,
        ...config.defaults,
      };
    }
  }

  // Create a unique ID from the permission key
  protected createPermissionId(key: string): string {
    return key
      .replace(/^NS/, '')
      .replace(/UsageDescription$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');
  }

  // Helper method to check if permission already exists
  protected permissionExists(keyName: string): boolean {
    if (!keyName) return false;

    const permissionId = this.createPermissionId(keyName);
    return this.permissions.some((p) => p.id === permissionId);
  }

  // Extract permission links from markdown content
  protected extractPermissionLinks(markdown: string): string[] {
    const permissionLinks: string[] = [];

    // Regular expression to find all markdown links
    const linkRegex = /\[`?([^`\]]+)`?\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(markdown)) !== null) {
      const linkText = match[1];
      const linkUrl = match[2];

      // Check if this is a permission link
      if (
        linkText.toLowerCase().includes('UsageDescription'.toLowerCase()) ||
        linkUrl.includes('/information-property-list/')
      ) {
        // Convert to full URL if needed
        const fullUrl = linkUrl.startsWith('http')
          ? linkUrl
          : `${this.config.baseUrl}${linkUrl}`;

        permissionLinks.push(fullUrl);
      }
    }

    return [...new Set(permissionLinks)]; // Remove duplicates
  }

  // Filter out already processed permissions
  protected filterNewPermissionLinks(allLinks: string[]): string[] {
    return allLinks.filter((url) => {
      const urlParts = url.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart.includes('usagedescription')) {
        const potentialKeyName = lastPart
          .replace(/-/g, '')
          .replace(/^n/, 'N')
          .replace(/^k/, 'K')
          .replace(/^c/, 'C')
          .replace(/^s/, 'S');

        return !this.permissionExists(potentialKeyName);
      }
      return true; // If we can't determine from URL, include it for processing
    });
  }

  // Extract information from markdown content based on the actual structure
  private extractInfoFromMarkdown(
    markdown: string,
    url: string,
  ): {
    keyName: string;
    description: string;
    deprecationNote: string;
    minIosVersion: string;
    privacyDescription: string;
    deviceCapabilities: string[];
  } {
    // Initialize result object
    const result = {
      keyName: '',
      description: '',
      deprecationNote: '',
      minIosVersion: '',
      privacyDescription: '',
      deviceCapabilities: [] as string[],
    };

    // Extract key name - it's typically the third bullet point or a header
    const keyNameMatch = markdown.match(
      this.appleConfig.patterns.keyNameBullet,
    );
    if (keyNameMatch) {
      result.keyName = keyNameMatch[1].trim();
    } else {
      // Try to find it from a header
      const headerMatch = markdown.match(
        this.appleConfig.patterns.keyNameHeader,
      );
      if (headerMatch) {
        result.keyName = headerMatch[1].trim();
      } else {
        // Extract from URL as last resort
        const urlParts = url.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        if (lastPart.includes('usagedescription')) {
          result.keyName = lastPart
            .replace(/-/g, '')
            .replace(/^n/, 'N')
            .replace(/^k/, 'K')
            .replace(/^c/, 'C')
            .replace(/^s/, 'S');
        }
      }
    }

    // Extract description - typically follows the key name header
    const descriptionMatch = markdown.match(
      this.appleConfig.patterns.description,
    );
    if (descriptionMatch) {
      result.description = descriptionMatch[1].trim();
    }

    // Check for deprecation notice
    const deprecationMatch = markdown.match(
      this.appleConfig.patterns.deprecationNotice,
    );
    if (deprecationMatch) {
      result.deprecationNote = deprecationMatch[1].trim();
    }

    // Extract iOS version information
    const iosVersionMatch = markdown.match(
      this.appleConfig.patterns.iosVersion,
    );
    if (iosVersionMatch) {
      result.minIosVersion = iosVersionMatch[1];
    }

    // Extract name (which often includes "Privacy - ")
    const nameMatch = markdown.match(this.appleConfig.patterns.privacyName);
    let _name = '';
    if (nameMatch) {
      _name = nameMatch[1].trim();
    }

    // Extract privacy description from Discussion section
    const discussionMatch = markdown.match(
      this.appleConfig.patterns.discussion,
    );
    if (discussionMatch) {
      const discussionText = discussionMatch[1].trim();

      // Look for specific patterns in the discussion that indicate privacy description requirements
      if (
        discussionText.includes('required') ||
        discussionText.includes('add this key') ||
        discussionText.includes('privacy')
      ) {
        result.privacyDescription = discussionText;
      }
    }

    // Extract device capabilities from any code-like references
    const codeMatches = markdown.match(
      this.appleConfig.patterns.deviceCapabilities,
    );
    if (codeMatches) {
      codeMatches.forEach((match) => {
        const capability = match.replace(/`/g, '').trim();
        if (
          capability.match(/^[a-z-]+$/) ||
          capability.includes('UIRequiredDeviceCapabilities')
        ) {
          const cleanCapability = capability
            .replace('UIRequiredDeviceCapabilities', '')
            .trim();
          if (
            cleanCapability &&
            !result.deviceCapabilities.includes(cleanCapability)
          ) {
            result.deviceCapabilities.push(cleanCapability);
          }
        }
      });
    }

    return result;
  }

  // Process a single permission page
  protected async processPermissionPage(
    page: Page,
    url: string,
  ): Promise<PermissionInfo | null> {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // Extract HTML content from the main content and convert to markdown
      const html = await page.innerHTML(this.config.mainContentSelector);
      const markdown = turndownService.turndown(html);

      // Extract information from markdown
      const info = this.extractInfoFromMarkdown(markdown, url);

      // Skip if it's not a usage description key
      if (!info.keyName?.includes('UsageDescription')) {
        console.log(
          `Skipping ${url} - not a usage description key or could not extract key name`,
        );
        return null;
      }

      // Check if we already have this permission
      if (this.permissionExists(info.keyName)) {
        console.log(
          `Skipping ${url} - permission ${info.keyName} already exists in dataset`,
        );
        return null;
      }

      // Check for deprecation
      const isDeprecated =
        info.deprecationNote.length > 0 || markdown.includes('Deprecated');

      // Create the permission info object
      const permissionId = this.createPermissionId(info.keyName);
      const categories = this.getCategoryFromUrl(url);

      // Fallback mechanism for description if not found directly
      let description = info.description;
      if (!description) {
        // Try to find a sentence that describes what the key does
        const descriptionAltMatch = markdown.match(
          this.appleConfig.patterns.alternateDescription,
        );
        if (descriptionAltMatch) {
          description = descriptionAltMatch[0];
        }
      }

      const permissionInfo: PermissionInfo = {
        id: permissionId,
        name: info.keyName.replace(/UsageDescription$/, ' Usage'),
        description: description,
        deprecated: isDeprecated,
        replacement: null, // Would need additional parsing to determine replacement
        categories: categories,
        platforms: {
          ios: {
            usageDescriptionKey: info.keyName,
            privacyDescription: info.privacyDescription,
            requiredDeviceCapabilities: info.deviceCapabilities,
            minIosVersion:
              info.minIosVersion || this.appleConfig.defaults.minIosVersion,
          },
        },
      };

      // Add deprecation info if applicable
      if (isDeprecated) {
        permissionInfo.deprecationInfo = {
          deprecatedSince: this.extractVersionFromText(info.deprecationNote),
          platforms: {
            ios: {
              sinceVersion: this.extractVersionFromText(info.deprecationNote),
              removalVersion: '',
            },
          },
        };
      }

      console.log(`Successfully processed ${info.keyName} from ${url}`);
      return permissionInfo;
    } catch (error) {
      console.error(`Error processing permission page ${url}:`, error);
      return null;
    }
  }
}

// Android-specific scraper configuration interface
interface AndroidScraperConfig extends ScraperConfig {
  // Android-specific patterns
  patterns: {
    permissionName: RegExp;
    description: RegExp;
    protectionLevel: RegExp;
    minSdk: RegExp;
    constantValue: RegExp;
    deprecationNotice: RegExp;
  };

  // Default values
  defaults: {
    minSdk: number;
  };
}

// Skeleton Android permission scraper (to be implemented)
class AndroidPermissionsScraper extends PermissionsScraper<PermissionInfo> {
  private androidConfig: AndroidScraperConfig;

  // Define Android-specific defaults
  private static readonly DEFAULT_CONFIG: AndroidScraperConfig = {
    baseUrl: 'https://developer.android.com',
    mainPagePath: '/reference/android/Manifest.permission',

    outputFile: 'android-permissions.json',

    maxConcurrentRequests: 5,
    requestDelay: 500,
    batchDelay: 1000,

    headless: true,

    mainContentSelector: '#main-content > devsite-content > article',

    patterns: {
      permissionName: /<h3[^>]*>([A-Z_]+)<\/h3>/i,
      description: /<p class="api-comment">([^<]+)<\/p>/,
      protectionLevel: /Protection level:\s*([a-z,\s]+)/i,
      minSdk: /Added in API level (\d+)/i,
      constantValue: /Constant Value: "([^"]+)"/i,
      deprecationNotice: /<p class="caution">([^<]+)<\/p>/,
    },

    categoryKeywords: {
      location: 'location',
      camera: 'camera',
      microphone: 'microphone',
      storage: 'storage',
      contacts: 'contacts',
      calendar: 'calendar',
      sms: 'sms',
      phone: 'phone',
      sensors: 'sensors',
      bluetooth: 'bluetooth',
    },

    defaults: {
      minSdk: 1,
    },
  };

  constructor(config: Partial<AndroidScraperConfig> = {}) {
    // Merge with base config
    super(config, AndroidPermissionsScraper.DEFAULT_CONFIG);

    // Store complete config with Android-specific fields
    this.androidConfig = {
      ...AndroidPermissionsScraper.DEFAULT_CONFIG,
      ...config,
    };

    // Deep merge for Android-specific nested objects
    if (config.patterns) {
      this.androidConfig.patterns = {
        ...AndroidPermissionsScraper.DEFAULT_CONFIG.patterns,
        ...config.patterns,
      };
    }
    if (config.defaults) {
      this.androidConfig.defaults = {
        ...AndroidPermissionsScraper.DEFAULT_CONFIG.defaults,
        ...config.defaults,
      };
    }
  }

  // Create a unique ID from the permission constant name
  protected createPermissionId(key: string): string {
    return key
      .replace(/^android\.permission\./, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');
  }

  // Helper method to check if permission already exists
  protected permissionExists(permissionName: string): boolean {
    if (!permissionName) return false;

    const permissionId = this.createPermissionId(permissionName);
    return this.permissions.some((p) => p.id === permissionId);
  }

  // Extract permission links from content
  protected extractPermissionLinks(content: string): string[] {
    // This is a simplified implementation - in a real scenario,
    // you would extract links from the Android documentation
    const permissionLinks: string[] = [];

    // Regular expression to find all links to permission details
    const linkRegex = /href="([^"]+Manifest\.permission[^"]+)"/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const linkUrl = match[1];

      // Convert to full URL if needed
      const fullUrl = linkUrl.startsWith('http')
        ? linkUrl
        : `${this.config.baseUrl}${linkUrl}`;

      permissionLinks.push(fullUrl);
    }

    return [...new Set(permissionLinks)]; // Remove duplicates
  }

  // Filter out already processed permissions
  protected filterNewPermissionLinks(allLinks: string[]): string[] {
    return allLinks.filter((url) => {
      const urlParts = url.split('/');
      const lastPart = urlParts[urlParts.length - 1];

      // Try to extract permission name from URL
      if (lastPart && lastPart.indexOf('#') !== -1) {
        const permissionName = lastPart.substring(lastPart.indexOf('#') + 1);
        return !this.permissionExists(permissionName);
      }

      return true; // If we can't determine from URL, include it for processing
    });
  }

  // Process a single permission page
  protected async processPermissionPage(
    page: Page,
    url: string,
  ): Promise<PermissionInfo | null> {
    // This is a skeleton implementation that should be completed based on
    // actual Android documentation structure
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // Extract content from the main content section
      const html = await page.innerHTML(this.config.mainContentSelector);
      const markdown = turndownService.turndown(html);
      console.log(markdown);

      // Extract the permission name from the URL or content
      let permissionName = '';
      const nameMatch = html.match(this.androidConfig.patterns.permissionName);
      if (nameMatch) {
        permissionName = nameMatch[1];
      } else {
        // Try to extract from URL as fallback
        const urlParts = url.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        if (lastPart && lastPart.indexOf('#') !== -1) {
          permissionName = lastPart.substring(lastPart.indexOf('#') + 1);
        }
      }

      if (!permissionName) {
        console.log(`Skipping ${url} - could not extract permission name`);
        return null;
      }

      // Check if we already have this permission
      if (this.permissionExists(permissionName)) {
        console.log(
          `Skipping ${url} - permission ${permissionName} already exists in dataset`,
        );
        return null;
      }

      // Extract other details (implement based on actual page structure)
      const descriptionMatch = html.match(
        this.androidConfig.patterns.description,
      );
      const description = descriptionMatch ? descriptionMatch[1] : '';

      const protectionLevelMatch = html.match(
        this.androidConfig.patterns.protectionLevel,
      );
      const protectionLevel = protectionLevelMatch
        ? protectionLevelMatch[1].split(',').map((p) => p.trim())
        : ['normal'];

      const minSdkMatch = html.match(this.androidConfig.patterns.minSdk);
      const minSdk = minSdkMatch
        ? parseInt(minSdkMatch[1], 10)
        : this.androidConfig.defaults.minSdk;

      const constantValueMatch = html.match(
        this.androidConfig.patterns.constantValue,
      );
      const constantValue = constantValueMatch ? constantValueMatch[1] : '';

      // Check for deprecation
      const deprecationMatch = html.match(
        this.androidConfig.patterns.deprecationNotice,
      );
      const isDeprecated =
        !!deprecationMatch || html.includes('This constant was deprecated');

      // Create the permission info object
      const permissionId = this.createPermissionId(permissionName);
      const categories = this.getCategoryFromUrl(url);

      const permissionInfo: PermissionInfo = {
        id: permissionId,
        name: permissionName
          .replace(/^PERMISSION_/, '')
          .replace(/_/g, ' ')
          .toLowerCase(),
        description: description,
        deprecated: isDeprecated,
        replacement: null,
        categories: categories,
        platforms: {
          android: {
            name: permissionName,
            protectionLevel: protectionLevel,
            minSdk: minSdk,
            constantValue: constantValue,
          },
        },
      };

      // Add deprecation info if applicable
      if (isDeprecated && deprecationMatch) {
        const deprecationText = deprecationMatch[1];
        const apiMatch = deprecationText.match(/API level (\d+)/);

        permissionInfo.deprecationInfo = {
          deprecatedSince: apiMatch ? parseInt(apiMatch[1], 10) : undefined,
          platforms: {
            android: {
              sinceApi: apiMatch ? parseInt(apiMatch[1], 10) : 0,
              removalApi: 0,
            },
          },
        };
      }

      console.log(`Successfully processed ${permissionName} from ${url}`);
      return permissionInfo;
    } catch (error) {
      console.error(`Error processing permission page ${url}:`, error);
      return null;
    }
  }
}

// Example usage with custom configuration
async function main() {
  // Example of custom configuration
  const customConfig: Partial<ScraperConfig> = {
    maxConcurrentRequests: 60, // Reduced concurrency to be gentler on the server
    requestDelay: 100, // Longer delay between requests
    headless: true, // Run browser in headless mode
  };

  const _appleScraper = new ApplePermissionsScraper({
    ...customConfig,
    outputFile: 'apple-permissions.json',
  });
  const androidScraper = new AndroidPermissionsScraper({
    ...customConfig,
    outputFile: 'android-permissions.json',
  });

  // try {
  //   const permissions = await appleScraper.scrapePermissions();
  //   console.log('Scraping completed successfully for apple!');
  //   console.log(`Total permission entries: ${permissions.length}`);
  // } catch (error) {
  //   console.error('An error occurred during scraping:', error);
  // }
  try {
    const permissions = await androidScraper.scrapePermissions();
    console.log('Scraping completed successfully for android!');
    console.log(`Total permission entries: ${permissions.length}`);
  } catch (error) {
    console.error('An error occurred during scraping:', error);
  }
}

main();
