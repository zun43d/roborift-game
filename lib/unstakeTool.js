// import { JsonRpc } from 'eosjs'

export default async function unstakeTool(activeUser, toolAssetIds) {
	// const session = ual.activeUser
	const userName = activeUser.accountName
	const api = process.env.NEXT_PUBLIC_API_ENDPOINT
	// const rpc = new JsonRpc(api)

	try {
		return await activeUser
			.signTransaction(
				{
					actions: [
						{
							account: 'wrecktmining',
							name: 'unstaketool',
							authorization: [
								{
									actor: userName,
									permission: activeUser.requestPermission,
								},
							],
							data: {
								wallet: userName,
								asset_ids: toolAssetIds,
							},
						},
					],
				},
				{
					blocksBehind: 0,
					expireSeconds: 120,
				}
			)
			.then((result) => result.transactionId && alert('Tool Unstaked!'))
	} catch (error) {
		console.log(error.message)
		alert(error.message)
	}
}
