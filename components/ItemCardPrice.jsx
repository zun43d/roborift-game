import cogoToast from 'cogo-toast'
import Image from 'next/image'
import useSWR from 'swr'
import purchase from '../lib/purchase'
import fetcher from '../utils/fetcher'
import { getImage } from '../utils/getImage'

const atomicApi = process.env.NEXT_PUBLIC_ASSET_API_ENDPOINT

export default function ItemCardPrice({ ual, sale }) {
	const { data: fetchedData, error } = useSWR(
		`${atomicApi}/atomicassets/v1/assets/${sale.asset_ids[0]}`,
		{
			fetcher,
		}
	)

	const data = fetchedData?.data

	const handleBuy = async (sale) => {
		await purchase(
			ual.activeUser,
			sale.sale_id,
			sale.asset_ids[0],
			sale.listing_price
		).then((res) => {
			if (res.message) {
				console.log(res)
				return cogoToast.warn(res.message)
			}

			res.transactionId &&
				cogoToast.success(
					`Success! The item was bought with ${sale.listing_price}!`
				)
		})
	}

	return !data ? null : (
		<div className="flex items-center justify-center transition-all duration-200">
			<div
				key={data.asset_id}
				className="bg-gray-800/50 rounded-xl border border-gray-700 w-64 h-[25rem] p-0 justify-between"
			>
				<div className="px-3 w-full mx-auto rounded-full text-center mt-3">
					<p className="inline-block bg-black/60 px-4 py-1 rounded-full">
						#{data.template_mint}
					</p>
				</div>
				<div className="mx-auto flex items-center justify-center h-60">
					<Image
						src={getImage(data)}
						alt={data.template.immutable_data.name}
						height={288}
						width={288}
						className="px-2 h-full w-full object-contain"
					/>
				</div>
				<div className="px-2">
					<p className="text-center pt-1 text-base">
						{data.template.immutable_data.name
							? data.template.immutable_data.name
							: 'No Name'}
					</p>
					{/* NFT price in green color */}
					<p className="text-center text-green-400 text-lg font-semibold pb-2">
						{sale.listing_price}
					</p>
					{data.schema.schema_name !== 'servers' && (
						<button
							className="bg-pink-700 hover:bg-gray-700 rounded-lg py-2 px-4 w-full duration-300"
							onClick={() => handleBuy(sale)}
						>
							Buy now
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
