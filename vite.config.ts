import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import UnoCss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Legacy from '@vitejs/plugin-legacy'
import { resolve as resolvePath } from 'node:path'

// https://vitejs.dev/config
export default defineConfig({
	base: '/io-toolbox',
	resolve: {
		alias: {
			'@': resolvePath(__dirname, 'src')
		}
	},
	build: {
		minify: 'terser',
		terserOptions: {
			mangle: true
		}
	},
	plugins: [
		Vue(),
		UnoCss(),
		AutoImport({
			imports: [
				'vue',
				{
					'naive-ui': [
						'useDialog',
						'useMessage',
						'useNotification',
						'useLoadingBar'
					]
				}
			]
		}),
		Components({
			resolvers: [
				NaiveUiResolver()
			]
		}),
		Legacy({
			targets: [
				'defaults',
				'chrome 52',
				'ie >= 11'
			]
		})
	]
})
