import type {Config} from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			keyframes: {
				popIn: {
					'0%': {opacity: '0', transform: 'scale(0.95)'},
					'100%': {opacity: '1', transform: 'scale(1)'},
				},
				flyRight: {
					'0%': {opacity: '1', transform: 'translateX(0)'},
					'49.99%': {opacity: '0', transform: 'translateX(100%)'},
					'50%': {opacity: '0', transform: 'translateX(-100%)'},
					'100%': {opacity: '1', transform: 'translateX(0)'},
				}
			},
			animation: {
				popIn: 'popIn 0.5s ease-out',
				flyRight: 'flyRight 0.65s ease-in-out',
			},
		},
	},
	plugins: [],
};
export default config;
