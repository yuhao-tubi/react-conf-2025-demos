# React 19.2 Features Quick Reference

## 🎣 Hooks

### use()
Read promises and context values in components.

```tsx
import { use } from 'react'

function Component({ dataPromise }) {
  const data = use(dataPromise)
  return <div>{data.title}</div>
}

// Or with Context
function Component() {
  const theme = use(ThemeContext)
  return <div>{theme}</div>
}
```

**Key Points:**
- Can be called conditionally (unlike other hooks)
- Works with Suspense
- Replaces useContext for context values

---

### useOptimistic
Show optimistic state while async action is pending.

```tsx
import { useOptimistic } from 'react'

function TodoList({ todos }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, newTodo]
  )

  async function addTodo(formData) {
    addOptimisticTodo({ id: Math.random(), text: formData.get('text') })
    await saveTodo(formData)
  }

  return (
    <form action={addTodo}>
      {/* ... */}
    </form>
  )
}
```

**Key Points:**
- Instant UI updates
- Automatic rollback on error
- Great for optimistic UX

---

### useFormStatus
Access form submission status from child components.

```tsx
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus()
  
  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}

// Must be used inside a form
function MyForm() {
  return (
    <form action={handleSubmit}>
      <input name="email" />
      <SubmitButton />
    </form>
  )
}
```

**Key Points:**
- No prop drilling needed
- Works with form actions
- Must be used inside a form

---

### useActionState
Manage form state with actions.

```tsx
import { useActionState } from 'react'

function Form() {
  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await submitData(formData)
      return result
    },
    null // initial state
  )

  return (
    <form action={formAction}>
      <input name="name" />
      <button disabled={isPending}>Submit</button>
      {state?.error && <p>{state.error}</p>}
    </form>
  )
}
```

**Key Points:**
- Combines state and form actions
- Automatic pending state
- Previous state available

---

### useTransition (Enhanced)
Now supports async functions!

```tsx
import { useTransition } from 'react'

function SearchBox() {
  const [isPending, startTransition] = useTransition()
  const [results, setResults] = useState([])

  const search = (query) => {
    startTransition(async () => {
      const data = await fetch(`/api/search?q=${query}`)
      const results = await data.json()
      setResults(results)
    })
  }

  return (
    <div>
      <input onChange={(e) => search(e.target.value)} />
      {isPending && <Spinner />}
      <Results items={results} />
    </div>
  )
}
```

**Key Points:**
- Now supports async callbacks
- Keeps UI responsive
- Shows old content while loading new

---

### useEffectEvent (Experimental)
Extract non-reactive logic from Effects to read latest values without re-triggering.

```tsx
import { useEffect, useEffectEvent } from 'react'

function Page({ url }) {
  const { items } = useContext(ShoppingCartContext)
  const numberOfItems = items.length

  // Extract non-reactive logic into an Effect Event
  const onVisit = useEffectEvent((visitedUrl) => {
    logVisit(visitedUrl, numberOfItems)  // Always reads latest numberOfItems
  })

  useEffect(() => {
    onVisit(url)
  }, [url])  // Only re-runs when url changes, not numberOfItems!

  // ...
}
```

**Key Points:**
- Read latest props/state without re-triggering the Effect
- Avoid stale closures in Effects
- Effect dependency array only includes truly reactive values
- Only call inside Effects (useEffect, useLayoutEffect, useInsertionEffect)
- Don't use as a dependency shortcut - use for truly non-reactive logic

**Common Use Cases:**
- Analytics/logging with current state
- WebSocket callbacks needing fresh values
- Notifications with current settings
- Event handlers in Effects that need latest props

**Availability:** Experimental feature - not yet in stable React release

---

## 🎬 Server Actions

Functions that run on the server, callable from client or server components.

```tsx
// actions.ts
'use server'

export async function createUser(formData: FormData) {
  const name = formData.get('name')
  await db.users.create({ name })
  revalidatePath('/users')
}

// Component
'use client'

import { createUser } from './actions'

export function Form() {
  return (
    <form action={createUser}>
      <input name="name" />
      <button>Create User</button>
    </form>
  )
}
```

**Key Points:**
- No API routes needed
- Type-safe with TypeScript
- Progressive enhancement
- Automatic request deduplication

---

## 📄 Document Metadata

Render metadata tags directly in components.

```tsx
function BlogPost({ post }) {
  return (
    <article>
      {/* These are automatically hoisted to <head> */}
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <link rel="canonical" href={post.url} />
      
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

**Key Points:**
- Automatic hoisting to `<head>`
- Works in Client and Server Components
- Better than external libraries

---

## 🔗 Ref as Prop

No more forwardRef!

```tsx
// React 19 - Simple!
function CustomInput({ ref, ...props }) {
  return <input ref={ref} {...props} />
}

// Usage
function Parent() {
  const inputRef = useRef(null)
  return <CustomInput ref={inputRef} />
}
```

**Key Points:**
- No forwardRef wrapper needed
- Simpler TypeScript types
- Backward compatible

---

## 🎨 Context as Provider

Use Context directly as a provider.

```tsx
import { createContext, use } from 'react'

const ThemeContext = createContext('light')

function App() {
  return (
    // New way - no .Provider needed
    <ThemeContext value="dark">
      <MyComponent />
    </ThemeContext>
  )
}

function MyComponent() {
  // Use the use() hook instead of useContext
  const theme = use(ThemeContext)
  return <div>Theme: {theme}</div>
}
```

**Key Points:**
- Cleaner API
- Works with use() hook
- Context.Provider still works

---

## 📦 Asset Loading

Better control over resource loading.

```tsx
import { preload, prefetch } from 'react-dom'

// Preload resources
function Component() {
  preload('/fonts/my-font.woff2', { 
    as: 'font',
    type: 'font/woff2' 
  })
  
  return (
    <div>
      {/* Control stylesheet precedence */}
      <link rel="stylesheet" href="/critical.css" precedence="high" />
      <link rel="stylesheet" href="/theme.css" precedence="low" />
      
      {/* Load scripts with callbacks */}
      <script 
        src="/analytics.js" 
        async
        onLoad={() => console.log('Loaded!')}
      />
    </div>
  )
}
```

**Key Points:**
- Preload critical resources
- Control loading order
- Works with Suspense

---

## 📝 Form Actions

Built-in form action handling.

```tsx
function Form() {
  async function handleSubmit(formData: FormData) {
    const data = Object.fromEntries(formData)
    await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  return (
    <form action={handleSubmit}>
      <input name="email" required />
      <button type="submit">Submit</button>
    </form>
  )
}
```

**Key Points:**
- No onSubmit handlers needed
- Automatic FormData creation
- Progressive enhancement

---

## ⚠️ Error Handling

Enhanced error boundaries.

```tsx
import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo)
  }

  render() {
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>
    }
    return this.props.children
  }
}

// Usage
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

**Key Points:**
- Better error messages
- Integration with Suspense
- Server Action error handling

---

## 🎬 View Transitions API

Create smooth animations between UI states.

```tsx
function withViewTransition(updateFn: () => void) {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      updateFn()
    })
  } else {
    updateFn()
  }
}

// Usage
function Component() {
  const [view, setView] = useState('grid')
  
  const toggleView = () => {
    withViewTransition(() => {
      setView(view === 'grid' ? 'list' : 'grid')
    })
  }
  
  return (
    <div>
      <button onClick={toggleView}>Toggle View</button>
      <div style={{ viewTransitionName: 'main-content' }}>
        {/* Content morphs smoothly */}
      </div>
    </div>
  )
}
```

**Key Points:**
- Native browser API for smooth transitions
- Works with React state updates
- Automatic element morphing
- Use `viewTransitionName` for targeted animations
- Graceful fallback for unsupported browsers

---

## 🎯 &lt;Activity /&gt; Component

**React 19.2** - Controlled rendering with visible/hidden modes.

The Activity component lets you break your app into "activities" that can be controlled and prioritized. It's an alternative to conditional rendering that provides better performance and state management.

```tsx
import { Activity } from 'react'

// Before: Loses state when toggled
{isVisible && <Page />}

// After: Preserves state when hidden
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>

// Tabs with state preservation
function TabView() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <>
      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <HomeTab />
      </Activity>
      
      <Activity mode={activeTab === 'profile' ? 'visible' : 'hidden'}>
        <ProfileTab />
      </Activity>
    </>
  )
}

// Pre-render next page for instant navigation
function Wizard() {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <>
      {/* Current step */}
      <Activity mode={currentStep === 1 ? 'visible' : 'hidden'}>
        <Step1 />
      </Activity>
      
      {/* Pre-render next step in background */}
      {currentStep === 1 && (
        <Activity mode="hidden">
          <Step2 />
        </Activity>
      )}
    </>
  )
}
```

**Key Features:**
- **visible mode:** Shows children, mounts effects, processes updates normally
- **hidden mode:** Hides children, unmounts effects, defers updates until React is idle
- **State preservation:** Keep component state when switching between modes
- **Performance:** Pre-render hidden content without impacting visible UI
- **Use cases:** Tabs, wizards, pre-loading, back navigation with state

**Benefits:**
- ⚡ Instant navigation by pre-rendering likely next routes
- 💾 Preserve form inputs and scroll position when switching views
- 🎯 Hidden activities defer updates until React is idle
- 📦 Load images, data, and CSS in background without blocking UI

---

## 🔧 React Compiler

Automatic memoization at build time.

### Before (Manual):
```tsx
import { useMemo, useCallback, memo } from 'react'

const List = memo(({ items, filter }) => {
  const filtered = useMemo(
    () => items.filter(item => item.includes(filter)),
    [items, filter]
  )
  
  const handleClick = useCallback((item) => {
    console.log(item)
  }, [])
  
  return filtered.map(item => 
    <div onClick={() => handleClick(item)}>{item}</div>
  )
})
```

### After (Automatic):
```tsx
// React Compiler does this automatically!
function List({ items, filter }) {
  const filtered = items.filter(item => item.includes(filter))
  
  const handleClick = (item) => {
    console.log(item)
  }
  
  return filtered.map(item => 
    <div onClick={() => handleClick(item)}>{item}</div>
  )
}
```

**Configuration:**
```js
// next.config.js
module.exports = {
  experimental: {
    reactCompiler: true
  }
}
```

**Key Points:**
- No manual optimization needed
- Smaller bundle sizes
- Better performance by default
- Zero runtime cost

---

## 🚀 Partial Pre-rendering (React 19.2)

Pre-render static parts of your app and resume rendering dynamic parts later.

### Pre-render Phase (Build Time)
```tsx
import { prerender } from 'react-dom/static'

const controller = new AbortController()

const { prelude, postponed } = await prerender(<App />, {
  signal: controller.signal,
})

// Save the postponed state for later
await savePostponedState(postponed)

// Send prelude to CDN
```

### Resume Phase (Runtime)
```tsx
import { resume } from 'react-dom/server'

// Get the postponed state from Phase 1
const postponed = await getPostponedState(request)

// Resume rendering to fill in dynamic content
const resumeStream = await resume(<App />, postponed)

// Send stream to client
```

### Resume and Pre-render for SSG
```tsx
import { resumeAndPrerender } from 'react-dom/static'

const postponedState = await getPostponedState(request)

const { prelude } = await resumeAndPrerender(
  <App />, 
  postponedState
)

// Send complete HTML to CDN
```

**Key Points:**
- Static shell served instantly from CDN
- Dynamic content loaded progressively
- Better Core Web Vitals (LCP, FCP)
- Reduced server load
- Works with Suspense boundaries
- Supports View Transitions for smooth reveals

**Use Cases:**
- E-commerce product pages (pre-render layout, resume for pricing/inventory)
- News/blog sites (pre-render content, resume for comments/personalization)
- Dashboards (pre-render shell, resume for real-time data)
- Profile pages (pre-render layout, resume for user data)

**Node.js APIs:**
- `resumeToPipeableStream()` - Resume to Node.js stream
- `resumeAndPrerenderToNodeStream()` - Resume to Node.js stream for SSG

---

## 🎯 Best Practices

1. **Use Server Actions** for data mutations
2. **Use useOptimistic** for instant feedback
3. **Use useTransition** for non-urgent updates
4. **Use Error Boundaries** at appropriate levels
5. **Enable React Compiler** for automatic optimization
6. **Use the use() hook** instead of useContext
7. **Preload critical resources** for better performance
8. **Use Form Actions** for simpler forms

---

## 🚀 Migration Tips

### From React 18:

1. **forwardRef** → Just use ref as a prop
2. **Context.Provider** → Use Context directly
3. **useContext** → Use the use() hook
4. **Manual memoization** → Let React Compiler handle it
5. **API routes** → Use Server Actions
6. **react-helmet** → Use native metadata support

### Gradual Adoption:

- All React 18 patterns still work
- Migrate incrementally
- No breaking changes
- Mix old and new approaches

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [React Compiler Docs](https://react.dev/learn/react-compiler)
- [Next.js Documentation](https://nextjs.org/docs)
- [Server Actions Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
