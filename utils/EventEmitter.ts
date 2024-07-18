export class EventEmitter<E extends Record<string, unknown[]>> {
    #subscribers: {
      [K in keyof E]?: Set<(...args: E[K]) => void>;
    };
    constructor() {
      this.#subscribers = {};
    }
    subscribe<K extends keyof E>(event: K, fn: (...args: E[K]) => void) {
      if (!this.#subscribers[event]) {
        this.#subscribers[event] = new Set();
      }
      this.#subscribers[event]?.add(fn);
      /**
       * Return a function to unsubscribe to the event
       */
      return () => {
        this.#subscribers[event]?.delete(fn);
      };
    }
  
    async publish<K extends keyof E>(event: K, ...args: E[K]): Promise<void> {
      if (this.#subscribers[event]) {
        this.#subscribers[event]?.forEach((fn) => {
          fn(...args);
        });
      } else {
        console.debug(`No subscribers for event ${String(event)} found`);
      }
    }
  }