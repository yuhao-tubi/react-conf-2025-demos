'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

// Polyfill for useEffectEvent (React 19 experimental feature)
// In production, import from 'react' when available
function useEffectEvent<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef<T>(callback)
  
  // Keep the callback ref up to date
  useEffect(() => {
    ref.current = callback
  })
  
  // Return a stable function that calls the latest callback
  return useCallback(((...args: any[]) => {
    return ref.current(...args)
  }) as T, [])
}

// Mock shopping cart context
interface ShoppingCartItem {
  id: number
  name: string
  price: number
}

function ShoppingCart({ items, onRemove }: { items: ShoppingCartItem[]; onRemove: (id: number) => void }) {
  return (
    <div className="card" style={{ padding: '1rem', background: '#f0fdf4', border: '1px solid #059669' }}>
      <h4>🛒 Shopping Cart ({items.length} items)</h4>
      {items.length === 0 ? (
        <p style={{ color: '#666' }}>Cart is empty</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0' }}>
          {items.map((item) => (
            <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span>{item.name} - ${item.price}</span>
              <button onClick={() => onRemove(item.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
        Total: ${items.reduce((sum, item) => sum + item.price, 0)}
      </div>
    </div>
  )
}

// Demo 1: Page visit tracker with shopping cart
function PageVisitTrackerDemo() {
  const [url, setUrl] = useState('/home')
  const [items, setItems] = useState<ShoppingCartItem[]>([
    { id: 1, name: 'Widget', price: 29.99 },
    { id: 2, name: 'Gadget', price: 49.99 },
  ])
  const [logs, setLogs] = useState<string[]>([])

  const availablePages = ['/home', '/about', '/products', '/contact']
  const availableItems: ShoppingCartItem[] = [
    { id: 1, name: 'Widget', price: 29.99 },
    { id: 2, name: 'Gadget', price: 49.99 },
    { id: 3, name: 'Doohickey', price: 19.99 },
    { id: 4, name: 'Thingamajig', price: 39.99 },
  ]

  const addItem = () => {
    const unusedItems = availableItems.filter(item => !items.find(i => i.id === item.id))
    if (unusedItems.length > 0) {
      setItems([...items, unusedItems[0]])
    }
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const numberOfItems = items.length

  // ✅ Good: Using useEffectEvent to read latest cart count without re-triggering effect
  const onVisit = useEffectEvent((visitedUrl: string) => {
    const logMessage = `📊 Visited ${visitedUrl} with ${numberOfItems} items in cart`
    setLogs(prev => [...prev, logMessage])
    console.log(logMessage)
  })

  useEffect(() => {
    onVisit(url)
  }, [url]) // Only re-run when url changes, not when numberOfItems changes

  return (
    <div>
      <h3>Demo 1: Page Visit Tracker</h3>
      <p>
        Track page visits and log the current shopping cart count. The effect only re-runs when
        the URL changes, but always reads the latest cart count via Effect Event.
      </p>

      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1rem' }}>
          <h4>Navigation</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {availablePages.map((page) => (
              <button
                key={page}
                onClick={() => setUrl(page)}
                style={{
                  padding: '0.5rem 1rem',
                  background: url === page ? '#0070f3' : '#e5e7eb',
                  color: url === page ? 'white' : '#333',
                }}
              >
                {page}
              </button>
            ))}
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Current page: <strong>{url}</strong>
          </p>
        </div>

        <ShoppingCart items={items} onRemove={removeItem} />

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={addItem} disabled={items.length >= availableItems.length}>
            ➕ Add Item to Cart
          </button>
        </div>

        <div className="card" style={{ padding: '1rem', background: '#fffbeb', border: '1px solid #f59e0b' }}>
          <h4>Analytics Logs</h4>
          <div style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '0.85rem' }}>
            {logs.length === 0 ? (
              <p style={{ color: '#666', margin: 0 }}>No logs yet</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} style={{ padding: '0.25rem 0', borderBottom: '1px solid #fef3c7' }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card" style={{ background: '#f0f9ff', border: '1px solid #0ea5e9', padding: '1rem' }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>💡 Key Insight:</strong> Change the cart items - notice the effect doesn&apos;t re-run!
            But when you navigate to a new page, the logged cart count is always current.
          </p>
        </div>
      </div>
    </div>
  )
}

// Demo 2: Before/After Comparison
function BeforeAfterComparison() {
  const [message, setMessage] = useState('Hello')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [connectionLogs, setConnectionLogs] = useState<string[]>([])
  const [badConnectionLogs, setBadConnectionLogs] = useState<string[]>([])

  // ❌ Bad: Without useEffectEvent - effect re-runs on every theme change
  useEffect(() => {
    const log = `❌ BAD: Connected to chat (theme: ${theme})`
    setBadConnectionLogs(prev => [...prev, log])
    console.log(log)
    
    return () => {
      const disconnectLog = `❌ BAD: Disconnected from chat`
      setBadConnectionLogs(prev => [...prev, disconnectLog])
      console.log(disconnectLog)
    }
  }, [theme]) // Re-runs on theme change - unnecessary!

  // ✅ Good: With useEffectEvent - only connects once, but reads latest theme
  const onConnected = useEffectEvent(() => {
    const log = `✅ GOOD: Connected to chat (theme: ${theme})`
    setConnectionLogs(prev => [...prev, log])
    console.log(log)
  })

  useEffect(() => {
    onConnected()
    
    return () => {
      const disconnectLog = `✅ GOOD: Disconnected from chat`
      setConnectionLogs(prev => [...prev, disconnectLog])
      console.log(disconnectLog)
    }
  }, []) // Only runs once on mount!

  return (
    <div>
      <h3>Demo 2: Before & After Comparison</h3>
      <p>
        Compare the behavior with and without <code>useEffectEvent</code>. Both need to show
        notifications with the current theme, but only the &quot;good&quot; version avoids reconnecting.
      </p>

      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1rem' }}>
          <h4>Theme Selector</h4>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setTheme('light')}
              style={{
                padding: '0.5rem 1rem',
                background: theme === 'light' ? '#fbbf24' : '#e5e7eb',
                color: theme === 'light' ? '#000' : '#333',
              }}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              style={{
                padding: '0.5rem 1rem',
                background: theme === 'dark' ? '#1e293b' : '#e5e7eb',
                color: theme === 'dark' ? '#fff' : '#333',
              }}
            >
              🌙 Dark
            </button>
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            Current theme: <strong>{theme}</strong>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="card" style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #ef4444' }}>
            <h4>❌ Without useEffectEvent</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '0.8rem' }}>
              {badConnectionLogs.map((log, i) => (
                <div key={i} style={{ padding: '0.25rem 0', borderBottom: '1px solid #fecaca' }}>
                  {log}
                </div>
              ))}
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#991b1b' }}>
              Reconnects every time theme changes! 😱
            </p>
          </div>

          <div className="card" style={{ padding: '1rem', background: '#f0fdf4', border: '1px solid #059669' }}>
            <h4>✅ With useEffectEvent</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '0.8rem' }}>
              {connectionLogs.map((log, i) => (
                <div key={i} style={{ padding: '0.25rem 0', borderBottom: '1px solid #d1fae5' }}>
                  {log}
                </div>
              ))}
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#065f46' }}>
              Connects once, reads latest theme! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Demo 3: Interactive notification system
function NotificationDemo() {
  const [notifications, setNotifications] = useState<string[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [volume, setVolume] = useState(50)
  const [messageCount, setMessageCount] = useState(0)

  const playNotificationSound = useEffectEvent(() => {
    if (soundEnabled) {
      const message = `🔔 Playing notification sound at volume ${volume}%`
      console.log(message)
      setNotifications(prev => [...prev, message])
    } else {
      const message = `🔇 Sound disabled, notification shown silently`
      console.log(message)
      setNotifications(prev => [...prev, message])
    }
  })

  useEffect(() => {
    if (messageCount === 0) return

    const message = `📩 New message received! (Message #${messageCount})`
    console.log(message)
    setNotifications(prev => [...prev, message])
    playNotificationSound()
  }, [messageCount]) // Only depends on messageCount, not soundEnabled or volume

  return (
    <div>
      <h3>Demo 3: Notification System</h3>
      <p>
        A notification system that plays sounds based on user preferences. The effect only runs
        when a new message arrives, but always uses the latest sound settings.
      </p>

      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1rem' }}>
          <h4>Notification Settings</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span>Enable notification sounds</span>
            </label>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Volume: {volume}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <h4>Simulate Messages</h4>
          <button onClick={() => setMessageCount(messageCount + 1)}>
            📨 Receive New Message
          </button>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            Messages received: <strong>{messageCount}</strong>
          </p>
        </div>

        <div className="card" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #cbd5e1' }}>
          <h4>Notification Log</h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '0.85rem' }}>
            {notifications.length === 0 ? (
              <p style={{ color: '#666', margin: 0 }}>No notifications yet</p>
            ) : (
              notifications.map((notification, i) => (
                <div key={i} style={{ padding: '0.25rem 0', borderBottom: '1px solid #e2e8f0' }}>
                  {notification}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card" style={{ background: '#f0f9ff', border: '1px solid #0ea5e9', padding: '1rem' }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>💡 Try This:</strong> Change the volume or toggle sound on/off, then receive a new message.
            The effect doesn&apos;t re-run when you change settings, but the latest settings are always used!
          </p>
        </div>
      </div>
    </div>
  )
}

export default function UseEffectEventDemo() {
  return (
    <div className="container">
      <Link href="/" className="back-link">
        ← Back to Home
      </Link>

      <h1>
        <code>useEffectEvent()</code> Hook Demo
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
        React 19 Experimental Feature | 
        <a 
          href="https://react.dev/reference/react/useEffectEvent" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ marginLeft: '0.5rem', color: '#0070f3' }}
        >
          Official Docs →
        </a>
      </p>

      <div className="demo-section">
        <h2>What is useEffectEvent?</h2>
        <p>
          <code>useEffectEvent</code> is a React Hook that lets you extract non-reactive logic from
          your Effects into a reusable function called an Effect Event. Effect Events allow you to
          read the latest props and state inside an Effect without causing the Effect to re-run when
          those values change.
        </p>

        <div className="card" style={{ background: '#f0f9ff', border: '1px solid #0ea5e9' }}>
          <h3>Key Benefits:</h3>
          <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
            <li><strong>Read latest values:</strong> Access current props/state without re-triggering the Effect</li>
            <li><strong>Avoid stale closures:</strong> Always read fresh values, no closure issues</li>
            <li><strong>Prevent unnecessary re-runs:</strong> Effect only depends on truly reactive values</li>
            <li><strong>Cleaner dependencies:</strong> Dependency arrays only include values that should trigger re-runs</li>
          </ul>
        </div>
      </div>

      <div className="demo-section">
        <PageVisitTrackerDemo />
      </div>

      <div className="demo-section">
        <BeforeAfterComparison />
      </div>

      <div className="demo-section">
        <NotificationDemo />
      </div>

      <div className="demo-section">
        <h2>Code Example</h2>
        
        <h3>Basic Usage</h3>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
          <code>{`import { useEffect, useEffectEvent } from 'react'

function Page({ url }) {
  const { items } = useContext(ShoppingCartContext)
  const numberOfItems = items.length

  // Extract non-reactive logic into an Effect Event
  const onVisit = useEffectEvent((visitedUrl) => {
    logVisit(visitedUrl, numberOfItems)  // Always reads latest numberOfItems
  })

  useEffect(() => {
    onVisit(url)
  }, [url])  // Only re-runs when url changes, not numberOfItems!

  // ...
}`}</code>
        </pre>

        <h3>Chat Room Example</h3>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
          <code>{`import { useEffect, useEffectEvent } from 'react'

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme)  // Reads latest theme
  })

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId)
    connection.on('connected', () => {
      onConnected()
    })
    connection.connect()
    return () => connection.disconnect()
  }, [roomId])  // Only reconnects when roomId changes, not theme!

  // ...
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Rules and Caveats</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="card" style={{ background: '#fef2f2', border: '1px solid #ef4444' }}>
            <h4>❌ Don&apos;t: Use as dependency shortcut</h4>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
              <code>{`// ❌ Bad: Hiding reactive dependency
const onClick = useEffectEvent(() => {
  doSomething(prop)
})

useEffect(() => {
  onClick()
}, [])  // Missing prop dependency!`}</code>
            </pre>
          </div>

          <div className="card" style={{ background: '#f0fdf4', border: '1px solid #059669' }}>
            <h4>✅ Do: Extract truly non-reactive logic</h4>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
              <code>{`// ✅ Good: Reading latest value without triggering effect
const onMessage = useEffectEvent((msg) => {
  showNotification(msg, theme)  // theme is truly non-reactive here
})

useEffect(() => {
  socket.on('message', onMessage)
  return () => socket.off('message', onMessage)
}, [])  // Effect doesn't care about theme changes`}</code>
            </pre>
          </div>

          <div className="card" style={{ background: '#fffbeb', border: '1px solid #f59e0b' }}>
            <h4>⚠️ Only call inside Effects</h4>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
              Effect Events should only be called within Effects like <code>useEffect</code>,{' '}
              <code>useLayoutEffect</code>, or <code>useInsertionEffect</code>. Don&apos;t pass them
              to other components or hooks.
            </p>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>When to Use useEffectEvent</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Analytics/Logging:</strong> Log events with current state without re-subscribing</li>
          <li><strong>Event Handlers in Effects:</strong> WebSocket callbacks, DOM event listeners that need fresh values</li>
          <li><strong>Notifications:</strong> Show alerts/toasts with current settings without restarting the effect</li>
          <li><strong>Non-reactive Context Values:</strong> Access context values that shouldn&apos;t trigger reconnections</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Best Practices</h2>
        <div className="card">
          <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
            <li>Use Effect Events for logic that needs latest values but shouldn&apos;t trigger the Effect</li>
            <li>Don&apos;t use it to bypass proper dependency arrays - that creates bugs</li>
            <li>Only call Effect Events inside Effects, not in event handlers or other functions</li>
            <li>Define Effect Events close to the Effects that use them for better readability</li>
            <li>Consider if you really need an Effect - sometimes event handlers are better</li>
          </ul>
        </div>
      </div>

      <div className="demo-section">
        <h2>Availability</h2>
        <div className="card" style={{ background: '#fffbeb', border: '1px solid #f59e0b' }}>
          <p style={{ margin: 0 }}>
            <strong>⚠️ Experimental Feature:</strong> <code>useEffectEvent</code> is currently
            experimental and not yet available in a stable React release. The demos on this page
            use a polyfill implementation. Use with caution in production code.
          </p>
        </div>
      </div>
    </div>
  )
}

