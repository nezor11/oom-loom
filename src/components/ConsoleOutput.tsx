// src/components/ConsoleOutput.tsx
import { useConsoleCapture } from '../hooks/useConsoleCapture';

export default function ConsoleOutput() {
  const logs = useConsoleCapture();

  const getColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-300';
      case 'info':
        return 'text-blue-300';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className="overflow-y-auto bg-black text-sm font-mono p-4 z-50 shadow-lg border-t border-gray-700">
      <div className="mb-2 font-bold text-white">🧪 Consola en pantalla:</div>
      {logs.map((log, index) => (
        <div key={index} className={`whitespace-pre-wrap ${getColor(log.type)}`}>
          [{log.type.toUpperCase()}] {log.message}
        </div>
      ))}
    </div>
  );
}
