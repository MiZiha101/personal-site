/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        soft: 'var(--surface-soft)',
        ink: 'var(--ink)',
        inkSoft: 'var(--ink-soft)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        lineStrong: 'var(--line-strong)',
        accent: 'var(--accent)',
        accentSoft: 'var(--accent-soft)',
        wash: 'var(--accent-wash)',
        sand: 'var(--sand)',
      },
      borderRadius: {
        card: '20px',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '"Segoe UI"',
          'sans-serif',
        ],
        serif: [
          '"Noto Serif SC"',
          '"Source Han Serif SC"',
          '"Songti SC"',
          'SimSun',
          'Georgia',
          'serif',
        ],
        mono: ['"JetBrains Mono"', 'Consolas', 'Menlo', 'monospace'],
      },
      maxWidth: {
        content: '1120px',
        prose: '68ch',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(27, 26, 23, 0.04)',
        lift: '0 18px 40px -24px rgba(27, 26, 23, 0.28)',
        panel: '-24px 0 60px -30px rgba(27, 26, 23, 0.35)',
      },
    },
  },
  plugins: [],
};
