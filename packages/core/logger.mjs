export const logKey = 'strudel.log';
export const clearKey = 'strudel.clear';

let debounce = 1000,
  lastMessage,
  lastTime;

export function logger(message, type, data = {}) {
  let t = performance.now();
  if (lastMessage === message && t - lastTime < debounce) {
    return;
  }
  lastMessage = message;
  lastTime = t;
  console.log(`%c${message}`, 'background-color: black;color:white;border-radius:15px');
  if (typeof document !== 'undefined' && typeof CustomEvent !== 'undefined') {
    document.dispatchEvent(
      new CustomEvent(logKey, {
        detail: {
          message,
          type,
          data,
        },
      }),
    );
  }
}

logger.key = logKey;
logger.clearKey = clearKey;

if (import.meta.env.DEV) {
  if (typeof window !== 'undefined') {
    // Record Control key event to trigger or block the tooltip depending on the state
    window.addEventListener(
      'keydown',
      function (e) {
        if ((e.ctrlKey && e.key === 'l') || (e.metaKey && e.key === 'k')) {
          if (typeof document !== 'undefined' && typeof CustomEvent !== 'undefined') {
            document.dispatchEvent(new CustomEvent(clearKey, {}));
          }
        }
      },
      true,
    );
  }
}
