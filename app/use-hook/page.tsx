'use client'

import { use, Suspense, useState } from 'react'
import Link from 'next/link'

// Simulate API call
function fetchData(id: number): Promise<{ id: number; title: string; content: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        title: `Post ${id}`,
        content: `This is the content for post ${id}. The use() hook allows us to read this promise directly in the component!`,
      })
    }, 1000)
  })
}

function Post({ postPromise }: { postPromise: Promise<any> }) {
  // use() hook unwraps the promise
  const post = use(postPromise)

  return (
    <div className="result">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <small>Post ID: {post.id}</small>
    </div>
  )
}

export default function UseHookDemo() {
  const [postId, setPostId] = useState(1)
  const [postPromise, setPostPromise] = useState(() => fetchData(1))

  const loadPost = (id: number) => {
    setPostId(id)
    setPostPromise(fetchData(id))
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>use() Hook Demo</h1>

      <div className="demo-section">
        <h2>What is the use() Hook?</h2>
        <p>
          The <code>use()</code> hook is a new React 19 feature that allows you to read the value of a Promise or Context
          directly inside your component. Unlike other hooks, <code>use()</code> can be called conditionally and in loops.
        </p>

        <h3>Key Features:</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Read promises directly without useState/useEffect</li>
          <li>Can be called conditionally (unlike other hooks)</li>
          <li>Works seamlessly with Suspense</li>
          <li>Can also read Context values</li>
          <li>Supports promise-based data fetching</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Interactive Demo</h2>
        <p>Click the buttons to load different posts. Notice how Suspense handles the loading state automatically!</p>

        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => loadPost(1)} disabled={postId === 1}>
            Load Post 1
          </button>
          <button onClick={() => loadPost(2)} disabled={postId === 2}>
            Load Post 2
          </button>
          <button onClick={() => loadPost(3)} disabled={postId === 3}>
            Load Post 3
          </button>
        </div>

        <Suspense fallback={<div className="result">Loading post...</div>}>
          <Post postPromise={postPromise} />
        </Suspense>
      </div>

      <div className="demo-section">
        <h2>Code Example</h2>
        <pre>
          <code>{`import { use, Suspense } from 'react'

function Post({ postPromise }) {
  // use() unwraps the promise
  const post = use(postPromise)
  
  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  )
}

function App() {
  const postPromise = fetchData(1)
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Post postPromise={postPromise} />
    </Suspense>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Benefits</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Simpler Code:</strong> No need for useState/useEffect boilerplate</li>
          <li><strong>Better Performance:</strong> Works naturally with Suspense for streaming</li>
          <li><strong>More Flexible:</strong> Can be called conditionally</li>
          <li><strong>Better Error Handling:</strong> Integrates with Error Boundaries</li>
        </ul>
      </div>
    </div>
  )
}
