import 'uno.css'

import { createApp, h } from 'vue'
import App from '@/Components/App.vue'
import { pinia, router } from '@/core/client.ts'

try {
	const container = document.createElement('div')
	container.setAttribute('id', 'app')

	const instance = createApp({
		render: () => h(App)
	})

	instance.use(pinia)
	instance.use(router)

	instance.mount(container)
	document.body.appendChild(container)
} finally {

}