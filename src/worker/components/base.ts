import WorkerPlugin from '../plugin';
import { ProcessMessageSendOptions } from '../../messager';
export default class Controller {
  readonly app: WorkerPlugin;
  constructor(plugin: WorkerPlugin) {
    this.app = plugin;
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
}