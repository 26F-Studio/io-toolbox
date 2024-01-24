import 'uno.css'

import { createApp, h } from 'vue'
import App from '@/Components/App.vue'
import { pinia, router } from '@/core/client.ts'

const instance = createApp({
	render: () => h(App)
})

instance.use(pinia)
instance.use(router)
instance.mount('#app')