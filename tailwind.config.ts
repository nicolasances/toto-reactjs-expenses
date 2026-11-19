import type { Config } from "tailwindcss";

/**
 * Tailwind is used mainly by the toto-react components (e.g. MaskedSvgIcon), which take Tailwind classes for size and color.
 *
 * Preflight is disabled on purpose: the app keeps its original CSS files and Tailwind's base reset would change the look of existing screens.
 * The colors mirror the CSS variables declared on <body> in app/globals.css.
 */
export default {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./utils/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/toto-react/dist/**/*.{js,mjs}",
	],
	corePlugins: {
		preflight: false,
	},
	theme: {
		extend: {
			colors: {
				"toto-background": "#00acc1",	// Main app background (--color-background)
				"accent": "#ffeb3b",			// Accent color, e.g. icon buttons (--color-accent)
				"dark-primary": "#004e6c",		// Dark primary (--color-dark-primary)
				"light-primary": "#5ddef5",		// Light primary (--color-light-primary)
				"text-light": "#d0d0d0",		// Light text (--color-text-light)
			},
		},
	},
	plugins: [],
} satisfies Config;
