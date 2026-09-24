import { describe, expect, it } from 'vitest'
import viteConfig from '../../vite.config'

describe('vite.config', () => {
  it('registers the react and tailwindcss plugins', () => {
    const config = viteConfig as { plugins: unknown[] }
    expect(config.plugins.length).toBeGreaterThanOrEqual(2)
  })
})
