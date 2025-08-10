/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // shadcn/uiのカラーシステム
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        // スケルトンに使うグラデーション
        'skeleton-gradient': 'linear-gradient(-90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
        'skeleton-gradient-dark': 'linear-gradient(-90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%)',
      },
      keyframes: {
        'skeleton-loading': {
          '0%': { 'background-position': '200% 0' },
          '100%': { 'background-position': '-200% 0' },
        },
        'snackbar-message': {
          '0%': { transform: 'translateY(-120%)' },
          '5%': { transform: 'translateY(0)' },
          '95%': { transform: 'translateY(0)', position: 'initial' },
          '100%': {
            transform: 'translateY(-120%)',
            position: 'absolute',
            bottom: 0,
            display: 'none',
          },
        },
      },
      animation: {
        'skeleton-loading': 'skeleton-loading 2s infinite',
        'snackbar-message': 'snackbar-message 7s forwards',
      },
    },
  },
};
