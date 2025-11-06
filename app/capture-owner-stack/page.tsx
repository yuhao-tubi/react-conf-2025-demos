'use client';

import { captureOwnerStack } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Deeply nested component that captures its owner stack
function DeepComponent() {
  const [stack, setStack] = useState<string | null>(null);
  
  useEffect(() => {
    setStack(captureOwnerStack());
  }, []);
  
  return (
    <div style={{ padding: '1rem', background: '#f3e8ff', borderRadius: '8px', border: '2px solid #a855f7', marginTop: '1rem' }}>
      <h4 style={{ marginBottom: '0.5rem', color: '#6b21a8' }}>DeepComponent Stack:</h4>
      <pre style={{ fontSize: '0.75rem', padding: '0.75rem', background: 'white', borderRadius: '4px', overflow: 'auto' }}>
        {stack || 'Loading...'}
      </pre>
    </div>
  );
}

// Middle component that also captures its stack
function MiddleComponent() {
  const [stack, setStack] = useState<string | null>(null);
  
  useEffect(() => {
    setStack(captureOwnerStack());
  }, []);
  
  return (
    <div style={{ padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '2px solid #3b82f6' }}>
      <h4 style={{ marginBottom: '0.5rem', color: '#1e40af' }}>MiddleComponent Stack:</h4>
      <pre style={{ fontSize: '0.75rem', padding: '0.75rem', background: 'white', borderRadius: '4px', overflow: 'auto' }}>
        {stack || 'Loading...'}
      </pre>
      <DeepComponent />
    </div>
  );
}

// Conditional component to demonstrate stack changes
function ConditionalComponent({ showChild }: { showChild: boolean }) {
  const [stack, setStack] = useState<string | null>(null);
  
  useEffect(() => {
    setStack(captureOwnerStack());
  }, []);
  
  return (
    <div style={{ padding: '1rem', background: '#dcfce7', borderRadius: '8px', border: '2px solid #22c55e' }}>
      <h4 style={{ marginBottom: '0.5rem', color: '#15803d' }}>ConditionalComponent Stack:</h4>
      <pre style={{ fontSize: '0.75rem', padding: '0.75rem', background: 'white', borderRadius: '4px', overflow: 'auto' }}>
        {stack || 'Loading...'}
      </pre>
      {showChild && (
        <div style={{ marginLeft: '1rem' }}>
          <DeepComponent />
        </div>
      )}
    </div>
  );
}

// Component that captures stack in an event handler
function InteractiveComponent() {
  const [clickStack, setClickStack] = useState<string | null>(null);
  
  const handleClick = () => {
    const stack = captureOwnerStack();
    setClickStack(stack);
  };
  
  return (
    <div style={{ padding: '1rem', background: '#fed7aa', borderRadius: '8px', border: '2px solid #f97316' }}>
      <h4 style={{ marginBottom: '0.75rem', color: '#9a3412' }}>Interactive Component</h4>
      <button onClick={handleClick}>
        Capture Stack on Click
      </button>
      {clickStack && (
        <div style={{ marginTop: '1rem' }}>
          <h4 style={{ marginBottom: '0.5rem', color: '#9a3412', fontSize: '0.9rem' }}>Stack captured in event handler:</h4>
          <pre style={{ fontSize: '0.75rem', padding: '0.75rem', background: 'white', borderRadius: '4px', overflow: 'auto' }}>
            {clickStack}
          </pre>
        </div>
      )}
    </div>
  );
}

// Array-rendered components to show stack in lists
function ListItem({ index }: { index: number }) {
  const [stack, setStack] = useState<string | null>(null);
  
  useEffect(() => {
    setStack(captureOwnerStack());
  }, []);
  
  return (
    <div style={{ padding: '0.75rem', background: '#fce7f3', borderRadius: '6px', border: '1px solid #ec4899', marginBottom: '0.75rem' }}>
      <h4 style={{ marginBottom: '0.5rem', color: '#9f1239', fontSize: '0.9rem' }}>List Item {index + 1}:</h4>
      <pre style={{ fontSize: '0.75rem', padding: '0.5rem', background: 'white', borderRadius: '4px', overflow: 'auto' }}>
        {stack || 'Loading...'}
      </pre>
    </div>
  );
}

function ListComponent() {
  const items = [0, 1, 2];
  
  return (
    <div style={{ padding: '1rem', background: '#fbcfe8', borderRadius: '8px', border: '2px solid #ec4899' }}>
      <h4 style={{ marginBottom: '1rem', color: '#9f1239' }}>List Component (Array Rendering)</h4>
      <div>
        {items.map((_, index) => (
          <ListItem key={index} index={index} />
        ))}
      </div>
    </div>
  );
}

export default function CaptureOwnerStackDemo() {
  const [showConditional, setShowConditional] = useState(true);
  const [rootStack, setRootStack] = useState<string | null>(null);
  
  useEffect(() => {
    setRootStack(captureOwnerStack());
  }, []);
  
  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <h1>captureOwnerStack() Demo</h1>

      <div className="demo-section">
        <h2>What is captureOwnerStack()?</h2>
        <p>
          React 19's <code>captureOwnerStack()</code> captures the component ownership stack at the point where it's called. 
          This is useful for debugging, error tracking, and understanding component hierarchies.
        </p>

        <div style={{ background: '#fef3c7', borderLeft: '4px solid #f59e0b', padding: '1rem', borderRadius: '4px', margin: '1rem 0' }}>
          <p style={{ margin: 0 }}>
            <strong>Note:</strong> The owner stack shows the chain of components that created/rendered the current component, 
            not the parent-child DOM hierarchy. This helps track where components originate from in your code.
          </p>
        </div>

        <h3>Root Component Stack:</h3>
        <pre style={{ fontSize: '0.875rem' }}>
          {rootStack || 'Loading...'}
        </pre>
      </div>

      <div className="demo-section">
        <h2>Nested Component Stacks</h2>
        <p>Notice how the stack grows deeper as components nest:</p>
        <MiddleComponent />
      </div>

      <div className="demo-section">
        <h2>Conditional Rendering</h2>
        <p>Toggle to see how conditional rendering affects the stack:</p>
        <button
          onClick={() => setShowConditional(!showConditional)}
          style={{ marginBottom: '1rem' }}
        >
          {showConditional ? 'Hide' : 'Show'} Child Component
        </button>
        {showConditional && <ConditionalComponent showChild={showConditional} />}
      </div>

      <div className="demo-section">
        <h2>Capturing Stack in Event Handlers</h2>
        <p>The stack can be captured at any time, including in event handlers:</p>
        <InteractiveComponent />
      </div>

      <div className="demo-section">
        <h2>Stack in Array-Rendered Components</h2>
        <p>Each item in the list shows the same owner stack since they're all created by the same component:</p>
        <ListComponent />
      </div>

      <div className="demo-section">
        <h2>Common Use Cases</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>
            <strong>🐛 Enhanced Error Reporting:</strong> Include owner stack in error logs to understand where components were created
          </li>
          <li>
            <strong>📊 Performance Tracking:</strong> Track which component hierarchies cause renders or performance issues
          </li>
          <li>
            <strong>🔍 Debugging Complex Apps:</strong> Understand component ownership in apps with HOCs, render props, or complex composition
          </li>
          <li>
            <strong>📝 Analytics & Telemetry:</strong> Add contextual information to analytics events showing where user interactions originated
          </li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Key Features</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Captures the component ownership hierarchy at any point</li>
          <li>Returns a string representation of the stack trace</li>
          <li>Useful for debugging and error tracking</li>
          <li>Can be called from any component or event handler</li>
          <li>Helps understand complex component compositions</li>
        </ul>
      </div>
    </div>
  );
}

