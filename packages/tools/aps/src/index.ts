#!/usr/bin/env node
import { Browser, chromium, Page } from "playwright";
import TurndownService from "turndown";
import * as fs from "fs";
import * as path from "path";

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

// Base class for permission scrapers with support for both multi-page and single-page approaches
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
          fs.readFileSync(this.config.outputFile, "utf-8"),
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
    const urlParts = url.split("/");

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
    return versionMatch ? versionMatch[1] : "";
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
      .filter((result) =>
        result.status === "fulfilled" && result.value !== null
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

  // These methods are now optional with default implementations
  protected extractPermissionLinks(content: string): string[] {
    return []; // Default implementation returns empty array (for single-page scrapers)
  }

  protected abstract processPermissionPage(
    page: Page,
    url: string,
  ): Promise<T | null>;

  // New method for processing single page with multiple permissions
  protected async processSinglePage(page: Page, url: string): Promise<T[]> {
    return []; // Default implementation returns empty array
  }

  // Filter implementation with default that does nothing
  protected filterNewPermissionLinks(allLinks: string[]): string[] {
    return allLinks; // Default implementation returns all links
  }

  // The main scraping method - now handles both multi-page and single-page approaches
  public async scrapePermissions(): Promise<T[]> {
    try {
      await this.initBrowser();
      console.log(
        `Fetching main page from ${this.config.baseUrl}${this.config.mainPagePath}...`,
      );

      const page = await this.browser!.newPage();
      const mainUrl = `${this.config.baseUrl}${this.config.mainPagePath}`;
      await page.goto(mainUrl, { waitUntil: "domcontentloaded" });

      // Extract HTML content and convert to markdown
      const html = await page.innerHTML(this.config.mainContentSelector);
      const content = turndownService.turndown(html);

      // Check if this is a single-page scraper
      if (
        this.isSinglePageScraper && typeof this.processSinglePage === "function"
      ) {
        console.log("Processing as single-page scraper...");
        const newPermissions = await this.processSinglePage(page, mainUrl);

        console.log(
          `Successfully processed ${newPermissions.length} permissions from single page.`,
        );

        // Add all new permissions to the existing ones
        this.permissions.push(...newPermissions);

        // Save everything to file
        this.saveToFile();

        await page.close();
        await this.closeBrowser();

        console.log(`Total permissions: ${this.permissions.length}`);
        return this.permissions;
      }

      // Continue with multi-page approach
      await page.close();

      console.log("Extracting permission links...");
      const allPermissionLinks = this.extractPermissionLinks(content);

      // Let each implementation filter out already processed permissions
      const newPermissionLinks = this.filterNewPermissionLinks(
        allPermissionLinks,
      );

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
          `Processing batch ${i + 1
          }/${batches.length} (${batch.length} URLs)...`,
        );
        const batchResults = await this.processBatch(batch);
        newPermissions.push(...batchResults);

        console.log(
          `Batch ${i + 1
          } completed. Processed ${batchResults.length} permissions in this batch.`,
        );

        // Add a small delay between batches to avoid overwhelming the server
        if (i < batches.length - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.config.batchDelay)
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
      console.error("Error scraping permissions:", error);
      await this.closeBrowser();
      throw error;
    }
  }

  // Property to determine if this is a single-page scraper
  get isSinglePageScraper(): boolean {
    return false; // Default is multi-page scraper
  }
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
    baseUrl: "https://developer.apple.com",
    mainPagePath: "/documentation/bundleresources/protected-resources",

    outputFile: "apple-permissions.json",

    maxConcurrentRequests: 50,
    requestDelay: 100,
    batchDelay: 100,

    headless: true,

    mainContentSelector: "#app-main",

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
      "location": "location",
      "bluetooth": "bluetooth",
      "camera": "camera",
      "microphone": "microphone",
      "photo": "photos",
      "media": "media",
      "health": "health",
      "contact": "contacts",
      "calendar": "calendar",
      "siri": "siri",
      "face": "face",
      "tracking": "tracking",
    },

    defaults: {
      minIosVersion: "7.0",
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
      .replace(/^NS/, "")
      .replace(/UsageDescription$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_");
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
        linkText.toLowerCase().includes("UsageDescription".toLowerCase()) ||
        linkUrl.includes("/information-property-list/")
      ) {
        // Convert to full URL if needed
        const fullUrl = linkUrl.startsWith("http")
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
      const urlParts = url.split("/");
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart.includes("usagedescription")) {
        const potentialKeyName = lastPart
          .replace(/-/g, "")
          .replace(/^n/, "N")
          .replace(/^k/, "K")
          .replace(/^c/, "C")
          .replace(/^s/, "S");

        return !this.permissionExists(potentialKeyName);
      }
      return true; // If we can't determine from URL, include it for processing
    });
  }

  // Extract information from markdown content based on the actual structure
  private extractInfoFromMarkdown(markdown: string, url: string): {
    keyName: string;
    description: string;
    deprecationNote: string;
    minIosVersion: string;
    privacyDescription: string;
    deviceCapabilities: string[];
  } {
    // Initialize result object
    const result = {
      keyName: "",
      description: "",
      deprecationNote: "",
      minIosVersion: "",
      privacyDescription: "",
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
        const urlParts = url.split("/");
        const lastPart = urlParts[urlParts.length - 1];
        if (lastPart.includes("usagedescription")) {
          result.keyName = lastPart
            .replace(/-/g, "")
            .replace(/^n/, "N")
            .replace(/^k/, "K")
            .replace(/^c/, "C")
            .replace(/^s/, "S");
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
    let name = "";
    if (nameMatch) {
      name = nameMatch[1].trim();
    }

    // Extract privacy description from Discussion section
    const discussionMatch = markdown.match(
      this.appleConfig.patterns.discussion,
    );
    if (discussionMatch) {
      const discussionText = discussionMatch[1].trim();

      // Look for specific patterns in the discussion that indicate privacy description requirements
      if (
        discussionText.includes("required") ||
        discussionText.includes("add this key") ||
        discussionText.includes("privacy")
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
        const capability = match.replace(/`/g, "").trim();
        if (
          capability.match(/^[a-z-]+$/) ||
          capability.includes("UIRequiredDeviceCapabilities")
        ) {
          const cleanCapability = capability.replace(
            "UIRequiredDeviceCapabilities",
            "",
          ).trim();
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
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // Extract HTML content from the main content and convert to markdown
      const html = await page.innerHTML(this.config.mainContentSelector);
      const markdown = turndownService.turndown(html);

      // Extract information from markdown
      const info = this.extractInfoFromMarkdown(markdown, url);

      // Skip if it's not a usage description key
      if (!info.keyName || !info.keyName.includes("UsageDescription")) {
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
      const isDeprecated = info.deprecationNote.length > 0 ||
        markdown.includes("Deprecated");

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
        name: info.keyName.replace(/UsageDescription$/, " Usage"),
        description: description,
        deprecated: isDeprecated,
        replacement: null, // Would need additional parsing to determine replacement
        categories: categories,
        platforms: {
          ios: {
            usageDescriptionKey: info.keyName,
            privacyDescription: info.privacyDescription,
            requiredDeviceCapabilities: info.deviceCapabilities,
            minIosVersion: info.minIosVersion ||
              this.appleConfig.defaults.minIosVersion,
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
              removalVersion: "",
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
    permissionBlock: RegExp;
    permissionName: RegExp;
    description: RegExp;
    notes: RegExp;
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

// Updated Android permission scraper for single-page approach
class AndroidPermissionsScraper extends PermissionsScraper<PermissionInfo> {
  private androidConfig: AndroidScraperConfig;

  // Define Android-specific defaults
  private static readonly DEFAULT_CONFIG: AndroidScraperConfig = {
    baseUrl: "https://developer.android.com",
    mainPagePath: "/reference/android/Manifest.permission",

    outputFile: "android-permissions.json",

    maxConcurrentRequests: 5,
    requestDelay: 500,
    batchDelay: 1000,

    headless: true,

    mainContentSelector: "#main-content > devsite-content > article",

    patterns: {
      permissionBlock: /### ([A-Z_]+)[\s\S]+?(?=### |$)/g,
      permissionName: /### ([A-Z_]+)/,
      description: /public static final \[String\][^\n]+\n\n([^\n]+)/,
      notes: /\n\n\*\*(Note|Warning):[^\n]*\n\n([\s\S]+?)(?=\n\nProtection level:|\n\nConstant Value:)/,
      protectionLevel: /Protection level:\s*([^\n]+)/i,
      minSdk: /Added in \[API level (\d+)\]/i,
      constantValue: /Constant Value:\s*"([^"]+)"/i,
      deprecationNotice: /This constant was deprecated in API level (\d+)/i
    },

    categoryKeywords: {
      "location": "location",
      "camera": "camera",
      "microphone": "microphone",
      "storage": "storage",
      "contacts": "contacts",
      "calendar": "calendar",
      "sms": "sms",
      "phone": "phone",
      "sensors": "sensors",
      "bluetooth": "bluetooth",
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

  // Specify that this is a single-page scraper
  get isSinglePageScraper(): boolean {
    return true;
  }

  // Create a unique ID from the permission constant name
  protected createPermissionId(key: string): string {
    return key
      .replace(/^android\.permission\./, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_");
  }

  // Helper method to check if permission already exists
  protected permissionExists(permissionName: string): boolean {
    if (!permissionName) return false;

    const permissionId = this.createPermissionId(permissionName);
    return this.permissions.some((p) => p.id === permissionId);
  }

  // Implement the single-page processing method
  protected async processSinglePage(
    page: Page,
    url: string,
  ): Promise<PermissionInfo[]> {
    try {
      // Extract HTML content and convert to markdown
      const html = await page.innerHTML(this.config.mainContentSelector);
      const markdown = turndownService.turndown(html).split("Constants\n--------")[1].replaceAll(/\\/g, "")
      if (!markdown) {
        console.error("Could not find Constants section in the documentation");
        return [];
      }
      console.log("Extracting permissions from markdown...");

      const newPermissions: PermissionInfo[] = [];
      const permissionBlocks =
        markdown.match(this.androidConfig.patterns.permissionBlock) || [];

      console.log(`Found ${permissionBlocks.length} permission blocks.`);

      for (const block of permissionBlocks) {

        try {
          // Extract permission name
          const nameMatch = block.match(
            this.androidConfig.patterns.permissionName,
          );
          if (!nameMatch) continue;

          const permissionName = nameMatch[1];

          // Skip if already processed
          if (this.permissionExists(permissionName)) {
            console.log(
              `Skipping - permission ${permissionName} already exists in dataset`,
            );
            continue;
          }

          // Extract description - typically follows the permission name
          const descriptionMatch = block.match(
            this.androidConfig.patterns.description,
          );

          let description = descriptionMatch
            ? descriptionMatch[1].trim()
            : "";
          const notesMatch = block.match(this.androidConfig.patterns.notes);
          if (notesMatch) {
            description += "\n\n" + notesMatch[0].trim();
          }
          // Extract protection level
          const protectionLevelMatch = block.match(this.androidConfig.patterns.protectionLevel);
          const protectionLevelRaw = protectionLevelMatch ? protectionLevelMatch[1].trim() : "normal";
          const protectionLevel = protectionLevelMatch
            ? protectionLevelRaw.split("|").map((p) => p.trim())
            : ["normal"];

          // Extract API level
          const minSdkMatch = block.match(this.androidConfig.patterns.minSdk);
          const minSdk = minSdkMatch
            ? parseInt(minSdkMatch[1])
            : this.androidConfig.defaults.minSdk;

          // Extract constant value
          const constantValueMatch = block.match(
            this.androidConfig.patterns.constantValue,
          );
          const constantValue = constantValueMatch ? constantValueMatch[1] : "";

          // Check for deprecation
          const deprecationMatch = block.match(
            this.androidConfig.patterns.deprecationNotice,
          );
          const isDeprecated = !!deprecationMatch;

          // Determine categories based on permission name and description
          const categories = this.getCategoriesFromPermissionInfo(
            permissionName,
            description,
          );

          // Create permission object
          const permissionId = this.createPermissionId(permissionName);

          const permissionInfo: PermissionInfo = {
            id: permissionId,
            name: permissionName.replace(/^PERMISSION_/, "").replace(/_/g, " ")
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
            const deprecationApiLevel = parseInt(deprecationMatch[1]);

            permissionInfo.deprecationInfo = {
              deprecatedSince: deprecationApiLevel,
              platforms: {
                android: {
                  sinceApi: deprecationApiLevel,
                  removalApi: 0, // Unknown removal API level
                },
              },
            };
          }

          newPermissions.push(permissionInfo);
          console.log(`Successfully processed ${permissionName}`);
        } catch (blockError) {
          console.error("Error processing permission block:", blockError);
        }
      }

      return newPermissions;
    } catch (error) {
      console.error(`Error processing Android permissions page:`, error);
      return [];
    }
  }

  // Helper to determine categories from permission name and description
  private getCategoriesFromPermissionInfo(
    name: string,
    description: string,
  ): string[] {
    const combinedText = (name + " " + description).toLowerCase();
    const categories: string[] = [];

    // Check against all category keywords
    Object.entries(this.config.categoryKeywords).forEach(
      ([keyword, category]) => {
        if (combinedText.includes(keyword.toLowerCase())) {
          categories.push(category);
        }
      },
    );

    // Add default category if none found
    if (categories.length === 0) {
      // Check for common patterns in permission names
      if (name.includes("_BACKGROUND")) {
        categories.push("background");
      } else if (name.includes("_ACTIVITY_RECOGNITION")) {
        categories.push("activity");
      } else if (name.includes("_ACCOUNTS")) {
        categories.push("accounts");
      } else if (name.includes("_NETWORK")) {
        categories.push("network");
      } else {
        categories.push("other");
      }
    }

    return categories;
  }

  // This method is required by the base class but not used for single-page approach
  protected async processPermissionPage(
    page: Page,
    url: string,
  ): Promise<PermissionInfo | null> {
    // Not used in single-page scraper
    return null;
  }
}

// Function to run both scrapers
export async function scrapeAllPlatforms() {
  try {
    console.log("Starting permission scraping process...");

    // Scrape Android permissions first
    console.log("\n=== SCRAPING ANDROID PERMISSIONS ===\n");
    const androidScraper = new AndroidPermissionsScraper();
    await androidScraper.scrapePermissions();

    // Then scrape Apple permissions
    console.log("\n=== SCRAPING APPLE PERMISSIONS ===\n");
    const appleScraper = new ApplePermissionsScraper();
    await appleScraper.scrapePermissions();

    // Merge the data by permission concept
    console.log("\n=== MERGING PERMISSIONS DATA ===\n");
    mergePermissionsData();

    console.log("\nPermission scraping completed successfully!");
  } catch (error) {
    console.error("Error in scraping process:", error);
  }
}

// Helper function to merge permissions data from both platforms
function mergePermissionsData() {
  try {
    // Load both platform data files
    const androidPath = path.resolve(process.cwd(), "android-permissions.json");
    const applePath = path.resolve(process.cwd(), "apple-permissions.json");

    if (!fs.existsSync(androidPath) || !fs.existsSync(applePath)) {
      console.error("One or both platform files not found. Skipping merge.");
      return;
    }

    const androidPermissions: PermissionInfo[] = JSON.parse(
      fs.readFileSync(androidPath, "utf-8"),
    );
    const applePermissions: PermissionInfo[] = JSON.parse(
      fs.readFileSync(applePath, "utf-8"),
    );

    console.log(
      `Loaded ${androidPermissions.length} Android permissions and ${applePermissions.length} Apple permissions.`,
    );

    // Create a map to group similar permissions
    const mergedPermissions: Map<string, PermissionInfo> = new Map();

    // Process Android permissions first
    androidPermissions.forEach((perm) => {
      mergedPermissions.set(perm.id, perm);
    });

    // Then process Apple permissions, merging where appropriate
    applePermissions.forEach((applePerm) => {
      // Try to find a matching Android permission by category and similar name
      let foundMatch = false;

      // Normalize the permission name for matching
      const normalizedName = applePerm.name
        .toLowerCase()
        .replace(/\s+usage$/, "")
        .replace(/\s+/g, "_");

      // Check for existing permissions with the same categories
      for (const [id, existingPerm] of mergedPermissions.entries()) {
        // Check if they share at least one category
        const sharedCategories = applePerm.categories.filter(
          (cat) => existingPerm.categories.includes(cat),
        );

        if (sharedCategories.length > 0) {
          // If categories match, check name similarity
          const existingName = existingPerm.name.toLowerCase().replace(
            /\s+/g,
            "_",
          );

          if (
            existingName.includes(normalizedName) ||
            normalizedName.includes(existingName) ||
            comparePermissionNames(existingName, normalizedName)
          ) {
            // Merge the platforms data
            existingPerm.platforms.ios = applePerm.platforms.ios;

            // Combine categories without duplicates
            existingPerm.categories = [
              ...new Set([
                ...existingPerm.categories,
                ...applePerm.categories,
              ]),
            ];

            // Prefer non-deprecated if one is deprecated
            if (existingPerm.deprecated && !applePerm.deprecated) {
              existingPerm.deprecated = false;
              existingPerm.deprecationInfo = undefined;
            }

            foundMatch = true;
            break;
          }
        }
      }
      // If no match found, add as new entry
      if (!foundMatch) {
        mergedPermissions.set(applePerm.id, applePerm);
      }
    });

    // Convert map back to array and save
    const finalPermissions = Array.from(mergedPermissions.values());

    console.log(
      `Merged into ${finalPermissions.length} cross-platform permissions.`,
    );

    // Save to merged file
    const outputPath = path.resolve(process.cwd(), "merged-permissions.json");
    fs.writeFileSync(outputPath, JSON.stringify(finalPermissions, null, 2));
    console.log(`Merged permissions saved to ${outputPath}`);
  } catch (error) {
    console.error("Error merging permissions data:", error);
  }
}

// Helper function to compare permission names for similarity
function comparePermissionNames(name1: string, name2: string): boolean {
  // For now a simple check if one contains a significant portion of the other
  const minLength = Math.min(name1.length, name2.length);
  const threshold = Math.floor(minLength * 0.7); // 70% similarity threshold

  // Count common characters in sequence
  let commonChars = 0;
  for (let i = 0; i < name1.length; i++) {
    if (name2.includes(name1.slice(i, i + 3))) {
      commonChars += 3;
      i += 2; // Skip ahead
    }
  }

  return commonChars >= threshold;
}
// If this script is run directly (not imported)
if (require.main === module) {
  await scrapeAllPlatforms()
  mergePermissionsData()
}
