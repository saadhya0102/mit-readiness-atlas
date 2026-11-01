import { useEffect, useState } from 'react'
import './App.css'
import { AppShell, type ViewId } from './components/AppShell'
import { AtlasView } from './components/AtlasView'
import { MethodView } from './components/MethodView'
import { ModelStudentsView } from './components/ModelStudentsView'
import { ProfileView } from './components/ProfileView'
import { SourcesView } from './components/SourcesView'
import { archetypes } from './data/archetypes'
import { sources } from './data/sources'
import type { ArchetypeId, StudentProfile } from './domain/types'
import { loadProfile, saveProfile } from './lib/storage'

function App() {
  const [activeView, setActiveView] = useState<ViewId>('atlas')
  const [selectedModel, setSelectedModel] = useState<ArchetypeId>('olympiad')
  const [targetModel, setTargetModel] = useState<ArchetypeId>()
  const [profile, setProfile] = useState<StudentProfile>(() => loadProfile())

  useEffect(() => saveProfile(profile), [profile])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey) return
      const shortcuts: Record<string, ViewId> = {
        '1': 'atlas',
        '2': 'students',
        '3': 'profile',
        '4': 'method',
        '5': 'sources',
      }
      const destination = shortcuts[event.key]
      if (destination) {
        event.preventDefault()
        setActiveView(destination)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const compareWith = (id: ArchetypeId) => {
    setTargetModel(id)
    setActiveView('profile')
  }

  const openModel = (id: ArchetypeId) => {
    setSelectedModel(id)
    setActiveView('atlas')
  }

  return (
    <AppShell activeView={activeView} onNavigate={setActiveView}>
      {activeView === 'atlas' && (
        <AtlasView
          archetypes={archetypes}
          selectedId={selectedModel}
          onSelect={setSelectedModel}
          onCompare={compareWith}
          onOpenSources={() => setActiveView('sources')}
        />
      )}
      {activeView === 'students' && (
        <ModelStudentsView archetypes={archetypes} onOpenArchetype={openModel} />
      )}
      {activeView === 'profile' && (
        <ProfileView
          profile={profile}
          archetypes={archetypes}
          targetId={targetModel}
          onChange={setProfile}
          onOpenModel={openModel}
        />
      )}
      {activeView === 'method' && (
        <MethodView onStart={() => setActiveView('profile')} />
      )}
      {activeView === 'sources' && <SourcesView sources={sources} />}
    </AppShell>
  )
}

export default App
