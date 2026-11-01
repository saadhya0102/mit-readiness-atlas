import type { ReactNode } from 'react'
import {
  BookOpenCheck,
  Library,
  Radar,
  ShieldCheck,
  Telescope,
  UserRoundSearch,
  Users,
} from 'lucide-react'

export type ViewId = 'atlas' | 'students' | 'profile' | 'method' | 'sources'

const navItems: Array<{
  id: ViewId
  label: string
  icon: typeof Telescope
}> = [
  { id: 'atlas', label: 'Archetypes', icon: Telescope },
  { id: 'students', label: 'Model students', icon: Users },
  { id: 'profile', label: 'My comparison', icon: UserRoundSearch },
  { id: 'method', label: 'How it works', icon: BookOpenCheck },
  { id: 'sources', label: 'Evidence library', icon: Library },
]

interface AppShellProps {
  activeView: ViewId
  onNavigate: (view: ViewId) => void
  children: ReactNode
}

export function AppShell({ activeView, onNavigate, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <Radar size={20} strokeWidth={1.8} />
          </div>
          <div className="brand-copy">
            <strong>MIT Readiness</strong>
            <span>Evidence atlas</span>
          </div>
        </div>

        <nav className="primary-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = activeView === item.id
            return (
              <button
                key={item.id}
                type="button"
                className="nav-item"
                data-active={active}
                aria-current={active ? 'page' : undefined}
                // Named here so the collapsed icon rail keeps an accessible label.
                aria-label={item.label}
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                <span className="nav-label">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-note">
          <ShieldCheck size={17} strokeWidth={1.8} aria-hidden="true" />
          <div>
            <strong>Local by default</strong>
            <p>Your activity profile stays on this device.</p>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <p className="boundary-line">
            Compares documented evidence with eight reference patterns. It does not
            predict admission.
          </p>
          <div className="topbar-meta">
            <span>Public sources</span>
            <span aria-hidden="true">·</span>
            <span>July 2026</span>
          </div>
        </header>
        <main id="main-content" className="main-content">
          {children}
        </main>
      </section>
    </div>
  )
}
