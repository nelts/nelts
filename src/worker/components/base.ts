import WorkerPlugin from '../plugin';
import { ProcessMessageSendOptions } from '../../messager';
export default class Base<T extends WorkerPlugin> {
  readonly app: T;
  constructor(plugin: T) {
    this.app = plugin;
  }

  get logger() {
    return this.app.logger;
  }

  get messager() {
    return this.app.app.messager;
  }

  send(method: string, data?: any, options?: ProcessMessageSendOptions) {
    return this.messager.send(method, data, options);
  }

  asyncSend(method: string, data?: any, options?: ProcessMessageSendOptions) {
    return this.messager.asyncSend(method, data, options);
  }

  asyncHealth() {
    return this.messager.asyncHealth();
  }
}