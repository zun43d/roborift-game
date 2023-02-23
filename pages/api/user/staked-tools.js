import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'

const api =
	process.env.NEXT_PUBLIC_ENV == 'dev'
		? 'https://testnet.waxsweden.org'
		: 'https://api.waxsweden.org'

const rpc = new JsonRpc(api, { fetch })
const atomicApi = process.env.NEXT_PUBLIC_ASSET_API_ENDPOINT

const collectionName = 'roboriftalpx'

export default async function handler(req, res) {
	if (req.method === 'GET') {
		const { wallet } = req.query

		// const admin = 'wreckminings'
		// const filter = 'atomicassets:transfer'
		// const skip = 0
		// const limit = 100
		// const sort = 'desc'

		// Below implementation has less filtering options
		// const actions = await rpc.history_get_actions(wallet)

		// manual implementation is more flexible
		// const actions = await fetch(
		// 	`${api}/v2/history/get_actions?account=${admin}&filter=${filter}&skip=${skip}&limit=${limit}&sort=${sort}`
		// ).then((res) => res.json())

		// const allStakedAssets = []

		// actions.actions.map((action) => {
		// 	if (
		// 		action.act.data.from === /*wallet*/ 'luposolitari' &&
		// 		action.act.data.memo === 'stake;tool'
		// 	)
		// 		return action.act.data.asset_ids.filter((id) =>
		// 			allStakedAssets.push(id)
		// 		)
		// })

		const { rows: stakedAssets } = await rpc.get_table_rows({
			json: true,
			code: 'robostakings',
			scope: wallet,
			table: 'tools',
			limit: 50,
			page: 1,
		})

		if (stakedAssets.length === 0) return res.status(200).json([])
		const stakedAssetIds = stakedAssets.map((tool) => tool.asset_id).join('%2C')

		const { data: stakedTools } =
			stakedAssetIds.length > 0
				? await fetch(
						`${atomicApi}/atomicassets/v1/assets?collection_name=${collectionName}&ids=${stakedAssetIds}&page=1&limit=100&order=desc&sort=updated`
				  ).then((res) => res.json())
				: { data: [] }

		res.status(200).json(stakedTools)
	}
}
