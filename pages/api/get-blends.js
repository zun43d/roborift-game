import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'

export default async function handler(req, res) {
	if (req.method === 'GET') {
		const { wallet } = req.query
		const collection = 'wreckedwrlds'
		const api = process.env.NEXT_PUBLIC_API_ENDPOINT
		const rpc = new JsonRpc(api, { fetch })

		const { rows } = await rpc.get_table_rows({
			json: true,
			code: 'blenderizerx',
			scope: 'blenderizerx',
			table: 'blenders',
			key_type: 'i64',
			lower_bound: '614199',
			index_position: 1,
			limit: 100,
		})

		const blends = rows.filter((row) => row.collection === collection)

		res.status(200).json(blends)
	}
}
