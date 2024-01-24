<script lang='ts' setup>
	import { useAppStore } from '@/core/stores.ts'
	import { darkTheme, lightTheme, MenuOption, NIcon } from 'naive-ui'
	import { Moon, Sun } from '@vicons/tabler'
	import { HomeOutlined, TrophyOutlined } from '@vicons/antd'
	import { RouterLink } from 'vue-router'

	const appStore = useAppStore()

	const theme = computed(() => {
		if (appStore.theme === 'dark') {
			return darkTheme
		}

		return lightTheme
	})

	const menus: MenuOption[] = [
		{
			label: () => h(RouterLink, {
				to: {
					name: 'home'
				}
			}, () => '主页'),
			key: 'home',
			icon: () => h(NIcon, {
				component: HomeOutlined
			})
		},
		{
			label: () => h(RouterLink, {
				to: {
					name: 'ranks'
				}
			}, () => '段位'),
			key: 'ranks',
			icon: () => h(NIcon, {
				component: TrophyOutlined
			})
		}
	]

	function switchTheme() {
		appStore.theme = appStore.theme === 'dark' ? 'light' : 'dark'
	}
</script>

<template>
	<n-config-provider :theme='theme'>
		<n-dialog-provider>
			<n-message-provider>
				<n-notification-provider>
					<n-loading-bar-provider>
						<n-layout :native-scrollbar='false' :scrollbar-props='{ trigger: "hover" }'>
							<n-layout-header>
								<n-space justify='center'>
									<n-menu :options='menus' :value='String($route.name)' mode='horizontal' />
								</n-space>
							</n-layout-header>

							<n-layout-content class='p-5'>
								<RouterView v-slot='{ Component }'>
									<template v-if='Component'>
										<Transition enter-active-class='transition duration-300'
													enter-from-class='opacity-0'
													leave-active-class='transition duration-300'
													leave-to-class='opacity-0'>
											<Component :is='Component' />
										</Transition>
									</template>
								</RouterView>
							</n-layout-content>

							<n-layout-footer bordered class='p-2' position='absolute'>
								<n-space align='center' justify='space-between'>
									<n-space :size='0'>
										<n-text>&copy; 2023 - {{ new Date().getFullYear() }}</n-text>
										<n-divider vertical />
										<n-button href='https://studio26f.org' tag='a' text>26F Studio</n-button>
									</n-space>

									<n-button text @click='switchTheme'>
										<template #icon>
											<n-icon :component='appStore.theme === "dark" ? Sun : Moon' />
										</template>

										{{ appStore.theme === 'dark' ? '浅色' : '深色' }}
									</n-button>
								</n-space>
							</n-layout-footer>
						</n-layout>
					</n-loading-bar-provider>
				</n-notification-provider>
			</n-message-provider>
		</n-dialog-provider>
	</n-config-provider>
</template>

<style lang='css'>
	:root, body, #app, .n-config-provider, .n-layout {
		@apply h-full;
	}
</style>