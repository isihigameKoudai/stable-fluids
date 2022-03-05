class EventBus {
  bus: HTMLElement;
  /**
   * Initialize a new event bus instance.
   */
  constructor() {
    this.bus = document.createElement("fakeelement");
  }

  /**
   * Add an event listener.
   */
  on(event: keyof HTMLElementEventMap, callback: (this: HTMLElement) => any) {
    this.bus.addEventListener(event, callback);
  }

  /**
   * Remove an event listener.
   */
  off(event: keyof HTMLElementEventMap, callback: (this: HTMLElement) => any) {
    this.bus.removeEventListener(event, callback);
  }

  /**
   * Dispatch an event.
   */
  emit(event: string, detail = {}) {
    this.bus.dispatchEvent(new CustomEvent(event, { detail }));
  }
}

export default new EventBus();
