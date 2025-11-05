'use client'

import { Component, ReactNode, useState } from 'react'
import Link from 'next/link'

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode; fallback: (error: Error, reset: () => void) => ReactNode },
  { error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, () => this.setState({ error: null }))
    }

    return this.props.children
  }
}

// Component that throws an error
function BuggyComponent({ shouldError }: { shouldError: boolean }) {
  if (shouldError) {
    throw new Error('💥 Something went wrong in BuggyComponent!')
  }

  return (
    <div className="success">
      ✅ Component rendered successfully! Click the button above to trigger an error.
    </div>
  )
}

// Async component that might fail
function AsyncBuggyComponent({ shouldError }: { shouldError: boolean }) {
  const [data, setData] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setError(null)
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (shouldError) {
            reject(new Error('Failed to fetch data from server'))
          } else {
            resolve('Data loaded successfully!')
          }
        }, 1000)
      })
      setData('Data loaded successfully!')
    } catch (err) {
      setError(err as Error)
    }
  }

  return (
    <div>
      <button onClick={fetchData} style={{ marginBottom: '1rem' }}>
        Fetch Data {shouldError ? '(Will Fail)' : '(Will Succeed)'}
      </button>

      {error && (
        <div className="error">
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {data && <div className="success">{data}</div>}
    </div>
  )
}

export default function ErrorHandlingDemo() {
  const [triggerError, setTriggerError] = useState(false)
  const [triggerAsyncError, setTriggerAsyncError] = useState(false)

  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>Error Handling Demo</h1>

      <div className="demo-section">
        <h2>What's New in Error Handling?</h2>
        <p>
          React 19 improves error handling with better error boundaries, enhanced error messages,
          and improved integration with Server Actions and async operations.
        </p>

        <h3>Key Features:</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Error boundaries catch rendering errors</li>
          <li>Better error messages and stack traces</li>
          <li>Server Action error handling</li>
          <li>Async error handling with Suspense</li>
          <li>Recovery mechanisms</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Demo 1: Error Boundary</h2>
        <p>Click the button to trigger an error. The Error Boundary will catch it!</p>

        <button
          onClick={() => setTriggerError(!triggerError)}
          style={{ marginBottom: '1rem' }}
        >
          {triggerError ? 'Fix Component' : 'Break Component'}
        </button>

        <ErrorBoundary
          fallback={(error, reset) => (
            <div className="error">
              <h3>⚠️ Error Caught by Boundary</h3>
              <p><strong>Error:</strong> {error.message}</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                The error was caught by the Error Boundary and the app didn't crash!
              </p>
              <button onClick={() => { reset(); setTriggerError(false); }} style={{ marginTop: '1rem' }}>
                Reset and Try Again
              </button>
            </div>
          )}
        >
          <BuggyComponent shouldError={triggerError} />
        </ErrorBoundary>
      </div>

      <div className="demo-section">
        <h2>Demo 2: Async Error Handling</h2>
        <p>Toggle the error state and try fetching data:</p>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="checkbox"
            checked={triggerAsyncError}
            onChange={(e) => setTriggerAsyncError(e.target.checked)}
          />
          Simulate API error
        </label>

        <AsyncBuggyComponent shouldError={triggerAsyncError} />
      </div>

      <div className="demo-section">
        <h2>Code Example - Error Boundary</h2>
        <pre>
          <code>{`import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    console.error('Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <p>{this.state.error.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Code Example - Server Action Error Handling</h2>
        <pre>
          <code>{`'use server'

export async function submitForm(formData: FormData) {
  try {
    const data = formData.get('data')
    
    // Validation
    if (!data) {
      throw new Error('Data is required')
    }
    
    // Process
    await saveToDatabase(data)
    
    return { success: true }
  } catch (error) {
    // Return error to client
    return { 
      success: false, 
      error: error.message 
    }
  }
}

// Client component
'use client'

import { useActionState } from 'react'

function Form() {
  const [state, formAction] = useActionState(submitForm, null)

  return (
    <form action={formAction}>
      <input name="data" />
      <button type="submit">Submit</button>
      
      {state?.error && (
        <div className="error">{state.error}</div>
      )}
    </form>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Code Example - Async Error with Suspense</h2>
        <pre>
          <code>{`import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`)
  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}

function UserProfile({ userId }) {
  const user = use(fetchUser(userId))
  return <div>{user.name}</div>
}

export default function Page() {
  return (
    <ErrorBoundary 
      fallback={<div>Error loading user</div>}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <UserProfile userId={1} />
      </Suspense>
    </ErrorBoundary>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Error Boundary Placement Strategies</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="card">
            <h4>1. Root Level</h4>
            <p>Catch all errors in your app</p>
            <pre style={{ fontSize: '0.85rem' }}>
              <code>{`<ErrorBoundary>
  <App />
</ErrorBoundary>`}</code>
            </pre>
          </div>

          <div className="card">
            <h4>2. Page Level</h4>
            <p>Isolate errors to specific pages</p>
            <pre style={{ fontSize: '0.85rem' }}>
              <code>{`<Routes>
  <Route path="/users" element={
    <ErrorBoundary>
      <UsersPage />
    </ErrorBoundary>
  } />
</Routes>`}</code>
            </pre>
          </div>

          <div className="card">
            <h4>3. Component Level</h4>
            <p>Protect critical components</p>
            <pre style={{ fontSize: '0.85rem' }}>
              <code>{`<div>
  <Header />
  <ErrorBoundary>
    <CriticalFeature />
  </ErrorBoundary>
  <Footer />
</div>`}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>What Error Boundaries Catch</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <h4 style={{ color: 'var(--success)' }}>✅ Catches:</h4>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '2' }}>
              <li>Errors during rendering</li>
              <li>Errors in lifecycle methods</li>
              <li>Errors in constructors</li>
              <li>Errors in child components</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--error)' }}>❌ Doesn't Catch:</h4>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '2' }}>
              <li>Event handlers (use try/catch)</li>
              <li>Async code (use try/catch)</li>
              <li>Errors in Error Boundary itself</li>
              <li>Server-side rendering errors</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Best Practices</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Multiple Boundaries:</strong> Use multiple error boundaries for better isolation</li>
          <li><strong>Granular Fallbacks:</strong> Provide context-specific error messages</li>
          <li><strong>Error Reporting:</strong> Log errors to monitoring services</li>
          <li><strong>Recovery Options:</strong> Offer ways to recover (retry, go back)</li>
          <li><strong>User-Friendly Messages:</strong> Don't show technical details to users</li>
          <li><strong>Try/Catch for Events:</strong> Use try/catch in event handlers and async code</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Integration with Error Reporting</h2>
        <pre>
          <code>{`import * as Sentry from '@sentry/react'

class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    // Report to Sentry
    Sentry.captureException(error, {
      contexts: { react: errorInfo }
    })
    
    // Or other services
    logErrorToMyService(error, errorInfo)
  }
  
  // ... rest of the component
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>React 19 Improvements</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Better Error Messages:</strong> More detailed error information</li>
          <li><strong>Improved Stack Traces:</strong> Easier to debug</li>
          <li><strong>Server Action Errors:</strong> Better handling of server-side errors</li>
          <li><strong>Suspense Integration:</strong> Errors work well with Suspense boundaries</li>
          <li><strong>Development Mode:</strong> Enhanced error overlays</li>
        </ul>
      </div>
    </div>
  )
}
