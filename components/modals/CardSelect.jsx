import Image from 'next/image'
import { useRouter } from 'next/router'
import ReactModal from 'react-modal'
import unstakeTool from '../../lib/unstakeTool'
import { getImage } from '../../utils/getImage'

export default function CardSelect({
	ual,
	mutate,
	modalIsOpen,
	setModalIsOpen,
	onSelect,
	nfts,
	type,
}) {
	const handleUnstake = async (assetId) =>
		await unstakeTool(ual.activeUser, [assetId]).then(() => mutate())

	return (
		<ReactModal
			isOpen={modalIsOpen}
			onRequestClose={() => setModalIsOpen(false)}
			shouldFocusAfterRender={false}
			ariaHideApp={false}
			style={{
				overlay: {
					backgroundColor: 'rgba(0, 0, 0, 0.4)',
				},
				content: {
					top: '50%',
					left: '50%',
					transform: 'translate(-50%,-50%)',
				},
			}}
			className="scrollbar modal"
		>
			<div className="my-10">
				<h2 className="text-4xl font-cinzel text-center font-semibold">
					{type == 'land' ? 'Choose a land' : 'Select your preferred tool'}
				</h2>
				{type === 'tool' && (
					<p className="text-slate-400 text-center mt-3">
						Only staked tools can be used for mining.
					</p>
				)}
			</div>

			<div className="grid grid-cols-3 items-center justify-items-center gap-y-8 mx-10">
				{nfts?.length > 0 ? (
					nfts.map((nft) => {
						const img = getImage(nft)
						const name = nft.template.immutable_data.name
						return (
							<div
								key={nft.asset_id}
								className="w-72 flex flex-col items-center justify-between bg-gray-700/40 hover:shadow-xl hover:scale-[1.0095] hover:-translate-y-1 duration-200 rounded-lg cursor-pointer"
								onClick={() => onSelect(nft, type)}
							>
								<div className="mx-auto object-contain py-5">
									<Image
										src={img}
										alt={name}
										width={264}
										height={264}
										className="px-5"
									/>
								</div>
								<div
									className={`flex items-center ${
										type === 'tool' ? 'justify-between' : 'justify-center'
									} w-full px-5 py-5`}
								>
									<p className="text-center">{name ? name : 'No Name'}</p>
									{type === 'tool' && (
										<button
											className="btn-colored rounded-lg py-2 px-4 text-sm z-10"
											onClick={() => handleUnstake(nft.asset_id)}
										>
											Unstake
										</button>
									)}
								</div>
							</div>
						)
					})
				) : type === 'land' ? (
					<p className="text-center">No lands available.</p>
				) : (
					<p className="text-center col-span-3 h-full flex items-center justify-center">
						Looks like you don&apos;t have any staked tool!
					</p>
				)}
			</div>
		</ReactModal>
	)
}
