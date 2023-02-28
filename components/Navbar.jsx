import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import fetcher from '../utils/fetcher'
import { CgMenuRight } from 'react-icons/cg'
import { useState } from 'react'
import { RxCross2 } from 'react-icons/rx'

export default function Navbar({ ual }) {
	const router = useRouter()
	const [navOpen, setNavOpen] = useState(false)

	const userName = ual.activeUser?.accountName

	const { data: userBal, error } = useSWR(
		`/api/user/balance?wallet=${userName}`,
		{ fetcher }
	)

	const handleLogout = () => {
		router.push('/')
		ual.logout()
	}

	return (
		<div className="bg-zinc-900 border-b border-zinc-800">
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
						<div className="bg-zinc-500/50 px-3 py-1 rounded-l-full">
							<span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-3"></span>
							{userBal ? userBal[1] : '...'}
						</div>
						<div className="bg-zinc-500/50 px-3 py-1 rounded-r-full">
							<span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-3"></span>
							{userBal ? userBal[0] : '...'}
						</div>
					</div>
					<button
						className="px-4 py-1 rounded-full bg-zinc-500/50 ml-3 font-semibold text-sm"
						onClick={handleLogout}
					>
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
							<RxCross2 />
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
			</div>
		</div>
	)
}
