'use client'

import { useState, useTransition, Suspense } from 'react'
import Link from 'next/link'

// Simulate async data fetching
function fetchData(query: string): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = [
        `Result 1 for "${query}"`,
        `Result 2 for "${query}"`,
        `Result 3 for "${query}"`,
        `Result 4 for "${query}"`,
        `Result 5 for "${query}"`,
      ]
      resolve(results)
    }, 1000)
  })
}

function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  const search = (searchQuery: string) => {
    startTransition(async () => {
      const data = await fetchData(searchQuery)
      setResults(data)
    })
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => search(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {isPending && (
        <div style={{ padding: '1rem', background: 'rgba(0, 112, 243, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
          🔄 Searching...
        </div>
      )}

      <div>
        {results.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {results.map((result, index) => (
              <div
                key={index}
                style={{
                  padding: '0.75rem',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  opacity: isPending ? 0.5 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {result}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No results yet. Try searching!</p>
        )}
      </div>
    </div>
  )
}

function TabContent({ tab }: { tab: string }) {
  // Simulate slow component
  const startTime = Date.now()
  while (Date.now() - startTime < 200) {
    // Busy wait
  }

  return (
    <div className="result">
      <h3>Content for {tab}</h3>
      <p>This is the content area for the {tab} tab.</p>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        This component intentionally renders slowly to demonstrate transitions.
      </p>
    </div>
  )
}

export default function AsyncTransitionsDemo() {
  const [activeTab, setActiveTab] = useState('home')
  const [isPending, startTransition] = useTransition()

  const switchTab = (tab: string) => {
    startTransition(() => {
      setActiveTab(tab)
    })
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>Async Transitions Demo</h1>

      <div className="demo-section">
        <h2>What are Async Transitions?</h2>
        <p>
          React 19 enhances the <code>useTransition</code> hook to support async functions.
          This allows you to mark state updates as non-urgent (transitions) even when they involve async operations.
        </p>

        <h3>Key Features:</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Mark async state updates as transitions</li>
          <li>Keep UI responsive during slow updates</li>
          <li>Show old content while new content loads</li>
          <li>Automatic pending state tracking</li>
          <li>Better user experience for slow operations</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Demo 1: Async Search with Transitions</h2>
        <p>
          Type in the search box below. Notice how the UI stays responsive and shows a pending state
          while fetching results!
        </p>
        <SearchResults query="" />
      </div>

      <div className="demo-section">
        <h2>Demo 2: Tab Switching with Slow Renders</h2>
        <p>
          Click the tabs below. Without transitions, the UI would freeze. With transitions,
          it stays responsive!
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '2px solid var(--border)' }}>
          {['home', 'profile', 'settings', 'about'].map((tab) => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === tab ? 'var(--primary)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--foreground)',
                border: 'none',
                borderRadius: '6px 6px 0 0',
                cursor: 'pointer',
                opacity: isPending && activeTab !== tab ? 0.5 : 1,
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {isPending && (
          <div style={{ padding: '0.5rem', background: 'rgba(0, 112, 243, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
            ⏳ Loading tab content...
          </div>
        )}

        <TabContent tab={activeTab} />
      </div>

      <div className="demo-section">
        <h2>Code Example - Async Search</h2>
        <pre>
          <code>{`'use client'

import { useState, useTransition } from 'react'

function SearchComponent() {
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const search = async (query: string) => {
    // Wrap async operation in startTransition
    startTransition(async () => {
      const data = await fetch(\`/api/search?q=\${query}\`)
      const results = await data.json()
      setResults(results)
    })
  }

  return (
    <div>
      <input onChange={(e) => search(e.target.value)} />
      {isPending && <div>Searching...</div>}
      <Results items={results} />
    </div>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Code Example - Tab Switching</h2>
        <pre>
          <code>{`function Tabs() {
  const [activeTab, setActiveTab] = useState('home')
  const [isPending, startTransition] = useTransition()

  const switchTab = (tab: string) => {
    // Mark this update as a transition
    startTransition(() => {
      setActiveTab(tab)
    })
  }

  return (
    <div>
      <button onClick={() => switchTab('home')}>
        Home
      </button>
      <button onClick={() => switchTab('profile')}>
        Profile
      </button>

      {isPending && <Spinner />}
      
      {/* This component renders slowly */}
      <TabContent tab={activeTab} />
    </div>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>How It Works</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="card">
            <h4>Without Transitions</h4>
            <ol style={{ marginLeft: '1.5rem', lineHeight: '2' }}>
              <li>User clicks button</li>
              <li>UI freezes while processing</li>
              <li>User sees blank screen or frozen UI</li>
              <li>New content appears (bad UX)</li>
            </ol>
          </div>
          <div className="card">
            <h4>With Transitions</h4>
            <ol style={{ marginLeft: '1.5rem', lineHeight: '2' }}>
              <li>User clicks button</li>
              <li>UI stays responsive (shows old content)</li>
              <li>Optional: Show loading indicator</li>
              <li>Smoothly transition to new content (good UX)</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>useTransition API</h2>
        <pre>
          <code>{`const [isPending, startTransition] = useTransition()

// isPending: boolean
//   - true while transition is in progress
//   - false otherwise

// startTransition: (callback: () => void) => void
//   - Marks updates as transitions
//   - Can now accept async callbacks!

// Example usage
startTransition(async () => {
  const data = await fetchData()
  setData(data)
})`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>When to Use Transitions</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Tab Switching:</strong> Keep old tab visible while loading new one</li>
          <li><strong>Search/Filtering:</strong> Show old results while fetching new ones</li>
          <li><strong>Navigation:</strong> Keep current page visible during navigation</li>
          <li><strong>Slow Renders:</strong> Prevent UI freeze with expensive components</li>
          <li><strong>Data Fetching:</strong> Show stale data while loading fresh data</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Benefits</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Better UX:</strong> UI stays responsive during updates</li>
          <li><strong>No Freezing:</strong> Expensive operations don't block the UI</li>
          <li><strong>Built-in Loading States:</strong> isPending flag for free</li>
          <li><strong>Async Support:</strong> Works with promises and async/await</li>
          <li><strong>Prioritization:</strong> React prioritizes urgent updates first</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Comparison with useDeferredValue</h2>
        <pre>
          <code>{`// useTransition - when you control the state update
const [isPending, startTransition] = useTransition()
startTransition(() => {
  setQuery(newQuery)
})

// useDeferredValue - when you don't control the state update
const deferredQuery = useDeferredValue(query)
<SearchResults query={deferredQuery} />`}</code>
        </pre>
      </div>
    </div>
  )
}
