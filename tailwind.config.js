/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx}',
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', ...defaultTheme.fontFamily.sans],
				merriweather: [
					'Merriweather',
					'Inter',
					...defaultTheme.fontFamily.sans,
				],
				cinzel: ['Cinzel', 'Inter', ...defaultTheme.fontFamily.sans],
			},
			backgroundImage: {
				main: "url('/wrecked-worlds-bg.png')",
			},
		},
	},
	plugins: [],
}
