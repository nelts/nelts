import AgentAppplication from '../index';
import { ProcessMessageSendOptions } from '../../messager';
export default class Agent {
  public app: AgentAppplication;
  [name: string]: any;
  constructor(app: AgentAppplication) {
    this.app = app;
  }

  send(method: string, data: any, options?: ProcessMessageSendOptions) {
    return this.app.messager.send(method, data, options);
  }

  asyncSend(method: string, data: any, options?: ProcessMessageSendOptions) {
    return this.app.messager.asyncSend(method, data, options);
  }

  kill() {
    return this.app.kill(process.pid);
  }
}