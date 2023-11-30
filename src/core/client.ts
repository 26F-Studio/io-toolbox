import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { createRouter, createWebHashHistory } from 'vue-router'

export const pinia = createPinia()
	.use(createPersistedState())

export const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: async () => import('@/Components/Pages/Home.vue')
		},
		{
			path: '/ranks',
			name: 'ranks',
			component: async () => import('@/Components/Pages/Ranks.vue')
		}
	]
})