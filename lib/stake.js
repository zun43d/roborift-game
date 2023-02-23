// import { JsonRpc } from 'eosjs'

export default async function stake(activeUser, toolAssetId) {
	// const session = ual.activeUser
	const userName = activeUser.accountName
	// const api = process.env.NEXT_PUBLIC_API_ENDPOINT
	// const rpc = new JsonRpc(api)

	try {
		return await activeUser
			.signTransaction(
				{
					actions: [
						{
							account: 'atomicassets',
							name: 'transfer',
							authorization: [
								{
									actor: userName,
									permission: activeUser.requestPermission,
								},
							],
							data: {
								from: userName,
								to: 'robostakings',
								asset_ids: [toolAssetId],
								memo: 'stake;tool',
							},
						},
					],
				},
				{
					blocksBehind: 0,
					expireSeconds: 120,
				}
			)
			.then((result) => result.transactionId && alert('Staked to server.'))
	} catch (error) {
		console.log(error.message)
		alert(error.message)
	}
}
