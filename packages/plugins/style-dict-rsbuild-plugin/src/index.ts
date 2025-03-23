import type { RsbuildPlugin } from '@rsbuild/core'
import { logger } from '@rsbuild/core'
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
            Promise.all(
              platforms.map(async (platform) => {
                const sdOptions = {
                  verbosity: 'verbose',
                  warnings: 'warn'
                } as const
                const sd = new StyleDictionary(
                  presetGetter(brand, platform),
                  sdOptions
                )
                sd.buildPlatform(platform)
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
