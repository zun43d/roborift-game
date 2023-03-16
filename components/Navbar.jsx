import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import fetcher from '../utils/fetcher'
import { CgMenuRight, CgClose } from 'react-icons/cg'
import { useState } from 'react'

import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, useMantineTheme, Text } from '@mantine/core'
import cogoToast from 'cogo-toast'
import exchange from '../lib/exchange'

export default function Navbar({ ual }) {
	const router = useRouter()
	const [navOpen, setNavOpen] = useState(false)
	const [exchangeAmt, setExchangeAmt] = useState(0)
	const [loading, setLoading] = useState(false)
	const [opened, { open, close }] = useDisclosure(false)

	const theme = useMantineTheme()

	const userName = ual.activeUser?.accountName

	const { data: userBal, error } = useSWR(
		`/api/user/balance?wallet=${userName}`,
		{ fetcher }
	)

	const handleLogout = () => {
		router.push('/')
		ual.logout()
	}

	const handleExchange = async (amt) => {
		setLoading(true)
		const res = await exchange(ual.activeUser, +amt)

		if (res.message) {
			close()
			setLoading(false)
			return cogoToast.warn(res.message)
		}

		res.transactionId && cogoToast.success('Transaction was successful')
		close()
		setLoading(false)
	}

	return (
		<div className="bg-zinc-900 border-b border-zinc-800 border-t-4 border-t-pink-600">
			<div className="max-w-7xl flex h-16 md:h-24 justify-between items-center mx-auto px-5">
				<nav className="flex items-center text-sm md:text-base font-bold space-x-4 md:space-x-8">
					<Link href="/lobby" className="w-8 md:w-auto">
						<Image
							src="/logo-1.png"
							alt="RoboRift Logo"
							width={50}
							height={50}
						/>
					</Link>
					<Link href="/lobby/staking">Staking Rewards</Link>
					<Link href="https://utility.roborift.world/">Utilities</Link>
				</nav>
				<div className="hidden md:flex">
					<div className="flex gap-0.5">
						<div className="bg-zinc-500/50 px-3 py-1.5 rounded-l-lg">
							<span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-3"></span>
							{userBal ? userBal[1] : '...'}
						</div>
						<div className="bg-zinc-500/50 px-3 py-1.5 rounded-r-lg">
							<span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-3"></span>
							{userBal ? userBal[0] : '...'}
						</div>
					</div>
					<button className="btn" onClick={open}>
						Exchange
					</button>
					<button className="btn" onClick={handleLogout}>
						Log Out
					</button>
				</div>
				<div className="md:hidden flex justify-center items-center">
					<button
						className="font-semibold pl-3 pr-1 py-3"
						onClick={() => setNavOpen((e) => !e)}
					>
						<CgMenuRight size={26} />
					</button>

					<div
						className={`${
							navOpen ? 'block' : 'hidden'
						} md:hidden absolute top-16 right-1/2 translate-x-1/2 w-11/12 my-3 p-5 bg-zinc-800 rounded-xl`}
					>
						<span
							onClick={() => setNavOpen(false)}
							className="absolute top-3 right-3 text-xl p-3"
						>
							<CgClose />
						</span>
						<h5 className="text-zinc-400 font-bold text-sm mb-2">Balances</h5>
						<div className="flex flex-col gap-0.5">
							<div className="px-3 py-1">
								<span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-3"></span>
								{userBal ? userBal[1] : '...'}
							</div>
							<div className="px-3 py-1">
								<span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-3"></span>
								{userBal ? userBal[0] : '...'}
							</div>
						</div>
						<hr className="border-zinc-700 my-4" />
						<button
							className="relative left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-zinc-500/50 font-semibold text-sm"
							onClick={handleLogout}
						>
							Log Out
						</button>
					</div>
				</div>

				<Modal
					radius={theme.radius.md}
					opened={opened}
					onClose={close}
					title="Resource Exchange"
					overlayProps={{
						color:
							theme.colorScheme === 'dark'
								? theme.colors.dark[9]
								: theme.colors.gray[2],
						opacity: 0.55,
						blur: 3,
					}}
				>
					<Text size="sm">
						<div className="flex flex-col justify-center items-start px-3 py-2 border border-zinc-800 rounded-lg">
							<p className="font-bold">Available Resources</p>
							<p className="text-2xl ">{userBal ? userBal[1] : '...'}</p>
						</div>
						<div className="flex flex-col justify-center items-start px-3 py-2 border border-zinc-800 rounded-lg my-3">
							<p className="font-bold">Exchange Rate</p>
							<p className="text-2xl">1.0000 RA = 1000.0000 RX</p>
						</div>
						<hr className="border-zinc-700 my-6 w-32 mx-auto" />
						<div className="flex flex-col justify-center items-start px-3 py-2 border border-zinc-800 rounded-lg my-3">
							<p className="font-bold text-pink-600">
								Enter withdraw amount (RA)
							</p>
							<div>
								<input
									type="number"
									className="w-full bg-transparent rounded-lg px-0.5 py-0 my-0.5 text-2xl focus:outline-pink-700 focus-visible:outline-0 placeholder:text-zinc-400"
									onChange={(e) => setExchangeAmt(+e.target.value)}
									placeholder="0.0000 RA"
									data-autofocus
									// value="0.0000"
								/>
								<p className="text-zinc-600 text-xs font-semibold">
									Enter the amount of RA you want to withdraw.
								</p>
							</div>
						</div>

						<Button
							color="pink"
							className="bg-pink-700 my-1"
							fullWidth
							radius={8}
							onClick={() => handleExchange(exchangeAmt)}
							loading={loading}
						>
							Confirm
						</Button>
					</Text>
				</Modal>
			</div>
		</div>
	)
}
