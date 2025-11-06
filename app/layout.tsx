import type { Metadata } from 'next'
import './globals.css'
import { ReactBuildVerifier } from './components/ReactBuildVerifier'

export const metadata: Metadata = {
  title: 'React 19.2 & Compiler v1.0 Demos',
  description: 'Comprehensive demos showcasing React 19.2, React Canary, and React Compiler v1.0 features',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ReactBuildVerifier />
      </body>
    </html>
  )
}
