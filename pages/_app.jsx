import '../styles/globals.css'
import 'regenerator-runtime/runtime'
import '@fontsource/cinzel/800.css'
import '@fontsource/merriweather'
import '@fontsource/inter'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'

import Script from 'next/script'
import { UALProvider, withUAL } from 'ual-reactjs-renderer'
import { Wax } from '@eosdacio/ual-wax'
import { Anchor } from 'ual-anchor'

const myChain = {
	chainId: process.env.NEXT_PUBLIC_API_CHAIN_ID, //'1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
	rpcEndpoints: [
		{
			protocol: 'https',
			host: process.env.NEXT_PUBLIC_API_ENDPOINT.replace('https://', ''), //'wax.dfuse.eosnation.io',
			port: '',
		},
	],
}

const wax = new Wax([myChain], { appName: 'My App' })
const anchor = new Anchor([myChain], { appName: 'My App' })

const authenticators =
	process.env.NEXT_PUBLIC_ENV == 'prod' ? [wax, anchor] : [anchor]

function MyApp({ Component, pageProps }) {
	const MyUALConsumer = withUAL(Component)

	// return <Component {...pageProps} />
	return (
		<>
			<Script
				strategy="lazyOnload"
				src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
			/>

			<Script strategy="lazyOnload" id="analytics">
				{`
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
				page_path: window.location.pathname,
				});
		`}
			</Script>

			<MantineProvider theme={{ colorScheme: 'dark' }}>
				<UALProvider
					chains={[myChain]}
					authenticators={authenticators}
					appName="My App"
				>
					<ModalsProvider>
						<MyUALConsumer {...pageProps} />
					</ModalsProvider>
				</UALProvider>
			</MantineProvider>
		</>
	)
}

export default MyApp
