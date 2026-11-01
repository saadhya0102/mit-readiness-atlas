import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ExternalLink,
  FileCheck2,
  FileText,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { isTauri } from '@tauri-apps/api/core'
import { openUrl } from '@tauri-apps/plugin-opener'
import Markdown from 'react-markdown'
import type { EvidenceSource } from '../domain/types'
import { EvidencePill } from './SignalUI'

interface OpenReport {
  title: string
  publisher: string
  body: string
}

const kinds: Array<{ id: 'all' | EvidenceSource['kind']; label: string }> = [
  { id: 'all', label: 'All sources' },
  { id: 'official-guidance', label: 'Admissions guidance' },
  { id: 'official-program', label: 'Programs & competitions' },
  { id: 'research-release', label: 'Research release' },
  { id: 'method', label: 'Methods' },
]

export function SourcesView({ sources }: { sources: EvidenceSource[] }) {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<(typeof kinds)[number]['id']>('all')
  const [linkError, setLinkError] = useState('')
  const [report, setReport] = useState<OpenReport>()
  const [isLoadingReport, setIsLoadingReport] = useState(false)

  // The workspace keeps its own scroll position, so a newly opened report would
  // otherwise start partway down with the back control out of view.
  useEffect(() => {
    document.getElementById('main-content')?.scrollTo({ top: 0 })
  }, [report])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return sources.filter((source) => {
      const matchesKind = kind === 'all' || source.kind === kind
      const matchesQuery =
        !normalized ||
        [source.title, source.publisher, source.verifies, source.caveat]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalized)
      return matchesKind && matchesQuery
    })
  }, [kind, query, sources])

  const openExternalSource = async (url: string) => {
    setLinkError('')
    try {
      if (isTauri()) {
        await openUrl(url)
        return
      }
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      setLinkError('The system browser could not open that source. Copy the link and try again.')
    }
  }

  // Bundled reports are markdown, which a browser would download rather than
  // display, so they are read inside the app instead.
  const openBundledReport = async (source: EvidenceSource) => {
    setLinkError('')
    setIsLoadingReport(true)
    try {
      const response = await fetch(source.url)
      if (!response.ok) throw new Error(String(response.status))
      setReport({
        title: source.title,
        publisher: source.publisher,
        body: await response.text(),
      })
    } catch {
      setLinkError('That bundled report could not be loaded.')
    } finally {
      setIsLoadingReport(false)
    }
  }

  if (report) {
    return (
      <div className="sources-view">
        <div className="report-bar">
          <button
            type="button"
            className="secondary-button"
            onClick={() => setReport(undefined)}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to sources
          </button>
          <span>{report.publisher}</span>
        </div>
        <article className="report-body">
          <Markdown>{report.body}</Markdown>
        </article>
      </div>
    )
  }

  return (
    <div className="sources-view">
      <header className="page-heading">
        <div>
          <h1>Evidence library</h1>
          <p>
            Every link here backs a specific claim about how a program works or where a
            number in this app came from.
          </p>
        </div>
        <div className="source-count">
          <FileCheck2 size={19} aria-hidden="true" />
          <span>
            <strong>{sources.length}</strong>
            references
          </span>
        </div>
      </header>

      <div className="source-tools">
        <label className="search-field">
          <span className="sr-only">Search evidence sources</span>
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={query}
            placeholder="Search publisher, program, or claim"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="source-filters" aria-label="Filter sources">
          {kinds.map((item) => (
            <button
              key={item.id}
              type="button"
              data-active={kind === item.id}
              aria-pressed={kind === item.id}
              onClick={() => setKind(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {linkError && (
        <p className="source-error" role="alert">
          {linkError}
        </p>
      )}

      <div className="sources-layout">
        <section className="source-results" aria-live="polite">
          <div className="result-summary">
            <span>
              {filtered.length} {filtered.length === 1 ? 'source' : 'sources'}
            </span>
            <span>Accessed July 2026</span>
          </div>

          {filtered.length ? (
            <div className="source-list">
              {filtered.map((source) => (
                <article key={source.id} className="source-row">
                  <div className="source-kind" aria-hidden="true">
                    {source.kind === 'official-program'
                      ? 'OP'
                      : source.kind === 'official-guidance'
                        ? 'AG'
                        : source.kind === 'research-release'
                          ? 'RR'
                          : 'MT'}
                  </div>
                  <div className="source-body">
                    <div>
                      <p>{source.publisher}</p>
                      <h2>{source.title}</h2>
                    </div>
                    <dl>
                      <div>
                        <dt>Used to verify</dt>
                        <dd>{source.verifies}</dd>
                      </div>
                      {source.caveat && (
                        <div>
                          <dt>Caveat</dt>
                          <dd>{source.caveat}</dd>
                        </div>
                      )}
                    </dl>
                    <div className="source-footer">
                      <EvidencePill
                        tone={
                          source.kind === 'official-program' ||
                          source.kind === 'official-guidance'
                            ? 'verified'
                            : 'neutral'
                        }
                      >
                        {source.kind.replaceAll('-', ' ')}
                      </EvidencePill>
                      {source.url === '#method' ? (
                        <span className="source-local">See How it works</span>
                      ) : source.url.startsWith('/') ? (
                        <button
                          type="button"
                          className="source-link"
                          disabled={isLoadingReport}
                          onClick={() => void openBundledReport(source)}
                        >
                          Read report
                          <FileText size={14} aria-hidden="true" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="source-link"
                          onClick={() => void openExternalSource(source.url)}
                        >
                          Open source
                          <ExternalLink size={14} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="source-empty">
              <Search size={24} aria-hidden="true" />
              <h2>No sources match those filters</h2>
              <p>Try a broader term or choose “All sources.”</p>
            </div>
          )}
        </section>

        <aside className="research-release-note">
          <ShieldCheck size={22} aria-hidden="true" />
          <h2>The research release</h2>
          <dl>
            <div>
              <dt>MIT profiles</dt>
              <dd>1,456</dd>
            </div>
            <div>
              <dt>Activity records</dt>
              <dd>2,790</dd>
            </div>
            <div>
              <dt>Distinct sources</dt>
              <dd>2,591</dd>
            </div>
          </dl>
          <p>
            Everything here comes from pages anyone can read. That also limits it to
            students whose activities someone published.
          </p>
        </aside>
      </div>
    </div>
  )
}
