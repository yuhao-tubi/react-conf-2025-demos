'use client';

import { useEffect, useState } from 'react';
import * as React from 'react';

export function ReactBuildVerifier() {
  const [buildInfo, setBuildInfo] = useState<{
    reactVersion: string;
    buildMode: string;
    canProfile: boolean;
  } | null>(null);

  useEffect(() => {
    try {
      // Get React version and mode
      const reactVersion = React.version;
      const isDevelopment = process.env.NODE_ENV !== 'production';
      
      // In React 19, profiling is available in development mode by default!
      const canProfile = isDevelopment;
      const buildMode = isDevelopment ? 'Development' : 'Production';
      
      const info = {
        reactVersion,
        buildMode,
        canProfile,
      };
      
      setBuildInfo(info);
      
      // Console logging
      console.group('🔍 React Profiling Status');
      console.log('React Version:', reactVersion);
      console.log('Build Mode:', buildMode);
      console.log('Can Profile:', canProfile ? '✅ YES' : '❌ NO');
      console.log('');
      console.log('📊 React DevTools Profiler:');
      if (canProfile) {
        console.log('  ✅ Profiling is available!');
        console.log('  1. Open DevTools');
        console.log('  2. Go to Profiler tab (⚛️ icon)');
        console.log('  3. Click Record → interact → Stop');
        console.log('  4. Analyze flame graphs and timing data');
      } else {
        console.log('  ⚠️ Running in production mode');
        console.log('  💡 Use development mode for profiling');
      }
      console.log('');
      console.log('💡 Note: React 19 includes profiling support in development mode.');
      console.log('   You do NOT need react-dom/profiling for development!');
      console.groupEnd();
      
      // Check if React DevTools is installed
      setTimeout(() => {
        // @ts-ignore
        const hasDevTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (hasDevTools) {
          console.log('✅ React DevTools detected - Profiler should be available');
        } else {
          console.warn('⚠️ React DevTools not detected - Install the browser extension');
          console.log('   Chrome: https://chrome.google.com/webstore/detail/fmkadmapgofadopljbjfkapdkoienihi');
          console.log('   Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/');
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error checking React status:', error);
      setBuildInfo({
        reactVersion: 'Error',
        buildMode: 'Unknown',
        canProfile: false,
      });
    }
  }, []);

  if (!buildInfo) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#ffff00',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
      }}>
        <strong>🔍 Loading verification...</strong>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: buildInfo.canProfile 
        ? 'rgba(0, 100, 0, 0.95)' 
        : 'rgba(100, 50, 0, 0.95)',
      color: '#ffffff',
      padding: '14px 18px',
      borderRadius: '10px',
      fontSize: '13px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      zIndex: 9999,
      maxWidth: '340px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
      border: buildInfo.canProfile 
        ? '2px solid #00ff00' 
        : '2px solid #ff9900',
    }}>
      <div style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>
        ⚛️ React Profiling Status
      </div>
      <div style={{ lineHeight: '1.8' }}>
        <div><strong>React:</strong> {buildInfo.reactVersion}</div>
        <div><strong>Mode:</strong> {buildInfo.buildMode}</div>
        <div><strong>Profiling:</strong> {buildInfo.canProfile ? '✅ Available' : '❌ Not Available'}</div>
        
        <div style={{ 
          marginTop: '12px', 
          paddingTop: '12px', 
          borderTop: '1px solid rgba(255,255,255,0.3)',
          fontSize: '11px',
          lineHeight: '1.5'
        }}>
          {buildInfo.canProfile ? (
            <>
              <div style={{ marginBottom: '6px', fontWeight: 'bold' }}>📊 How to Profile:</div>
              <div>1. Open DevTools</div>
              <div>2. Go to &quot;Profiler&quot; tab</div>
              <div>3. Record → Interact → Stop</div>
              <div style={{ marginTop: '6px', opacity: 0.8 }}>
                💡 No special setup needed!
              </div>
            </>
          ) : (
            <>
              <div>⚠️ Production mode detected</div>
              <div style={{ marginTop: '4px' }}>
                Run <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '3px' }}>npm run dev</code> to enable profiling
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

