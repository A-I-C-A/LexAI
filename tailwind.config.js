// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        // Theme-aware semantic colors
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        'card-foreground': 'rgb(var(--card-foreground) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--muted-foreground) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        
        // Landing page accent colors (black in light, white in dark)
        'landing-accent': 'rgb(var(--landing-accent) / <alpha-value>)',
        'landing-accent-hover': 'rgb(var(--landing-accent-hover) / <alpha-value>)',
        'landing-accent-text': 'rgb(var(--landing-accent-text) / <alpha-value>)',
        'landing-accent-border': 'rgb(var(--landing-accent) / <alpha-value>)',
        
        // Dashboard accent colors (replacing emerald/green)
        'dashboard-accent': 'rgb(var(--dashboard-accent) / <alpha-value>)',
        'dashboard-accent-hover': 'rgb(var(--dashboard-accent-hover) / <alpha-value>)',
        'dashboard-accent-text': 'rgb(var(--dashboard-accent-text) / <alpha-value>)',
        'dashboard-accent-muted': 'rgb(var(--dashboard-accent-muted) / <alpha-value>)',
        'dashboard-accent-border': 'rgb(var(--dashboard-accent) / <alpha-value>)',
        
        // Chart colors
        'chart-primary': 'rgb(var(--chart-primary) / <alpha-value>)',
        'chart-secondary': 'rgb(var(--chart-secondary) / <alpha-value>)',
        'chart-success': 'rgb(var(--chart-success) / <alpha-value>)',
        'chart-warning': 'rgb(var(--chart-warning) / <alpha-value>)',
        'chart-danger': 'rgb(var(--chart-danger) / <alpha-value>)',
        
        // Neon Emerald Accent
        'neon-emerald': '#10b981',
        
        // Legacy compatibility
        page: 'rgb(var(--background) / <alpha-value>)',
        boxbg: 'rgb(var(--card) / <alpha-value>)',
        greybg: 'rgb(var(--muted) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
      },
      fontSize: {
        'hero': ['5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'hero-md': ['7rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'hero-lg': ['8rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      backdropBlur: {
        'xs': '2px',
        'xl': '24px',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-out',
        'slideIn': 'slideIn 0.4s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}