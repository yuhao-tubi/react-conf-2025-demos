'use client'

import { useState, useTransition, startTransition } from 'react'
import Link from 'next/link'

// Utility to check if View Transitions API is supported
const supportsViewTransitions = () => {
  return typeof document !== 'undefined' && 'startViewTransition' in document
}

// Helper to wrap updates with View Transitions
function withViewTransition(updateFn: () => void) {
  if (supportsViewTransitions() && (document as any).startViewTransition) {
    (document as any).startViewTransition(() => {
      updateFn()
    })
  } else {
    updateFn()
  }
}

interface Item {
  id: number
  title: string
  description: string
  color: string
}

const ITEMS: Item[] = [
  { id: 1, title: 'React 19', description: 'Latest React version with amazing features', color: '#61dafb' },
  { id: 2, title: 'Next.js 15', description: 'The React framework for production', color: '#0070f3' },
  { id: 3, title: 'TypeScript', description: 'JavaScript with syntax for types', color: '#3178c6' },
  { id: 4, title: 'React Compiler', description: 'Automatic optimization for React', color: '#7928ca' },
  { id: 5, title: 'Server Actions', description: 'Simplified server-side operations', color: '#10b981' },
  { id: 6, title: 'Suspense', description: 'Declarative loading states', color: '#f59e0b' },
]

function ItemCard({ item, isSelected, onClick }: { 
  item: Item
  isSelected: boolean
  onClick: () => void 
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '1.5rem',
        background: isSelected ? item.color : 'var(--card-bg)',
        color: isSelected ? 'white' : 'var(--foreground)',
        border: `2px solid ${isSelected ? item.color : 'var(--border)'}`,
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
        viewTransitionName: `item-${item.id}`,
      }}
    >
      <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
      <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>{item.description}</p>
    </div>
  )
}

function DetailView({ item, onClose }: { item: Item; onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        viewTransitionName: 'detail-overlay',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: item.color,
          color: 'white',
          padding: '3rem',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '90%',
          viewTransitionName: `item-${item.id}`,
        }}
      >
        <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>{item.title}</h2>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '2rem' }}>
          {item.description}
        </p>
        <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
          This is a detailed view showing more information about {item.title}. 
          Notice how the card smoothly transitions into this full-screen view using the View Transitions API!
        </p>
        <button
          onClick={onClose}
          style={{
            background: 'white',
            color: item.color,
            padding: '0.75rem 2rem',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default function ViewTransitionsDemo() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleItemClick = (item: Item) => {
    withViewTransition(() => {
      setSelectedItem(item)
    })
  }

  const handleClose = () => {
    withViewTransition(() => {
      setSelectedItem(null)
    })
  }

  const toggleView = () => {
    withViewTransition(() => {
      setView(view === 'grid' ? 'list' : 'grid')
    })
  }

  const toggleSort = () => {
    withViewTransition(() => {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    })
  }

  const sortedItems = [...ITEMS].sort((a, b) => {
    return sortOrder === 'asc' 
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  })

  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>View Transitions API Demo</h1>

      <div className="demo-section">
        <h2>What is the View Transitions API?</h2>
        <p>
          The View Transitions API allows you to create smooth, animated transitions between different states
          of your UI. React 19 works seamlessly with this browser API to provide native-like animations.
        </p>

        <h3>Key Features:</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Smooth transitions between UI states</li>
          <li>Automatic element morphing and positioning</li>
          <li>Native browser performance</li>
          <li>Simple API with powerful results</li>
          <li>Works with React's concurrent features</li>
        </ul>

        {!supportsViewTransitions() && (
          <div className="error" style={{ marginTop: '1rem' }}>
            ⚠️ Your browser doesn't support the View Transitions API. 
            Try Chrome 111+ or Edge 111+ to see the animations.
          </div>
        )}
      </div>

      <div className="demo-section">
        <h2>Demo 1: List/Grid View Toggle</h2>
        <p>Toggle between grid and list views with smooth transitions:</p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={toggleView}>
            Switch to {view === 'grid' ? 'List' : 'Grid'} View
          </button>
          <button onClick={toggleSort}>
            Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
          </button>
        </div>

        <div
          style={{
            display: view === 'grid' ? 'grid' : 'flex',
            gridTemplateColumns: view === 'grid' ? 'repeat(auto-fit, minmax(250px, 1fr))' : undefined,
            flexDirection: view === 'list' ? 'column' : undefined,
            gap: '1rem',
          }}
        >
          {sortedItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isSelected={false}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
      </div>

      <div className="demo-section">
        <h2>How It Works</h2>
        <p>The View Transitions API works in three steps:</p>
        <ol style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Capture:</strong> Browser captures the current state</li>
          <li><strong>Update:</strong> DOM is updated with new state</li>
          <li><strong>Animate:</strong> Browser animates between states</li>
        </ol>
      </div>

      <div className="demo-section">
        <h2>Code Example - Basic Usage</h2>
        <pre>
          <code>{`// Helper function
function withViewTransition(updateFn: () => void) {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      updateFn()
    })
  } else {
    // Fallback for unsupported browsers
    updateFn()
  }
}

// Usage with React state
function Component() {
  const [view, setView] = useState('grid')
  
  const toggleView = () => {
    withViewTransition(() => {
      setView(view === 'grid' ? 'list' : 'grid')
    })
  }
  
  return (
    <button onClick={toggleView}>
      Toggle View
    </button>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Code Example - Named Transitions</h2>
        <pre>
          <code>{`// CSS (add to your stylesheet)
::view-transition-old(item-1),
::view-transition-new(item-1) {
  animation-duration: 0.5s;
}

// React Component
function ItemCard({ item }) {
  return (
    <div style={{ viewTransitionName: \`item-\${item.id}\` }}>
      {item.title}
    </div>
  )
}

// When transitioning, elements with matching
// viewTransitionName will morph smoothly!`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Code Example - With React Transitions</h2>
        <pre>
          <code>{`import { useTransition } from 'react'

function Component() {
  const [isPending, startTransition] = useTransition()
  const [items, setItems] = useState([])
  
  const updateItems = () => {
    // Combine React's useTransition with View Transitions
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        startTransition(() => {
          setItems(newItems)
        })
      })
    } else {
      startTransition(() => {
        setItems(newItems)
      })
    }
  }
  
  return (
    <button onClick={updateItems}>
      Update Items
    </button>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>CSS for Custom Animations</h2>
        <pre>
          <code>{`/* Default transition for all elements */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}

/* Fade animation */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

::view-transition-old(root) {
  animation: fade-out 0.3s ease-out;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-in;
}

/* Slide animation */
@keyframes slide-from-right {
  from { transform: translateX(100%); }
}

::view-transition-new(detail-view) {
  animation: slide-from-right 0.4s ease-out;
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Browser Support</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="card">
            <h4>✅ Supported</h4>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '2' }}>
              <li>Chrome 111+</li>
              <li>Edge 111+</li>
              <li>Opera 97+</li>
            </ul>
          </div>
          <div className="card">
            <h4>⏳ Coming Soon</h4>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '2' }}>
              <li>Safari (in development)</li>
              <li>Firefox (in development)</li>
            </ul>
          </div>
          <div className="card">
            <h4>🔄 Graceful Degradation</h4>
            <p>
              Always check for support and provide a fallback. 
              Unsupported browsers will simply update without animation.
            </p>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Benefits</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Native Performance:</strong> Runs on the browser's rendering thread</li>
          <li><strong>Simple API:</strong> Easy to implement, hard to mess up</li>
          <li><strong>Automatic Animations:</strong> Browser handles the heavy lifting</li>
          <li><strong>Better UX:</strong> Smooth transitions improve user experience</li>
          <li><strong>Progressive Enhancement:</strong> Works in supported browsers, degrades gracefully</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Best Practices</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Always check for browser support before using</li>
          <li>Keep animations short (200-400ms)</li>
          <li>Use meaningful <code>view-transition-name</code> values</li>
          <li>Combine with React's <code>useTransition</code> for best results</li>
          <li>Test fallback behavior in unsupported browsers</li>
          <li>Don't overuse - use for significant state changes</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Use Cases</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Page navigation transitions</li>
          <li>Modal/dialog open/close</li>
          <li>List to detail view expansions</li>
          <li>Image gallery navigation</li>
          <li>Tab switching</li>
          <li>Sorting and filtering animations</li>
          <li>Layout changes (grid ↔ list)</li>
        </ul>
      </div>

      {selectedItem && (
        <DetailView item={selectedItem} onClose={handleClose} />
      )}
    </div>
  )
}
