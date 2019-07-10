type ipcStatus = 0 | 1;
type MessageSendOptions = { to?: string | number, socket?: any, timeout?: number };
export type ProcessMessageSendOptions = string | number | MessageSendOptions;
export type ProcessMessageReceiveDataType = {
  id: number,
  to: string | number,
  from: number,
  method?: string,
  data?: any,
  code?: ipcStatus
};

let id = 1;

export default class Messager<T> {
  private app: T;
  public mpid: number;
  private _stacks: { [name: string]: [(value?: unknown) => void, (reason?: any) => void] };
  constructor(app: T, mpid: number) {
    this.app = app;
    this._stacks = {};
    this.mpid = mpid;
  }

  parse(id: number, code: ipcStatus, data: any) {
    if (!this._stacks[id]) throw new Error('cannot find the callbackId of ' + id);
    const callback = this._stacks[id][code];
    callback(data);
  }

  createAgent(name: any, file: string, args?: any) {
    if (!file && typeof name !== 'string') {
      if (!name.__filename || !name.__filepath) throw new Error('create agent should provide filename and filepath');
      return this.asyncSend('newAgent', {
        name: name.__filename, 
        file: name.__filepath, 
        args
      });
    }
    return this.asyncSend('newAgent', {
      name, file, args
    });
  }

  send(method: string, data: any, options?: ProcessMessageSendOptions) {
    if (!options) options = this.mpid;
    if (typeof options !== 'object') {
      options = {
        to: options,
      }
    }
    const _id = id++;
    process.send({
      id: _id,
      to: options.to || this.mpid,
      from: process.pid,
      method, data,
    }, options.socket);
    return _id;
  }

  asyncSend(method: string, data: any, options?: ProcessMessageSendOptions) {
    return new Promise((resolve, reject) => {
      const _id = this.send(method, data, options);
      const timeout = typeof options === 'object' ? options.timeout : 20000;
      const timer = setTimeout(() => {
        if (this._stacks[_id]) {
          delete this._stacks[_id];
          reject(new Error('ipc request timeout: ' + _id + 'ms'));
        }
      }, timeout);
      const resolver = (value?: unknown) => {
        clearTimeout(timer);
        delete this._stacks[_id];
        resolve(value);
      }
      const rejecter = (reason?: any) => {
        clearTimeout(timer);
        delete this._stacks[_id];
        reject(reason);
      }
      this._stacks[_id] = [resolver, rejecter];
    });
  }
}