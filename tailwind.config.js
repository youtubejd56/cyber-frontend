/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    900: '#0a0e1a',
                    800: '#0f1629',
                    700: '#141e35',
                    600: '#1a2744',
                    500: '#1e2d50',
                },
                cyber: {
                    green: '#00ff41',
                    blue: '#0080ff',
                    purple: '#8b5cf6',
                    red: '#ff0040',
                    yellow: '#ffd700',
                    cyan: '#00d4ff',
                }
            },
            fontFamily: {
                mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
            },
            animation: {
                'pulse-green': 'pulse-green 2s infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'scanline': 'scanline 3s linear infinite',
                'flicker': 'flicker 0.15s infinite',
            },
            keyframes: {
                'pulse-green': {
                    '0%, 100%': { boxShadow: '0 0 5px #00ff41' },
                    '50%': { boxShadow: '0 0 20px #00ff41, 0 0 40px #00ff41' },
                },
                'glow': {
                    from: { textShadow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 40px #00ff41' },
                    to: { textShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff, 0 0 80px #00d4ff' },
                },
                'scanline': {
                    '0%': { top: '0%' },
                    '100%': { top: '100%' },
                }
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(rgba(0, 255, 65, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.03) 1px, transparent 1px)",
                'cyber-gradient': 'linear-gradient(135deg, #0a0e1a 0%, #0f1629 50%, #141e35 100%)',
            },
            backgroundSize: {
                'grid': '40px 40px',
            }
        },
    },
    plugins: [],
}
