import * as net from 'net';
import * as http from 'http';
import { MakeWorkerPluginRender } from '../helper/plugin-render';
import * as Router from 'find-my-way';
import { Processer, WidgetComponent } from '@nelts/process';
import Compose, { Middleware, ComposedMiddleware } from '../helper/request-response-compose';
import { ContextError } from './context';
import Messager, { ProcessMessageReceiveDataType } from '../messager';

import Factory, { InCommingMessage } from '../factory';
import WorkerPlugin from './plugin';

import BootstrapCompiler from './compilers/bootstrap';
import ControllerCompiler from './compilers/controller';
import MiddlewareCompiler from './compilers/middleware';
import ServiceCompiler from './compilers/service';
import AgentCompiler from './compilers/agent';

export default class WorkerComponent extends Factory<WorkerPlugin> implements WidgetComponent {
  private _app: WorkerPlugin;
  private _port: number;
  private _middlewares: Middleware[];
  private _handler: ComposedMiddleware;
  private _socket: boolean;
  private _sticky: string;
  public server: http.Server;
  public render: (path: string) => Promise<WorkerPlugin>;
  public router: Router.Instance<Router.HTTPVersion.V1>;
  public messager: Messager<WorkerComponent>;

  constructor(processer: Processer, args: InCommingMessage) {
    super(processer, args);
    this.logger.info(`[pid:${process.pid}] server opening...`);
    this._socket = args.socket;
    this._sticky = args.sticky;
    this._port = Number(args.port || 8080);
    this._middlewares = [];
    this.messager = new Messager<WorkerComponent>(this, args.mpid);
    this.router = Router({
      ignoreTrailingSlash: true,
      defaultRoute(req, res) {
        res.statusCode = 404;
        res.end();
      }
    });
    if (this._socket) {
      process.on('message', (message: any, socket: net.Socket) => {
        switch (message) {
          case this._sticky: this.resumeConnection(socket); break;
        }
      });
    }
  }

  use(...args: Middleware[]) {
    this._middlewares.push(...args);
    return this;
  }

  get app() {
    return this._app;
  }

  private resumeConnection(socket: net.Socket) {
    if (!this.server) return socket.destroy();
    this.server.emit('connection', socket);
    socket.resume();
  }

  async componentWillCreate() {
    this.render = MakeWorkerPluginRender(this);
    this._app = await this.render(this.base);
    this.compiler.addCompiler(AgentCompiler);
    this.compiler.addCompiler(MiddlewareCompiler);
    this.compiler.addCompiler(ServiceCompiler);
    this.compiler.addCompiler(ControllerCompiler);
    this.compiler.addCompiler(BootstrapCompiler);
    this.server = http.createServer((req, res) => {
      this._handler(req, res).catch((e: ContextError) => {
        if (res.headersSent) return;
        res.statusCode = e.status || 500;
        res.end(e.message);
      });
    });
  }

  async componentDidCreated() {
    await this.compiler.run();
    if (this.configs) await this._app.props(this.configs);
    this._middlewares.push(async (req, res, next) => {
      await this.router.lookup(req, res);
      await next();
    });
    this._handler = Compose(this._middlewares);
    await new Promise((resolve, reject) => {
      this.server.listen(this._port, (err?: Error) => {
        if (err) return reject(err);
        resolve();
      });
    });
    await this._app.broadcast('ServerStarted');
    this.logger.info(`[pid:${process.pid}] server opened at http://127.0.0.1:${this._port}`);
  }

  async componentWillDestroy() {
    await this._app.broadcast('ServerStopping');
  }

  async componentDidDestroyed() {
    this.server.close();
    await new Promise(resolve => process.nextTick(resolve));
    await this._app.broadcast('ServerStopped');
    this.logger.info(`[pid:${process.pid}] server closed`);
  }

  componentCatchError(err: Error) {
    this.logger.error(err);
  }

  componentReceiveMessage(message:ProcessMessageReceiveDataType, socket?:any) {
    const name = message.to;
    const pid = process.pid;
    if (name === pid) {
      if (!message.method && message.id && [0, 1].includes(message.code)) {
        this.messager.parse(message.id, message.code, message.data);
      } else {
        switch (message.method) {
          case '__master:done__': 
            if (message.id !== -1) throw new Error('id is invaild on master:ready lifecycle');
            this._app.broadcast('ready').catch(e => this.logger.error(e)).then(() => this.logger.info('All success!')); 
            break;
          case '__master:notice__':
            this.logger.info('worker', process.pid, 'receive __master:notice__ from master and broadcast to plugins');
            this._app.broadcast('notice', message.data).catch(e => this.logger.error(e));
            break;
          default: throw new Error('No support actions on ipc receiver');
        }
      }
    }
  }
}