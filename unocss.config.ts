import { defineConfig } from 'unocss/vite'
import { presetUno, presetWebFonts, transformerDirectives } from 'unocss'

export default defineConfig({
	presets: [
		presetUno(),
		presetWebFonts({
			provider: 'none',
			fonts: {
				sans: ['HarmonyOS Sans SC', 'HarmonyOS Sans']
			}
		})
	],
	transformers: [
		transformerDirectives()
	]
})