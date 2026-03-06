import type { GameEvent } from '@venomous-snake/shared-types';

type EventHandler = (event: GameEvent) => void;

class GameEventBus {
  private handlers: Set<EventHandler> = new Set();

  emit(event: GameEvent): void {
    for (const handler of this.handlers) {
      handler(event);
    }
  }

  on(handler: EventHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  off(handler: EventHandler): void {
    this.handlers.delete(handler);
  }

  removeAll(): void {
    this.handlers.clear();
  }
}

export const EventBus = new GameEventBus();
