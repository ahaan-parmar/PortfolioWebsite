import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Cybersecurity theme colors
				cyber: {
					bg: 'hsl(var(--cyber-bg))',
					surface: 'hsl(var(--cyber-surface))',
					'surface-high': 'hsl(var(--cyber-surface-high))',
					text: 'hsl(var(--cyber-text))',
					'text-muted': 'hsl(var(--cyber-text-muted))',
					cyan: 'hsl(var(--cyber-cyan))',
					green: 'hsl(var(--cyber-green))',
					blue: 'hsl(var(--cyber-blue))'
				}
			},
			fontFamily: {
				mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
			},
			backgroundImage: {
				'cyber-gradient': 'var(--gradient-cyber)',
				'glow-gradient': 'var(--gradient-glow)',
				'surface-gradient': 'var(--gradient-surface)'
			},
			boxShadow: {
				'cyber': 'var(--shadow-cyber)',
				'glow-cyan': 'var(--glow-cyan)',
				'glow-green': 'var(--glow-green)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: 'var(--glow-cyan)' },
					'50%': { boxShadow: '0 0 30px hsl(180 100% 50% / 0.5)' }
				},
				'matrix-rain': {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(100vh)' }
				},
				'slide-in-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'matrix-rain': 'matrix-rain 1s linear infinite',
				'slide-in-up': 'slide-in-up 0.6s ease-out',
				'fade-in': 'fade-in 0.5s ease-in'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
