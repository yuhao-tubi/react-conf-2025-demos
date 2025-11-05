import Link from 'next/link'
import { ServerActionForm } from './ServerActionForm'

export default function ServerActionsDemo() {
  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>Server Actions Demo</h1>

      <div className="demo-section">
        <h2>What are Server Actions?</h2>
        <p>
          Server Actions are asynchronous functions that run on the server and can be called from Client or Server Components.
          They provide a seamless way to handle form submissions and data mutations without building API routes.
        </p>

        <h3>Key Features:</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Run server-side code from client components</li>
          <li>Automatic request deduplication</li>
          <li>Integrated with forms using the <code>action</code> prop</li>
          <li>Progressive enhancement (works without JavaScript)</li>
          <li>Type-safe with TypeScript</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Interactive Demo</h2>
        <p>Try submitting the form below. The server action will process the data and return a response.</p>
        <ServerActionForm />
      </div>

      <div className="demo-section">
        <h2>Code Example</h2>
        <pre>
          <code>{`// Server Action (can be in a separate file)
'use server'

export async function submitForm(prevState, formData) {
  const name = formData.get('name')
  const email = formData.get('email')
  
  // Simulate processing
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Validation
  if (!name || !email) {
    return { error: 'Please fill all fields' }
  }
  
  return { 
    success: true, 
    message: \`Thanks \${name}! We'll contact you at \${email}\` 
  }
}

// Client Component
'use client'
import { useActionState } from 'react'

export function Form() {
  const [state, formAction] = useActionState(submitForm, null)
  
  return (
    <form action={formAction}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit">Submit</button>
      {state?.message && <p>{state.message}</p>}
    </form>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Benefits</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>No API Routes:</strong> Direct server-side execution</li>
          <li><strong>Type Safety:</strong> End-to-end TypeScript support</li>
          <li><strong>Progressive Enhancement:</strong> Works without JavaScript</li>
          <li><strong>Automatic Revalidation:</strong> Integrates with Next.js caching</li>
          <li><strong>Better DX:</strong> Simpler code, less boilerplate</li>
        </ul>
      </div>
    </div>
  )
}
