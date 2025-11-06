import Link from 'next/link'

const demos = [
  {
    title: 'use Hook',
    description: 'Demonstrates the new use() hook for reading promises and context values',
    href: '/use-hook',
    tags: ['React 19', 'Hooks', 'Suspense'],
  },
  {
    title: 'Server Actions',
    description: 'Form handling with Server Actions and useActionState',
    href: '/server-actions',
    tags: ['React 19', 'Server Components', 'Forms'],
  },
  {
    title: 'useOptimistic Hook',
    description: 'Optimistic UI updates for better user experience',
    href: '/use-optimistic',
    tags: ['React 19', 'Hooks', 'UX'],
  },
  {
    title: 'useFormStatus Hook',
    description: 'Access form submission status in child components',
    href: '/use-form-status',
    tags: ['React 19', 'Forms', 'Hooks'],
  },
  {
    title: 'Document Metadata',
    description: 'Native support for title, meta, and link tags in components',
    href: '/metadata',
    tags: ['React 19', 'SEO'],
  },
  {
    title: 'Ref as Prop',
    description: 'Pass ref directly as a prop without forwardRef',
    href: '/ref-as-prop',
    tags: ['React 19', 'Refs'],
  },
  {
    title: 'Context as Provider',
    description: 'Use Context directly as a provider without Context.Provider',
    href: '/context-provider',
    tags: ['React 19', 'Context'],
  },
  {
    title: 'Asset Loading',
    description: 'Preload and manage stylesheet, font, and script loading',
    href: '/asset-loading',
    tags: ['React 19', 'Performance', 'Suspense'],
  },
  {
    title: 'React Compiler',
    description: 'Automatic memoization and optimization with React Compiler v1.0',
    href: '/react-compiler',
    tags: ['React Compiler', 'Performance', 'Optimization'],
  },
  {
    title: 'Form Actions',
    description: 'Built-in form action handling with automatic pending states',
    href: '/form-actions',
    tags: ['React 19', 'Forms', 'Actions'],
  },
  {
    title: 'Async Transitions',
    description: 'useTransition with async functions and isPending state',
    href: '/async-transitions',
    tags: ['React 19', 'Hooks', 'Suspense'],
  },
  {
    title: 'Error Handling',
    description: 'Enhanced error handling with error boundaries and Server Actions',
    href: '/error-handling',
    tags: ['React 19', 'Error Boundary'],
  },
  {
    title: 'View Transitions',
    description: 'Smooth animations between UI states with the View Transitions API',
    href: '/view-transitions',
    tags: ['React 19', 'Animations', 'UX'],
  },
  {
    title: '<Activity /> Component',
    description: 'React 19.2 Activity component for controlled rendering with visible/hidden modes',
    href: '/activity',
    tags: ['React 19.2', 'Performance', 'State Management'],
  },
  {
    title: 'Suspense Improvements',
    description: 'Compare React 18 vs React 19 Suspense behavior with immediate fallbacks and pre-warming',
    href: '/suspense-improvements',
    tags: ['React 19', 'Suspense', 'Performance', 'UX'],
  },
  {
    title: 'captureOwnerStack()',
    description: 'Capture component ownership stack for debugging and error tracking',
    href: '/capture-owner-stack',
    tags: ['React 19', 'Debugging', 'DevTools'],
  },
  {
    title: 'useEffectEvent Hook',
    description: 'Extract non-reactive logic from Effects to read latest values without re-triggering',
    href: '/use-effect-event',
    tags: ['React 19', 'Hooks', 'Experimental'],
  },
  {
    title: 'Partial Pre-rendering',
    description: 'Pre-render static parts and resume dynamic parts for optimal performance',
    href: '/partial-pre-rendering',
    tags: ['React 19.2', 'SSR', 'Performance', 'CDN'],
  },
]

export default function Home() {
  return (
    <div className="container">
      <header style={{ textAlign: 'center', margin: '3rem 0' }}>
        <h1>React 19.2 & Compiler v1.0 Demos</h1>
        <p style={{ fontSize: '1.25rem', color: '#666', maxWidth: '800px', margin: '1rem auto' }}>
          Explore the latest features in React 19.2, React Canary, and React Compiler v1.0
          with interactive demos and code examples.
        </p>
      </header>

      <section>
        <h2>Featured Demos</h2>
        <div className="grid">
          {demos.map((demo) => (
            <Link href={demo.href} key={demo.href}>
              <div className="card">
                <h3 style={{ marginBottom: '0.5rem' }}>{demo.title}</h3>
                <p style={{ color: '#666', marginBottom: '1rem' }}>{demo.description}</p>
                <div>
                  {demo.tags.map((tag) => (
                    <span key={tag} className="badge">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '4rem', padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px' }}>
        <h2>About This Project</h2>
        <p>
          This repository contains comprehensive demonstrations of the newest features in React 19.2 and React Compiler v1.0.
          Each demo is self-contained and includes detailed explanations of how the features work.
        </p>
        <h3 style={{ marginTop: '2rem' }}>Key Features Covered:</h3>
        <ul style={{ lineHeight: '2', marginLeft: '2rem' }}>
          <li><strong>use() Hook:</strong> Read promises and context values directly in components</li>
          <li><strong>Server Actions:</strong> Simplified form handling and data mutations</li>
          <li><strong>useOptimistic:</strong> Optimistic UI updates for better UX</li>
          <li><strong>useFormStatus:</strong> Access form state from child components</li>
          <li><strong>Document Metadata:</strong> Native support for SEO tags</li>
          <li><strong>Ref as Prop:</strong> Simplified ref forwarding</li>
          <li><strong>Context as Provider:</strong> Cleaner context API</li>
          <li><strong>React Compiler:</strong> Automatic memoization and optimization</li>
          <li><strong>View Transitions:</strong> Smooth animations with native browser API</li>
          <li><strong>Activity Component:</strong> Controlled rendering with visible/hidden modes for better performance</li>
          <li><strong>Partial Pre-rendering:</strong> Pre-render static parts and resume dynamic parts for optimal SSR performance</li>
        </ul>
        <h3 style={{ marginTop: '2rem' }}>Getting Started:</h3>
        <pre><code>{`npm install
npm run dev`}</code></pre>
        <p style={{ marginTop: '1rem' }}>
          Then visit <code>http://localhost:3000</code> to explore the demos.
        </p>
      </section>
    </div>
  )
}
