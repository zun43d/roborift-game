// import { ExplorerApi, RpcApi } from 'atomicassets'
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'

const api = process.env.NEXT_PUBLIC_API_ENDPOINT
const atomicApi = process.env.NEXT_PUBLIC_ASSET_API_ENDPOINT

export default async function handler(req, res) {
	if (req.method === 'GET') {
		const { wallet } = req.query
		// const atomicApi = new RpcApi(api, 'atomicassets', { fetcher })
		const rpc = new JsonRpc(api, { fetch })

		const { rows: assets } = await rpc.get_table_rows({
			json: true,
			code: 'robostakings',
			scope: 'robostakings',
			table: 'lands',
			key_type: 'i64',
			index_position: 1,
			limit: 100,
		})

		const assetIds = assets.map((id) => id.asset_id).join('%2C')
		const { data: lands } = await fetch(
			`${atomicApi}/atomicassets/v1/assets?ids=${assetIds}&page=1&limit=100&order=desc&sort=updated`
		).then((res) => res.json())

		// let whiteLandNFTs = []

		// whiteLands.forEach((templateLands) =>
		// 	templateLands.data.forEach((lands) => whiteLandNFTs.push(lands))
		// )

		// const test = await rpc.get_table_rows({
		// 	json: true,
		// 	code: 'atomicassets',
		// 	scope: 'atomicassets',
		// 	table: 'assets',
		// 	// key_type: 'i64',
		// 	// index_position: 1,
		// 	table_key: 'template_id',
		// 	lower_bound: 72,
		// 	upper_bound: 72,
		// 	limit: 100,
		// })

		res.status(200).json(lands)
		// res.status(200).json([templateIds, whiteLandNFTs])
	}
}
