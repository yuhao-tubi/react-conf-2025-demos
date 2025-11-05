'use client'

import { useState } from 'react'
import Link from 'next/link'

// Without React Compiler, you'd need useMemo/useCallback for these
function ExpensiveList({ items, filter }: { items: string[]; filter: string }) {
  // React Compiler automatically memoizes this computation!
  const filteredItems = items.filter((item) => item.toLowerCase().includes(filter.toLowerCase()))

  // This function is also automatically memoized
  const renderItem = (item: string, index: number) => {
    return (
      <div
        key={index}
        style={{
          padding: '0.75rem',
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          marginBottom: '0.5rem',
        }}
      >
        {item}
      </div>
    )
  }

  return <div>{filteredItems.map(renderItem)}</div>
}

// Component that would normally need React.memo
function CounterDisplay({ count }: { count: number }) {
  console.log('CounterDisplay rendered')
  
  return (
    <div className="result">
      <h4>Counter Value: {count}</h4>
      <p>This component is automatically memoized by React Compiler!</p>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        (Check console to see render frequency)
      </p>
    </div>
  )
}

export default function ReactCompilerDemo() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const [items] = useState([
    'React 19 Features',
    'React Compiler',
    'Server Components',
    'Server Actions',
    'useOptimistic Hook',
    'Asset Loading',
    'Form Actions',
    'Context as Provider',
  ])

  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>React Compiler v1.0 Demo</h1>

      <div className="demo-section">
        <h2>What is React Compiler?</h2>
        <p>
          React Compiler (formerly React Forget) is a build-time compiler that automatically optimizes your React code.
          It intelligently applies memoization without you writing <code>useMemo</code>, <code>useCallback</code>, or{' '}
          <code>React.memo</code>.
        </p>

        <h3>Key Features:</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Automatic memoization of components and values</li>
          <li>No need for manual useMemo/useCallback/React.memo</li>
          <li>Better performance by default</li>
          <li>Reduces bundle size (fewer optimization hooks)</li>
          <li>Works with existing React code</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>How It Works</h2>
        <p>React Compiler analyzes your code at build time and:</p>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Detects which values and components can be memoized</li>
          <li>Automatically wraps them with memoization</li>
          <li>Ensures referential stability where needed</li>
          <li>Optimizes re-renders intelligently</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Interactive Demo</h2>
        <p>
          Try interacting with the components below. Notice how the CounterDisplay only re-renders when the count changes,
          not when you type in the search box!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
          <div>
            <h3>Counter (triggers specific re-renders)</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button onClick={() => setCount(count + 1)}>Increment</button>
              <button onClick={() => setCount(count - 1)}>Decrement</button>
              <button onClick={() => setCount(0)}>Reset</button>
            </div>
            <CounterDisplay count={count} />
          </div>

          <div>
            <h3>Filtered List (expensive computation)</h3>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Search items..."
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <ExpensiveList items={items} filter={text} />
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Code Comparison</h2>

        <h3>Without React Compiler (Manual Optimization):</h3>
        <pre>
          <code>{`import { useMemo, useCallback, memo } from 'react'

// Need to wrap with memo
const ExpensiveList = memo(({ items, filter }) => {
  // Need useMemo for expensive computation
  const filteredItems = useMemo(
    () => items.filter(item => 
      item.toLowerCase().includes(filter.toLowerCase())
    ),
    [items, filter]
  )

  // Need useCallback for functions
  const renderItem = useCallback((item, index) => {
    return <div key={index}>{item}</div>
  }, [])

  return <div>{filteredItems.map(renderItem)}</div>
})

// Need memo for this too
const CounterDisplay = memo(({ count }) => {
  return <div>Count: {count}</div>
})`}</code>
        </pre>

        <h3>With React Compiler (Automatic Optimization):</h3>
        <pre>
          <code>{`// No imports needed!

// Automatically memoized by React Compiler
function ExpensiveList({ items, filter }) {
  // Automatically memoized computation
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(filter.toLowerCase())
  )

  // Automatically memoized function
  const renderItem = (item, index) => {
    return <div key={index}>{item}</div>
  }

  return <div>{filteredItems.map(renderItem)}</div>
}

// Automatically memoized component
function CounterDisplay({ count }) {
  return <div>Count: {count}</div>
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Configuration</h2>
        <p>Enable React Compiler in your Next.js config:</p>
        <pre>
          <code>{`// next.config.js
module.exports = {
  experimental: {
    reactCompiler: true,
  },
}

// Or with options
module.exports = {
  experimental: {
    reactCompiler: {
      compilationMode: 'annotation', // or 'all'
      panicThreshold: 'all_errors',
    },
  },
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Compilation Modes</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="card">
            <h4>all (default)</h4>
            <p>Compiles all components automatically</p>
          </div>
          <div className="card">
            <h4>annotation</h4>
            <p>Only compiles components with "use memo" directive</p>
            <pre style={{ marginTop: '0.5rem' }}>
              <code>{`function MyComponent() {
  'use memo'
  // This component will be compiled
}`}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Compiler Directives</h2>
        <pre>
          <code>{`// Opt-in to compilation (when using annotation mode)
function Component() {
  'use memo'
  // ...
}

// Opt-out of compilation
function Component() {
  'use no memo'
  // This component won't be compiled
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>What Gets Optimized?</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Component Renders:</strong> Automatically memoized like React.memo</li>
          <li><strong>Computed Values:</strong> Cached like useMemo</li>
          <li><strong>Functions:</strong> Stable references like useCallback</li>
          <li><strong>Object/Array Literals:</strong> Referential stability maintained</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Benefits</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Less Code:</strong> No manual memoization hooks needed</li>
          <li><strong>Better Performance:</strong> Optimizations applied correctly and consistently</li>
          <li><strong>Smaller Bundles:</strong> Fewer hooks and wrappers in your code</li>
          <li><strong>Better DX:</strong> Focus on logic, not optimization</li>
          <li><strong>No Runtime Cost:</strong> Optimizations happen at build time</li>
          <li><strong>Backward Compatible:</strong> Works with existing React code</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Compatibility</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>✅ Works with React 19+</li>
          <li>✅ Compatible with existing useMemo/useCallback code</li>
          <li>✅ Works with Server and Client Components</li>
          <li>✅ Supports TypeScript</li>
          <li>✅ Works with all React features (Suspense, Transitions, etc.)</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>When to Use React Compiler</h2>
        <p>React Compiler is beneficial for:</p>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Large applications with many components</li>
          <li>Apps with performance-sensitive interactions</li>
          <li>Teams that want to reduce manual optimization</li>
          <li>New projects starting with React 19</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          <strong>Note:</strong> The compiler is production-ready but still evolving. 
          Test thoroughly before deploying to production!
        </p>
      </div>
    </div>
  )
}
