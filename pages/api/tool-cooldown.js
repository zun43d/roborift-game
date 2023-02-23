import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'

const api = process.env.NEXT_PUBLIC_API_ENDPOINT

export default async function handler(req, res) {
	if (req.method === 'GET') {
		const { toolId, wallet } = req.query
		const rpc = new JsonRpc(api, { fetch })

		const { rows: tools } = await rpc.get_table_rows({
			json: true,
			code: 'wrecktmining',
			scope: wallet,
			table: 'tools',
			key_type: 'i64',
			index_position: 1,
			lower_bound: toolId,
			upper_bound: toolId,
			limit: 100,
		})

		const cooldownUntil =
			new Date(tools[0].cooldown_until).toLocaleString() + ' GMT'

		res.status(200).json(cooldownUntil)
	}
}
