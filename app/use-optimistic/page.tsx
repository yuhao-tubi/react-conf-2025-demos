'use client'

import { useOptimistic, useState, useTransition } from 'react'
import Link from 'next/link'

type Todo = {
  id: number
  text: string
  completed: boolean
}

// Simulate server action
async function updateTodoOnServer(id: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 2000))
}

export default function UseOptimisticDemo() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React 19', completed: false },
    { id: 2, text: 'Try useOptimistic', completed: false },
    { id: 3, text: 'Build awesome apps', completed: false },
  ])

  const [optimisticTodos, setOptimisticTodos] = useOptimistic(
    todos,
    (state, optimisticValue: { id: number; completed: boolean }) => {
      return state.map((todo) =>
        todo.id === optimisticValue.id
          ? { ...todo, completed: optimisticValue.completed }
          : todo
      )
    }
  )

  const [isPending, startTransition] = useTransition()

  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    // Optimistically update UI immediately
    setOptimisticTodos({ id, completed: !todo.completed })

    // Then update server (simulated)
    startTransition(async () => {
      try {
        await updateTodoOnServer(id)
        // Update actual state after server responds
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        )
      } catch (error) {
        // If it fails, the optimistic update will revert automatically
        console.error('Failed to update todo')
      }
    })
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>useOptimistic Hook Demo</h1>

      <div className="demo-section">
        <h2>What is useOptimistic?</h2>
        <p>
          The <code>useOptimistic</code> hook allows you to show a different state optimistically while an async action
          is in progress. It automatically reverts to the real state once the async action completes.
        </p>

        <h3>Key Features:</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Instant UI updates for better UX</li>
          <li>Automatic rollback on failure</li>
          <li>Works seamlessly with Server Actions</li>
          <li>Reduces perceived loading time</li>
          <li>Type-safe with TypeScript</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Interactive Demo</h2>
        <p>
          Click on any todo item to toggle its completion status. Notice how it updates instantly, 
          even though the "server update" takes 2 seconds!
        </p>

        {isPending && (
          <div style={{ padding: '0.5rem', background: 'rgba(0, 112, 243, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
            ⏳ Syncing with server...
          </div>
        )}

        <div style={{ maxWidth: '500px' }}>
          {optimisticTodos.map((todo) => (
            <div
              key={todo.id}
              onClick={() => toggleTodo(todo.id)}
              style={{
                padding: '1rem',
                margin: '0.5rem 0',
                background: 'var(--card-bg)',
                border: '2px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s',
                opacity: todo.completed ? 0.6 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => {}}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  flex: 1,
                }}
              >
                {todo.text}
              </span>
              {todo.completed && <span>✓</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="demo-section">
        <h2>Code Example</h2>
        <pre>
          <code>{`'use client'

import { useOptimistic, useTransition } from 'react'

export function TodoList({ todos, updateTodo }) {
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(
    todos,
    (state, optimisticValue) => {
      // Apply optimistic update
      return state.map(todo =>
        todo.id === optimisticValue.id
          ? { ...todo, completed: optimisticValue.completed }
          : todo
      )
    }
  )

  const [isPending, startTransition] = useTransition()

  const toggle = async (id) => {
    const todo = todos.find(t => t.id === id)
    
    // Optimistically update UI
    setOptimisticTodos({ 
      id, 
      completed: !todo.completed 
    })

    // Update server
    startTransition(async () => {
      await updateTodo(id, !todo.completed)
    })
  }

  return (
    <div>
      {optimisticTodos.map(todo => (
        <div key={todo.id} onClick={() => toggle(todo.id)}>
          {todo.text} - {todo.completed ? '✓' : '○'}
        </div>
      ))}
    </div>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Benefits</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Better UX:</strong> Instant feedback without waiting for server</li>
          <li><strong>Automatic Rollback:</strong> Reverts on error without manual code</li>
          <li><strong>Simple API:</strong> Easy to understand and implement</li>
          <li><strong>Works with Transitions:</strong> Integrates seamlessly with concurrent features</li>
        </ul>
      </div>
    </div>
  )
}
