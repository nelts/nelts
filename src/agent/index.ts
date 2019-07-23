import 'reflect-metadata';
import { Processer } from '@nelts/process';
import Factory, { InCommingMessage } from '../factory';
import AgentPlugin from './plugin';
import Require from '../helper/require';
import Agentbase from './components/base';
import { MakeAgentPluginRender } from '../helper/plugin-render';
import Messager, { ProcessMessageReceiveDataType } from '../messager';
import DecoratorNameSpace from './decorators/namespace';

import BootstrapCompiler from './compilers/bootstrap';

export default class AgentComponent extends Factory<AgentPlugin> {
  private _target: Agentbase;
  private _app: AgentPlugin;
  private _name: string;
  public messager: Messager<AgentComponent>;
  private _targetConstructor: any;
  public render: (path: string) => Promise<AgentPlugin>;
  constructor(processer: Processer, args: InCommingMessage) {
    const target = Require<{ new(app: AgentComponent): Agentbase }>(args.file);
    super(processer, args);
    this._targetConstructor = target;
    this._name = args.name;
    this._target = new target(this);
    this.messager = new Messager<AgentComponent>(this, args.mpid);
  }

  async componentWillCreate() {
    this.render = MakeAgentPluginRender(this._name, this);
    this._app = await this.render(this.base);
    this.compiler.addCompiler(BootstrapCompiler);
    this._target.beforeCreate && await this._target.beforeCreate();
  }

  async componentDidCreated() {
    await this.compiler.run();
    if (this.configs) await this._app.props(this.configs);
    this._target.created && await this._target.created();
    await this._app.emit('AgentStarted');
  }

  async componentWillDestroy() {
    this._target.beforeDestroy && await this._target.beforeDestroy();
    await this._app.emit('AgentStopping');
  }

  async componentDidDestroyed() {
    this._target.destroyed && await this._target.destroyed();
    await this._app.emit('AgentStopped');
  }

  componentCatchError(err: Error) {
    this.logger.error(err);
    this._target.catchError && this._target.catchError(err);
  }

  componentReceiveMessage(message:ProcessMessageReceiveDataType, socket?:any) {
    const name = message.to;
    const pid = process.pid;
    if (name === this._name || name === pid) {
      if (message.method === 'health') {
        const healthTime = new Date();
        if (!this._target.health) {
          process.send({
            id: message.id,
            to: message.from,
            from: process.pid,
            data: {
              time: healthTime,
              status: true,
            },
            code: 0
          });
        } else {
          let result: any;
          try{
            result = this._target.health(message.data, socket);
          }catch(e) { result = e; }
          this._sendValue(result, message, value => Object.assign(value || {}, { time: healthTime }));
        }
      } else if (message.method && this._target[message.method]) {
        this.runWidthMethod(message, socket);
      } else if (message.id && [0, 1].includes(message.code)){
        this.messager.parse(message.id, message.code, message.data);
      } else {
        throw new Error('No support actions on ipc receiver');
      }
    }
  }

  private runWidthMethod(message:ProcessMessageReceiveDataType, socket?:any) {
    const isIPC = Reflect.getMetadata(DecoratorNameSpace.IPC, this._targetConstructor.prototype[message.method]);
    const isFallback = Reflect.getMetadata(DecoratorNameSpace.FEEDBACK, this._targetConstructor.prototype[message.method]);
    if (isIPC) {
      let result: any;
      try{
        result = this._target[message.method](message.data, socket);
      }catch(e) { result = e; }
      if (isFallback) {
        this._sendValue(result, message);
      }
    }
  }

  private _sendValue(result: any, message:ProcessMessageReceiveDataType, callback?: (value: any) => any) {
    if (Object.prototype.toString.call(result) === '[object Promise]') {
      (<Promise<any>>result).then(value => process.send({
        id: message.id,
        to: message.from,
        from: process.pid,
        data: callback ? callback(value) : value,
        code: 0
      })).catch(e => process.send({
        id: message.id,
        to: message.from,
        from: process.pid,
        data: e.message,
        code: 1
      }));
    } else {
      if (result instanceof Error) {
        process.send({
          id: message.id,
          to: message.from,
          from: process.pid,
          data: result.message,
          code: 1
        });
      } else {
        process.send({
          id: message.id,
          to: message.from,
          from: process.pid,
          data: callback ? callback(result) : result,
          code: 0
        });
      }
    }
  }
}