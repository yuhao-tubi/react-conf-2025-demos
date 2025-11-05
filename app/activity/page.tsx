'use client'

import { useState, useTransition, Suspense } from 'react'
import Link from 'next/link'

// Activity Indicator Component
function ActivityIndicator({ size = 'medium', label }: { size?: 'small' | 'medium' | 'large'; label?: string }) {
  const sizes = {
    small: 16,
    medium: 24,
    large: 40,
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div
        style={{
          width: sizes[size],
          height: sizes[size],
          border: '3px solid rgba(0, 112, 243, 0.3)',
          borderTopColor: '#0070f3',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {label && <span style={{ fontSize: size === 'small' ? '0.875rem' : '1rem' }}>{label}</span>}
    </div>
  )
}

// Skeleton Loader Component
function SkeletonLoader({ width, height, count = 1 }: { width?: string; height?: string; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: width || '100%',
            height: height || '20px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '4px',
            marginBottom: count > 1 ? '0.5rem' : 0,
          }}
        />
      ))}
    </>
  )
}

// Progress Bar Component
function ProgressBar({ progress, label }: { progress: number; label?: string }) {
  return (
    <div style={{ width: '100%' }}>
      {label && <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>{label}</div>}
      <div
        style={{
          width: '100%',
          height: '8px',
          background: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #0070f3, #7928ca)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <div style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#666' }}>
        {progress}% complete
      </div>
    </div>
  )
}

// Pulse Indicator
function PulseIndicator({ color = '#0070f3' }: { color?: string }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '12px',
        height: '12px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: color,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: color,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
    </div>
  )
}

// Dot Loader
function DotLoader() {
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#0070f3',
            animation: 'bounce 1.4s infinite ease-in-out both',
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </div>
  )
}

// Simulated async data fetch
async function fetchData(delay: number = 2000): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, delay))
  return ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']
}

// Component that uses Suspense
function DataList({ promise }: { promise: Promise<string[]> }) {
  const [data, setData] = useState<string[] | null>(null)

  promise.then(setData)

  if (!data) {
    throw promise
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {data.map((item, i) => (
        <div key={i} className="card" style={{ padding: '1rem' }}>
          {item}
        </div>
      ))}
    </div>
  )
}

export default function ActivityDemo() {
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dataPromise, setDataPromise] = useState<Promise<string[]> | null>(null)

  const simulateProgress = () => {
    setProgress(0)
    setIsLoading(true)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsLoading(false)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const loadDataWithTransition = () => {
    startTransition(() => {
      // Simulate expensive operation
      const start = Date.now()
      while (Date.now() - start < 1000) {
        // Busy wait
      }
    })
  }

  const loadDataWithSuspense = () => {
    setDataPromise(fetchData())
  }

  const resetSuspense = () => {
    setDataPromise(null)
  }

  return (
    <div className="container">
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.5);
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>

      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>Activity Indicators Demo</h1>

      <div className="demo-section">
        <h2>What are Activity Indicators?</h2>
        <p>
          Activity indicators (also called loading indicators or spinners) provide visual feedback during
          asynchronous operations. React 19 provides several patterns for implementing loading states
          with Suspense, useTransition, and custom components.
        </p>

        <h3>Key Concepts:</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Show progress during async operations</li>
          <li>Improve perceived performance</li>
          <li>Reduce user anxiety during waits</li>
          <li>Integrate with React's concurrent features</li>
          <li>Provide meaningful feedback</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Demo 1: Activity Indicator Styles</h2>
        <p>Different styles of loading indicators for various use cases:</p>

        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="card">
            <h4>Spinner (Small)</h4>
            <div style={{ padding: '1rem' }}>
              <ActivityIndicator size="small" label="Loading..." />
            </div>
          </div>

          <div className="card">
            <h4>Spinner (Medium)</h4>
            <div style={{ padding: '1rem' }}>
              <ActivityIndicator size="medium" label="Processing..." />
            </div>
          </div>

          <div className="card">
            <h4>Spinner (Large)</h4>
            <div style={{ padding: '1rem' }}>
              <ActivityIndicator size="large" />
            </div>
          </div>

          <div className="card">
            <h4>Dot Loader</h4>
            <div style={{ padding: '1rem' }}>
              <DotLoader />
            </div>
          </div>

          <div className="card">
            <h4>Pulse Indicator</h4>
            <div style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <PulseIndicator />
              <span>Live</span>
            </div>
          </div>

          <div className="card">
            <h4>Skeleton Loader</h4>
            <div style={{ padding: '1rem' }}>
              <SkeletonLoader count={3} height="16px" />
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Demo 2: Progress Bar</h2>
        <p>Show determinate progress for operations with known duration:</p>

        <button onClick={simulateProgress} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Start Progress'}
        </button>

        {isLoading && (
          <div style={{ marginTop: '1rem' }}>
            <ProgressBar progress={progress} label="Uploading file..." />
          </div>
        )}
      </div>

      <div className="demo-section">
        <h2>Demo 3: useTransition with Activity</h2>
        <p>Use React's useTransition hook to show pending states:</p>

        <button onClick={loadDataWithTransition} disabled={isPending}>
          {isPending ? 'Processing...' : 'Load Data (useTransition)'}
        </button>

        {isPending && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0, 112, 243, 0.1)', borderRadius: '8px' }}>
            <ActivityIndicator size="small" label="Loading with useTransition..." />
          </div>
        )}
      </div>

      <div className="demo-section">
        <h2>Demo 4: Suspense with Fallback</h2>
        <p>Use Suspense to show loading states for async components:</p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={loadDataWithSuspense} disabled={!!dataPromise}>
            Load Data (Suspense)
          </button>
          {dataPromise && (
            <button onClick={resetSuspense}>
              Reset
            </button>
          )}
        </div>

        {dataPromise && (
          <Suspense
            fallback={
              <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <ActivityIndicator size="large" />
                <p style={{ marginTop: '1rem' }}>Loading data with Suspense...</p>
              </div>
            }
          >
            <DataList promise={dataPromise} />
          </Suspense>
        )}
      </div>

      <div className="demo-section">
        <h2>Code Example - Activity Indicator Component</h2>
        <pre>
          <code>{`function ActivityIndicator({ 
  size = 'medium', 
  label 
}: { 
  size?: 'small' | 'medium' | 'large'
  label?: string 
}) {
  const sizes = {
    small: 16,
    medium: 24,
    large: 40,
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div
        style={{
          width: sizes[size],
          height: sizes[size],
          border: '3px solid rgba(0, 112, 243, 0.3)',
          borderTopColor: '#0070f3',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {label && <span>{label}</span>}
    </div>
  )
}

// CSS
@keyframes spin {
  to { transform: rotate(360deg); }
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Code Example - Skeleton Loader</h2>
        <pre>
          <code>{`function SkeletonLoader({ 
  width, 
  height, 
  count = 1 
}: { 
  width?: string
  height?: string
  count?: number 
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: width || '100%',
            height: height || '20px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '4px',
            marginBottom: count > 1 ? '0.5rem' : 0,
          }}
        />
      ))}
    </>
  )
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Code Example - With useTransition</h2>
        <pre>
          <code>{`import { useTransition } from 'react'

function Component() {
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState([])

  const loadData = () => {
    startTransition(async () => {
      const result = await fetch('/api/data')
      const json = await result.json()
      setData(json)
    })
  }

  return (
    <div>
      <button onClick={loadData} disabled={isPending}>
        Load Data
      </button>
      
      {isPending && <ActivityIndicator label="Loading..." />}
      
      <DataDisplay data={data} />
    </div>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Code Example - With Suspense</h2>
        <pre>
          <code>{`import { Suspense } from 'react'

function LoadingFallback() {
  return (
    <div>
      <ActivityIndicator size="large" />
      <p>Loading content...</p>
    </div>
  )
}

function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AsyncComponent />
    </Suspense>
  )
}

// AsyncComponent can use() hook or throw promises
function AsyncComponent() {
  const data = use(fetchData()) // React 19 use() hook
  return <div>{data.map(item => ...)}</div>
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Code Example - Progress Bar</h2>
        <pre>
          <code>{`function ProgressBar({ 
  progress, 
  label 
}: { 
  progress: number
  label?: string 
}) {
  return (
    <div>
      {label && <div>{label}</div>}
      <div style={{
        width: '100%',
        height: '8px',
        background: '#e5e7eb',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: \`\${progress}%\`,
          height: '100%',
          background: 'linear-gradient(90deg, #0070f3, #7928ca)',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <div>{progress}% complete</div>
    </div>
  )
}

// Usage
function Upload() {
  const [progress, setProgress] = useState(0)
  
  const upload = async (file) => {
    // Track upload progress
    const xhr = new XMLHttpRequest()
    xhr.upload.addEventListener('progress', (e) => {
      const percent = (e.loaded / e.total) * 100
      setProgress(percent)
    })
    // ... upload logic
  }
  
  return <ProgressBar progress={progress} label="Uploading..." />
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Loading State Patterns</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="card">
            <h4>1. Inline Spinner</h4>
            <p>Small spinner next to action button</p>
            <div style={{ marginTop: '0.5rem' }}>
              <button disabled style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} />
                Loading...
              </button>
            </div>
          </div>

          <div className="card">
            <h4>2. Overlay Spinner</h4>
            <p>Full-screen or section overlay with spinner</p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Good for blocking operations</p>
          </div>

          <div className="card">
            <h4>3. Skeleton Screens</h4>
            <p>Show content outline while loading</p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Best for content-heavy pages</p>
          </div>

          <div className="card">
            <h4>4. Progress Indicators</h4>
            <p>Show actual progress percentage</p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Use when duration is known</p>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Best Practices</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Show immediately:</strong> Display loading indicators within 100ms</li>
          <li><strong>Use appropriate type:</strong> Skeleton for content, spinner for actions</li>
          <li><strong>Provide context:</strong> Add labels explaining what's loading</li>
          <li><strong>Don't over-animate:</strong> Keep animations subtle and smooth</li>
          <li><strong>Match the context:</strong> Size and style should fit the UI</li>
          <li><strong>Consider accessibility:</strong> Add ARIA labels for screen readers</li>
          <li><strong>Use Suspense:</strong> Let React handle loading boundaries</li>
          <li><strong>Combine with useTransition:</strong> Keep UI responsive during updates</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Accessibility Considerations</h2>
        <pre>
          <code>{`function AccessibleSpinner({ label }: { label: string }) {
  return (
    <div 
      role="status" 
      aria-live="polite"
      aria-label={label}
    >
      <div className="spinner" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  )
}

// CSS for screen reader only text
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>When to Use Each Type</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Spinner:</strong> Quick operations ({"<"} 3 seconds)</li>
          <li><strong>Progress Bar:</strong> Long operations with known duration</li>
          <li><strong>Skeleton:</strong> Initial page load or content-heavy sections</li>
          <li><strong>Pulse/Dot:</strong> Real-time updates or live indicators</li>
          <li><strong>Suspense:</strong> Async component loading</li>
          <li><strong>useTransition:</strong> Non-urgent state updates</li>
        </ul>
      </div>
    </div>
  )
}
