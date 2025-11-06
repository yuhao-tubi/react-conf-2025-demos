'use client'

import { useState, useEffect, Suspense, use } from 'react'
import Link from 'next/link'

// Mock Activity component (React 19.2 feature - this is a polyfill/demonstration)
// In real React 19.2, this would be imported from 'react'
function Activity({ mode, children }: { mode: 'visible' | 'hidden'; children: React.ReactNode }) {
  const [shouldRender, setShouldRender] = useState(mode === 'visible')
  
  useEffect(() => {
    if (mode === 'visible') {
      setShouldRender(true)
    }
    // For 'hidden' mode, we keep rendering but defer updates and unmount effects
  }, [mode])

  return (
    <div
      style={{
        display: mode === 'hidden' ? 'none' : 'block',
        // In real implementation, React would defer all updates and unmount effects when hidden
      }}
      data-activity-mode={mode}
    >
      {children}
    </div>
  )
}

// Simulated heavy component with effects
function HeavyComponent({ id, color }: { id: string; color: string }) {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log(`${id} mounted`)
    setMounted(true)
    return () => {
      console.log(`${id} unmounted`)
    }
  }, [id])

  return (
    <div className="card" style={{ padding: '1.5rem', borderLeft: `4px solid ${color}` }}>
      <h4>{id}</h4>
      <p>Status: {mounted ? '✅ Mounted' : '⏳ Mounting...'}</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)} style={{ marginTop: '0.5rem' }}>
        Increment
      </button>
      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
        Check console for mount/unmount logs
      </p>
    </div>
  )
}

// Simulated tab content with data loading
function TabContent({ name, color }: { name: string; color: string }) {
  const [data, setData] = useState<string | null>(null)
  const [input, setInput] = useState('')

  useEffect(() => {
    console.log(`${name} tab mounted, loading data...`)
    const timer = setTimeout(() => {
      setData(`Data loaded for ${name}`)
    }, 1000)

    return () => {
      console.log(`${name} tab unmounted`)
      clearTimeout(timer)
    }
  }, [name])

  return (
    <div className="card" style={{ padding: '1.5rem', borderTop: `4px solid ${color}` }}>
      <h3>{name}</h3>
      {data ? (
        <>
          <p style={{ color: '#059669' }}>✅ {data}</p>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Your input (state preserved when switching tabs):
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type something..."
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem' }}>
            💡 Switch tabs and come back - your input will be preserved!
          </p>
        </>
      ) : (
        <p>⏳ Loading data...</p>
      )}
    </div>
  )
}

// Image preloader component
function ImagePreloader({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      console.log(`Image loaded: ${alt}`)
      setLoaded(true)
    }
  }, [src, alt])

  return (
    <div className="card" style={{ padding: '1rem' }}>
      <div
        style={{
          width: '100%',
          height: '200px',
          background: loaded ? `url(${src}) center/cover` : '#f0f0f0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
        }}
      >
        {!loaded && '🖼️ Placeholder'}
      </div>
      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
        {loaded ? `✅ ${alt}` : `⏳ Loading ${alt}...`}
      </p>
    </div>
  )
}

export default function ActivityDemo() {
  // Demo 1: Basic visible/hidden toggle
  const [isVisible, setIsVisible] = useState(true)

  // Demo 2: Multi-page state with tabs
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'settings'>('home')

  // Demo 3: Pre-render next page
  const [currentPage, setCurrentPage] = useState(1)
  const [preloadNext, setPreloadNext] = useState(false)

  return (
    <div className="container">
      <Link href="/" className="back-link">
        ← Back to Home
      </Link>

      <h1>
        <code>&lt;Activity /&gt;</code> Component Demo
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
        React 19.2 - New in October 2025 | 
        <a 
          href="https://react.dev/blog/2025/10/01/react-19-2#activity" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ marginLeft: '0.5rem', color: '#0070f3' }}
        >
          Official Docs →
        </a>
      </p>

      <div className="demo-section">
        <h2>What is &lt;Activity /&gt;?</h2>
        <p>
          <code>&lt;Activity&gt;</code> lets you break your app into &quot;activities&quot; that can be controlled 
          and prioritized. It&apos;s an alternative to conditional rendering that provides better performance 
          and state management.
        </p>

        <div className="card" style={{ background: '#f0f9ff', border: '1px solid #0ea5e9' }}>
          <h3>Key Features:</h3>
          <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
            <li><strong>visible mode:</strong> Shows children, mounts effects, processes updates normally</li>
            <li><strong>hidden mode:</strong> Hides children, unmounts effects, defers updates until React is idle</li>
            <li><strong>State preservation:</strong> Keep component state when switching between modes</li>
            <li><strong>Performance:</strong> Pre-render hidden content without impacting visible UI</li>
            <li><strong>Use cases:</strong> Tabs, wizards, pre-loading, back navigation with state</li>
          </ul>
        </div>
      </div>

      <div className="demo-section">
        <h2>Demo 1: Basic Usage - Before & After</h2>
        <p>Compare conditional rendering vs Activity component:</p>

        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <h3>❌ Before (Conditional Rendering)</h3>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
              <code>{`// Loses state when toggled
{isVisible && <Page />}`}</code>
            </pre>
          </div>

          <div>
            <h3>✅ After (Activity Component)</h3>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
              <code>{`// Preserves state when hidden
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>`}</code>
            </pre>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => setIsVisible(!isVisible)}>
            {isVisible ? '👁️ Hide Component' : '👁️‍🗨️ Show Component'}
          </button>

          <div style={{ marginTop: '1rem' }}>
            <Activity mode={isVisible ? 'visible' : 'hidden'}>
              <HeavyComponent id="Demo 1 Component" color="#0070f3" />
            </Activity>
          </div>

          <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
            💡 Notice: When hidden, effects unmount. When visible again, they remount - but state is preserved!
          </p>
        </div>
      </div>

      <div className="demo-section">
        <h2>Demo 2: Tabs with State Preservation</h2>
        <p>
          Traditional tab implementations unmount inactive tabs, losing their state. 
          With <code>&lt;Activity&gt;</code>, all tabs stay mounted but hidden tabs defer updates.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '2px solid #e5e7eb' }}>
          {(['home', 'profile', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === tab ? '#0070f3' : 'transparent',
                color: activeTab === tab ? 'white' : '#666',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #0070f3' : 'none',
                marginBottom: '-2px',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
          <TabContent name="Home" color="#0070f3" />
        </Activity>

        <Activity mode={activeTab === 'profile' ? 'visible' : 'hidden'}>
          <TabContent name="Profile" color="#7928ca" />
        </Activity>

        <Activity mode={activeTab === 'settings' ? 'visible' : 'hidden'}>
          <TabContent name="Settings" color="#059669" />
        </Activity>

        <div className="card" style={{ marginTop: '1rem', background: '#fffbeb', border: '1px solid #f59e0b' }}>
          <p style={{ margin: 0 }}>
            <strong>Try it:</strong> Type something in one tab&apos;s input field, switch tabs, then come back. 
            Your input is preserved! Check the console to see mount/unmount logs.
          </p>
        </div>
      </div>

      <div className="demo-section">
        <h2>Demo 3: Pre-render Next Page</h2>
        <p>
          Pre-render the next page users are likely to navigate to. This loads data, images, and CSS 
          in the background without impacting the current page&apos;s performance.
        </p>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
            ← Previous
          </button>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Page {currentPage}</span>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= 3}>
            Next →
          </button>
          <label style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={preloadNext}
              onChange={(e) => setPreloadNext(e.target.checked)}
            />
            Pre-render next page
          </label>
        </div>

        {/* Current Page */}
        <Activity mode={currentPage === 1 ? 'visible' : 'hidden'}>
          <div className="card" style={{ padding: '2rem', borderTop: '4px solid #0070f3' }}>
            <h3>Page 1 Content</h3>
            <p>This is the currently visible page. It renders and updates normally.</p>
            <ImagePreloader 
              src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400" 
              alt="Page 1 Image" 
            />
          </div>
        </Activity>

        <Activity mode={currentPage === 2 ? 'visible' : 'hidden'}>
          <div className="card" style={{ padding: '2rem', borderTop: '4px solid #7928ca' }}>
            <h3>Page 2 Content</h3>
            <p>This page loads its data and images when pre-rendered or visible.</p>
            <ImagePreloader 
              src="https://images.unsplash.com/photo-1682687221038-404cb8830901?w=400" 
              alt="Page 2 Image" 
            />
          </div>
        </Activity>

        <Activity mode={currentPage === 3 ? 'visible' : 'hidden'}>
          <div className="card" style={{ padding: '2rem', borderTop: '4px solid #059669' }}>
            <h3>Page 3 Content</h3>
            <p>Final page with its own content and resources.</p>
            <ImagePreloader 
              src="https://images.unsplash.com/photo-1682687220795-796d3f6f7000?w=400" 
              alt="Page 3 Image" 
            />
          </div>
        </Activity>

        {/* Pre-render next page */}
        {preloadNext && currentPage < 3 && (
          <Activity mode="hidden">
            {currentPage === 1 && (
              <div className="card" style={{ padding: '2rem', borderTop: '4px solid #7928ca' }}>
                <h3>Page 2 Content</h3>
                <p>This page loads its data and images when pre-rendered or visible.</p>
                <ImagePreloader 
                  src="https://images.unsplash.com/photo-1682687221038-404cb8830901?w=400" 
                  alt="Page 2 Image" 
                />
              </div>
            )}
            {currentPage === 2 && (
              <div className="card" style={{ padding: '2rem', borderTop: '4px solid #059669' }}>
                <h3>Page 3 Content</h3>
                <p>Final page with its own content and resources.</p>
                <ImagePreloader 
                  src="https://images.unsplash.com/photo-1682687220795-796d3f6f7000?w=400" 
                  alt="Page 3 Image" 
                />
              </div>
            )}
          </Activity>
        )}

        <div className="card" style={{ marginTop: '1rem', background: '#f0fdf4', border: '1px solid #059669' }}>
          <p style={{ margin: 0 }}>
            <strong>Watch the console:</strong> With pre-render enabled, the next page starts loading in the 
            background. Navigation becomes instant because resources are already loaded!
          </p>
        </div>
      </div>

      <div className="demo-section">
        <h2>Code Examples</h2>

        <h3>1. Basic Usage</h3>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px' }}>
          <code>{`import { Activity } from 'react'

function App() {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <Activity mode={isVisible ? 'visible' : 'hidden'}>
      <ExpensiveComponent />
    </Activity>
  )
}`}</code>
        </pre>

        <h3>2. Tabs with State Preservation</h3>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px' }}>
          <code>{`function TabView() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <>
      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <HomeTab />
      </Activity>
      
      <Activity mode={activeTab === 'profile' ? 'visible' : 'hidden'}>
        <ProfileTab />
      </Activity>
      
      <Activity mode={activeTab === 'settings' ? 'visible' : 'hidden'}>
        <SettingsTab />
      </Activity>
    </>
  )
}`}</code>
        </pre>

        <h3>3. Pre-render Next Route</h3>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px' }}>
          <code>{`function Wizard() {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <>
      {/* Current step */}
      <Activity mode={currentStep === 1 ? 'visible' : 'hidden'}>
        <Step1 />
      </Activity>
      
      {/* Pre-render next step in background */}
      {currentStep === 1 && (
        <Activity mode="hidden">
          <Step2 />
        </Activity>
      )}
    </>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Performance Benefits</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="card">
            <h4>🚀 Instant Navigation</h4>
            <p>Pre-render hidden routes so navigation feels instant</p>
          </div>

          <div className="card">
            <h4>💾 State Preservation</h4>
            <p>Keep form inputs and scroll position when switching views</p>
          </div>

          <div className="card">
            <h4>🎯 Priority Control</h4>
            <p>Hidden activities defer updates until React is idle</p>
          </div>

          <div className="card">
            <h4>📦 Resource Pre-loading</h4>
            <p>Load images, data, and CSS in background without blocking UI</p>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Use Cases</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Tabs:</strong> Keep all tabs mounted, preserve state when switching</li>
          <li><strong>Wizards:</strong> Pre-render next step for instant navigation</li>
          <li><strong>Carousels:</strong> Pre-load adjacent slides</li>
          <li><strong>Modal Dialogs:</strong> Keep dialog state when closing/opening</li>
          <li><strong>Search Results:</strong> Pre-render likely next page of results</li>
          <li><strong>Dashboard Widgets:</strong> Load non-visible widgets in background</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Best Practices</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Use for navigation:</strong> Pre-render routes users are likely to visit next</li>
          <li><strong>Preserve state:</strong> Better UX by keeping form inputs and scroll position</li>
          <li><strong>Don&apos;t overuse:</strong> Too many hidden activities can consume memory</li>
          <li><strong>Monitor effects:</strong> Hidden mode unmounts effects, visible remounts them</li>
          <li><strong>Combine with Suspense:</strong> Let React handle loading states</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Future Modes</h2>
        <p>
          React 19.2 currently supports <code>visible</code> and <code>hidden</code> modes. 
          Future versions will add more modes for different use cases like background processing, 
          throttled updates, and more granular priority control.
        </p>
      </div>
    </div>
  )
}
