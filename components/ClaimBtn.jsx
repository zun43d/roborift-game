import { DateTime, Interval } from 'luxon'
import { useEffect, useRef, useState } from 'react'
import mine from '../lib/mine'

export default function ClaimBtn({ ual, currentTool }) {
	const [cooldown, setCooldown] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const intervalId = useRef(null)

	const [isMining, setIsMining] = useState(false)

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

	const handleMine = async (activeUser, landAssetId, toolAssetId) => {
		setIsMining(true)
		await mine(activeUser, landAssetId, toolAssetId)
			.then((res) => {
				setIsMining(false)

				if (res.message) {
					return alert(res.message)
				}

				res.transactionId && alert('Resources Collected.\n')
			})
			.catch((err) => {
				setIsMining(false)
				alert('Something went wrong!')
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

	return (
		<>
			{isLoading ? (
				<div className="animate-pulse rounded-md bg-gray-900/70 px-6 py-2">
					Fetching...
				</div>
			) : cooldown ? (
				<div className="flex flex-col justify-center items-center bg-gray-800/70 text-gray-300 rounded-xl px-3 pt-3 pb-2 w-full">
					<span className="text-lg text-center">
						{cooldown.hours || '00'}:{cooldown.minutes || '00'}:
						{cooldown.seconds || '00'}
					</span>
				</div>
			) : (
				<button
					className="w-full rounded-xl bg-gray-500 text-white hover:bg-gray-600 duration-300 px-6 py-2 cursor-pointer"
					disabled={isMining}
					onClick={() =>
						handleMine(
							ual.activeUser,
							currentLand.asset_id,
							currentTool.asset_id
						)
					}
				>
					{isMining ? 'Receiving...' : 'Get Resources'}
				</button>
			)}
		</>
	)
}
