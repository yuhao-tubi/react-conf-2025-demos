'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Adding...' : 'Add Todo'}
    </button>
  )
}

export default function FormActionsDemo() {
  const [todos, setTodos] = useActionState<string[]>(
    async (currentTodos: string[], formData: FormData) => {
      const todo = formData.get('todo') as string
      
      // Simulate server delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      if (!todo.trim()) {
        return currentTodos
      }
      
      return [...currentTodos, todo]
    },
    []
  )

  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>Form Actions Demo</h1>

      <div className="demo-section">
        <h2>What are Form Actions?</h2>
        <p>
          React 19 provides native support for form actions through the <code>action</code> prop.
          Actions can be synchronous or asynchronous functions that handle form submissions.
        </p>

        <h3>Key Features:</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Pass functions directly to the <code>action</code> prop</li>
          <li>Automatic pending state management</li>
          <li>Works with useActionState for state updates</li>
          <li>Progressive enhancement (works without JavaScript)</li>
          <li>Integrates with useFormStatus</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Interactive Demo</h2>
        <p>Add todos using the form below. The form action handles everything automatically!</p>

        <form
          action={setTodos}
          style={{
            display: 'flex',
            gap: '0.5rem',
            maxWidth: '500px',
            marginBottom: '2rem',
          }}
        >
          <input
            name="todo"
            type="text"
            placeholder="Enter a todo..."
            required
            style={{ flex: 1 }}
          />
          <SubmitButton />
        </form>

        <div>
          <h3>Todos ({todos.length}):</h3>
          {todos.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No todos yet. Add one above!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {todos.map((todo, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                  }}
                >
                  {todo}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="demo-section">
        <h2>Code Example - Basic Form Action</h2>
        <pre>
          <code>{`function MyForm() {
  async function handleSubmit(formData: FormData) {
    'use server' // Mark as server action in Server Components
    
    const name = formData.get('name')
    await saveToDatabase(name)
  }

  return (
    <form action={handleSubmit}>
      <input name="name" required />
      <button type="submit">Submit</button>
    </form>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Code Example - With useActionState</h2>
        <pre>
          <code>{`'use client'

import { useActionState } from 'react'

function TodoForm() {
  const [todos, addTodo] = useActionState(
    async (currentTodos, formData) => {
      const todo = formData.get('todo')
      
      // Optimistically update (instant UI feedback)
      const newTodos = [...currentTodos, todo]
      
      // Save to server
      await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ todo }),
      })
      
      return newTodos
    },
    [] // initial state
  )

  return (
    <form action={addTodo}>
      <input name="todo" />
      <button type="submit">Add</button>
      
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>{todo}</li>
        ))}
      </ul>
    </form>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Code Example - With Form Status</h2>
        <pre>
          <code>{`import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}

function MyForm() {
  async function handleSubmit(formData) {
    await processForm(formData)
  }

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" />
      <SubmitButton /> {/* Automatically knows form status */}
    </form>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Form Action Patterns</h2>

        <h3>1. Client-Side Action:</h3>
        <pre>
          <code>{`'use client'

function Form() {
  async function clientAction(formData: FormData) {
    // Runs on client
    const data = Object.fromEntries(formData)
    await fetch('/api/endpoint', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  return <form action={clientAction}>...</form>
}`}</code>
        </pre>

        <h3>2. Server Action:</h3>
        <pre>
          <code>{`// app/actions.ts
'use server'

export async function serverAction(formData: FormData) {
  // Runs on server - can access database directly
  const name = formData.get('name')
  await db.users.create({ name })
}

// app/form.tsx
import { serverAction } from './actions'

function Form() {
  return <form action={serverAction}>...</form>
}`}</code>
        </pre>

        <h3>3. With URL Action:</h3>
        <pre>
          <code>{`// Traditional form submission to URL
<form action="/api/submit" method="POST">
  <input name="email" />
  <button type="submit">Submit</button>
</form>`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Benefits</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Simpler Code:</strong> No need for onSubmit handlers and preventDefault</li>
          <li><strong>Progressive Enhancement:</strong> Works without JavaScript</li>
          <li><strong>Automatic Pending States:</strong> Built-in loading state management</li>
          <li><strong>Better UX:</strong> Seamless form submission experience</li>
          <li><strong>Type Safe:</strong> Full TypeScript support with Server Actions</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Form Validation</h2>
        <pre>
          <code>{`'use client'

import { useActionState } from 'react'

function Form() {
  const [state, formAction] = useActionState(
    async (prevState, formData) => {
      const email = formData.get('email')
      
      // Validation
      if (!email || !email.includes('@')) {
        return { error: 'Invalid email' }
      }
      
      // Process
      await submitEmail(email)
      return { success: true }
    },
    null
  )

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <button type="submit">Submit</button>
      {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
      {state?.success && <p style={{ color: 'green' }}>Success!</p>}
    </form>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Best Practices</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Use Server Actions for sensitive operations</li>
          <li>Always validate form data</li>
          <li>Provide feedback using useActionState</li>
          <li>Use useFormStatus for loading states</li>
          <li>Handle errors gracefully</li>
          <li>Consider progressive enhancement</li>
        </ul>
      </div>
    </div>
  )
}
