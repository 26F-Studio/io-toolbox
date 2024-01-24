<script lang='ts' setup>
	import data_ranks from '@/data/ranks.json'
	import rgbaster from 'rgbaster-plus'
	import { flatten, groupBy, pipe, sortBy, uniqBy } from 'remeda'
	import VChart from 'vue-echarts'
	import { asyncComputed } from '@vueuse/core'
	import { use } from 'echarts/core'
	import { LineChart } from 'echarts/charts'
	import { CanvasRenderer } from 'echarts/renderers'

	import {
		GridComponent,
		LegendComponent,
		TitleComponent,
		ToolboxComponent,
		TooltipComponent
	} from 'echarts/components'
	import { RankData } from '@/types/data/ranks'
	import { Ref } from 'vue'

	use([
		TitleComponent,
		TooltipComponent,
		ToolboxComponent,
		LegendComponent,
		GridComponent,
		LineChart,
		CanvasRenderer
	])

	const ranks: RankData[] = data_ranks

	const chart = asyncComputed(async () => {
		const data = groupBy(ranks, rank => formatDate(rank.updated_at))

		return {
			backgroundColor: '#FFF',
			animationDuration: 5000,
			title: {
				text: '段位分走势图'
			},
			tooltip: {
				trigger: 'axis'
			},
			toolbox: {
				feature: {
					saveAsImage: {}
				}
			},
			legend: {},
			xAxis: {
				type: 'category',
				data: Object.keys(data)
			},
			yAxis: {
				type: 'value',
				min: 0,
				max: 25000
			},
			series: await Promise.all(
				Object.entries(
					pipe(
						Object.values(data),
						flatten(),
						groupBy(rank => rank.name)
					)
				).map(async ([rank, records]) => ({
					type: 'line' as const,
					name: rank.toUpperCase(),
					data: records.map(rank => rank.require_tr.toFixed(2)),
					endLabel: {
						show: true
					},
					lineStyle: {
						color: await getColor(rank, false)
					},
					areaStyle: {
						color: await getColor(rank, false)
					},
					itemStyle: {
						color: await getColor(rank, false)
					}
				}))
			)
		}
	}, null)

	function formatDate(value: string) {
		const date = new Date(value)

		date.setMinutes(0)
		date.setSeconds(0)
		date.setMilliseconds(0)

		return date.toLocaleString()
	}

	function getIcon(rank: string) {
		const filename = rank.toLowerCase()
			.replace('-', 'm')
			.replace('+', 'p')

		return new URL(`../../assets/rank/${filename}.png`, import.meta.url).href
	}

	async function getColor(rank: string, transparent = true) {
		const pixels = await rgbaster(getIcon(rank))
		const [r, g, b] = pixels[1].color.split('(')[1].split(')')[0].split(',').slice(0, 3)

		return transparent ? `rgba(${r}, ${g}, ${b}, 0.5)` : `rgb(${r}, ${g}, ${b})`
	}

	const showMoreReferenceCacheMap = new Map<string, Ref<boolean>>()

	function getShowMoreReference(rank: string) {
		if (!showMoreReferenceCacheMap.has(rank)) {
			const reference = ref(false)
			showMoreReferenceCacheMap.set(rank, reference)
		}

		return showMoreReferenceCacheMap.get(rank)!
	}

	const colorRefCacheMap = new Map<string, Ref<string | undefined>>()

	function getColorRef(rank: string) {
		if (!colorRefCacheMap.has(rank)) {
			const reference = ref<string>()
			getColor(rank).then(result => reference.value = result)
			colorRefCacheMap.set(rank, reference)
		}

		return colorRefCacheMap.get(rank)!
	}

	const data = pipe(
		sortBy(ranks, rank => rank.updated_at).reverse(),
		uniqBy(rank => rank.name),
		sortBy(rank => rank.require_tr)
	).reverse()
</script>

<template>
	<n-space vertical>
		<n-space justify='center'>
			<template v-for='rank in data'>
				<n-card :style='{ backgroundColor: getColorRef(rank.name).value }'
						class='w-100'>
					<n-space vertical>
						<n-space justify='space-between'>
							<n-popover>
								<template #trigger>
									<n-image :src='getIcon(rank.name)' :width='50' />
								</template>

								<n-text strong>{{ rank.name.toUpperCase() }}</n-text>
							</n-popover>

							<n-space :size='0' align='end' vertical>
								<n-text strong>
									{{ rank.player_count }} 玩家
								</n-text>

								<n-popover>
									<template #trigger>
										<n-text strong>
											{{ rank.require_tr.toFixed(2) }} TR
										</n-text>
									</template>

									{{ rank.require_tr }}
								</n-popover>
							</n-space>
						</n-space>

						<n-descriptions :content-style='{ textAlign: "center" }' class='cursor-pointer'
										label-align='center'
										@click='getShowMoreReference(rank.name).value = !getShowMoreReference(rank.name).value'>
							<n-descriptions-item label='平均 APM'>
								<n-popover>
									<template #trigger>
										{{ rank.average_apm.toFixed(2) }}
									</template>

									{{ rank.average_apm }}
								</n-popover>
							</n-descriptions-item>

							<n-descriptions-item label='平均 PPS'>
								<n-popover>
									<template #trigger>
										{{ rank.average_pps.toFixed(2) }}
									</template>

									{{ rank.average_pps }}
								</n-popover>
							</n-descriptions-item>

							<n-descriptions-item label='平均 VS'>
								<n-popover>
									<template #trigger>
										{{ rank.average_vs.toFixed(2) }}
									</template>

									{{ rank.average_vs }}
								</n-popover>
							</n-descriptions-item>
						</n-descriptions>

						<n-collapse-transition v-model:show='getShowMoreReference(rank.name).value'>
							<n-descriptions :content-style='{ textAlign: "center" }' label-align='center'>
								<n-descriptions-item label='最小 APM'>
									<n-popover animated>
										<template #trigger>
											{{ rank.minimum_apm_player.value.toFixed(2) }}
										</template>

										<n-button :href='(`https://ch.tetr.io/u/${rank.minimum_apm_player.id}`)'
												  tag='a' text type='primary'>
											{{ rank.minimum_apm_player.name }}
										</n-button>
									</n-popover>
								</n-descriptions-item>

								<n-descriptions-item label='最小 PPS'>
									<n-popover animated>
										<template #trigger>
											{{ rank.minimum_pps_player.value.toFixed(2) }}
										</template>

										<n-button :href='(`https://ch.tetr.io/u/${rank.minimum_pps_player.id}`)' tag='a'
												  text type='primary'>
											{{ rank.minimum_pps_player.name }}
										</n-button>
									</n-popover>
								</n-descriptions-item>

								<n-descriptions-item label='最小 VS'>
									<n-popover animated>
										<template #trigger>
											{{ rank.minimum_vs_player.value.toFixed(2) }}
										</template>

										<n-button :href='(`https://ch.tetr.io/u/${rank.minimum_vs_player.id}`)' tag='a'
												  text
												  type='primary'>
											{{ rank.minimum_vs_player.name }}
										</n-button>
									</n-popover>
								</n-descriptions-item>

								<n-descriptions-item label='最大 APM'>
									<n-popover animated>
										<template #trigger>
											{{ rank.maximum_apm_player.value.toFixed(2) }}
										</template>

										<n-button :href='(`https://ch.tetr.io/u/${rank.maximum_apm_player.id}`)' tag='a'
												  text type='primary'>
											{{ rank.maximum_apm_player.name }}
										</n-button>
									</n-popover>
								</n-descriptions-item>

								<n-descriptions-item label='最大 PPS'>
									<n-popover animated>
										<template #trigger>
											{{ rank.maximum_pps_player.value.toFixed(2) }}
										</template>

										<n-button :href='(`https://ch.tetr.io/u/${rank.maximum_pps_player.id}`)' tag='a'
												  text
												  type='primary'>
											{{ rank.maximum_pps_player.name }}
										</n-button>
									</n-popover>
								</n-descriptions-item>

								<n-descriptions-item label='最大 VS'>
									<n-popover animated>
										<template #trigger>
											{{ rank.maximum_vs_player.value.toFixed(2) }}
										</template>

										<n-button :href='(`https://ch.tetr.io/u/${rank.maximum_vs_player.id}`)' tag='a'
												  text
												  type='primary'>
											{{ rank.maximum_vs_player.name }}
										</n-button>
									</n-popover>
								</n-descriptions-item>
							</n-descriptions>
						</n-collapse-transition>

						<n-element class='text-center'>
							<n-text :depth='3' class='text-lg'>
								更新时间:
								<n-popover>
									<template #trigger>
										{{ formatDate(rank.updated_at) }}
									</template>

									{{ new Date(rank.updated_at).toLocaleString() }}
								</n-popover>
							</n-text>
						</n-element>
					</n-space>
				</n-card>
			</template>
		</n-space>

		<n-scrollbar x-scrollable>
			<n-element v-if='chart'
					   class='w-[300vw] sm:w-screen h-[200vh] sm:h-screen flex justify-center items-center'>
				<v-chart :option='chart' class='sm:w-4/5 sm:h-4/5 p-5 rounded' />
			</n-element>
		</n-scrollbar>
	</n-space>
</template>