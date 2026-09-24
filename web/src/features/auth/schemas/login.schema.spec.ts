import { describe, expect, it } from 'vitest'
import { loginSchema } from './login.schema'

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'ana@interseguro.pe', password: 'password123' })
    expect(result.success).toBe(true)
  })

  it('rejects a malformed email', () => {
    const result = loginSchema.safeParse({ email: 'no-es-un-email', password: 'password123' })
    expect(result.success).toBe(false)
  })

  it('rejects a password shorter than 8 characters', () => {
    const result = loginSchema.safeParse({ email: 'ana@interseguro.pe', password: '1234567' })
    expect(result.success).toBe(false)
  })

  it('rejects a password longer than 72 characters (BCrypt limit)', () => {
    const result = loginSchema.safeParse({ email: 'ana@interseguro.pe', password: 'a'.repeat(73) })
    expect(result.success).toBe(false)
  })

  it('rejects an email longer than 254 characters', () => {
    const longLocalPart = 'a'.repeat(250)
    const result = loginSchema.safeParse({ email: `${longLocalPart}@a.pe`, password: 'password123' })
    expect(result.success).toBe(false)
  })
})
