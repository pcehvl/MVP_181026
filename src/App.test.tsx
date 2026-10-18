import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the product-neutral application shell', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: /application shell/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/harness ready/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /stack verified/i }),
    ).toBeInTheDocument()
  })
})
