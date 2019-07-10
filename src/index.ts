import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { Component, Processer } from '@nelts/process';
import Messager, { ProcessMessageReceiveDataType } from './messager';
export * from './export';
const workScriptFilename = path.resolve(__dirname, './worker/index');
const agentScriptFilename = path.resolve(__dirname, './agent/index');

export default class Master extends Component {

  private _base: string;
  private _max: number;
  private _config: string;
  private _port: number;
  private _messager: Messager<Master>;
  private _forker: () => Promise<any>;

  get messager() {
    return this._messager;
  }

  constructor(processer: Processer, args: { [name:string]: any }) {
    super(processer, args);
    const base = args.base ? path.resolve(args.base || '.') : args.cwd;
    const max = Number(args.max || os.cpus().length);
    if (!fs.existsSync(base)) throw new Error('base cwd is not exists.');
    this._base = base;
    this._port = Number(args.port || 8080);
    this._config = args.config;
    this._max = max;
    this._messager = new Messager<Master>(this, args.mpid);
  }

  async componentWillCreate() {
    this._forker = this.createWorkerForker(workScriptFilename, { base: this._base, config: this._config, port: this._port });
  }

  async componentDidCreated() {
    for (let i = 0; i < this._max; i++) {
      console.info('forking worker...');
      const worker = await this._forker();
      console.info(`worker [pid:${worker.pid}] forked.\n\n`);
    }
    this.processer.workers[0].send({
      id: -1,
      to: this.processer.workers[0].pid,
      from: process.pid,
      method: '__master:done__',
    });
  }

  componentCatchError(err: Error) {
    console.error(err);
  }

  componentReceiveMessage(message: ProcessMessageReceiveDataType, socket?:any) {
    const to = message.to;

    switch (to) {
      case this.messager.mpid: 
        this.masterMessageConvert(message, socket);
        break;
      default:
        if (typeof to === 'string') {
          if (!this.processer.agents[to]) throw new Error('cannot find the agent name of ' + to);
          this.processer.agents[to].send(message, socket);
        } else if (typeof to === 'number') {
          if (!this.processer.pids[to]) throw new Error('cannot find the process pid of ' + to);
          this.processer.pids[to].send(message, socket);
        } else {
          throw new Error('message.to is invaild type, only can be string or number.');
        }
    }
  }

  private masterMessageConvert(message: ProcessMessageReceiveDataType, socket?:any) {
    const reply = this.createReply(message, socket);
    switch (message.method) {
      case 'newAgent':
        if (this.processer.agents[message.data.name]) {
          reply({ code: 0, time: 0 });
        } else {
          const startCreateAgentTime = Date.now();
          this.createAgent(message.data.name, agentScriptFilename, Object.assign(message.data.args || {}, {
            base: this._base, 
            config: this._config,
            file: message.data.file,
            name: message.data.name,
            mpid: this.messager.mpid,
          }))
          .then(() => reply({ code: 0, time: Date.now() - startCreateAgentTime }))
          .catch(e => reply({ code: 1, message: e.message, time: Date.now() - startCreateAgentTime }));
        }
        break;
      default: throw new Error('cannot find the master.message.convert:' + message.method);
    }
  }

  private createReply(message: ProcessMessageReceiveDataType, socket: any) {
    const from = this.processer.pids[message.from];
    if (!from) throw new Error('cannot find the process of ' + message.from);
    return (data: any) => {
      from.send({
        id: message.id,
        to: message.from,
        from: process.pid,
        data,
        code: data.code,
      }, socket);
    }
  }
}