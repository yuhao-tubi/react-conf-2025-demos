'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function MetadataDemo() {
  const [showMetadata, setShowMetadata] = useState(false)

  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>Document Metadata Demo</h1>

      <div className="demo-section">
        <h2>What is Document Metadata?</h2>
        <p>
          React 19 now supports rendering <code>&lt;title&gt;</code>, <code>&lt;meta&gt;</code>, and{' '}
          <code>&lt;link&gt;</code> tags directly inside components. These tags are automatically hoisted
          to the document <code>&lt;head&gt;</code>.
        </p>

        <h3>Key Features:</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Render metadata tags directly in components</li>
          <li>Automatic hoisting to document head</li>
          <li>Works in both Client and Server Components</li>
          <li>Better SEO management</li>
          <li>Simpler than previous solutions</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Interactive Demo</h2>
        <p>Click the button to toggle metadata rendering. Check the browser tab and view source!</p>

        <button onClick={() => setShowMetadata(!showMetadata)}>
          {showMetadata ? 'Hide Metadata' : 'Show Metadata'}
        </button>

        {showMetadata && (
          <>
            <title>Custom Page Title - React 19 Demo</title>
            <meta name="description" content="This is a dynamic description set by React 19!" />
            <meta property="og:title" content="React 19 Metadata Demo" />
            <meta property="og:description" content="Learn about native metadata support in React 19" />
            <link rel="canonical" href="https://example.com/metadata-demo" />

            <div className="success" style={{ marginTop: '1rem' }}>
              ✓ Metadata tags have been rendered! Check your browser tab title and view the page source.
            </div>
          </>
        )}
      </div>

      <div className="demo-section">
        <h2>Code Example - Basic Usage</h2>
        <pre>
          <code>{`function BlogPost({ post }) {
  return (
    <article>
      {/* These tags are automatically moved to <head> */}
      <title>{post.title} - My Blog</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <meta property="og:image" content={post.image} />
      <link rel="canonical" href={\`https://myblog.com/posts/\${post.slug}\`} />
      
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Code Example - With Next.js Metadata API</h2>
        <p>Next.js 15 provides an even better metadata API for Server Components:</p>
        <pre>
          <code>{`// app/blog/[slug]/page.tsx
import { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPost(params.slug)
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  }
}

// The page component
export default async function BlogPost({ params }: Props) {
  const post = await fetchPost(params.slug)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Supported Tags</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="card">
            <h4>&lt;title&gt;</h4>
            <p>Set the document title</p>
            <code>{`<title>My Page Title</title>`}</code>
          </div>

          <div className="card">
            <h4>&lt;meta&gt;</h4>
            <p>Define metadata like description, keywords, Open Graph tags</p>
            <code>{`<meta name="description" content="..." />`}</code>
          </div>

          <div className="card">
            <h4>&lt;link&gt;</h4>
            <p>Link to external resources like stylesheets, canonical URLs</p>
            <code>{`<link rel="canonical" href="..." />`}</code>
          </div>

          <div className="card">
            <h4>&lt;style&gt;</h4>
            <p>Inline styles (though CSS-in-JS is recommended)</p>
            <code>{`<style>{\`body { color: red; }\`}</style>`}</code>
          </div>

          <div className="card">
            <h4>&lt;script&gt;</h4>
            <p>Include scripts (with async/defer support)</p>
            <code>{`<script src="..." async />`}</code>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Benefits</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Better SEO:</strong> Easy to manage meta tags for search engines</li>
          <li><strong>Colocation:</strong> Keep metadata with the component that needs it</li>
          <li><strong>Dynamic Updates:</strong> Change metadata based on component state</li>
          <li><strong>No Libraries Needed:</strong> Native React feature, no helmet or other libs</li>
          <li><strong>SSR Compatible:</strong> Works perfectly with server-side rendering</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Priority Rules</h2>
        <p>When multiple components render the same metadata tag:</p>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>The last rendered tag wins for unique tags like <code>&lt;title&gt;</code></li>
          <li>Tags with the same key prop are deduplicated</li>
          <li>Child component metadata overrides parent metadata</li>
        </ul>
      </div>
    </div>
  )
}
