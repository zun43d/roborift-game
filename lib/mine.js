// import { JsonRpc } from 'eosjs'

export default async function mine(activeUser, landAssetId, toolAssetId) {
	// const session = ual.activeUser
	const userName = activeUser.accountName
	const api = process.env.NEXT_PUBLIC_API_ENDPOINT
	// const rpc = new JsonRpc(api)

	try {
		return await activeUser.signTransaction(
			{
				actions: [
					{
						account: 'wrecktmining',
						name: 'mineland',
						authorization: [
							{
								actor: userName,
								permission: activeUser.requestPermission,
							},
						],
						data: {
							wallet: userName,
							land_asset_id: landAssetId,
							tool_asset_id: toolAssetId,
						},
					},
				],
			},
			{
				blocksBehind: 0,
				expireSeconds: 120,
			}
		)
	} catch (error) {
		console.log(error.message)
		return error
	}
}
