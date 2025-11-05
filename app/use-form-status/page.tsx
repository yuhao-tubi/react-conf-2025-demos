'use client'

import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { useState } from 'react'

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus()

  return (
    <div>
      <button type="submit" disabled={pending}>
        {pending ? (
          <>
            <span className="loading" style={{ marginRight: '0.5rem' }} />
            Submitting...
          </>
        ) : (
          'Submit Form'
        )}
      </button>

      {pending && (
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          <div>Status: Pending...</div>
          {data && <div>Form data: {JSON.stringify(Object.fromEntries(data))}</div>}
        </div>
      )}
    </div>
  )
}

function FormStatusInfo() {
  const status = useFormStatus()

  if (!status.pending) {
    return <div style={{ color: '#10b981', marginTop: '0.5rem' }}>✓ Form is ready</div>
  }

  return (
    <div className="result" style={{ marginTop: '1rem' }}>
      <h4>Form Status (from child component):</h4>
      <pre style={{ fontSize: '0.85rem' }}>{JSON.stringify(status, null, 2)}</pre>
    </div>
  )
}

export default function UseFormStatusDemo() {
  const [result, setResult] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    // Simulate server processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const name = formData.get('name')
    const email = formData.get('email')

    setResult(`Form submitted! Name: ${name}, Email: ${email}`)
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>useFormStatus Hook Demo</h1>

      <div className="demo-section">
        <h2>What is useFormStatus?</h2>
        <p>
          The <code>useFormStatus</code> hook provides information about the status of the parent form.
          It can only be called from components that are rendered inside a <code>&lt;form&gt;</code> tag.
        </p>

        <h3>Key Features:</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Access form status from any child component</li>
          <li>Know when form is submitting (pending state)</li>
          <li>Access form data being submitted</li>
          <li>Get information about the form action and method</li>
          <li>Great for building reusable form components</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Interactive Demo</h2>
        <p>
          Submit the form below and watch how child components can access the form status
          without prop drilling!
        </p>

        <form
          action={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '400px',
            marginTop: '1rem',
          }}
        >
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

          {/* These components can access form status */}
          <SubmitButton />
          <FormStatusInfo />
        </form>

        {result && (
          <div className="success" style={{ marginTop: '1rem' }}>
            {result}
          </div>
        )}
      </div>

      <div className="demo-section">
        <h2>Code Example</h2>
        <pre>
          <code>{`'use client'

import { useFormStatus } from 'react-dom'

// Child component that needs form status
function SubmitButton() {
  const { pending, data, method, action } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}

// Parent component with form
export function MyForm() {
  async function handleSubmit(formData) {
    await saveToDatabase(formData)
  }

  return (
    <form action={handleSubmit}>
      <input name="username" />
      <input name="email" type="email" />
      {/* SubmitButton can access form status */}
      <SubmitButton />
    </form>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>useFormStatus Return Value</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--code-bg)' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                  Property
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                  Type
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  <code>pending</code>
                </td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>boolean</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  Whether the form is currently submitting
                </td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  <code>data</code>
                </td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>FormData | null</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  The data being submitted
                </td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  <code>method</code>
                </td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>string | null</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  The form method (GET or POST)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem' }}>
                  <code>action</code>
                </td>
                <td style={{ padding: '0.75rem' }}>string | function | null</td>
                <td style={{ padding: '0.75rem' }}>The form action</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="demo-section">
        <h2>Benefits</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>No Prop Drilling:</strong> Child components can access form state directly</li>
          <li><strong>Reusable Components:</strong> Build generic form components easily</li>
          <li><strong>Better UX:</strong> Show loading states and disable buttons automatically</li>
          <li><strong>Simple API:</strong> Easy to use and understand</li>
        </ul>
      </div>
    </div>
  )
}
