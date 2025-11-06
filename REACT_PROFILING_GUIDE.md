# React Profiling Guide for React 19 & Next.js 15

## TL;DR - You Don't Need the Profiling Build for Development! ✅

**Good news:** In React 19 with Next.js 15, **React DevTools Profiler works perfectly with the standard development build**. You don't need to swap to `react-dom/profiling` for development profiling.

## Understanding React Builds

React has two types of builds:

### 1. Standard Build (Default)
- Used for development and production
- **Includes profiling support in development mode**
- React DevTools Profiler works out of the box
- ✅ This is what you should use for development

### 2. Profiling Build (`react-dom/profiling`)
- Specifically for **profiling in production**
- Adds profiling overhead even in production bundles
- Has stricter version checks that can cause compatibility issues
- ⚠️ Only needed when profiling production builds

## How to Profile Your React 19 App

### Step 1: Install React DevTools

Install the [React Developer Tools](https://react.dev/learn/react-developer-tools) browser extension:
- [Chrome/Edge](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### Step 2: Start Your Dev Server

```bash
npm run dev
```

Your app is already running with profiling support enabled!

### Step 3: Use the Profiler

1. Open your app in the browser
2. Open DevTools (F12 or Cmd+Option+I)
3. Click the **"Profiler"** tab (you'll see a ⚛️ React icon)
4. Click the **Record** button (🔴)
5. Interact with your app
6. Click **Stop** recording
7. Analyze the flame graph and timing data!

## What You'll See in the Profiler

- **Flame Graph**: Visual representation of component render times
- **Ranked Chart**: Components sorted by render time
- **Component Details**: Why each component re-rendered
- **Commit Timeline**: When React commits were made
- **Render Duration**: How long each render took

## When to Use `react-dom/profiling`

You ONLY need the profiling build when:

1. **Profiling production builds** - You want to profile optimized production code
2. **Identifying production-only issues** - Issues that don't appear in development

### How to Use Profiling Build for Production

If you really need to profile production, here's the proper approach:

```javascript
// next.config.js
module.exports = {
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Only for production client bundles
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling',
      };
    }
    return config;
  },
}
```

Then build and serve:

```bash
npm run build
npm start
```

## Troubleshooting

### "Incompatible React versions" Error

This error occurs when trying to use `react-dom/profiling` with webpack aliases. It happens because:

1. The profiling build has stricter version validation
2. Webpack module resolution can cause version detection issues
3. React and ReactDOM internal version strings don't match

**Solution:** Don't use the profiling build for development. The standard build works great!

### Profiler Tab is Empty

If the Profiler tab shows no data:

1. Make sure you clicked Record before interacting
2. Ensure components are actually re-rendering
3. Try refreshing the page and recording again
4. Check that React DevTools recognizes your app (you should see the Components tab populated)

### No Profiler Tab in DevTools

If you don't see the Profiler tab:

1. Make sure React DevTools extension is installed
2. Refresh the page
3. Check that your app is actually using React (not a build issue)
4. Try restarting your browser

## Performance Tips from Profiling

When you see slow renders in the Profiler:

1. **Large render times**: Consider code splitting or lazy loading
2. **Frequent re-renders**: Check if state is changing unnecessarily
3. **Deep component trees**: Use React.memo() for expensive components
4. **Large lists**: Implement virtualization (react-window)
5. **Heavy computations**: Use useMemo() to cache results

## React Compiler Integration

Your project has React Compiler enabled, which automatically optimizes renders. The Profiler will help you verify that the compiler is working:

- Look for **fewer re-renders** after compiler optimization
- Compare render times before/after enabling compiler
- Identify components that still re-render unnecessarily

## Additional Resources

- [React DevTools Profiler Documentation](https://react.dev/learn/react-developer-tools)
- [Profiling Performance](https://react.dev/reference/react/Profiler)
- [React Compiler](https://react.dev/learn/react-compiler)

---

## Summary

✅ **For Development**: Use standard React build (already configured)  
✅ **Profile with**: React DevTools Profiler  
❌ **Don't use**: `react-dom/profiling` in development  
⚠️ **Use profiling build**: Only when profiling production

**Your app is ready to profile right now!** Just open React DevTools and start recording. 🚀

