import Head from 'next/head'
import useSWR, { mutate } from 'swr'
import Navbar from '../../components/Navbar'
import Image from 'next/image'
import fetcher from '../../utils/fetcher'
import { getImage } from '../../utils/getImage'
import ClaimBtn from '../../components/ClaimBtn'
import { useEffect, useState } from 'react'
import stake from '../../lib/stake'
import mineMulti from '../../lib/mineMulti'
import cogoToast from 'cogo-toast'
import { useRouter } from 'next/router'

export default function Staking({ ual }) {
	const router = useRouter()

	const [page, setPage] = useState(1)
	const [isCollecting, setIsCollecting] = useState(false)
	const [currentLand, setCurrentLand] = useState({
		contract: 'atomicassets',
		asset_id: '1099862287827',
		owner: 'robostakings',
		is_transferable: true,
		is_burnable: true,
		collection: {
			collection_name: 'roboriftalpx',
			name: 'RoboRift',
			img: 'Qmd8oLHXdxjQnsNbRvEc2xiFGpjptCBm1X4qv3dR3GThRM',
			author: 'roborftadmin',
			allow_notify: true,
			authorized_accounts: ['roborftadmin', 'robostakings', 'neftyblocksd'],
			notify_accounts: [],
			market_fee: 0.06,
			created_at_block: '231590891',
			created_at_time: '1677264499000',
		},
		schema: {
			schema_name: 'servers',
			format: [
				{
					name: 'name',
					type: 'string',
				},
				{
					name: 'img',
					type: 'image',
				},
				{
					name: 'video',
					type: 'string',
				},
				{
					name: 'rarity',
					type: 'string',
				},
				{
					name: 'maintenance fee',
					type: 'string',
				},
				{
					name: 'description',
					type: 'string',
				},
			],
			created_at_block: '231744298',
			created_at_time: '1677341251000',
		},
		template: {
			template_id: '662887',
			max_supply: '0',
			is_transferable: true,
			is_burnable: true,
			issued_supply: '1',
			immutable_data: {
				img: 'QmTkVuDawy2Xh5NrX3mGvbQPQ6JbaREUxn5Q2Y9qKyyphW',
				name: 'MegaCore Server',
				rarity: 'epic',
				description:
					"In Robo Rift, the servers play a crucial role as the host of Rift X (RX). These servers are responsible for distributing RX to players through the staking process, and they also serve as the backbone of the game's economy. The servers are maintained and secured by the game developers, ensuring a fair and stable environment for players to participate in. By staking RX on these servers, players not only earn rewards in the form of Rift Alpha (RA) but also contribute to the stability and security of the game. So whether you're a seasoned player or just starting out, be sure to make use of the servers to your advantage. By claiming your share of RX, you'll become a valuable part of the Robo Rift community, helping to shape the future of the game.  The server charges 5% royalty for the maintenance cost.",
				'maintenance fee': '5%',
			},
			created_at_time: '1677342603000',
			created_at_block: '231747002',
		},
		mutable_data: {},
		immutable_data: {},
		template_mint: '1',
		backed_tokens: [],
		burned_by_account: null,
		burned_at_block: null,
		burned_at_time: null,
		updated_at_block: '232265197',
		updated_at_time: '1677601717500',
		transferred_at_block: '232265197',
		transferred_at_time: '1677601717500',
		minted_at_block: '232265119',
		minted_at_time: '1677601678500',
		data: {
			img: 'QmTkVuDawy2Xh5NrX3mGvbQPQ6JbaREUxn5Q2Y9qKyyphW',
			name: 'MegaCore Server',
			rarity: 'epic',
			description:
				"In Robo Rift, the servers play a crucial role as the host of Rift X (RX). These servers are responsible for distributing RX to players through the staking process, and they also serve as the backbone of the game's economy. The servers are maintained and secured by the game developers, ensuring a fair and stable environment for players to participate in. By staking RX on these servers, players not only earn rewards in the form of Rift Alpha (RA) but also contribute to the stability and security of the game. So whether you're a seasoned player or just starting out, be sure to make use of the servers to your advantage. By claiming your share of RX, you'll become a valuable part of the Robo Rift community, helping to shape the future of the game.  The server charges 5% royalty for the maintenance cost.",
			'maintenance fee': '5%',
		},
		name: 'MegaCore Server',
	}) // defined server
	const [randomKey, setRandomKey] = useState(0)

	const userName = ual.activeUser?.accountName

	useEffect(() => {
		// if no user logges in, redirect to login page using router
		if (!ual.activeUser) {
			router.push('/')
		}
	}, [ual])

	// const { data: stakedLands } = useSWR('/api/staked-lands', { fetcher })
	const { data: stakedTools, isValidating } = useSWR(
		`/api/user/staked-tools?wallet=${ual.activeUser?.accountName}`,
		{ fetcher }
	)

	const assetsAPI = process.env.NEXT_PUBLIC_ASSET_API_ENDPOINT
	const {
		data,
		error,
		isValidating: inventoryValidating,
	} = useSWR(
		`${assetsAPI}/atomicassets/v1/assets?collection_name=roboriftalpx&owner=${userName}&page=1&limit=100&order=desc&sort=asset_id`,
		{ fetcher }
	)
	const unstakedTools = data?.data

	const ipfsAddr = process.env.NEXT_PUBLIC_ASSET_IMAGE_ENDPOINT
	const serverImgHash = 'QmTkVuDawy2Xh5NrX3mGvbQPQ6JbaREUxn5Q2Y9qKyyphW'

	const handleStake = async (assetId) =>
		await stake(ual.activeUser, assetId).then((res) => {
			if (res.message) {
				return cogoToast.warn(res.message)
			}

			res.transactionId && cogoToast.success('Flash drive staked to server!')

			mutate(
				`${assetsAPI}/atomicassets/v1/assets?collection_name=roboriftalpx&owner=${userName}&page=1&limit=100&order=desc&sort=asset_id`
			)
		})

	const handleMultiMine = async (activeUser, landAssetId, tools) => {
		setIsCollecting(true)
		const toolsIds = tools.map((tool) => tool.asset_id)
		const key = () => Math.random() * 100000000
		await mineMulti(activeUser, landAssetId, toolsIds)
			.then((res) => {
				setIsCollecting(false)
				setRandomKey(key)

				if (res.message) {
					return cogoToast.warn(res.message)
				}

				res.transactionId && cogoToast.success('Resources Collected!')
			})
			.catch((err) => {
				setIsCollecting(false)
				cogoToast.error('Something went wrong!')
			})
	}

	return (
		<div>
			<Head>
				<title>RoboRift | Staking</title>
			</Head>

			<Navbar ual={ual} />
			<main className="max-w-7xl mx-auto mb-5">
				<div className="flex flex-col md:flex-row justify-start items-center py-10 border-b border-zinc-800">
					<div className="flex flex-col justify-center items-center w-52 bg-gray-800/70 rounded-xl border border-gray-700 px-3 py-3">
						<Image
							src={`${ipfsAddr}/${serverImgHash}`}
							alt="MegaCore Server"
							height={288}
							width={288}
							className="px-2 h-full w-full object-contain"
						/>
						<h3 className="font-semibold text-center py-3">MegaCore Server</h3>
					</div>
					<div className="px-8 py-2 flex justify-center md:justify-start flex-col items-center md:items-start">
						<h2 className="leading-tight text-center font-bold text-4xl md:text-5xl py-4 md:py-3">
							Flash Drive Staking
						</h2>
						<p className="text-center md:text-left text-gray-400 max-w-3xl">
							Claim your rewards from the staked flash drive and collect
							resources. To prevent data corruption, resources from flash drives
							can only be claimed after a certain cooldown which the drive was
							assigned with.
						</p>
					</div>
				</div>
				<div className="my-5 flex justify-center items-center">
					<div className="bg-zinc-600 p-1 rounded-xl">
						<button
							className={`px-3 py-2 rounded-lg active:scale-95 duration-200 ${
								page === 1 && 'bg-zinc-900'
							}`}
							onClick={() => setPage(1)}
						>
							Unstaked
						</button>
						<button
							className={`px-5 py-2 rounded-lg active:scale-95 duration-200 ${
								page === 2 && 'bg-zinc-900'
							}`}
							onClick={() => setPage(2)}
						>
							Staked
						</button>
					</div>
				</div>
				{page === 1 && (
					<div className="flex items-center justify-center my-12 transition-all duration-200">
						{!unstakedTools ? (
							<div className="w-full">
								<p className="text-center animate-pulse">
									Getting unstaked drives...
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-8 mb-10 mx-10">
								{unstakedTools?.length > 0 ? (
									unstakedTools.map((tool, i) => (
										<div
											key={tool.asset_id}
											className="bg-gray-800/70 rounded-xl border border-gray-700 w-64 h-96 p-0 justify-between"
										>
											<div className="px-3 w-full mx-auto rounded-full text-center mt-3">
												<p className="inline-block bg-black/60 px-4 py-1 rounded-full">
													#{tool.template_mint}
												</p>
											</div>
											<div className="mx-auto flex items-center justify-center h-60">
												<Image
													src={getImage(tool)}
													alt={tool.template.immutable_data.name}
													height={288}
													width={288}
													className="px-2 h-full w-full object-contain"
												/>
											</div>
											<div className="px-2">
												<p className="text-center pt-2 pb-4 text-base">
													{tool.template.immutable_data.name
														? tool.template.immutable_data.name
														: 'No Name'}
												</p>
												{tool.schema.schema_name !== 'servers' && (
													<button
														className="bg-gray-500 hover:bg-gray-700 rounded-lg py-2 px-4 w-full duration-300"
														onClick={() => handleStake(tool.asset_id)}
													>
														Stake
													</button>
												)}
											</div>
										</div>
									))
								) : (
									<div>No flash drives found in your wallet.</div>
								)}
							</div>
						)}
					</div>
				)}
				{page === 2 && (
					<div
						className="flex flex-col items-center justify-center my-12 transition-all duration-200 mx-5"
						key={randomKey}
					>
						{!stakedTools ? (
							<div className="w-full">
								<p className="text-center animate-pulse">
									Fetching staked drives...
								</p>
							</div>
						) : stakedTools?.length > 0 ? (
							<>
								<div className="flex flex-col md:flex-row items-center justify-between w-10/12 md:w-full bg-zinc-800 border border-zinc-700/80 mb-8 rounded-xl px-5 py-4 md:py-3">
									<div className="mb-5 md:mb-0">
										<h4 className="font-bold">
											Get all of the available resources in one click.
										</h4>
										<p className="text-sm text-gray-400 pt-2 md:pt-0">
											Remember, this button will only work if none of the tools
											are on cooldown.
										</p>
									</div>
									<button
										className="bg-gray-200 py-3 px-5 text-gray-900 text-sm font-semibold rounded-xl"
										onClick={() =>
											handleMultiMine(
												ual.activeUser,
												currentLand.asset_id,
												stakedTools
											)
										}
									>
										Collect all resources
									</button>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-8 mb-10 mx-10">
									{stakedTools.map((tool, i) => (
										<div
											key={tool.asset_id}
											className="bg-gray-800/70 rounded-xl border border-gray-700 w-64 h-96 p-0 justify-between"
										>
											<div className="px-3 w-full mx-auto rounded-full text-center mt-3">
												<p className="inline-block bg-black/60 px-4 py-1 rounded-full">
													#{tool.template_mint}
												</p>
											</div>
											<div className="mx-auto flex items-center justify-center h-60">
												<Image
													src={getImage(tool)}
													alt={tool.template.immutable_data.name}
													height={288}
													width={288}
													className="px-2 h-full w-full object-contain"
												/>
											</div>
											<div className="px-2">
												<p className="text-center pt-2 pb-4 text-base">
													{tool.template.immutable_data.name
														? tool.template.immutable_data.name
														: 'No Name'}
												</p>
												<ClaimBtn
													ual={ual}
													currentTool={tool}
													currentLand={currentLand}
												/>
											</div>
										</div>
									))}
								</div>
							</>
						) : (
							<div>No flash drive found.</div>
						)}
					</div>
				)}
			</main>
		</div>
	)
}
