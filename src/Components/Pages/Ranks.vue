<script lang='ts' setup>
	import ranks from '@/data/ranks.json'
	import rgbaster from 'rgbaster-plus'
	import { Ref } from 'vue'
	import { flatten, forEach, groupBy, pipe, sortBy, uniqBy } from 'remeda'
	import VChart from 'vue-echarts'
	import { asyncComputed } from '@vueuse/core'
	import { ComposeOption, use } from 'echarts/core'
	import { LineChart, LineSeriesOption } from 'echarts/charts'
	import { CanvasRenderer } from 'echarts/renderers'

	import {
		GridComponent,
		GridComponentOption,
		LegendComponent,
		LegendComponentOption,
		TitleComponent,
		TitleComponentOption,
		ToolboxComponent,
		ToolboxComponentOption,
		TooltipComponent,
		TooltipComponentOption
	} from 'echarts/components'
	import { RanksData } from '@/types/data'

	use([
		TitleComponent,
		TooltipComponent,
		ToolboxComponent,
		LegendComponent,
		GridComponent,
		LineChart,
		CanvasRenderer
	])

	const chart = asyncComputed(async () => {
		const data = pipe(
			ranks as unknown as RanksData[],
			forEach(rank => {
				const date = new Date(rank.updated_at)

				date.setMinutes(0)
				date.setSeconds(0)
				date.setMilliseconds(0)

				rank.updated_at = date.toLocaleString()
			}),
			groupBy(rank => rank.updated_at)
		)

		const result: ComposeOption<
			| TitleComponentOption
			| TooltipComponentOption
			| ToolboxComponentOption
			| LegendComponentOption
			| GridComponentOption
			| LineSeriesOption
		> = {
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
				).map(async ([rank, records]) => {
					return {
						type: 'line' as 'line',
						name: rank.toUpperCase(),
						data: records.map(rank => {
							return rank.require_tr.toFixed(2)
						}),
						endLabel: {
							show: true
						},
						lineStyle: {
							color: await getColor(rank)
						}
					}
				})
			)
		}

		return result
	}, null)

	function getIcon(rank: string) {
		const filename = rank.toLowerCase()
			.replace('-', 'm').replace('+', 'p')

		return new URL(`../../assets/${filename}.png`, import.meta.url).href
	}

	async function getColor(rank: string) {
		const pixels = await rgbaster(getIcon(rank))
		const [r, g, b] = pixels[0].color.split('(')[1].split(')')[0].split(',').slice(0, 3)

		return `rgba(${r}, ${g}, ${b}, 0.5)`
	}

	const data = pipe(
		pipe(
			ranks as unknown as (RanksData & {
				icon: string,
				color: Ref<string | null>,
				show_more: Ref<boolean>
			})[],
			sortBy(rank => rank.updated_at)
		).reverse(),
		uniqBy(rank => rank.name),
		forEach(rank => {
			rank.show_more = ref(false)
		}),
		forEach(rank => {
			rank.icon = getIcon(rank.name)
		}),
		forEach(rank => {
			rank.color = ref(null)

			getColor(rank.name)
				.then(result => {
					rank.color.value = result
				})
		}),
		sortBy(rank => {
			return rank.require_tr
		})
	).reverse()
</script>

<template>
	<n-space vertical>
		<n-space justify='center'>
			<n-card v-for='rank in data' :style='{ backgroundColor: rank.color.value }'
					class='w-100'>
				<n-space vertical>
					<n-space justify='space-between'>
						<n-popover>
							<template #trigger>
								<n-image :src='rank.icon' :width='50' />
							</template>

							<n-text strong>{{ rank.name.toUpperCase() }}</n-text>
						</n-popover>

						<n-space :size='0' align='end' vertical>
							<n-text strong>
								{{ rank.player_count }} 玩家
							</n-text>

							<n-text strong>
								{{ rank.require_tr.toFixed(2) }} TR
							</n-text>
						</n-space>
					</n-space>

					<n-descriptions :content-style='{ textAlign: "center" }' class='cursor-pointer' label-align='center'
									@click='rank.show_more.value = !rank.show_more.value'>
						<n-descriptions-item label='平均 APM'>{{ rank.average_apm.toFixed(2) }}</n-descriptions-item>
						<n-descriptions-item label='平均 PPS'>{{ rank.average_pps.toFixed(2) }}</n-descriptions-item>
						<n-descriptions-item label='平均 VS'>{{ rank.average_vs.toFixed(2) }}</n-descriptions-item>
					</n-descriptions>

					<n-collapse-transition v-model:show='rank.show_more.value'>
						<n-descriptions :content-style='{ textAlign: "center" }' label-align='center'>
							<n-descriptions-item label='最小 APM'>
								<n-popover animated>
									<template #trigger>
										{{ rank.minimum_apm_player.value.toFixed(2) }}
									</template>

									<n-button :href='(`https://ch.tetr.io/u/${rank.minimum_apm_player.id}`)' tag='a'
											  text
											  type='primary'>
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
											  text
											  type='primary'>
										{{ rank.minimum_pps_player.name }}
									</n-button>
								</n-popover>
							</n-descriptions-item>

							<n-descriptions-item label='最小 VS'>
								<n-popover animated>
									<template #trigger>
										{{ rank.minimum_vs_player.value.toFixed(2) }}
									</template>

									<n-button :href='(`https://ch.tetr.io/u/${rank.minimum_vs_player.id}`)' tag='a' text
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
											  text
											  type='primary'>
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

									<n-button :href='(`https://ch.tetr.io/u/${rank.maximum_vs_player.id}`)' tag='a' text
											  type='primary'>
										{{ rank.maximum_vs_player.name }}
									</n-button>
								</n-popover>
							</n-descriptions-item>
						</n-descriptions>
					</n-collapse-transition>

					<n-el class='text-center'>
						<n-text :depth='3' class='text-lg'>
							更新时间: {{ new Date(rank.updated_at).toLocaleString() }}
						</n-text>
					</n-el>
				</n-space>
			</n-card>
		</n-space>

		<n-scrollbar x-scrollable>
			<n-el v-if='chart' class='w-[300vw] sm:w-screen h-[200vh] sm:h-screen flex justify-center items-center'>
				<v-chart :option='chart' class='sm:w-4/5 sm:h-4/5 p-5 rounded' />
			</n-el>
		</n-scrollbar>
	</n-space>
</template>