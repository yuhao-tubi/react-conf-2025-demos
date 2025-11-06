'use client'

import { useState, Suspense, use } from 'react'
import Link from 'next/link'

// Simulate a slow data fetch
function fetchData(id: string, delay: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Data for ${id} (loaded after ${delay}ms)`)
    }, delay)
  })
}

// Dynamic component that requires data
function DynamicContent({ id, delay }: { id: string; delay: number }) {
  const data = use(fetchData(id, delay))
  return (
    <div className="card" style={{ borderLeft: '4px solid #0070f3' }}>
      <h4>Dynamic: {id}</h4>
      <p>{data}</p>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>
        This content was loaded dynamically after {delay}ms
      </p>
    </div>
  )
}

// Static component that can be pre-rendered
function StaticContent({ title, description }: { title: string; description: string }) {
  return (
    <div className="card" style={{ borderLeft: '4px solid #50e3c2' }}>
      <h4>Static: {title}</h4>
      <p>{description}</p>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>
        This content was pre-rendered at build time
      </p>
    </div>
  )
}

// Demo 1: Basic Partial Pre-rendering concept
function BasicPPRDemo() {
  return (
    <div className="card" style={{ background: 'var(--card-bg)' }}>
      <h3>Demo 1: Basic Concept</h3>
      <p style={{ marginBottom: '1rem' }}>
        Partial Pre-rendering allows you to pre-render static parts of your app and serve them
        immediately, while dynamic parts are loaded progressively.
      </p>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {/* Static content - can be pre-rendered */}
        <StaticContent 
          title="Header Section"
          description="This header is static and was pre-rendered. It's served immediately from CDN."
        />
        
        <StaticContent 
          title="Navigation"
          description="Static navigation that doesn't need to wait for data."
        />
        
        {/* Dynamic content - needs to be rendered on-demand */}
        <Suspense fallback={
          <div className="card" style={{ borderLeft: '4px solid #ffd700', opacity: 0.6 }}>
            <h4>⏳ Loading dynamic content...</h4>
            <p>This content is being fetched...</p>
          </div>
        }>
          <DynamicContent id="User Profile" delay={1500} />
        </Suspense>
        
        <StaticContent 
          title="Footer"
          description="Another static section that was pre-rendered."
        />
      </div>
    </div>
  )
}

// Demo 2: Multiple dynamic sections
function MultipleDynamicDemo() {
  return (
    <div className="card" style={{ background: 'var(--card-bg)' }}>
      <h3>Demo 2: Multiple Dynamic Sections</h3>
      <p style={{ marginBottom: '1rem' }}>
        You can have multiple dynamic sections that load independently while the static shell
        is served immediately.
      </p>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        <StaticContent 
          title="Page Header"
          description="Pre-rendered shell served from CDN instantly."
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <Suspense fallback={<LoadingCard label="Recommendations" />}>
            <DynamicContent id="Recommendations" delay={1000} />
          </Suspense>
          
          <Suspense fallback={<LoadingCard label="Activity Feed" />}>
            <DynamicContent id="Activity Feed" delay={1800} />
          </Suspense>
          
          <Suspense fallback={<LoadingCard label="Notifications" />}>
            <DynamicContent id="Notifications" delay={2200} />
          </Suspense>
        </div>
        
        <StaticContent 
          title="Static Sidebar"
          description="This sidebar content is static and instantly available."
        />
      </div>
    </div>
  )
}

function LoadingCard({ label }: { label: string }) {
  return (
    <div className="card" style={{ borderLeft: '4px solid #ffd700', opacity: 0.6 }}>
      <h4>⏳ {label}</h4>
      <p>Loading...</p>
    </div>
  )
}

// Demo 3: Interactive visualization
function InteractivePPRDemo() {
  const [isResuming, setIsResuming] = useState(false)
  const [phase, setPhase] = useState<'prerender' | 'serving' | 'resume'>('prerender')
  
  const handleSimulateFlow = () => {
    setPhase('prerender')
    setTimeout(() => setPhase('serving'), 1000)
    setTimeout(() => {
      setPhase('resume')
      setIsResuming(true)
    }, 2000)
    setTimeout(() => setIsResuming(false), 4000)
  }
  
  return (
    <div className="card" style={{ background: 'var(--card-bg)' }}>
      <h3>Demo 3: PPR Flow Visualization</h3>
      <p style={{ marginBottom: '1rem' }}>
        This demo visualizes the three phases of Partial Pre-rendering:
      </p>
      
      <button 
        onClick={handleSimulateFlow}
        style={{ marginBottom: '1.5rem', padding: '0.75rem 1.5rem' }}
      >
        Simulate PPR Flow
      </button>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {/* Phase indicator */}
        <div style={{ 
          padding: '1rem', 
          background: phase === 'prerender' ? '#0070f3' : phase === 'serving' ? '#50e3c2' : '#7928ca',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {phase === 'prerender' && '1️⃣ Pre-render Phase: Creating static shell'}
          {phase === 'serving' && '2️⃣ Serving Phase: Static shell from CDN'}
          {phase === 'resume' && '3️⃣ Resume Phase: Filling in dynamic content'}
        </div>
        
        {/* Static shell */}
        <div className="card" style={{ 
          borderLeft: '4px solid #50e3c2',
          opacity: phase === 'prerender' ? 0.5 : 1,
          transition: 'opacity 0.3s'
        }}>
          <h4>Static Shell ✅</h4>
          <p>This is pre-rendered and served immediately</p>
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
            Available in phases: Prerender → Serving → Resume
          </div>
        </div>
        
        {/* Dynamic content */}
        <div className="card" style={{ 
          borderLeft: '4px solid #0070f3',
          opacity: phase === 'resume' && isResuming ? 1 : 0.3,
          transition: 'opacity 0.5s'
        }}>
          <h4>Dynamic Content {phase === 'resume' && isResuming ? '✅' : '⏳'}</h4>
          <p>
            {phase === 'resume' && isResuming 
              ? 'Dynamic content has been loaded!'
              : 'This will be loaded during resume phase'}
          </p>
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
            Available in phase: Resume only
          </div>
        </div>
      </div>
    </div>
  )
}

// Code example component
function CodeExample() {
  const [activeTab, setActiveTab] = useState<'prerender' | 'resume' | 'resumeAndPrerender'>('prerender')
  
  const examples = {
    prerender: `// Phase 1: Pre-render the app
import { prerender } from 'react-dom/server'

const controller = new AbortController()

const { prelude, postponed } = await prerender(<App />, {
  signal: controller.signal,
})

// Save the postponed state for later
await savePostponedState(postponed)

// Send prelude (static shell) to client or CDN
// This is the fast, pre-rendered HTML that users see first`,
    
    resume: `// Phase 2: Resume rendering for SSR
import { resume } from 'react-dom/server'

// Get the postponed state from Phase 1
const postponed = await getPostponedState(request)

// Resume rendering to fill in dynamic content
const resumeStream = await resume(<App />, postponed)

// Send stream to client
// This completes the page with dynamic content`,
    
    resumeAndPrerender: `// Alternative: Resume and pre-render for SSG
import { resumeAndPrerender } from 'react-dom/static'

// Get the postponed state
const postponedState = await getPostponedState(request)

// Resume and get complete static HTML
const { prelude } = await resumeAndPrerender(
  <App />, 
  postponedState
)

// Send complete HTML prelude to CDN
// This is for static generation of the full page`
  }
  
  return (
    <div className="card" style={{ background: 'var(--card-bg)' }}>
      <h3>API Examples</h3>
      <p style={{ marginBottom: '1rem' }}>
        Partial Pre-rendering introduces new server-side APIs:
      </p>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('prerender')}
          style={{
            padding: '0.5rem 1rem',
            background: activeTab === 'prerender' ? '#0070f3' : 'transparent',
            color: activeTab === 'prerender' ? 'white' : 'inherit',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          prerender()
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          style={{
            padding: '0.5rem 1rem',
            background: activeTab === 'resume' ? '#0070f3' : 'transparent',
            color: activeTab === 'resume' ? 'white' : 'inherit',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          resume()
        </button>
        <button
          onClick={() => setActiveTab('resumeAndPrerender')}
          style={{
            padding: '0.5rem 1rem',
            background: activeTab === 'resumeAndPrerender' ? '#0070f3' : 'transparent',
            color: activeTab === 'resumeAndPrerender' ? 'white' : 'inherit',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          resumeAndPrerender()
        </button>
      </div>
      
      <pre style={{ 
        background: '#1e1e1e', 
        color: '#d4d4d4', 
        padding: '1.5rem', 
        borderRadius: '8px',
        overflow: 'auto',
        fontSize: '0.875rem',
        lineHeight: '1.5'
      }}>
        <code>{examples[activeTab]}</code>
      </pre>
    </div>
  )
}

// Benefits component
function BenefitsSection() {
  const benefits = [
    {
      icon: '⚡',
      title: 'Faster Initial Load',
      description: 'Static shell is served immediately from CDN, providing instant visual feedback to users.'
    },
    {
      icon: '🎯',
      title: 'Better Core Web Vitals',
      description: 'Improved LCP (Largest Contentful Paint) as critical static content appears faster.'
    },
    {
      icon: '📦',
      title: 'Efficient Caching',
      description: 'Pre-rendered shells can be cached on CDN, reducing server load and costs.'
    },
    {
      icon: '🔄',
      title: 'Progressive Enhancement',
      description: 'Page is functional immediately with static content, dynamic parts load progressively.'
    },
    {
      icon: '🎨',
      title: 'Smooth Transitions',
      description: 'Works with View Transitions API to animate content reveals in batches.'
    },
    {
      icon: '🚀',
      title: 'Optimized Streaming',
      description: 'Suspense boundaries are batched to reveal more content together for better UX.'
    }
  ]
  
  return (
    <div className="card" style={{ background: 'var(--card-bg)' }}>
      <h3>Benefits of Partial Pre-rendering</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginTop: '1rem'
      }}>
        {benefits.map((benefit, i) => (
          <div key={i} className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{benefit.icon}</div>
            <h4 style={{ marginBottom: '0.5rem' }}>{benefit.title}</h4>
            <p style={{ fontSize: '0.875rem', color: '#666' }}>{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Use cases component
function UseCasesSection() {
  const useCases = [
    {
      title: '🛒 E-commerce Product Pages',
      description: 'Pre-render product layout, images, and static info. Resume to load pricing, inventory, and personalized recommendations.',
      example: 'Static: Product images, description, specs | Dynamic: Price, stock, reviews'
    },
    {
      title: '📰 News/Blog Sites',
      description: 'Pre-render article layout and content. Resume for comment counts, related articles, and user-specific data.',
      example: 'Static: Article content, images, author | Dynamic: Comments, trending, ads'
    },
    {
      title: '📊 Dashboard Applications',
      description: 'Pre-render dashboard shell and navigation. Resume to load real-time metrics and user data.',
      example: 'Static: Layout, navigation, labels | Dynamic: Metrics, charts, notifications'
    },
    {
      title: '👤 Profile Pages',
      description: 'Pre-render profile layout. Resume to load user-specific data and activity feeds.',
      example: 'Static: Page structure, sections | Dynamic: User data, posts, connections'
    }
  ]
  
  return (
    <div className="card" style={{ background: 'var(--card-bg)' }}>
      <h3>Use Cases</h3>
      <p style={{ marginBottom: '1rem', color: '#666' }}>
        Partial Pre-rendering is ideal for pages with a mix of static and dynamic content:
      </p>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {useCases.map((useCase, i) => (
          <div key={i} className="card">
            <h4 style={{ marginBottom: '0.5rem' }}>{useCase.title}</h4>
            <p style={{ marginBottom: '0.75rem' }}>{useCase.description}</p>
            <div style={{ 
              padding: '0.75rem', 
              background: 'rgba(0, 112, 243, 0.1)', 
              borderRadius: '6px',
              fontSize: '0.875rem',
              borderLeft: '3px solid #0070f3'
            }}>
              {useCase.example}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Architecture diagram
function ArchitectureDiagram() {
  return (
    <div className="card" style={{ background: 'var(--card-bg)' }}>
      <h3>How It Works</h3>
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Step 1 */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
            <div style={{ 
              background: '#0070f3', 
              color: 'white', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              flexShrink: 0
            }}>1</div>
            <div>
              <h4>Build Time: Pre-render</h4>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>
                Call <code>prerender()</code> with an AbortController. React renders the static parts
                and saves the "postponed" state for dynamic parts.
              </p>
              <div style={{ 
                marginTop: '0.75rem', 
                padding: '0.75rem', 
                background: 'rgba(80, 227, 194, 0.1)',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}>
                Output: Static HTML shell + Postponed state
              </div>
            </div>
          </div>
          
          {/* Arrow */}
          <div style={{ textAlign: 'center', fontSize: '2rem' }}>↓</div>
          
          {/* Step 2 */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
            <div style={{ 
              background: '#50e3c2', 
              color: '#333', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              flexShrink: 0
            }}>2</div>
            <div>
              <h4>Deploy: Serve from CDN</h4>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>
                Deploy the static shell to CDN. When users visit, they immediately get the
                pre-rendered HTML with no server processing.
              </p>
              <div style={{ 
                marginTop: '0.75rem', 
                padding: '0.75rem', 
                background: 'rgba(80, 227, 194, 0.1)',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}>
                Result: Instant page load with static content
              </div>
            </div>
          </div>
          
          {/* Arrow */}
          <div style={{ textAlign: 'center', fontSize: '2rem' }}>↓</div>
          
          {/* Step 3 */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
            <div style={{ 
              background: '#7928ca', 
              color: 'white', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              flexShrink: 0
            }}>3</div>
            <div>
              <h4>Runtime: Resume Rendering</h4>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>
                Call <code>resume()</code> or <code>resumeAndPrerender()</code> with the postponed state.
                React fills in the dynamic parts and streams them to the client.
              </p>
              <div style={{ 
                marginTop: '0.75rem', 
                padding: '0.75rem', 
                background: 'rgba(121, 40, 202, 0.1)',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}>
                Result: Complete page with personalized/dynamic content
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main page component
export default function PartialPreRenderingPage() {
  return (
    <div className="container">
      <Link href="/" style={{ display: 'inline-block', marginBottom: '2rem', color: '#0070f3' }}>
        ← Back to Home
      </Link>
      
      <header style={{ marginBottom: '3rem' }}>
        <h1>Partial Pre-rendering</h1>
        <p style={{ fontSize: '1.25rem', color: '#666', marginTop: '1rem' }}>
          React 19.2 introduces Partial Pre-rendering (PPR), a new capability to pre-render 
          static parts of your app and resume rendering dynamic parts later.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <span className="badge">React 19.2</span>
          <span className="badge">SSR</span>
          <span className="badge">Performance</span>
          <span className="badge">CDN</span>
        </div>
      </header>

      <section style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ background: '#fff3cd', border: '1px solid #ffc107' }}>
          <strong>⚠️ Note:</strong> This is a conceptual demo. Partial Pre-rendering requires 
          server-side setup with React 19.2's new SSR APIs. These demos simulate the behavior 
          to help you understand how PPR works.
        </div>
      </section>

      <section style={{ display: 'grid', gap: '2rem' }}>
        <ArchitectureDiagram />
        <BasicPPRDemo />
        <MultipleDynamicDemo />
        <InteractivePPRDemo />
        <CodeExample />
        <BenefitsSection />
        <UseCasesSection />
      </section>

      <section style={{ marginTop: '3rem', padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px' }}>
        <h2>Key Concepts</h2>
        <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3>🎯 What is Partial Pre-rendering?</h3>
            <p>
              PPR allows you to split your app into static and dynamic parts. Static parts are 
              pre-rendered at build time and served from CDN instantly. Dynamic parts are rendered 
              on-demand and streamed to the client.
            </p>
          </div>
          
          <div>
            <h3>⚡ Why Use PPR?</h3>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
              <li><strong>Faster perceived performance:</strong> Users see content immediately</li>
              <li><strong>Better caching:</strong> Static shells can be cached on CDN globally</li>
              <li><strong>Reduced server load:</strong> Only dynamic parts require server processing</li>
              <li><strong>Progressive enhancement:</strong> Page works with JavaScript disabled</li>
              <li><strong>SEO friendly:</strong> Search engines see pre-rendered content</li>
            </ul>
          </div>
          
          <div>
            <h3>🔧 How to Implement</h3>
            <ol style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>
                <strong>Identify static vs dynamic content:</strong> Determine which parts of your 
                page can be pre-rendered and which need runtime data
              </li>
              <li>
                <strong>Use Suspense boundaries:</strong> Wrap dynamic content in Suspense to mark 
                it for deferred rendering
              </li>
              <li>
                <strong>Call prerender() at build time:</strong> Generate the static shell and save 
                the postponed state
              </li>
              <li>
                <strong>Deploy shell to CDN:</strong> Serve the pre-rendered HTML from CDN for instant loads
              </li>
              <li>
                <strong>Resume rendering at runtime:</strong> Use resume() to fill in dynamic content 
                when requested
              </li>
            </ol>
          </div>
          
          <div>
            <h3>📚 Related APIs</h3>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>
                <code>prerender()</code> - Pre-render app and get postponed state (react-dom/static)
              </li>
              <li>
                <code>resume()</code> - Resume rendering to SSR stream (react-dom/server)
              </li>
              <li>
                <code>resumeAndPrerender()</code> - Resume and get complete HTML (react-dom/static)
              </li>
              <li>
                <code>resumeToPipeableStream()</code> - Resume to Node.js stream (react-dom/server)
              </li>
              <li>
                <code>resumeAndPrerenderToNodeStream()</code> - Resume to Node.js stream for SSG (react-dom/static)
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '2rem', padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px' }}>
        <h2>Resources</h2>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <a 
              href="https://react.dev/blog/2025/10/01/react-19-2#partial-pre-rendering" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#0070f3' }}
            >
              React 19.2 Blog Post - Partial Pre-rendering
            </a>
          </li>
          <li>
            <a 
              href="https://react.dev/reference/react-dom/server/prerender" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#0070f3' }}
            >
              prerender() API Documentation
            </a>
          </li>
          <li>
            <a 
              href="https://react.dev/reference/react-dom/server/resume" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#0070f3' }}
            >
              resume() API Documentation
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}

