'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'

// Old way (React 18) - needed forwardRef
// const OldInput = forwardRef((props, ref) => {
//   return <input ref={ref} {...props} />
// })

// New way (React 19) - ref is just a prop!
function NewInput({ ref, ...props }: any) {
  return <input ref={ref} {...props} style={{ padding: '0.75rem', width: '100%' }} />
}

// Works with TypeScript too
interface CustomButtonProps {
  ref?: React.Ref<HTMLButtonElement>
  children: React.ReactNode
  onClick?: () => void
}

function CustomButton({ ref, children, onClick }: CustomButtonProps) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      style={{
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

export default function RefAsPropDemo() {
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [message, setMessage] = useState('')

  const focusInput = () => {
    inputRef.current?.focus()
    setMessage('Input focused!')
  }

  const getButtonInfo = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMessage(`Button is ${rect.width}px wide and ${rect.height}px tall`)
    }
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>Ref as Prop Demo</h1>

      <div className="demo-section">
        <h2>What is Ref as Prop?</h2>
        <p>
          In React 19, you can now pass <code>ref</code> as a regular prop to function components without
          using <code>forwardRef</code>. This simplifies component APIs and reduces boilerplate.
        </p>

        <h3>Key Features:</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>No more <code>forwardRef</code> wrapper needed</li>
          <li>Treat <code>ref</code> like any other prop</li>
          <li>Cleaner component definitions</li>
          <li>Better TypeScript support</li>
          <li>Fully backward compatible</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Interactive Demo</h2>
        <p>
          These custom components accept <code>ref</code> as a regular prop without using <code>forwardRef</code>:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', marginTop: '1rem' }}>
          <NewInput ref={inputRef} placeholder="Type something..." />

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={focusInput}>Focus Input</button>
            <CustomButton ref={buttonRef} onClick={getButtonInfo}>
              Get Button Info
            </CustomButton>
          </div>

          {message && (
            <div className="result">
              <strong>Result:</strong> {message}
            </div>
          )}
        </div>
      </div>

      <div className="demo-section">
        <h2>Code Comparison</h2>

        <h3>React 18 (Old Way):</h3>
        <pre>
          <code>{`import { forwardRef } from 'react'

// Had to wrap with forwardRef
const CustomInput = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />
})

// TypeScript was more complex
const CustomButton = forwardRef<
  HTMLButtonElement,
  { children: React.ReactNode }
>((props, ref) => {
  return <button ref={ref}>{props.children}</button>
})`}</code>
        </pre>

        <h3>React 19 (New Way):</h3>
        <pre>
          <code>{`// ref is just a regular prop now!
function CustomInput({ ref, ...props }) {
  return <input ref={ref} {...props} />
}

// TypeScript is simpler
interface CustomButtonProps {
  ref?: React.Ref<HTMLButtonElement>
  children: React.ReactNode
}

function CustomButton({ ref, children }: CustomButtonProps) {
  return <button ref={ref}>{children}</button>
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Usage Example</h2>
        <pre>
          <code>{`function ParentComponent() {
  const inputRef = useRef(null)
  
  const focus = () => {
    inputRef.current?.focus()
  }
  
  return (
    <div>
      {/* Just pass ref like any other prop */}
      <CustomInput ref={inputRef} />
      <button onClick={focus}>Focus</button>
    </div>
  )
}`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h2>Backward Compatibility</h2>
        <p>
          Don't worry! Components using <code>forwardRef</code> still work perfectly in React 19.
          You can migrate gradually:
        </p>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Existing <code>forwardRef</code> components continue to work</li>
          <li>New components can use ref as a prop directly</li>
          <li>Mix and match both approaches in the same codebase</li>
          <li>No breaking changes</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Benefits</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Less Boilerplate:</strong> No need for forwardRef wrapper</li>
          <li><strong>Simpler Code:</strong> Refs work like regular props</li>
          <li><strong>Better DX:</strong> Easier to understand and write</li>
          <li><strong>Better TypeScript:</strong> Simpler type definitions</li>
          <li><strong>Consistent API:</strong> All props (including ref) work the same way</li>
        </ul>
      </div>
    </div>
  )
}
