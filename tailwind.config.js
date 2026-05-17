/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Static navy/gold palette
        navy: {
          900: "#001529",
          800: "#001F3F",
          700: "#0A2B52",
          600: "#112240",
          500: "#1B3461",
        },
        slate: {
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
        },
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Syne', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'slate-sm': '0 0 12px rgba(197, 160, 89, 0.2)',
        'slate':    '0 0 24px rgba(197, 160, 89, 0.3)',
        'slate-lg': '0 0 40px rgba(197, 160, 89, 0.4)',
        'card':    '0 8px 32px rgba(0, 0, 0, 0.35)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'slate-gradient': 'linear-gradient(135deg, #94a3b8 0%, #64748b 50%, #475569 100%)',
        'navy-gradient': 'linear-gradient(180deg, #001F3F 0%, #001529 100%)',
        'hero-radial':   'radial-gradient(ellipse at 60% 50%, rgba(197,160,89,0.06) 0%, transparent 60%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'pulse-slate': 'pulseSlate 2s infinite',
        'shimmer':    'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        pulseSlate: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(197,160,89,0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(197,160,89,0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
