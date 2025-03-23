import { defineConfig } from '@rsbuild/core'
import { pluginStyleDictionary } from '../src'

export default defineConfig({
  plugins: [pluginStyleDictionary()]
})
