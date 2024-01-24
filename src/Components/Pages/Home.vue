<script lang='ts' setup>
	import { GithubOutlined } from '@vicons/antd'
	import { sha1 } from 'hash-wasm'
	import TetrIoClientChinesePatch from '@/assets/app.asar?url'

	function createDownloadable(url: string) {
		const loading = ref(false)

		return {
			loading,
			async download() {
				loading.value = true

				const response = await fetch(url)
				const blob = await response.blob()
				const content = await blob.text()

				const hash = await sha1(content)
				const ext = url.split('.').at(-1)

				const element = document.createElement('a')
				element.download = `${hash}.${ext}`
				element.href = URL.createObjectURL(blob)
				element.click()

				loading.value = false
			}
		}
	}

	const TetrIoClientChinesePatchDownload = createDownloadable(TetrIoClientChinesePatch)
</script>

<template>
	<n-element class="lg:w-1/2 mx-auto">
		<n-card title="[推荐] tetr.io 汉化脚本">
			<iframe class="w-full h-120" src="//player.bilibili.com/player.html?aid=571090457" />

			<template #action>
				<n-space align="center">
					<n-button href="https://github.com/huanmieSAA/iotranslate" tag="a">
						<template #icon>
							<n-icon :component="GithubOutlined" />
						</template>

						Github 仓库
					</n-button>

					<n-button href="https://greasyfork.org/zh-CN/scripts/466016" tag="a">GreasyFork 发布页</n-button>

					<n-button :disabled="!TetrIoClientChinesePatchDownload.loading"
							  :loading="!TetrIoClientChinesePatchDownload.loading"
							  @click="TetrIoClientChinesePatchDownload.download">客户端 tetr.io plus + 汉化 补丁下载
					</n-button>
				</n-space>
			</template>
		</n-card>
	</n-element>
</template>