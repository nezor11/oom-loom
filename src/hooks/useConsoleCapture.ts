// src/hooks/useConsoleCapture.ts
import { useEffect, useState } from 'react';

type LogEntry = {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
};

export function useConsoleCapture() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    const capture = (type: LogEntry['type'], ...args: any[]) => {
      const message = args.map((arg) =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      setLogs((prev) => [...prev, { type, message }]);
    };

    console.log = (...args) => {
      capture('log', ...args);
      originalLog(...args);
    };
    console.error = (...args) => {
      capture('error', ...args);
      originalError(...args);
    };
    console.warn = (...args) => {
      capture('warn', ...args);
      originalWarn(...args);
    };
    console.info = (...args) => {
      capture('info', ...args);
      originalInfo(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    };
  }, []);

  return logs;
}
