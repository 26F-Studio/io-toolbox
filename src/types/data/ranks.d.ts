export interface RankData {
	readonly name: string

	readonly player_count: number
	readonly require_tr: number

	readonly average_apm: number
	readonly average_pps: number
	readonly average_vs: number

	readonly minimum_apm_player: {
		readonly id: string
		readonly name: string
		readonly value: number
	}

	readonly minimum_pps_player: {
		readonly id: string
		readonly name: string
		readonly value: number
	}

	readonly minimum_vs_player: {
		readonly id: string
		readonly name: string
		readonly value: number
	}

	readonly maximum_apm_player: {
		readonly id: string
		readonly name: string
		readonly value: number
	}

	readonly maximum_pps_player: {
		readonly id: string
		readonly name: string
		readonly value: number
	}

	readonly maximum_vs_player: {
		readonly id: string
		readonly name: string
		readonly value: number
	}

	readonly updated_at: string
}

declare module '@/data/ranks.json' {
	const _: RankData[]
	export default _
}