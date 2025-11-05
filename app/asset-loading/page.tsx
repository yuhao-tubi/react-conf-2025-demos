'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'

function PreloadExample() {
  return (
    <div className="card">
      <h3>Preloading Resources</h3>
      <p>React 19 provides built-in support for preloading resources:</p>
      <pre>
        <code>{`import { preload, prefetch } from 'react-dom'

// Preload a stylesheet
preload('/styles/theme.css', { as: 'style' })

// Preload a font
preload('/fonts/my-font.woff2', { 
  as: 'font',
  type: 'font/woff2',
  crossOrigin: 'anonymous'
})

// Preload a script
preload('/scripts/analytics.js', { as: 'script' })

// Prefetch for future navigation
prefetch('/next-page', { as: 'document' })`}</code>
      </pre>
    </div>
  )
}

function StylesheetExample() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="card">
      <h3>Stylesheet Loading</h3>
      <p>Load stylesheets with precedence control:</p>
      <pre>
        <code>{`// Higher precedence loads first
<link 
  rel="stylesheet" 
  href="/critical.css" 
  precedence="high"
/>

// Lower precedence for non-critical styles
<link 
  rel="stylesheet" 
  href="/theme.css" 
  precedence="low"
/>`}</code>
      </pre>

      <button onClick={() => setLoaded(!loaded)} style={{ marginTop: '1rem' }}>
        {loaded ? 'Unload' : 'Load'} Example Stylesheet
      </button>

      {loaded && (
        <>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" />
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0, 112, 243, 0.1)', borderRadius: '8px' }}>
            <p style={{ fontFamily: 'Roboto, sans-serif' }}>
              This text uses the Roboto font loaded dynamically!
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function ScriptExample() {
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const loadScript = () => {
    setScriptLoaded(true)
  }

  return (
    <div className="card">
      <h3>Script Loading</h3>
      <p>Load scripts with async/defer and get loading callbacks:</p>
      <pre>
        <code>{`<script 
  src="/analytics.js" 
  async
  onLoad={() => console.log('Script loaded!')}
  onError={() => console.error('Script failed')}
/>

// Or with defer
<script 
  src="/non-critical.js" 
  defer
/>`}</code>
      </pre>

      <button onClick={loadScript} disabled={scriptLoaded} style={{ marginTop: '1rem' }}>
        Load External Script
      </button>

      {scriptLoaded && (
        <>
          <script
            src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"
            async
            onLoad={() => {
              // @ts-ignore
              if (window.confetti) {
                // @ts-ignore
                window.confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                })
              }
            }}
          />
          <div className="success" style={{ marginTop: '1rem' }}>
            🎉 Script loaded! (Check for confetti)
          </div>
        </>
      )}
    </div>
  )
}

export default function AssetLoadingDemo() {
  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>Asset Loading Demo</h1>

      <div className="demo-section">
        <h2>What is Asset Loading?</h2>
        <p>
          React 19 provides native support for loading external resources like stylesheets, fonts, and scripts.
          You can now render these tags directly in your components with better control over loading behavior.
        </p>

        <h3>Key Features:</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Preload resources for better performance</li>
          <li>Control stylesheet precedence</li>
          <li>Async/defer script loading with callbacks</li>
          <li>Works with Suspense boundaries</li>
          <li>Better resource loading prioritization</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Resource Types</h2>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div className="card">
            <h4>📄 Stylesheets</h4>
            <p>CSS files with precedence control</p>
          </div>
          <div className="card">
            <h4>🔤 Fonts</h4>
            <p>Web fonts with preloading</p>
          </div>
          <div className="card">
            <h4>📜 Scripts</h4>
            <p>JavaScript with async/defer</p>
          </div>
          <div className="card">
            <h4>🖼️ Images</h4>
            <p>Preload critical images</p>
          </div>
        </div>
      </div>

      <Suspense fallback={<div>Loading examples...</div>}>
        <PreloadExample />
        <StylesheetExample />
        <ScriptExample />
      </Suspense>

      <div className="demo-section">
        <h2>Precedence System</h2>
        <p>
          Control the order in which stylesheets are loaded using the <code>precedence</code> attribute:
        </p>
        <pre>
          <code>{`// Load in this order: reset → high → medium → low
<link rel="stylesheet" href="/reset.css" precedence="reset" />
<link rel="stylesheet" href="/critical.css" precedence="high" />
<link rel="stylesheet" href="/theme.css" precedence="medium" />
<link rel="stylesheet" href="/optional.css" precedence="low" />

// React ensures they load in the correct order
// even if rendered from different components!`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>With Suspense</h2>
        <p>Asset loading works seamlessly with Suspense boundaries:</p>
        <pre>
          <code>{`function Component() {
  return (
    <Suspense fallback={<Spinner />}>
      {/* These resources are loaded before showing content */}
      <link rel="stylesheet" href="/component.css" />
      <link rel="preload" href="/font.woff2" as="font" />
      
      <div className="component">
        Content appears after resources load
      </div>
    </Suspense>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Preload API Functions</h2>
        <pre>
          <code>{`import { preload, prefetch, preconnect, preinit } from 'react-dom'

// Preload a resource
preload('/styles/theme.css', { as: 'style' })
preload('/fonts/font.woff2', { as: 'font', crossOrigin: 'anonymous' })

// Prefetch for future navigation
prefetch('/next-page')

// Preconnect to a domain
preconnect('https://api.example.com')

// Preinitialize a module
preinit('/client-module.js', { as: 'script' })`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Best Practices</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Preload Critical Resources:</strong> Use preload for above-the-fold content</li>
          <li><strong>Set Precedence:</strong> Ensure critical styles load first</li>
          <li><strong>Use Async/Defer:</strong> Load non-critical scripts asynchronously</li>
          <li><strong>Combine with Suspense:</strong> Show fallback UI while loading</li>
          <li><strong>Error Handling:</strong> Provide onError callbacks for scripts</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Benefits</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Better Performance:</strong> Optimized resource loading</li>
          <li><strong>Simpler Code:</strong> No need for external libraries</li>
          <li><strong>Better Control:</strong> Fine-grained loading control</li>
          <li><strong>SSR Compatible:</strong> Works with server-side rendering</li>
          <li><strong>Type Safe:</strong> Full TypeScript support</li>
        </ul>
      </div>
    </div>
  )
}
