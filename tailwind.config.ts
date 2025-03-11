/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";
import daisyui from "daisyui"
import { default as flattenColorPalette } from 'tailwindcss/lib/util/flattenColorPalette';

/** @type {import('tailwindcss').Config} */

module.exports = {
	darkMode: ["class"],
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
    	colors: {
			
    		transparent: 'transparent',
    		current: 'currentColor',
    		black: 'colors.black',
    		white: 'colors.white',
    		gray: 'colors.gray',
    		slate: 'colors.slate',
    		zinc: 'colors.zinc',
    		neutral: 'colors.neutral',
    		stone: 'colors.stone',
    		red: 'colors.red',
    		orange: 'colors.orange',
    		amber: 'colors.amber',
    		yellow: 'colors.yellow',
    		lime: 'colors.lime',
    		green: 'colors.green',
    		emerald: 'colors.emerald',
    		teal: 'colors.teal',
    		cyan: 'colors.cyan',
    		sky: 'colors.sky',
    		blue: 'colors.blue',
    		indigo: 'colors.indigo',
    		violet: 'colors.violet',
    		purple: 'colors.purple',
    		fuchsia: 'colors.fuchsia',
    		pink: 'colors.pink',
    		rose: 'colors.rose'
    	},
    	extend: {
    		colors: {
                ...colors,
    			monad: {
    				offwhite: '#FBFAF9',
    				black: '#0E100F',
    				purple: '#836EF9',
    				berry: '#A0055D'
    			},
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		borderRadius: {
    			none: '0',
    			sm: '0.125rem',
    			DEFAULT: '0.25rem',
    			md: '0.375rem',
    			lg: '0.5rem',
    			xl: '0.75rem',
    			'2xl': '1rem',
    			'3xl': '1.5rem',
    			full: '9999px'
    		},
    		animation: {
    			'spin-slow': 'spin 5s linear infinite',
    			'scroll': 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
    			marquee: 'marquee var(--duration) infinite linear',
    			'marquee-vertical': 'marquee-vertical var(--duration) linear infinite'
    		},
    		keyframes: {
    			scroll: {
    				to: {
    					transform: 'translate(calc(-50% - 0.5rem))'
    				}
    			},
    			marquee: {
    				from: {
    					transform: 'translateX(0)'
    				},
    				to: {
    					transform: 'translateX(calc(-100% - var(--gap)))'
    				}
    			},
    			'marquee-vertical': {
    				from: {
    					transform: 'translateY(0)'
    				},
    				to: {
    					transform: 'translateY(calc(-100% - var(--gap)))'
    				}
    			}
    		},
    		fontFamily: {
    			grotesk: ['Space Grotesk', 'sans-serif'],
    			ubuntu: [
    				'var(--font-ubuntu)'
    			],
    			josefin: [
    				'var(--font-ubuntu)'
    			]
    		}
    	},
    	boxShadow: {
    		'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
    	},
    	borderRadius: {
    		lg: 'var(--radius)',
    		md: 'calc(var(--radius) - 2px)',
    		sm: 'calc(var(--radius) - 4px)'
    	}
    },
	plugins: [import("tailwindcss-animate"), addVariablesForColors, daisyui]
};

function addVariablesForColors({ addBase, theme }: any) {
	let allColors = flattenColorPalette(theme("colors"));
	let newVars = Object.fromEntries(
		Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
	);

	addBase({
		":root": newVars,
	});
}