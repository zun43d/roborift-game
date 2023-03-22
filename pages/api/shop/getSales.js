import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'

const adminWallet = 'roborftadmin' // mainnet
// const adminWallet = 'thatdevthere' // testnet

export default async function handler(req, res) {
	if (req.method == 'GET') {
		// get sale info from the sales table of atomicmarket-contract
		const api = process.env.NEXT_PUBLIC_API_ENDPOINT
		const rpc = new JsonRpc(api, { fetch })
		const { rows } = await rpc.get_table_rows({
			json: true,
			code: 'roborftmarkt',
			scope: 'roborftmarkt',
			table: 'sales',
			limit: 100,
			reverse: true,
			show_payer: true,
		})

		// check is if the offer was created for the asset(s)
		const validSales = rows.filter(
			(sale) => sale.data.offer_id !== -1 && sale.data.seller === adminWallet
		)

		res.status(200).json(validSales)
	}
}
