import * as fs from 'node:fs'
import type { RsbuildPlugin } from '@rsbuild/core'
import { logger } from '@rsbuild/core'
import * as glob from 'glob'
import StyleDictionary from 'style-dictionary'
import { formats as f, transformGroups } from 'style-dictionary/enums'

const { web } = transformGroups
export const platforms = ['ios', 'android', 'web'] as const
export type Platform = (typeof platforms)[number]
export type PresetName = keyof typeof presets

const presets = {
  'multi-brands-platforms': (brand: string, platform: Platform) => ({
    source: [
      `tokens/brands/${brand}/*.json`,
      'tokens/globals/**/*.json',
      `tokens/platforms/${platform}/*.json`
    ],
    platforms: {
      web: {
        transformGroup: web,
        buildPath: `build/web/${brand}/`,
        files: [
          {
            destination: 'tokens.scss',
            format: f.scssVariables
          },
          {
            destination: 'colors.js',
            format: f.javascriptEsm
          },
          {
            destination: 'colors.d.ts',
            format: f.typescriptModuleDeclarations
          }
        ]
      },
      android: {
        transformGroup: 'android',
        buildPath: `build/android/${brand}/`,
        files: [
          {
            destination: 'tokens.colors.xml',
            format: f.androidColors
          },
          {
            destination: 'tokens.dimens.xml',
            format: f.androidDimens
          },
          {
            destination: 'tokens.font_dimens.xml',
            format: f.androidFontDimens
          }
        ]
      },
      ios: {
        transformGroup: 'ios',
        buildPath: `build/ios/${brand}/`,
        files: [
          {
            destination: 'tokens.h',
            format: f.iosMacros
          },
          {
            destination: 'tokens.swift',
            format: f.iosSwiftEnumSwift,
            options: { className: 'Tokens' }
          }
        ]
      }
    }
  })
}

/**
 * Check if a source pattern has matching files
 * @param pattern - Glob pattern to check
 * @returns Promise that resolves to boolean indicating if files exist
 */
const hasMatchingFiles = async (pattern: string): Promise<boolean> => {
  const res = await glob.glob(pattern, { nodir: true })
  return res.length > 0
}

/**
 * Check if the base directory for a pattern exists
 * @param pattern - Glob pattern to check
 * @returns True if the base directory exists
 */
const baseDirectoryExists = (pattern: string): boolean => {
  // Extract the base directory from the pattern
  // This handles patterns like 'tokens/brands/main/*.json'
  const baseDir = pattern.split('*')[0]?.replace(/\/+$/, '')
  if (!baseDir) throw new Error('Incorrect pattern')
  return fs.existsSync(baseDir)
}

type StyleDictionaryPluginOptions = Readonly<{
  preset: PresetName
  platforms: Platform[]
  brands: string[]
}>

export const pluginStyleDictionary = (
  options: StyleDictionaryPluginOptions = {
    preset: 'multi-brands-platforms',
    brands: ['main'],
    platforms: ['ios', 'android', 'web']
  }
): RsbuildPlugin => ({
  name: 'rsbuild:style-dictionary',
  setup(api) {
    const { brands, preset, platforms } = options
    api.onAfterCreateCompiler(async () => {
      const presetGetter = presets[preset]
      if (presetGetter) {
        logger.info(`Starting config of ${preset} style dictionary`)

        await Promise.all(
          brands.map(async (brand) => {
            await Promise.all(
              platforms.map(async (platform) => {
                const config = presetGetter(brand, platform)
                const sources = config.source as string[]

                // Check if source directories exist and have files
                const sourcesExist = await Promise.all(
                  sources.map(async (pattern) => {
                    const dirExists = baseDirectoryExists(pattern)
                    if (!dirExists) {
                      logger.warn(
                        `Source directory ${pattern.split('*')[0]} does not exist`
                      )
                      return false
                    }

                    const hasFiles = await hasMatchingFiles(pattern)
                    if (!hasFiles) {
                      logger.warn(
                        `No matching files found for pattern: ${pattern}`
                      )
                      return false
                    }

                    return true
                  })
                )

                // If at least one source exists, build the platform
                if (sourcesExist.some((exists) => exists)) {
                  const sdOptions = {
                    verbosity: 'verbose',
                    warnings: 'warn'
                  } as const

                  const sd = new StyleDictionary(config, sdOptions)
                  sd.buildPlatform(platform)
                  logger.info(`Built ${platform} for brand ${brand}`)
                } else {
                  logger.error(
                    `No valid source files found for ${brand}/${platform}. Skipping build.`
                  )
                }
              })
            )
          })
        )
      } else {
        throw new Error('Unsupported preset')
      }
    })
  }
})
