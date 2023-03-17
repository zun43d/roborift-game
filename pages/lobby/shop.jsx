import Head from 'next/head'
import Navbar from '../../components/Navbar'

export default function Shop({ ual }) {
	return (
		<>
			<Head>
				<title>RoboRift | Shop</title>
			</Head>

			<Navbar ual={ual} />
			<main className="max-w-7xl mx-auto mb-5">
				<div className="flex flex-col justify-center items-center py-14 border-b border-zinc-800 text-center">
					<p className="font-orbitron tracking-[0.5rem] text-pink-500 text-sm text-center">
						MARKET
					</p>
					<h2 className="text-3xl md:text-5xl font-semibold py-3">
						RoboRift Shop
					</h2>
					<p className="text-gray-400">
						Buy anything with your heart&apos;s content
					</p>
				</div>
				<div className="w-full mt-14">
					<p className="text-7xl text-center font-orbitron text-zinc-400 py-2 mb-3">
						╰(°▽°)╯
					</p>
					<p className="text-zinc-400 text-center mt-5 mx-4">
						Items will be added at the beginning of <br />
						<span className="text-pink-600">Next Season!</span>
					</p>
				</div>
			</main>
		</>
	)
}
