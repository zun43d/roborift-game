import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'

const api = process.env.NEXT_PUBLIC_API_ENDPOINT
const rpc = new JsonRpc(api, { fetch })
// const rpc = new JsonRpc('https://wax.pink.gg/', { fetch })

export default async function handler(req, res) {
	// check if the request is a GET request
	if (req.method === 'GET') {
		const { wallet } = req.query

		// fetch user data from the blockchain

		const response = await Promise.all([
			// rpc.get_currency_balance('wrecktiumtok', wallet, 'WTM'),
			null,
			rpc.get_table_rows({
				json: true,
				code: 'robostakings',
				scope: 'robostakings',
				table: 'wallets',
				key_type: 'i64',
				index_position: 1,
				table_key: 'wallet', // Lookup key
				lower_bound: wallet, // NFT author name
				upper_bound: wallet,
				limit: 1,
			}),
		])

		// const response = await rpc
		// 	.get_currency_balance('wrecktiumtok', wallet, 'WTM')
		// 	.then((wtm) => {
		// 		return wtm
		// 	})
		// 	.catch((error) => {
		// 		console.log(error)
		// 	})

		const balances = () => {
			const tokens = []
			const initGameTok = ['0.0000 RX']

			// tokens.push(response[0].length > 0 ? response[0][0] : '0.0000 RA')
			tokens.push('0.0000 RA')
			response[1].rows.length > 0
				? response[1].rows[0].resource_tokens.forEach((token) =>
						tokens.push(token)
				  )
				: initGameTok.map((tok) => tokens.push(tok))

			return tokens
		}

		res.status(200).json(balances())
	}
}
