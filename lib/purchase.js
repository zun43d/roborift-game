export default async function purchase(
	activeUser,
	saleId,
	assetId,
	listingPrice,
	settlementSymbol = '4,RA'
) {
	const userName = activeUser.accountName

	try {
		return await activeUser.signTransaction(
			{
				actions: [
					{
						account: 'roborftmarkt',
						name: 'assertsale',
						authorization: [
							{
								actor: userName,
								permission: activeUser.requestPermission,
							},
						],
						data: {
							sale_id: saleId,
							asset_ids_to_assert: [assetId],
							listing_price_to_assert: listingPrice,
							settlement_symbol_to_assert: settlementSymbol,
						},
					},
					{
						account: 'roborfttoken',
						name: 'transfer',
						authorization: [
							{
								actor: userName,
								permission: activeUser.requestPermission,
							},
						],
						data: {
							from: userName,
							to: 'roborftmarkt',
							quantity: listingPrice,
							memo: 'deposit',
						},
					},
					{
						account: 'roborftmarkt',
						name: 'purchasesale',
						authorization: [
							{
								actor: userName,
								permission: activeUser.requestPermission,
							},
						],
						data: {
							buyer: userName,
							sale_id: saleId,
							intended_delphi_median: 0,
							taker_marketplace: '',
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
