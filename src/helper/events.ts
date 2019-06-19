export type AsyncEventEmitterListener = (...args: any[]) => void;
export default class EventEmitter {
  private _eventStacks: { [name: string]: AsyncEventEmitterListener[] };
  static readonly Methods = [
    'on',
    'off',
    'addListener',
    'removeListener',
    'prependListener',
    'removeAllListeners',
    'emit',
    'eventNames',
    'listenerCount',
    'listeners'
  ];

  constructor() {
    this._eventStacks = {};
  }

  on(name: string, listener: AsyncEventEmitterListener) {
    this.addListener(name, listener);
    return this;
  }

  off(name: string, listener: AsyncEventEmitterListener) {
    this.removeListener(name, listener);
    return this;
  }

  addListener(name: string, listener: AsyncEventEmitterListener) {
    if (!this._eventStacks[name]) this._eventStacks[name] = [];
    this._eventStacks[name].push(listener);
    return this;
  }

  removeListener(name: string, listener?: AsyncEventEmitterListener) {
    const listeners = this.listeners(name);
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
      if (this.listenerCount(name) === 0) {
        this.removeAllListeners(name);
      }
    }
  }

  prependListener(name: string, listener: AsyncEventEmitterListener) {
    if (!this._eventStacks[name]) this._eventStacks[name] = [];
    this._eventStacks[name].unshift(listener);
  }

  removeAllListeners(name: string) {
    if (this._eventStacks[name]) {
      delete this._eventStacks[name];
    }
  }

  async emit(name: string, ...args: any[]) {
    const listeners = this.listeners(name);
    if (!listeners) return;
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      await listener(...args);
    }
  }

  eventNames() {
    return Object.keys(this._eventStacks);
  }

  listenerCount(name: string) {
    const listeners = this.listeners(name);
    return listeners ? listeners.length : 0;
  }

  listeners(name: string) {
    return this._eventStacks[name];
  }
}