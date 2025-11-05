'use client'

import { createContext, use, useState } from 'react'
import Link from 'next/link'

// Create a theme context
const ThemeContext = createContext<{
  theme: string
  setTheme: (theme: string) => void
}>({
  theme: 'light',
  setTheme: () => {},
})

// Child component using the new use() hook with context
function ThemedCard() {
  // New way: use the use() hook with context
  const { theme, setTheme } = use(ThemeContext)

  return (
    <div
      className="card"
      style={{
        background: theme === 'dark' ? '#1a1a1a' : '#f9fafb',
        color: theme === 'dark' ? '#ededed' : '#000',
        padding: '2rem',
        borderRadius: '8px',
        border: `2px solid ${theme === 'dark' ? '#333' : '#e5e7eb'}`,
      }}
    >
      <h3>Themed Card Component</h3>
      <p>Current theme: <strong>{theme}</strong></p>
      <p>This component uses the <code>use()</code> hook to read context!</p>
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        style={{
          marginTop: '1rem',
        }}
      >
        Toggle Theme
      </button>
    </div>
  )
}

// Another nested component
function DeepNestedComponent() {
  const { theme } = use(ThemeContext)

  return (
    <div style={{ padding: '1rem', marginTop: '1rem', border: '2px dashed var(--border)', borderRadius: '8px' }}>
      <p>This is a deeply nested component!</p>
      <p>It can still access the theme: <strong>{theme}</strong></p>
    </div>
  )
}

export default function ContextProviderDemo() {
  const [theme, setTheme] = useState('light')

  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>Context as Provider Demo</h1>

      <div className="demo-section">
        <h2>What Changed with Context?</h2>
        <p>
          React 19 simplifies context usage in two ways:
        </p>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>
            You can render <code>&lt;Context&gt;</code> directly as a provider instead of{' '}
            <code>&lt;Context.Provider&gt;</code>
          </li>
          <li>
            You can use the new <code>use()</code> hook to read context values (more flexible than{' '}
            <code>useContext</code>)
          </li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Interactive Demo</h2>
        <p>The components below use context to share theme state. Try toggling the theme!</p>

        {/* New way: Context directly as provider */}
        <ThemeContext value={{ theme, setTheme }}>
          <ThemedCard />
          <DeepNestedComponent />
        </ThemeContext>
      </div>

      <div className="demo-section">
        <h2>Code Comparison</h2>

        <h3>React 18 (Old Way):</h3>
        <pre>
          <code>{`import { createContext, useContext } from 'react'

const ThemeContext = createContext('light')

function App() {
  return (
    // Had to use .Provider
    <ThemeContext.Provider value="dark">
      <ThemedComponent />
    </ThemeContext.Provider>
  )
}

function ThemedComponent() {
  // Had to use useContext
  const theme = useContext(ThemeContext)
  return <div>Theme: {theme}</div>
}`}</code>
        </pre>

        <h3>React 19 (New Way):</h3>
        <pre>
          <code>{`import { createContext, use } from 'react'

const ThemeContext = createContext('light')

function App() {
  return (
    // Can use Context directly as provider!
    <ThemeContext value="dark">
      <ThemedComponent />
    </ThemeContext>
  )
}

function ThemedComponent() {
  // Can use the use() hook (more flexible!)
  const theme = use(ThemeContext)
  return <div>Theme: {theme}</div>
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Full Example with State</h2>
        <pre>
          <code>{`'use client'

import { createContext, use, useState } from 'react'

// Create context
const UserContext = createContext(null)

// Provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  
  return (
    <UserContext value={{ user, setUser }}>
      {children}
    </UserContext>
  )
}

// Consumer component
function UserProfile() {
  const { user, setUser } = use(UserContext)
  
  if (!user) {
    return <button onClick={() => setUser({ name: 'Alice' })}>
      Login
    </button>
  }
  
  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={() => setUser(null)}>Logout</button>
    </div>
  )
}

// App
export default function App() {
  return (
    <UserProvider>
      <UserProfile />
    </UserProvider>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Benefits of use() Hook over useContext</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Conditional Usage:</strong> Can be called conditionally (useContext cannot)</li>
          <li><strong>Works in Loops:</strong> Can be used inside loops</li>
          <li><strong>Consistent API:</strong> Same hook for promises and context</li>
          <li><strong>Future-Proof:</strong> Designed for React's future direction</li>
        </ul>

        <h4>Example of conditional usage:</h4>
        <pre>
          <code>{`function Component({ useTheme }) {
  // This is allowed with use(), but not with useContext!
  const theme = useTheme ? use(ThemeContext) : null
  
  return <div>Theme: {theme || 'default'}</div>
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Backward Compatibility</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><code>Context.Provider</code> still works perfectly</li>
          <li><code>useContext</code> is not deprecated</li>
          <li>You can mix both old and new approaches</li>
          <li>Migrate gradually at your own pace</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>When to Use Context</h2>
        <p>Context is great for:</p>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Theme/styling preferences</li>
          <li>Current user/authentication</li>
          <li>Language/locale settings</li>
          <li>App-wide configuration</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          <strong>Note:</strong> For complex state management, consider libraries like Zustand or Redux.
        </p>
      </div>
    </div>
  )
}
