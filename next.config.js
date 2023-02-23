/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'atomichub-ipfs.com',
				port: '',
				pathname: '/ipfs/**',
			},
		],
	},
}

module.exports = nextConfig
