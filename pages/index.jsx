import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Home({ ual }) {
	const [user, setUser] = useState(null)

	const router = useRouter()

	const walletLogin = async () => {
		ual.showModal()
	}

	useEffect(() => {
		setUser(ual.activeUser)

		ual.activeUser && router.push('/lobby')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ual])

	return (
		<>
			<Head>
				<title>Lobby Login | RoboRift</title>
			</Head>

			<div className="h-screen w-screen text-white bg-main bg-no-repeat bg-cover bg-center">
				<div className="flex flex-col items-center w-full h-full py-40">
					<h1 className="text-5xl font-cinzel font-bold pb-5 drop-shadow-xl">
						RoboRift
					</h1>
					<div className="flex flex-col justify-center items-center h-full">
						<div className="flex flex-col justify-center items-center bg-zinc-700/90 rounded-xl py-6 px-12">
							<h3 className="text-3xl font-semibold">No Trespassing!!!</h3>
							<p className="text-sm font-merriweather pt-2 pb-6">
								Authenticate yourself to get access.
							</p>
							{!ual.activeUser && (
								<button
									onClick={walletLogin}
									className="my-3 bg-pink-500 px-6 py-4 rounded-xl font-bold shadow-lg active:scale-95 duration-150"
								>
									{/* Sign in with{' '} */}
									Open Authorizer
								</button>
							)}
							{ual.activeUser && (
								<>
									<p className="mb-8 font-merriweather">
										Logged in as {ual.activeUser?.accountName}
									</p>
									<p className="">Redirecting to lobby...</p>
								</>
							)}
							<a
								href="https://roborift.world/"
								className="text-sm font-semibold font-merriweather my-8 hover:text-blue-300 transition duration-200 ease-in-out active:scale-95"
							>
								Read more about us &gt;
							</a>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
