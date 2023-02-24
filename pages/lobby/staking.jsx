import Head from 'next/head'
import useSWR, { mutate } from 'swr'
import Navbar from '../../components/Navbar'
import Image from 'next/image'
import fetcher from '../../utils/fetcher'
import { getImage } from '../../utils/getImage'
import ClaimBtn from '../../components/ClaimBtn'
import { useState } from 'react'
import stake from '../../lib/stake'
import mineMulti from '../../lib/mineMulti'

export default function Staking({ ual }) {
	const [page, setPage] = useState(1)
	const [isCollecting, setIsCollecting] = useState(false)
	const [currentLand, setCurrentLand] = useState({
		contract: 'atomicassets',
		asset_id: '1099551158657',
		owner: 'robostakings',
		is_transferable: true,
		is_burnable: true,
		collection: {
			collection_name: 'roboriftalpx',
			name: 'RoboRift',
			img: 'QmQWqZ9RHfPvarVhRkwWDe4WG3EdXQE9gyiqQALGQbAFki',
			author: 'roborftadmin',
			allow_notify: true,
			authorized_accounts: ['roborftadmin'],
			notify_accounts: [],
			market_fee: 0.02,
			created_at_block: '201696446',
			created_at_time: '1676734672000',
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
			],
			created_at_block: '202561860',
			created_at_time: '1677167837000',
		},
		template: {
			template_id: '607915',
			max_supply: '0',
			is_transferable: true,
			is_burnable: true,
			issued_supply: '1',
			immutable_data: {
				img: 'QmTkVuDawy2Xh5NrX3mGvbQPQ6JbaREUxn5Q2Y9qKyyphW',
				name: 'MegaCore Server',
				rarity: 'epic',
			},
			created_at_time: '1677168000500',
			created_at_block: '202562187',
		},
		mutable_data: {},
		immutable_data: {},
		template_mint: '1',
		backed_tokens: [],
		burned_by_account: null,
		burned_at_block: null,
		burned_at_time: null,
		updated_at_block: '202572513',
		updated_at_time: '1677173163500',
		transferred_at_block: '202572513',
		transferred_at_time: '1677173163500',
		minted_at_block: '202572413',
		minted_at_time: '1677173113500',
		data: {
			img: 'QmTkVuDawy2Xh5NrX3mGvbQPQ6JbaREUxn5Q2Y9qKyyphW',
			name: 'MegaCore Server',
			rarity: 'epic',
		},
		name: 'MegaCore Server',
	}) // defined server

	const userName = ual.activeUser?.accountName

	// const { data: stakedLands } = useSWR('/api/staked-lands', { fetcher })
	const { data: stakedTools, isValidating } = useSWR(
		`/api/user/staked-tools?wallet=${ual.activeUser?.accountName}`,
		{ fetcher }
	)

	const assetsAPI = process.env.NEXT_PUBLIC_ASSET_API_ENDPOINT
	const {
		data: { data: unstakedTools },
		error,
		isValidating: inventoryValidating,
	} = useSWR(
		`${assetsAPI}/atomicassets/v1/assets?collection_name=roboriftalpx&owner=${userName}&page=1&limit=100&order=desc&sort=asset_id`,
		{ fetcher }
	)
	console.log('unstakedTools', unstakedTools)

	const ipfsAddr = process.env.NEXT_PUBLIC_ASSET_IMAGE_ENDPOINT
	const serverImgHash = 'QmTkVuDawy2Xh5NrX3mGvbQPQ6JbaREUxn5Q2Y9qKyyphW'

	const handleStake = async (assetId) =>
		await stake(ual.activeUser, assetId).then(() =>
			mutate(
				`${assetsAPI}/atomicassets/v1/assets?collection_name=roboriftalpx&owner=${userName}&page=1&limit=100&order=desc&sort=asset_id`
			)
		)

	const handleMultiMine = async (activeUser, landAssetId, tools) => {
		setIsCollecting(true)
		const toolsIds = tools.map((tool) => tool.asset_id)
		await mineMulti(activeUser, landAssetId, toolsIds)
			.then((res) => {
				setIsCollecting(false)

				if (res.message) {
					return alert(res.message)
				}

				res.transactionId && alert('Resources Collected.\n')
			})
			.catch((err) => {
				setIsCollecting(false)
				alert('Something went wrong!')
			})
	}

	return (
		<div>
			<Head>
				<title>RoboRift | Staking</title>
			</Head>

			<Navbar ual={ual} />
			<main className="max-w-7xl mx-auto mb-5">
				<div className="flex justify-start items-center py-10 border-b border-zinc-800">
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
					<div className="px-8 py-2 flex justify-start flex-col items-start">
						<h2 className="text-center font-bold text-5xl py-3">
							Flash Drive Staking
						</h2>
						<p className="text-gray-400 max-w-3xl">
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
							<div className="grid grid-cols-4 justify-items-center gap-8 mb-10">
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
					<div className="flex flex-col items-center justify-center my-12 transition-all duration-200">
						{!stakedTools ? (
							<div className="w-full">
								<p className="text-center animate-pulse">
									Fetching staked drives...
								</p>
							</div>
						) : stakedTools?.length > 0 ? (
							<>
								<div className="flex items-center justify-between w-full bg-zinc-800 border border-zinc-700/80 mb-8 rounded-xl px-5 py-3">
									<div className="">
										<h4 className="font-bold">
											Get all of the available resources in one click.
										</h4>
										<p className="text-sm text-gray-400">
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
								<div className="grid grid-cols-4 justify-items-center gap-8 mb-10">
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
