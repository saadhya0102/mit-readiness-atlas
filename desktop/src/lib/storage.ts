import type { StudentProfile } from '../domain/types'

const storageKey = 'mit-readiness-atlas.profile.v1'

const emptyProfile = (): StudentProfile => ({
  version: 1,
  activities: [],
  updatedAt: new Date().toISOString(),
})

export function loadProfile(): StudentProfile {
  try {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return emptyProfile()
    const value = JSON.parse(saved) as Partial<StudentProfile>
    if (value.version !== 1 || !Array.isArray(value.activities)) return emptyProfile()
    return {
      version: 1,
      activities: value.activities,
      updatedAt: value.updatedAt ?? new Date().toISOString(),
    }
  } catch {
    return emptyProfile()
  }
}

export function saveProfile(profile: StudentProfile) {
  localStorage.setItem(
    storageKey,
    JSON.stringify({ ...profile, updatedAt: new Date().toISOString() }),
  )
}

export function clearProfile() {
  localStorage.removeItem(storageKey)
}
