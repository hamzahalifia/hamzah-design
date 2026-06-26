import { useState, useEffect } from 'react'

export default function ComingSoon() {
  const [time, setTime] = useState(new Date())
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Subtle mouse parallax for background orbs
  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')
  const formattedTime = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`
  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-subtle flex flex-col">

      {/* ── Ambient Background Orbs ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Primary green orb */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #15803D 0%, transparent 70%)',
            top: '-100px',
            left: '-100px',
            transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
            transition: 'transform 0.8s ease-out',
          }}
        />
        {/* Secondary blue orb */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl"
          style={{
            background: 'radial-gradient(circle, #0F172A 0%, transparent 70%)',
            bottom: '0',
            right: '-100px',
            transform: `translate(${-mousePos.x * 0.3}px, ${-mousePos.y * 0.3}px)`,
            transition: 'transform 0.8s ease-out',
          }}
        />
        {/* Warm center glow */}
        <div
          className="absolute w-[800px] h-[300px] opacity-[0.04] blur-3xl"
          style={{
            background: 'radial-gradient(ellipse, #FDF7ED 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)`,
            transition: 'transform 0.8s ease-out',
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-text-primary) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Header / Nav ─────────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-8 pt-8 pb-0 animate-fade-in">
        {/* Name — Figma: "Alifia Hamzah" with Display md/Regular */}
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full bg-brand animate-pulse-slow"
          />
          <span
            className="font-display font-medium text-text-primary text-sm tracking-tight"
            style={{ letterSpacing: '-0.005em' }}
          >
            Alifia Hamzah
          </span>
        </div>

        {/* Status badge — inspired by Figma badge component (EL-9096bc26) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-pill bg-brand-light border border-brand/20">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          <span className="text-xs font-medium text-brand-dark" style={{ letterSpacing: '-0.005em' }}>
            Designing in progress
          </span>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">

        {/* "Portfolio" accent label — Figma: EL-b1841217, Prof. Bens font, #15803D */}
        <div
          className="opacity-0 animate-fade-up"
          style={{ animationFillMode: 'forwards' }}
        >
          <p
            className="text-brand text-lg font-medium mb-4"
            style={{
              fontFamily: 'var(--font-accent)',
              letterSpacing: '0.02em',
            }}
          >
            Portfolio · 2026
          </p>
        </div>

        {/* Hero headline */}
        <div
          className="opacity-0 animate-fade-up-d1 max-w-4xl"
          style={{ animationFillMode: 'forwards' }}
        >
          <h1 className="text-hero leading-none mb-2">
            <span className="text-text-primary">Crafting</span>{' '}
            <span className="text-shimmer">experiences</span>
          </h1>
          <h1 className="text-hero leading-none">
            <span className="text-text-secondary font-medium">that matter.</span>
          </h1>
        </div>

        {/* Subtext — Figma: EL-fc09a9f7, Text md/Regular */}
        <div
          className="opacity-0 animate-fade-up-d2 mt-8 max-w-lg"
          style={{ animationFillMode: 'forwards' }}
        >
          <p
            className="text-base text-text-tertiary leading-7"
            style={{ letterSpacing: '-0.01em' }}
          >
            I partner with companies to build and scale their data-driven
            enterprise tools with a story-data approach.
          </p>
        </div>

        {/* ── Status Card ───────────────────────────────────────────────── */}
        <div
          className="opacity-0 animate-fade-up-d3 mt-14 w-full max-w-md"
          style={{ animationFillMode: 'forwards' }}
        >
          <div className="glass rounded-2xl p-6 shadow-card">
            {/* Card header */}
            <div className="flex items-center justify-between mb-5">
              <span
                className="text-xs font-semibold text-text-muted uppercase"
                style={{ letterSpacing: '0.08em' }}
              >
                Website Status
              </span>
              <span className="text-xs font-mono text-text-tertiary">{formattedTime}</span>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-default" style={{ letterSpacing: '-0.005em' }}>
                  Design progress
                </span>
                <span className="text-sm font-semibold text-brand">35%</span>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full relative overflow-hidden"
                  style={{ width: '35%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-2.5 pt-3 border-t border-border">
              {[
                { label: 'Design System',     done: true  },
                { label: 'UI Components',      done: false },
                { label: 'Homepage Design',    done: false },
                { label: 'Case Studies',       done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                    item.done
                      ? 'bg-brand-light'
                      : 'bg-bg-muted border border-border'
                  }`}>
                    {item.done && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${item.done ? 'text-text-default line-through opacity-60' : 'text-text-secondary'}`}
                    style={{ letterSpacing: '-0.005em' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Date */}
        <div
          className="opacity-0 animate-fade-up-d4 mt-8"
          style={{ animationFillMode: 'forwards' }}
        >
          <p className="text-xs text-text-muted" style={{ letterSpacing: '-0.005em' }}>
            {formattedDate}
          </p>
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 flex items-center justify-between px-8 pb-8 pt-0 animate-fade-in">
        <p className="text-xs text-text-muted" style={{ letterSpacing: '-0.005em' }}>
          © 2026 Alifia Hamzah
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-muted hover:text-text-default transition-colors duration-200"
            style={{ letterSpacing: '-0.005em' }}
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
          <a
            href="https://dribbble.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-muted hover:text-text-default transition-colors duration-200"
            style={{ letterSpacing: '-0.005em' }}
            aria-label="Dribbble"
          >
            Dribbble
          </a>
        </div>
      </footer>
    </div>
  )
}
