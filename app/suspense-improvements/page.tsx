'use client'

import { use, Suspense, useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ============================================================================
// DATA FETCHING UTILITIES
// ============================================================================

interface UserData {
  id: number
  name: string
  email: string
  role: string
}

interface PostData {
  id: number
  title: string
  excerpt: string
  likes: number
}

interface CommentData {
  id: number
  author: string
  text: string
  timestamp: string
}

function fetchUserProfile(): Promise<UserData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: 'Alex Johnson',
        email: 'alex@example.com',
        role: 'Senior Developer',
      })
    }, 1000)
  })
}

function fetchPosts(): Promise<PostData[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Understanding React 19', excerpt: 'Exploring new features...', likes: 42 },
        { id: 2, title: 'Suspense Deep Dive', excerpt: 'How Suspense works...', likes: 38 },
      ])
    }, 2000)
  })
}

function fetchComments(): Promise<CommentData[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, author: 'Sarah', text: 'Great article!', timestamp: '2 hours ago' },
        { id: 2, author: 'Mike', text: 'Very informative', timestamp: '3 hours ago' },
        { id: 3, author: 'Emma', text: 'Thanks for sharing', timestamp: '5 hours ago' },
      ])
    }, 3000)
  })
}

// ============================================================================
// TIMELINE VISUALIZATION
// ============================================================================

interface TimelineEvent {
  label: string
  timestamp: number
  color: string
  type: 'fallback' | 'fetch-start' | 'fetch-end'
  component?: string
}

function Timeline({ events, startTime }: { events: TimelineEvent[]; startTime: number }) {
  const maxTime = 3500 // 3.5 seconds timeline

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
      <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>Timeline</h4>
      <div style={{ position: 'relative', height: '200px', background: 'white', borderRadius: '4px', padding: '1rem' }}>
        {/* Time markers */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999' }}>
          <span>0s</span>
          <span>1s</span>
          <span>2s</span>
          <span>3s</span>
        </div>

        {/* Timeline track */}
        <div style={{ position: 'absolute', top: '30px', left: '0', right: '0', bottom: '10px' }}>
          {events.map((event, idx) => {
            const leftPercent = ((event.timestamp - startTime) / maxTime) * 100
            const isInstant = event.type === 'fallback' || event.type === 'fetch-start'
            
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: `${leftPercent}%`,
                  top: `${idx * 30}px`,
                  width: isInstant ? '3px' : 'auto',
                  height: '20px',
                  background: event.color,
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: isInstant ? '0' : '0 0.5rem',
                  fontSize: '0.75rem',
                  color: 'white',
                  whiteSpace: 'nowrap',
                }}
              >
                {!isInstant && event.label}
              </div>
            )
          })}
        </div>

        {/* Event labels below timeline */}
        <div style={{ position: 'absolute', bottom: '-40px', left: 0, right: 0, fontSize: '0.7rem' }}>
          {events.map((event, idx) => (
            <div key={idx} style={{ marginBottom: '0.25rem', color: '#666' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', background: event.color, borderRadius: '50%', marginRight: '0.5rem' }} />
              {event.label}: {((event.timestamp - startTime) / 1000).toFixed(2)}s
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// DATA COMPONENTS (for React 19 side)
// ============================================================================

function UserProfile({ userPromise }: { userPromise: Promise<UserData> }) {
  const user = use(userPromise)

  return (
    <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#1e40af' }}>👤 User Profile</h3>
      <div style={{ fontSize: '0.9rem' }}>
        <p style={{ margin: '0.25rem 0' }}><strong>Name:</strong> {user.name}</p>
        <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> {user.email}</p>
        <p style={{ margin: '0.25rem 0' }}><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  )
}

function Posts({ postsPromise }: { postsPromise: Promise<PostData[]> }) {
  const posts = use(postsPromise)

  return (
    <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#166534' }}>📝 Recent Posts</h3>
      {posts.map(post => (
        <div key={post.id} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
          <p style={{ margin: '0.25rem 0', fontWeight: 600 }}>{post.title}</p>
          <p style={{ margin: '0.25rem 0', color: '#666' }}>{post.excerpt}</p>
          <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#999' }}>❤️ {post.likes} likes</p>
        </div>
      ))}
    </div>
  )
}

function Comments({ commentsPromise }: { commentsPromise: Promise<CommentData[]> }) {
  const comments = use(commentsPromise)

  return (
    <div style={{ padding: '1rem', background: '#fef3f2', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#991b1b' }}>💬 Comments</h3>
      {comments.map(comment => (
        <div key={comment.id} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
          <p style={{ margin: '0.25rem 0', fontWeight: 600 }}>{comment.author}</p>
          <p style={{ margin: '0.25rem 0' }}>{comment.text}</p>
          <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#999' }}>{comment.timestamp}</p>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// REACT 18 SIMULATION
// ============================================================================

function React18Simulation({ resetKey }: { resetKey: number }) {
  const [showFallback, setShowFallback] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [postsData, setPostsData] = useState<PostData[] | null>(null)
  const [commentsData, setCommentsData] = useState<CommentData[] | null>(null)
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    // Reset everything
    setShowFallback(false)
    setUserData(null)
    setPostsData(null)
    setCommentsData(null)
    setEvents([])
    startTimeRef.current = Date.now()

    const startTime = Date.now()

    // In React 18, the fallback is delayed until all siblings are tried
    // We simulate this by delaying the fallback appearance
    const fallbackTimer = setTimeout(() => {
      setShowFallback(true)
      setEvents(prev => [...prev, {
        label: 'Fallback shown (delayed)',
        timestamp: Date.now(),
        color: '#f59e0b',
        type: 'fallback',
      }])
    }, 800) // React 18 delays showing fallback significantly

    // All data fetching starts together
    setEvents([
      { label: 'User fetch starts', timestamp: startTime, color: '#3b82f6', type: 'fetch-start', component: 'user' },
      { label: 'Posts fetch starts', timestamp: startTime + 10, color: '#10b981', type: 'fetch-start', component: 'posts' },
      { label: 'Comments fetch starts', timestamp: startTime + 20, color: '#ef4444', type: 'fetch-start', component: 'comments' },
    ])

    // Fetch data
    fetchUserProfile().then(data => {
      setUserData(data)
      setEvents(prev => [...prev, {
        label: 'User loaded',
        timestamp: Date.now(),
        color: '#3b82f6',
        type: 'fetch-end',
        component: 'user',
      }])
    })

    fetchPosts().then(data => {
      setPostsData(data)
      setEvents(prev => [...prev, {
        label: 'Posts loaded',
        timestamp: Date.now(),
        color: '#10b981',
        type: 'fetch-end',
        component: 'posts',
      }])
    })

    fetchComments().then(data => {
      setCommentsData(data)
      setEvents(prev => [...prev, {
        label: 'Comments loaded',
        timestamp: Date.now(),
        color: '#ef4444',
        type: 'fetch-end',
        component: 'comments',
      }])
      setShowFallback(false)
    })

    return () => clearTimeout(fallbackTimer)
  }, [resetKey])

  const isLoading = !userData || !postsData || !commentsData

  return (
    <div>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: '#dc2626' }}>React 18 Behavior (Simulated)</h3>
      <div style={{ minHeight: '300px', padding: '1rem', background: 'white', borderRadius: '8px', border: '2px solid #fee2e2' }}>
        {!showFallback && isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
            <div style={{ 
              padding: '3rem', 
              border: '2px dashed #e5e7eb', 
              borderRadius: '8px',
              background: '#fafafa'
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>⏱️ Blank screen...</p>
              <p style={{ fontSize: '0.9rem' }}>No loading indicator yet (React 18 is trying siblings first)</p>
            </div>
          </div>
        ) : showFallback && isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f4f6',
              borderTopColor: '#dc2626',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem',
            }} />
            <p>Loading content... (Fallback finally shown after delay)</p>
          </div>
        ) : !isLoading ? (
          <>
            {userData && (
              <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '8px', marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#1e40af' }}>👤 User Profile</h4>
                <div style={{ fontSize: '0.9rem' }}>
                  <p style={{ margin: '0.25rem 0' }}><strong>Name:</strong> {userData.name}</p>
                  <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> {userData.email}</p>
                  <p style={{ margin: '0.25rem 0' }}><strong>Role:</strong> {userData.role}</p>
                </div>
              </div>
            )}
            {postsData && (
              <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#166534' }}>📝 Recent Posts</h4>
                {postsData.map(post => (
                  <div key={post.id} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <p style={{ margin: '0.25rem 0', fontWeight: 600 }}>{post.title}</p>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>{post.excerpt}</p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#999' }}>❤️ {post.likes} likes</p>
                  </div>
                ))}
              </div>
            )}
            {commentsData && (
              <div style={{ padding: '1rem', background: '#fef3f2', borderRadius: '8px', marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#991b1b' }}>💬 Comments</h4>
                {commentsData.map(comment => (
                  <div key={comment.id} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <p style={{ margin: '0.25rem 0', fontWeight: 600 }}>{comment.author}</p>
                    <p style={{ margin: '0.25rem 0' }}>{comment.text}</p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#999' }}>{comment.timestamp}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
      <Timeline events={events} startTime={startTimeRef.current} />
    </div>
  )
}

// ============================================================================
// REACT 19 NATIVE SUSPENSE
// ============================================================================

function React19Demo({ resetKey }: { resetKey: number }) {
  const [userPromise, setUserPromise] = useState<Promise<UserData> | null>(null)
  const [postsPromise, setPostsPromise] = useState<Promise<PostData[]> | null>(null)
  const [commentsPromise, setCommentsPromise] = useState<Promise<CommentData[]> | null>(null)
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    // Reset
    setEvents([])
    startTimeRef.current = Date.now()

    const startTime = Date.now()

    // Record fallback shown immediately
    setTimeout(() => {
      setEvents(prev => [...prev, {
        label: 'Fallback shown (immediate)',
        timestamp: Date.now(),
        color: '#f59e0b',
        type: 'fallback',
      }])
    }, 10)

    // Create promises (React 19 pre-warms siblings)
    const userProm = fetchUserProfile()
    const postsProm = fetchPosts()
    const commentsProm = fetchComments()

    setUserPromise(userProm)
    setPostsPromise(postsProm)
    setCommentsPromise(commentsProm)

    // Track fetch starts
    setEvents([
      { label: 'User fetch starts', timestamp: startTime, color: '#3b82f6', type: 'fetch-start', component: 'user' },
      { label: 'Posts fetch starts (pre-warmed)', timestamp: startTime + 5, color: '#10b981', type: 'fetch-start', component: 'posts' },
      { label: 'Comments fetch starts (pre-warmed)', timestamp: startTime + 10, color: '#ef4444', type: 'fetch-start', component: 'comments' },
    ])

    // Track when data loads
    userProm.then(() => {
      setEvents(prev => [...prev, {
        label: 'User loaded',
        timestamp: Date.now(),
        color: '#3b82f6',
        type: 'fetch-end',
        component: 'user',
      }])
    })

    postsProm.then(() => {
      setEvents(prev => [...prev, {
        label: 'Posts loaded',
        timestamp: Date.now(),
        color: '#10b981',
        type: 'fetch-end',
        component: 'posts',
      }])
    })

    commentsProm.then(() => {
      setEvents(prev => [...prev, {
        label: 'Comments loaded',
        timestamp: Date.now(),
        color: '#ef4444',
        type: 'fetch-end',
        component: 'comments',
      }])
    })
  }, [resetKey])

  return (
    <div>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: '#16a34a' }}>React 19 Behavior (Actual)</h3>
      <div style={{ minHeight: '300px', padding: '1rem', background: 'white', borderRadius: '8px', border: '2px solid #dcfce7' }}>
        <Suspense fallback={
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f4f6',
              borderTopColor: '#16a34a',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem',
            }} />
            <p>Loading content... (Fallback shown immediately + pre-warming siblings)</p>
          </div>
        }>
          {userPromise && <UserProfile userPromise={userPromise} />}
          {postsPromise && <Posts postsPromise={postsPromise} />}
          {commentsPromise && <Comments commentsPromise={commentsPromise} />}
        </Suspense>
      </div>
      <Timeline events={events} startTime={startTimeRef.current} />
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SuspenseImprovementsDemo() {
  const [resetKey, setResetKey] = useState(0)

  const handleReset = () => {
    setResetKey(prev => prev + 1)
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>Suspense Improvements in React 19</h1>

      <div className="demo-section">
        <h2>What Changed?</h2>
        <p>
          React 19 significantly improves how Suspense handles loading states, providing better perceived performance
          and user experience compared to React 18.
        </p>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>React 18 Behavior</h3>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
            <li><strong>Delayed fallback:</strong> React 18 tried all sibling components before showing the loading UI</li>
            <li><strong>Better for data fetching:</strong> Optimized parallel data fetching</li>
            <li><strong>Worse for UX:</strong> Users saw a blank screen or stale content longer</li>
            <li><strong>Problem:</strong> Perceived as slow and unresponsive</li>
          </ul>
        </div>

        <div style={{ marginTop: '1rem', padding: '1rem', background: '#d1fae5', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>React 19 Improvements</h3>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
            <li><strong>Immediate fallback:</strong> Loading UI appears instantly when a component suspends</li>
            <li><strong>Pre-warming:</strong> React still starts data fetching for sibling components early</li>
            <li><strong>Better UX:</strong> Users see immediate feedback that something is happening</li>
            <li><strong>Balanced approach:</strong> Fast perceived performance + optimized data fetching</li>
          </ul>
        </div>

        <div style={{ marginTop: '1rem', padding: '1rem', background: '#eff6ff', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>📊 The Data</h3>
          <p>
            This improvement came from analyzing real-world usage and user feedback. The delayed fallback in React 18
            was optimized for data fetching performance, but users perceived the application as slow because they
            didn&apos;t see any loading indicators.
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            <strong>Reference:</strong>{' '}
            <a 
              href="https://github.com/facebook/react/issues/29898" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#0070f3' }}
            >
              GitHub Issue #29898
            </a>
          </p>
        </div>
      </div>

      <div className="demo-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Interactive Comparison</h2>
          <button 
            onClick={handleReset}
            style={{
              padding: '0.5rem 1rem',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            🔄 Reset Demo
          </button>
        </div>
        <p>
          Watch both behaviors side-by-side. <strong>Notice how React 18 shows a blank screen for ~800ms before displaying the spinner</strong>, 
          while React 19 shows the loading indicator immediately. Both versions start fetching data at the same time, but the UX is dramatically different!
        </p>
        <p style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '6px', fontSize: '0.9rem' }}>
          💡 <strong>Tip:</strong> Watch the left side (React 18) carefully - you&apos;ll see a blank screen message before the spinner appears!
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '2rem',
          marginTop: '2rem',
        }}>
          <React18Simulation resetKey={resetKey} />
          <React19Demo resetKey={resetKey} />
        </div>
      </div>

      <div className="demo-section">
        <h2>Key Takeaways</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--card-bg)', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, fontSize: '1rem', color: '#0070f3' }}>⚡ Immediate Feedback</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              React 19 shows loading indicators immediately, giving users instant feedback that their action is being processed.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'var(--card-bg)', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, fontSize: '1rem', color: '#0070f3' }}>🔥 Pre-warming</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              Sibling components start their data fetching early, maintaining the performance benefits of React 18&apos;s approach.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'var(--card-bg)', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, fontSize: '1rem', color: '#0070f3' }}>🎯 Better Perceived Performance</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              Even though total load time is similar, users feel the app is more responsive because they see feedback sooner.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

