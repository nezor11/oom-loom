// logger.ts
let logHandler: ((msg: string) => void) | null = null;
let lastMessage = '';

export function setLogHandler(handler: (msg: string) => void) {
  logHandler = handler;
}

export function log(...args: unknown[]) {
  const isStyledLog = args.length > 1 && typeof args[0] === 'string' && args[0].startsWith('%c');
  if (isStyledLog) return;

  const plainText = args
    .filter((arg) => typeof arg === 'string')
    .map((str) => str.replace(/%[csdifoO]/g, '').trim())
    .join(' ')
    .trim();

  if (plainText && plainText !== lastMessage) {
    lastMessage = plainText;
    if (logHandler) logHandler(`[LOG] ${plainText}`);
    console.log(...args);
  }
}
