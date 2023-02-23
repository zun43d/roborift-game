import Head from 'next/head'
import useSWR from 'swr'
import Navbar from '../../components/Navbar'
import Image from 'next/image'
import fetcher from '../../utils/fetcher'
import { getImage } from '../../utils/getImage'
import ClaimBtn from '../../components/ClaimBtn'

export default function Staking({ ual }) {
	// const { data: stakedLands } = useSWR('/api/staked-lands', { fetcher })
	const { data: stakedTools } = useSWR(
		`/api/user/staked-tools?wallet=${ual.activeUser?.accountName}`,
		{ fetcher }
	)

	const ipfsAddr = process.env.NEXT_PUBLIC_ASSET_IMAGE_ENDPOINT
	const serverImgHash = 'QmTkVuDawy2Xh5NrX3mGvbQPQ6JbaREUxn5Q2Y9qKyyphW'

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
						<p className="text-gray-400">
							Claim your rewards from the staked flash drive and collect
							resources.
						</p>
					</div>
				</div>
				<div className="flex items-center justify-start my-12 transition-all duration-200">
					<div className="flex items-center justify-start gap-8 mb-10">
						{stakedTools?.length > 0 ? (
							stakedTools.map((tool, i) => (
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
										<ClaimBtn ual={ual} currentTool={tool} />
									</div>
								</div>
							))
						) : (
							<div>No flash drive found.</div>
						)}
					</div>
				</div>
			</main>
		</div>
	)
}
