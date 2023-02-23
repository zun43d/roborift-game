import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import useSWR, { useSWRConfig } from 'swr'
import Image from 'next/image'

import fetcher from '../../utils/fetcher'
import { getImage } from '../../utils/getImage'
import stake from '../../lib/stake'

export default function Lobby({ ual }) {
	const router = useRouter()

	// useEffect(() => {
	// 	// ual.activeUser && router.push('/lobby/staking')
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [ual])

	const { mutate } = useSWRConfig()

	useEffect(() => {
		mutate()
	}, [])

	const userName = ual.activeUser?.accountName

	const assetsAPI = process.env.NEXT_PUBLIC_ASSET_API_ENDPOINT

	const { data, error, isLoading } = useSWR(
		`${assetsAPI}/atomicassets/v1/assets?collection_name=roboriftalpx&owner=${userName}&page=1&limit=100&order=desc&sort=asset_id`,
		{ fetcher }
	)

	const inventory = data?.data || []

	const handleStake = async (assetId) =>
		await stake(ual.activeUser, assetId).then(() =>
			mutate(
				`${assetsAPI}/atomicassets/v1/assets?collection_name=roboriftalpx&owner=${userName}&page=1&limit=100&order=desc&sort=asset_id`
			)
		)

	return (
		<div>
			<Head>
				<title>RoboRift Lobby</title>
			</Head>

			<Navbar ual={ual} />
			<main className="max-w-7xl mx-auto">
				<div className="mb-5">
					<div className="py-10 border-b border-zinc-800">
						<h2 className="font-bold text-5xl py-3">Inventory</h2>
						<p className="text-gray-400 max-w-3xl">
							Check all the items you have in your wallet from <b>RoboRift</b>.
							You can stake the flash drives to server and collect resources
							from them.
						</p>
					</div>
					<div className="grid grid-cols-4 gap-4 w-full h-full my-10">
						{isLoading ? (
							<p className="text-center">Loading...</p>
						) : inventory.length > 0 ? (
							inventory.map((item) => (
								<div
									key={item.asset_id}
									className="bg-gray-900/20 border border-gray-800 rounded-lg px-4 py-4"
								>
									<div className="flex flex-col items-center justify-between h-full">
										<Image
											src={getImage(item)}
											alt={item.data.name}
											className="w-full h-full object-contain"
											height={264}
											width={264}
										/>
										{/* <p className="text-white text-center mt-3">
											{item.data.name ? item.data.name : 'No Name'}
										</p> */}
										<div className="flex items-center justify-between w-full">
											<p className="text-white font-semibold text-center">
												{item.data.name ? item.data.name : 'No Name'}
											</p>
											{item.schema.schema_name !== 'servers' && (
												<button
													className="bg-gray-500 hover:bg-gray-700 rounded-lg py-2 px-4 text-sm duration-300"
													onClick={() => handleStake(item.asset_id)}
												>
													Stake
												</button>
											)}
										</div>
									</div>
								</div>
							))
						) : (
							<p className="col-span-4 text-gray-300 text-center mt-3 flex items-center justify-center">
								You have no items in your inventory.
							</p>
						)}
					</div>
				</div>
			</main>
		</div>
	)
}
