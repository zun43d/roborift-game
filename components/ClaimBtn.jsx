import cogoToast from 'cogo-toast'
import { DateTime, Interval } from 'luxon'
import { useEffect, useRef, useState } from 'react'
import mine from '../lib/mine'
import { BsCircleFill } from 'react-icons/bs'

export default function ClaimBtn({ ual, currentTool, currentLand }) {
	const [cooldown, setCooldown] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const intervalId = useRef(null)

	const [isMining, setIsMining] = useState(false)

	const handleMine = async (activeUser, landAssetId, toolAssetId) => {
		setIsMining(true)
		await mine(activeUser, landAssetId, toolAssetId)
			.then((res) => {
				setIsMining(false)

				if (res.message) {
					return cogoToast.warn(res.message)
				}

				res.transactionId && cogoToast.success('Resources Collected!')
			})
			.catch((err) => {
				setIsMining(false)
				cogoToast.error('Something went wrong!')
			})
	}

	useEffect(() => {
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

		return () => {
			clearInterval(intervalId.current)
			setCooldown(null)
		}
	}, [isMining])

	const countdown = async (time) => {
		// calculate the time remaining until the end time
		const timeRemaining = Interval.fromDateTimes(
			DateTime.utc(),
			DateTime.fromJSDate(new Date(time), { zone: 'utc' })
		).toDuration(['hours', 'minutes', 'seconds', 'milliseconds'])

		const secondsRemaining = Interval.fromDateTimes(
			DateTime.utc(),
			DateTime.fromJSDate(new Date(time), { zone: 'utc' })
		)
			.toDuration(['seconds'])
			.toObject().seconds

		const remain = timeRemaining.toObject()

		setCooldown(remain)
		setIsLoading(false)

		// update the UI with the time remaining
		// console.log(`Time remaining: ${secondsRemaining} seconds`)

		if (!timeRemaining.isValid || secondsRemaining <= 0) {
			clearInterval(intervalId.current)
			setCooldown(null)
			console.log("Time's Up!")
		}
	}

	return (
		<>
			{isLoading ? (
				<div className="animate-pulse rounded-md bg-gray-900/70 px-6 py-2">
					Fetching...
				</div>
			) : cooldown ? (
				<div className="flex flex-col justify-center items-center bg-gray-800/70 text-gray-300 rounded-xl px-3 py-1.5 w-full">
					<span className="text-lg text-center">
						{cooldown.hours || '00'}:{cooldown.minutes || '00'}:
						{cooldown.seconds || '00'}
					</span>
				</div>
			) : (
				<div
					className="w-full rounded-xl bg-gray-900 text-white duration-300 px-6 py-2"
					// disabled={isMining}
					// onClick={() =>
					// 	handleMine(
					// 		ual.activeUser,
					// 		currentLand.asset_id,
					// 		currentTool.asset_id
					// 	)
					// }
				>
					{/* {isMining ? 'Receiving...' : 'Get Resources'} */}
					{isMining ? (
						'Receiving...'
					) : (
						<span className="flex justify-center items-center gap-2">
							<BsCircleFill className="text-green-500" size={8} />
							Ready
						</span>
					)}
				</div>
			)}
		</>
	)
}
