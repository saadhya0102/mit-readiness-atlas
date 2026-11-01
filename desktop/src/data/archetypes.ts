import type { Archetype } from '../domain/types'
import {
  olympiadArchetype,
  researchArchetype,
  roboticsArchetype,
} from './archetypesStem'
import {
  artsArchetype,
  debateArchetype,
  humanitiesArchetype,
} from './archetypesExpression'
import { athleteArchetype, builderArchetype } from './archetypesBreadth'

export const archetypes: Archetype[] = [
  olympiadArchetype,
  researchArchetype,
  roboticsArchetype,
  debateArchetype,
  athleteArchetype,
  humanitiesArchetype,
  artsArchetype,
  builderArchetype,
]
