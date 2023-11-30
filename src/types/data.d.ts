export interface RanksData {
	name: string
	player_count: number
	require_tr: number
	average_apm: number
	average_pps: number
	average_vs: number

	minimum_apm_player: {
		id: number
		name: number
		value: number
	}

	minimum_pps_player: {
		id: number
		name: number
		value: number
	}

	minimum_vs_player: {
		id: number
		name: number
		value: number
	}

	maximum_apm_player: {
		id: number
		name: number
		value: number
	}

	maximum_pps_player: {
		id: number
		name: number
		value: number
	}

	maximum_vs_player: {
		id: number
		name: number
		value: number
	}

	updated_at: string
}

declare module '@/data/ranks.json' {
	const _: RanksData[]
	export default _
}