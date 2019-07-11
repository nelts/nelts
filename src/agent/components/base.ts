import AgentAppplication from '../index';
import { ProcessMessageSendOptions } from '../../messager';
export default class Agent {
  public app: AgentAppplication;
  [name: string]: any;
  constructor(app: AgentAppplication) {
    this.app = app;
  }

  get messager() {
    return this.app.messager;
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

  kill() {
    return this.app.kill(process.pid);
  }
}