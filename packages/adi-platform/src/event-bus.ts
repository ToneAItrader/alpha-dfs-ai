import type { AdiEventHandler, AdiEventName, AdiEventPayloadMap } from "./types";

type HandlerEntry = {
  event: AdiEventName;
  handler: AdiEventHandler<AdiEventName>;
};

export type EventBus = {
  subscribe<T extends AdiEventName>(event: T, handler: AdiEventHandler<T>): () => void;
  publish<T extends AdiEventName>(event: T, payload: AdiEventPayloadMap[T]): Promise<void>;
  clear(): void;
};

export function createEventBus(): EventBus {
  const handlers: HandlerEntry[] = [];

  return {
    subscribe(event, handler) {
      const entry: HandlerEntry = {
        event,
        handler: handler as AdiEventHandler<AdiEventName>,
      };
      handlers.push(entry);
      return () => {
        const index = handlers.indexOf(entry);
        if (index >= 0) {
          handlers.splice(index, 1);
        }
      };
    },

    async publish(event, payload) {
      for (const entry of handlers) {
        if (entry.event !== event) continue;
        await entry.handler(payload as AdiEventPayloadMap[AdiEventName]);
      }
    },

    clear() {
      handlers.length = 0;
    },
  };
}
