// import { JsonRpc } from 'eosjs'

export default async function exchange(activeUser, quantity) {
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
							account: 'wrecktmining',
							name: 'withdraw',
							authorization: [
								{
									actor: userName,
									permission: activeUser.requestPermission,
								},
							],
							data: {
								wallet: userName,
								quantity: `${Math.floor(quantity)} WTM`,
							},
						},
					],
				},
				{
					blocksBehind: 0,
					expireSeconds: 120,
				}
			)
			.then(
				(result) =>
					result.transactionId && alert('You received ' + quantity + ' WTM!!')
			)
	} catch (error) {
		console.log(error.message)
		alert(error.message)
	}
}
