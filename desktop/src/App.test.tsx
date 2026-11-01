import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('MIT Readiness Atlas', () => {
  beforeEach(() => localStorage.clear())

  it('opens on the archetype atlas', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Archetypes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Olympiad/i })).toBeInTheDocument()
    expect(screen.getByText('Synthetic composite')).toBeInTheDocument()
  })

  it('shows model students as fictional and labels their tier shape', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Model students' }))

    expect(
      screen.getByRole('heading', { name: 'Model students' }),
    ).toBeInTheDocument()
    expect(screen.getByText('All eight are fictional.')).toBeInTheDocument()
    expect(screen.getByLabelText('Signals by tier')).toBeInTheDocument()
  })

  it('loads a fictional profile and shows comparative matches', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /My comparison/i }))
    await user.click(
      screen.getByRole('button', { name: 'Load a fictional example' }),
    )

    expect(
      screen.getByRole('heading', { name: 'Closest patterns' }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/documented/i).length).toBeGreaterThan(0)
  })

  it('keeps the interpretation boundary visible on every view', async () => {
    const user = userEvent.setup()
    render(<App />)

    const boundary = /does not\s+predict admission/i
    expect(screen.getByText(boundary)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /My comparison/i }))
    expect(screen.getByText(boundary)).toBeInTheDocument()
  })
})
