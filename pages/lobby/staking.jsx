import { DateTime, Interval } from 'luxon'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import Navbar from '../../components/Navbar'
import { BsPlusCircleDotted } from 'react-icons/bs'
import { GiWarPick } from 'react-icons/gi'
import Image from 'next/image'
import CardSelect from '../../components/modals/CardSelect'

export default function Staking({ ual }) {
	const { mutate } = useSWRConfig()

	const [landModalIsOpen, setLandModalIsOpen] = useState(false)
	const [currentLand, setCurrentLand] = useState(null)

	const [toolModalIsOpen, setToolModalIsOpen] = useState(false)
	const [currentTool, setCurrentTool] = useState(null)

	const [cooldown, setCooldown] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const intervalId = useRef(null)

	const [isMining, setIsMining] = useState(false)

	const { data: stakedLands } = useSWR('/api/staked-lands', fetch)
	const { data: stakedTools } = useSWR(
		`/api/user/staked-tools?wallet=${ual.activeUser?.accountName}`,
		fetch
	)

	const countdown = async (time) => {
		// calculate the time remaining until the end time
		const timeRemaining = Interval.fromDateTimes(
			DateTime.utc(),
			DateTime.fromJSDate(new Date(time), { zone: 'utc' })
		).toDuration(['hours', 'minutes', 'seconds', 'milliseconds'])

		const remain = {
			hours: timeRemaining.hours,
			minutes: timeRemaining.minutes,
			seconds: timeRemaining.seconds,
		}

		setCooldown(remain)
		setIsLoading(false)

		// update the UI with the time remaining
		console.log(`Time remaining: ${timeRemaining.seconds} seconds`)

		if (!timeRemaining.isValid || timeRemaining.seconds <= 0) {
			clearInterval(intervalId.current)
			setCooldown(null)
			console.log("Time's Up!")
		}
	}

	useEffect(() => {
		if (currentTool) {
			setIsLoading(true)
			fetch(
				`/api/tool-cooldown?wallet=${ual.activeUser?.accountName}&toolId=${currentTool?.asset_id}`
			)
				.then((res) => res.json())
				.then((res) => {
					const isValidDurantion = Interval.fromDateTimes(
						DateTime.utc(),
						new Date(res)
					).toDuration().isValid

					if (isValidDurantion) {
						intervalId.current = setInterval(() => countdown(res), 1000)
						return
					}
					setIsLoading(false)
				})
		}

		return () => {
			clearInterval(intervalId.current)
			setCooldown(null)
		}
	}, [currentTool, isMining])

	const handleMine = async (activeUser, landAssetId, toolAssetId) => {
		setIsMining(true)
		await mine(activeUser, landAssetId, toolAssetId)
			.then((res) => {
				setIsMining(false)

				if (res.message) {
					return alert(res.message)
				}

				res.transactionId && alert('\nMining Success!!\nRewards Received!\n')
			})
			.catch((err) => {
				setIsMining(false)
				alert('Something went wrong!')
			})
	}

	const onSelect = (nft, type) => {
		if (type == 'land') {
			setCurrentLand(nft)
			setLandModalIsOpen(false)
		} else {
			setCurrentTool(nft)
			setToolModalIsOpen(false)
		}
	}

	return (
		<div>
			<Head>
				<title>RoboRift | Staking</title>
			</Head>

			<Navbar ual={ual} />
			<main className="max-w-7xl mx-auto  my-5">
				<h2 className="text-center font-bold text-4xl">Staking</h2>
				<div className="flex flex-col items-center justify-center my-12 transition-all duration-200">
					<div className="flex items-center justify-cente gap-8 mb-10">
						{currentLand ? (
							<div
								className="select-card h-[442px] p-0 justify-between"
								onClick={() => setLandModalIsOpen(true)}
							>
								<h3 className="text-center text-gray-300 w-full border-b border-b-gray-700 py-3">
									Selected Land
								</h3>
								<div className="mx-auto flex items-center justify-center h-80 pt-3">
									<Image
										src={getImage(currentLand)}
										alt={currentLand.template.immutable_data.name}
										height={288}
										width={288}
										className="px-2 h-full w-full object-contain"
									/>
								</div>
								<p className="text-center pt-2 pb-4 text-base">
									{currentLand.template.immutable_data.name
										? currentLand.template.immutable_data.name
										: 'No Name'}
								</p>
							</div>
						) : (
							<div
								className="select-card"
								onClick={() => setLandModalIsOpen(true)}
							>
								<BsPlusCircleDotted size={50} />
								<span className="mt-3">Choose a land</span>
							</div>
						)}
						{currentTool ? (
							<div
								className="select-card h-[442px] p-0 justify-between"
								onClick={() => setToolModalIsOpen(true)}
							>
								<h3 className="text-center text-gray-300 w-full border-b border-b-gray-700 py-3">
									Current Tool
								</h3>
								<div className="mx-auto flex items-center justify-center h-80 pt-3">
									<Image
										src={getImage(currentTool)}
										alt={currentTool.template.immutable_data.name}
										width={264}
										height={264}
										className="px-2 w-full h-full object-contain"
									/>
								</div>
								<p className="text-center pt-2 pb-4 text-base">
									{currentTool.template.immutable_data.name
										? currentTool.template.immutable_data.name
										: 'No Name'}
								</p>
							</div>
						) : (
							<div
								className="select-card"
								onClick={() => setToolModalIsOpen(true)}
							>
								<GiWarPick size={50} />
								<span className="mt-3">Select a tool</span>
							</div>
						)}
					</div>

					{isLoading ? (
						<div className="animate-pulse rounded-md bg-gray-900/70 px-6 py-2">
							Fetching...
						</div>
					) : cooldown ? (
						<div className="flex flex-col justify-center items-center bg-gray-900/70 rounded-md px-3 pt-3 pb-2 w-28">
							<span className="font-sans text-xs font-semibold text-gray-300 ">
								NEXT MINE IN
							</span>
							<span className="text-lg font-merriweather">
								{cooldown.hours || '00'}:{cooldown.minutes || '00'}:
								{cooldown.seconds || '00'}
							</span>
						</div>
					) : (
						<button
							className={`${!(currentLand && currentTool) && 'disabled'} ${
								!isMining && 'border'
							} border-gray-400 bg-gray-800/80 hover:bg-gray-800 px-6 py-2 cursor-pointer`}
							disabled={!(currentLand && currentTool) || isMining}
							onClick={() =>
								handleMine(
									ual.activeUser,
									currentLand.asset_id,
									currentTool.asset_id
								)
							}
						>
							{isMining ? 'Mining...' : 'Start Mine'}
						</button>
					)}
				</div>
			</main>

			<CardSelect
				modalIsOpen={landModalIsOpen}
				setModalIsOpen={setLandModalIsOpen}
				onSelect={onSelect}
				nfts={stakedLands}
				type="land"
			/>

			<CardSelect
				ual={ual}
				mutate={mutate}
				modalIsOpen={toolModalIsOpen}
				setModalIsOpen={setToolModalIsOpen}
				onSelect={onSelect}
				nfts={stakedTools}
				type="tool"
			/>
		</div>
	)
}
