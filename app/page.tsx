import LiveStatusBadge from '@/components/LiveStatusBadge'
import ParticleField from '@/components/ParticleField'

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/vikas0207aradhya', icon: 'github' },
  { label: 'Instagram', href: 'https://instagram.com/vikasketchup', icon: 'instagram' },
  { label: 'Twitter', href: 'https://twitter.com/vikas_1807', icon: 'twitter' },
]

function Icon({ name }: { name: string }) {
  const common = 'h-5 w-5'
  switch (name) {
    case 'github':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common}>
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
      )
    case 'twitter':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common}>
          <path d="M18.9 2H22l-7.6 8.68L23.3 22h-6.96l-5.45-7.13L4.62 22H1.5l8.13-9.29L.9 2h7.13l4.93 6.52L18.9 2Zm-1.22 18h1.72L6.4 3.9H4.56L17.68 20Z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    default:
      return null
  }
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleField />

      {/* ambient radial wash behind everything */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[28%] -z-20 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(201,138,107,0.18) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-8 sm:px-10">
        {/* top row: corner brackets + status badges */}
        <div className="animate-rise flex items-start justify-between">
          <div className="relative pl-4 pt-3">
            <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-hairline" />
            <LiveStatusBadge />
          </div>

          <div className="relative pr-4 pt-3">
            <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-hairline" />
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-breathe rounded-full bg-ember" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
              </span>
              <span className="tracking-label text-[11px] font-medium text-muted">ONLINE</span>
            </div>
          </div>
        </div>

        {/* hero center */}
        <div className="flex flex-1 flex-col items-center justify-center py-20 text-center"> 
          <h1 className="animate-rise font-display text-6xl font-medium tracking-tight text-bone sm:text-7xl">
            vikasketchup
            <span className="ml-1 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-ember align-middle" />
          </h1>

          <p className="animate-rise mt-8 max-w-md text-balance text-lg leading-relaxed text-bone/90 sm:text-xl">
            I fix what&apos;s broken on the front line, then build the systems that catch it
            before it breaks again.
          </p>

          <div className="animate-rise mt-10 flex items-center gap-5">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-muted transition-colors hover:text-ember"
              >
                <Icon name={link.icon} />
              </a>
            ))}
          </div>
        </div>

        <footer className="animate-rise pb-4 text-center">
          <p className="tracking-label text-[10px] text-muted/60">
            VIKASKETCHUP.COM — THIS UPDATE IS REAL TIME AUTOOMATLLY AS PER WHAT I DO 
          </p>
        </footer>
      </div>
    </main>
  )
}
