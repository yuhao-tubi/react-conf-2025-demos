# React 19.2 & Compiler v1.0 Demos

A comprehensive collection of interactive demos showcasing the latest features in **React 19.2**, **React Canary**, and **React Compiler v1.0**.

## 🚀 Features Covered

### React 19.2 Core Features

1. **use() Hook** - Read promises and context values directly in components
2. **Server Actions** - Simplified form handling and data mutations
3. **useOptimistic** - Optimistic UI updates for better UX
4. **useFormStatus** - Access form submission status from child components
5. **Document Metadata** - Native support for title, meta, and link tags
6. **Ref as Prop** - Pass ref directly as a prop without forwardRef
7. **Context as Provider** - Use Context directly as a provider
8. **Asset Loading** - Preload and manage external resources
9. **Form Actions** - Built-in form action handling with automatic pending states
10. **Async Transitions** - useTransition with async function support
11. **Error Handling** - Enhanced error boundaries and error handling
12. **View Transitions** - Smooth animations with the View Transitions API
13. **Activity Indicators** - Loading states, spinners, and progress bars

### React Compiler v1.0

- **Automatic Memoization** - No need for manual useMemo/useCallback
- **Performance Optimization** - Build-time optimizations
- **Zero Runtime Cost** - Optimizations happen at compile time

## 📦 Installation

```bash
npm install
```

## 🏃‍♂️ Running the Project

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Then visit [http://localhost:3000](http://localhost:3000) to explore the demos.

## 📚 Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Home page with demo index
│   ├── globals.css             # Global styles
│   ├── use-hook/               # use() hook demo
│   ├── server-actions/         # Server Actions demo
│   ├── use-optimistic/         # useOptimistic demo
│   ├── use-form-status/        # useFormStatus demo
│   ├── metadata/               # Document metadata demo
│   ├── ref-as-prop/            # Ref as prop demo
│   ├── context-provider/       # Context provider demo
│   ├── asset-loading/          # Asset loading demo
│   ├── react-compiler/         # React Compiler demo
│   ├── form-actions/           # Form actions demo
│   ├── async-transitions/      # Async transitions demo
│   ├── error-handling/         # Error handling demo
│   ├── view-transitions/       # View Transitions API demo
│   └── activity/               # Activity indicators demo
├── next.config.js              # Next.js config with React Compiler
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 🎯 Demo Highlights

### 1. use() Hook
Interactive demo showing how to read promises directly in components with Suspense integration.

### 2. Server Actions
Form submission with server-side processing, validation, and automatic pending states.

### 3. useOptimistic
Real-time optimistic updates with automatic rollback on error.

### 4. useFormStatus
Access form submission status from child components without prop drilling.

### 5. Document Metadata
Dynamic metadata rendering with automatic hoisting to document head.

### 6. Ref as Prop
Simplified ref forwarding without forwardRef wrapper.

### 7. Context as Provider
Use Context directly as a provider with the new use() hook.

### 8. Asset Loading
Preload stylesheets, fonts, and scripts with precedence control.

### 9. React Compiler
Automatic memoization demonstrations with performance comparisons.

### 10. Form Actions
Native form action handling with built-in pending states.

### 11. Async Transitions
Non-blocking state updates with useTransition and async operations.

### 12. Error Handling
Error boundaries with recovery mechanisms and best practices.

### 13. View Transitions
Smooth animations between UI states using the native View Transitions API.

### 14. Activity Indicators
Comprehensive loading states including spinners, progress bars, skeleton loaders, and more.

## ⚙️ React Compiler Configuration

The React Compiler is enabled in `next.config.js`:

```javascript
module.exports = {
  experimental: {
    reactCompiler: true,
  },
}
```

### Compiler Options

```javascript
module.exports = {
  experimental: {
    reactCompiler: {
      compilationMode: 'all', // or 'annotation'
      panicThreshold: 'all_errors',
    },
  },
}
```

### Opting Out

Use the `'use no memo'` directive to opt-out specific components:

```javascript
function MyComponent() {
  'use no memo'
  // This component won't be optimized
}
```

## 🛠️ Technologies Used

- **React 19.0** - Latest React version with all new features
- **Next.js 15** - React framework with App Router
- **TypeScript 5.3** - Type safety
- **React Compiler v1.0** - Automatic optimization
- **CSS** - Custom styling with modern CSS features

## 📖 Learning Resources

Each demo page includes:
- ✅ Detailed explanation of the feature
- ✅ Interactive demonstrations
- ✅ Code examples with comparisons
- ✅ Best practices and use cases
- ✅ Benefits and considerations

## 🎨 Features

- **Modern UI** - Beautiful, responsive design with dark mode support
- **Interactive Demos** - Try features hands-on
- **Code Examples** - Real working code you can copy
- **Comprehensive** - Covers all major React 19 features
- **Well Documented** - Detailed explanations for each feature

## 🚦 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Progressive enhancement where applicable

## 📝 Notes

- This is a demo project for educational purposes
- Some features work best in development mode
- Server Actions require server-side rendering
- React Compiler is production-ready but still evolving

## 🤝 Contributing

Feel free to explore, learn, and build upon this demo repository!

## 📄 License

MIT License - feel free to use this for learning and teaching React 19.

## 🎓 Key Takeaways

### React 19 Benefits
- **Simpler Code** - Less boilerplate, more productivity
- **Better Performance** - Built-in optimizations
- **Enhanced UX** - Better loading and error states
- **Modern Features** - Cutting-edge React patterns

### React Compiler Benefits
- **Zero Config Optimization** - Automatic memoization
- **Smaller Bundles** - Fewer optimization hooks
- **Better Performance** - Consistent optimizations
- **Developer Experience** - Focus on logic, not optimization

## 🔗 Official Documentation

- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Compiler Documentation](https://react.dev/learn/react-compiler)

---

Built with ❤️ to showcase React 19.2 and React Compiler v1.0 features
