export const getImage = (nft, type) => {
	const imgId =
		type === 'template'
			? nft.immutable_data.img
			: nft.template.immutable_data.img
	const ipfsAddr = process.env.NEXT_PUBLIC_ASSET_IMAGE_ENDPOINT

	return `${ipfsAddr}/${imgId}`
}
