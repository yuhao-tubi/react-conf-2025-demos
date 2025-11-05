# Development Guide

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Basic knowledge of React and Next.js

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
react-19-demos/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page / Demo index
│   ├── globals.css            # Global styles
│   │
│   ├── use-hook/              # Demo: use() hook
│   │   └── page.tsx
│   │
│   ├── server-actions/        # Demo: Server Actions
│   │   ├── page.tsx
│   │   ├── ServerActionForm.tsx
│   │   └── actions.ts
│   │
│   ├── use-optimistic/        # Demo: useOptimistic
│   │   └── page.tsx
│   │
│   ├── use-form-status/       # Demo: useFormStatus
│   │   └── page.tsx
│   │
│   ├── metadata/              # Demo: Document Metadata
│   │   └── page.tsx
│   │
│   ├── ref-as-prop/           # Demo: Ref as Prop
│   │   └── page.tsx
│   │
│   ├── context-provider/      # Demo: Context as Provider
│   │   └── page.tsx
│   │
│   ├── asset-loading/         # Demo: Asset Loading
│   │   └── page.tsx
│   │
│   ├── react-compiler/        # Demo: React Compiler
│   │   └── page.tsx
│   │
│   ├── form-actions/          # Demo: Form Actions
│   │   └── page.tsx
│   │
│   ├── async-transitions/     # Demo: Async Transitions
│   │   └── page.tsx
│   │
│   └── error-handling/        # Demo: Error Handling
│       └── page.tsx
│
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies
├── README.md                  # Project documentation
├── FEATURES.md                # Feature quick reference
└── DEVELOPMENT.md            # This file
```

## Adding a New Demo

### 1. Create Demo Directory

```bash
mkdir app/my-feature
```

### 2. Create Page Component

```tsx
// app/my-feature/page.tsx
'use client' // If using client-side features

import Link from 'next/link'

export default function MyFeatureDemo() {
  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>My Feature Demo</h1>

      <div className="demo-section">
        <h2>What is My Feature?</h2>
        <p>Description of the feature...</p>
      </div>

      <div className="demo-section">
        <h2>Interactive Demo</h2>
        {/* Your interactive demo */}
      </div>

      <div className="demo-section">
        <h2>Code Example</h2>
        <pre>
          <code>{`// Your code example`}</code>
        </pre>
      </div>
    </div>
  )
}
```

### 3. Add to Home Page

```tsx
// app/page.tsx
const demos = [
  // ... existing demos
  {
    title: 'My Feature',
    description: 'Description of my feature',
    href: '/my-feature',
    tags: ['React 19', 'Category'],
  },
]
```

## Styling Guidelines

### Using CSS Classes

The project includes predefined CSS classes in `globals.css`:

```tsx
// Container for page content
<div className="container">

// Card component
<div className="card">

// Demo section
<div className="demo-section">

// Badge/tag
<span className="badge">

// Result display
<div className="result">

// Success message
<div className="success">

// Error message
<div className="error">

// Loading indicator
<span className="loading">

// Grid layout
<div className="grid">
```

### Custom Styles

Use inline styles for component-specific styling:

```tsx
<div style={{ 
  padding: '1rem', 
  background: 'var(--card-bg)',
  borderRadius: '8px' 
}}>
```

### CSS Variables

Available CSS variables:

```css
--primary: #0070f3
--primary-dark: #0051cc
--secondary: #7928ca
--background: #ffffff
--foreground: #000000
--card-bg: #f9fafb
--border: #e5e7eb
--code-bg: #f4f4f5
--success: #10b981
--warning: #f59e0b
--error: #ef4444
```

## React Compiler

### Enabling/Disabling

Edit `next.config.js`:

```javascript
module.exports = {
  experimental: {
    reactCompiler: true, // or false
  },
}
```

### Compilation Modes

```javascript
module.exports = {
  experimental: {
    reactCompiler: {
      compilationMode: 'all', // Compile all components
      // OR
      compilationMode: 'annotation', // Only components with 'use memo'
    },
  },
}
```

### Opting Out of Compilation

```tsx
function MyComponent() {
  'use no memo'
  // This component won't be compiled
}
```

## Server vs Client Components

### Server Component (default)

```tsx
// No directive needed
// Runs on server, no client-side JS

export default function ServerComponent() {
  return <div>Server Component</div>
}
```

### Client Component

```tsx
'use client' // Required at top

import { useState } from 'react'

export default function ClientComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### Server Actions

```tsx
// actions.ts
'use server'

export async function myAction(formData: FormData) {
  // Server-side code
  await db.insert(...)
}

// component.tsx
'use client'

import { myAction } from './actions'

export function MyForm() {
  return <form action={myAction}>...</form>
}
```

## TypeScript Tips

### Type Safety with Forms

```tsx
async function handleSubmit(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  // ...
}
```

### Component Props

```tsx
interface Props {
  title: string
  items: string[]
  onSelect?: (item: string) => void
}

export function MyComponent({ title, items, onSelect }: Props) {
  // ...
}
```

### Server Action Types

```tsx
type ActionState = {
  success?: boolean
  error?: string
  data?: any
}

async function myAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  // ...
}
```

## Common Patterns

### Loading States

```tsx
import { Suspense } from 'react'

<Suspense fallback={<div>Loading...</div>}>
  <AsyncComponent />
</Suspense>
```

### Error Boundaries

```tsx
import { ErrorBoundary } from './ErrorBoundary'

<ErrorBoundary fallback={<div>Error occurred</div>}>
  <MyComponent />
</ErrorBoundary>
```

### Optimistic Updates

```tsx
import { useOptimistic } from 'react'

const [optimisticData, updateOptimistic] = useOptimistic(
  data,
  (state, newItem) => [...state, newItem]
)
```

### Form Actions

```tsx
import { useActionState } from 'react'

const [state, formAction, isPending] = useActionState(
  async (prevState, formData) => {
    // Process form
    return { success: true }
  },
  null
)

<form action={formAction}>
  <button disabled={isPending}>Submit</button>
</form>
```

## Debugging

### React DevTools

Install [React DevTools](https://react.dev/learn/react-developer-tools) browser extension.

### Console Logging

```tsx
console.log('Component rendered', { props, state })
```

### Error Logging

```tsx
try {
  await riskyOperation()
} catch (error) {
  console.error('Error:', error)
  // Report to error service
}
```

### Server Action Debugging

Server actions log to the terminal running `npm run dev`, not the browser console.

## Building for Production

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Check Build Output

```bash
# After build, check:
.next/
├── server/
└── static/
```

## Environment Variables

Create `.env.local` for local development:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://...
```

Usage:

```tsx
// Client-side (must start with NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// Server-side (any name)
const dbUrl = process.env.DATABASE_URL
```

## Testing

### Testing Components

```tsx
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

test('renders component', () => {
  render(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

### Testing Server Actions

```tsx
import { myAction } from './actions'

test('server action works', async () => {
  const formData = new FormData()
  formData.set('name', 'Test')
  
  const result = await myAction(null, formData)
  expect(result.success).toBe(true)
})
```

## Performance Optimization

### React Compiler

Let the compiler handle optimization automatically!

### Code Splitting

```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
})
```

### Image Optimization

```tsx
import Image from 'next/image'

<Image
  src="/photo.jpg"
  alt="Photo"
  width={500}
  height={300}
/>
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

The project is a standard Next.js app and can be deployed to:
- Vercel
- Netlify
- AWS
- Google Cloud
- Any Node.js hosting

## Troubleshooting

### React Compiler Errors

If you see compiler errors:

1. Disable compiler in `next.config.js`
2. Identify problematic component
3. Add `'use no memo'` to that component

### Type Errors

```bash
# Check types
npx tsc --noEmit
```

### Build Errors

```bash
# Clean build
rm -rf .next
npm run build
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Compiler Docs](https://react.dev/learn/react-compiler)

## Contributing

Feel free to:
- Add new demos
- Improve existing demos
- Fix bugs
- Improve documentation
- Share feedback

---

Happy coding! 🚀
