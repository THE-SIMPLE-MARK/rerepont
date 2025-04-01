// tailwind.config.js
const { heroui } = require("@heroui/theme")

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",

		// ...
		// make sure it's pointing to the ROOT node_module
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	darkMode: "class",
	plugins: [heroui()],
}
