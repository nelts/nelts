import * as os from 'os';
import * as fs from 'fs';
import * as net from 'net';
import * as path from 'path';
import stickyBalance from './helper/sticky-blalance';
import { Component, Processer, Node } from '@nelts/process';
import Messager, { ProcessMessageReceiveDataType } from './messager';
export * from './export';
const workScriptFilename = path.resolve(__dirname, './worker/index');
const agentScriptFilename = path.resolve(__dirname, './agent/index');

export default class Master extends Component {

  private _base: string;
  private _max: number;
  private _config: string;
  private _port: number;
  private _socket: boolean;
  private _sticky: string = 'sticky:balance';
  private _messager: Messager<Master>;
  private _forker: () => Promise<any>;

  get messager() {
    return this._messager;
  }

  get logger() {
    return this.processer.logger;
  }

  constructor(processer: Processer, args: { [name:string]: any }) {
    super(processer, args);
    const base = args.base ? path.resolve(args.base || '.') : args.cwd;
    const max = Number(args.max || os.cpus().length);
    if (!fs.existsSync(base)) throw new Error('base cwd is not exists.');
    this._base = base;
    this._port = Number(args.port || 8080);
    this._config = args.config;
    this._socket = !!args.socket;
    this._max = max;
    this._messager = new Messager<Master>(this, args.mpid);
  }

  private async health() {
    const agents = Object.keys(this.processer.agents);
    const datas = await Promise.all(agents.map(agent => this._messager.asyncSend('health', null, agent)));
    const result: { [name: string]: any } = {};
    datas.forEach((data, index) => {
      result[agents[index]] = data || {};
      result[agents[index]].pid = this.processer.agents[agents[index]].pid;
    });
    return result;
  }

  private notice(data: { type: string, data: any }) {
    const workers = this.processer.workers;
    workers.forEach(worker => {
      const pid = worker.pid;
      this.messager.send('__master:notice__', data, {
        to: pid
      });
      this.logger.info('[master] send', '__master:notice__', 'commander to worker', pid);
    })
  }

  async componentWillCreate() {
    if (this._socket) await this.createSocketInterceptor();
    this._forker = this.createWorkerForker(workScriptFilename, { 
      base: this._base, 
      config: this._config, 
      port: this._port, 
      socket: this._socket,
      sticky: this._sticky, 
    });
  }

  async componentDidCreated() {
    for (let i = 0; i < this._max; i++) {
      this.logger.info('forking worker...');
      const worker = await this._forker();
      this.logger.info(`worker [pid:${worker.pid}] forked.\n\n`);
    }
    const firstWorker = this.processer.workers[0];
    firstWorker.send({
      id: -1,
      to: firstWorker.pid,
      from: process.pid,
      method: '__master:done__',
    });    
  }

  componentCatchError(err: Error) {
    this.logger.error(err);
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
    if (!message.method) return this.messager.parse(message.id, message.code, message.data);
    const reply = this.createReply(message, socket);
    switch (message.method) {
      case 'newAgent':
        if (this.processer.agents[message.data.name]) {
          reply({ code: 0, time: 0, data: this.processer.agents[message.data.name].pid });
        } else {
          const startCreateAgentTime = Date.now();
          this.createAgent(message.data.name, agentScriptFilename, Object.assign(message.data.args || {}, {
            base: this._base, 
            config: this._config,
            file: message.data.file,
            name: message.data.name,
            mpid: this.messager.mpid,
          }))
          .then((node: Node) => reply({ code: 0, time: Date.now() - startCreateAgentTime, data: node.pid }))
          .catch(e => reply({ code: 1, message: e.message, time: Date.now() - startCreateAgentTime }));
        }
        break;
      case 'health':
        this.health().then(data => reply({ code: 0, data })).catch(e => reply({ code: 1, message: e.message }));
        break;
      case 'notice':
        this.logger.info('[master] receive notice message');
        this.notice(message.data);
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
        data: data.data || data.message,
        code: data.code,
      }, socket);
    }
  }

  private createSocketInterceptor() {
    return new Promise((resolve, reject) => {
      const server = net.createServer({ pauseOnConnect: true }, (socket: net.Socket) => {
        if (!socket.remoteAddress) return socket.destroy();
        const hash = stickyBalance(socket.remoteAddress);
        const worker = this.processer.workers[hash % this.processer.workers.length];
        if (!worker) return socket.destroy();
        worker.send(this._sticky, socket);
      });
      server.listen(this._port, (err?: Error) => {
        if (err) return reject(err);
        this.logger.info('[master] start socket server interceptor on', this._port);
        resolve();
      })
    })
  }
}