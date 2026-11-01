import { describe, expect, it } from 'vitest'
import { archetypes } from './archetypes'
import { sourceById, sources } from './sources'

describe('evidence catalog', () => {
  it('resolves every source reference on an archetype', () => {
    const unresolved = archetypes.flatMap((archetype) =>
      archetype.sourceIds
        .filter((id) => !sourceById.has(id))
        .map((id) => `${archetype.id} -> ${id}`),
    )

    expect(unresolved).toEqual([])
  })

  it('resolves every source reference on a signal example', () => {
    const unresolved = archetypes.flatMap((archetype) =>
      archetype.tierGroups.flatMap((group) =>
        group.examples.flatMap((example) =>
          example.sourceIds
            .filter((id) => !sourceById.has(id))
            .map((id) => `${example.id} -> ${id}`),
        ),
      ),
    )

    expect(unresolved).toEqual([])
  })

  it('cites at least one source for every signal example', () => {
    const uncited = archetypes.flatMap((archetype) =>
      archetype.tierGroups.flatMap((group) =>
        group.examples.filter((example) => example.sourceIds.length === 0).map((example) => example.id),
      ),
    )

    expect(uncited).toEqual([])
  })

  it('keeps source and signal identifiers unique', () => {
    const sourceIds = sources.map((source) => source.id)
    expect(new Set(sourceIds).size).toBe(sourceIds.length)

    const signalIds = archetypes.flatMap((archetype) =>
      archetype.tierGroups.flatMap((group) => group.examples.map((example) => example.id)),
    )
    expect(new Set(signalIds).size).toBe(signalIds.length)
  })

  it('places every signal example in its containing tier group', () => {
    const misfiled = archetypes.flatMap((archetype) =>
      archetype.tierGroups.flatMap((group) =>
        group.examples
          .filter((example) => example.tier !== group.tier)
          .map((example) => `${example.id} is tier ${example.tier} inside group ${group.tier}`),
      ),
    )

    expect(misfiled).toEqual([])
  })
})
