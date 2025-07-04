import { useEffect, useRef } from 'react';
import { useConsoleCapture } from '../hooks/useConsoleCapture';

export default function ConsolePanel() {
  const logs = useConsoleCapture();
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top (most recent) on new log
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [logs]);

  if (logs.length === 0) return null;

  // Show newest first
  const displayed = [...logs].reverse();

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 right-0 p-4 bg-gray-100 rounded text-xs max-h-64 w-full max-w-xs overflow-y-auto font-mono shadow-inner"
    >
      <h3 className="font-bold mb-2 text-gray-700">🧪 Consola en pantalla:</h3>
      {displayed.map((entry, i) => (
        <p
          key={i}
          className={
            entry.type === 'error'
              ? 'text-red-600'
              : entry.type === 'warn'
              ? 'text-yellow-600'
              : 'text-gray-600'
          }
        >
          [{entry.type.toUpperCase()}] {entry.message}
        </p>
      ))}
    </div>
  );
}
