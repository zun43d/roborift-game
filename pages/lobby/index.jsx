import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import useSWR, { useSWRConfig } from 'swr'
import Image from 'next/image'

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

	const { data, error } = useSWR(
		`${assetsAPI}/atomicassets/v1/assets?collection_name=roboriftalpx&owner=${userName}&page=1&limit=100&order=desc&sort=asset_id`,
		{ fetch }
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
				<div className="py-5 my-5">
					<h2 className="text-center font-bold text-4xl">Inventory</h2>
					<div className="grid grid-cols-4 gap-4 w-full h-full my-10">
						{inventory.length > 0 ? (
							inventory.map((item) => (
								<div
									key={item.asset_id}
									className="bg-amber-900/20 border border-amber-800 rounded-lg px-4 py-4"
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
										<div className="flex items-center justify-center w-full">
											<p className="text-white font-semibold text-center">
												{item.data.name ? item.data.name : 'No Name'}
											</p>
											{item.schema.schema_name === 'tools' && (
												<button
													className="btn-colored rounded-lg py-2 px-4 text-sm"
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
