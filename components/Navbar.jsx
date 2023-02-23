import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import fetcher from '../utils/fetcher'

export default function Navbar({ ual }) {
	const router = useRouter()

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
			<div className="max-w-7xl flex h-24 justify-between items-center mx-auto">
				<nav className="flex items-center font-bold space-x-8">
					<Link
						href="/lobby"
						className="font-extrabold text-2xl rounded-full border border-zinc-700 p-4 mr-3"
					>
						RR
					</Link>
					<Link href="/lobby/staking">Staking Rewards</Link>
					<Link href="https://utility.roborift.world/">Utilities</Link>
				</nav>
				<div className="flex">
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
			</div>
		</div>
	)
}
