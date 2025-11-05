'use client'

import { useActionState } from 'react'
import { submitFormAction } from './actions'

export function ServerActionForm() {
  const [state, formAction, isPending] = useActionState(submitFormAction, null)

  return (
    <div>
      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Name:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Message:
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Enter your message"
            rows={4}
            required
            style={{ width: '100%' }}
          />
        </div>

        <button type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit Form'}
        </button>
      </form>

      {state?.error && (
        <div className="error" style={{ marginTop: '1rem' }}>
          <strong>Error:</strong> {state.error}
        </div>
      )}

      {state?.success && (
        <div className="success" style={{ marginTop: '1rem' }}>
          <strong>Success!</strong> {state.message}
        </div>
      )}
    </div>
  )
}
