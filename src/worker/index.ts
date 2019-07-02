import * as http from 'http';
import { MakeWorkerPluginRender } from '../helper/plugin-render';
import * as Router from 'find-my-way';
import { Processer } from '@nelts/process';

import Factory from '../factory';
import WorkerPlugin from './plugin';

import BootstrapCompiler from './compilers/bootstrap';
import ControllerCompiler from './compilers/controller';
import MiddlewareCompiler from './compilers/middleware';
import ServiceCompiler from './compilers/service';

export default class WorkerComponent extends Factory<WorkerPlugin> {
  private _app: WorkerPlugin;
  private _port: number;
  public server: http.Server;
  public render: (path: string) => Promise<WorkerPlugin>;
  public router: Router.Instance<Router.HTTPVersion.V1>;

  constructor(processer: Processer, args: { [name:string]: any }) {
    console.info(`[pid:${process.pid}] server opening...`);
    super(processer, args);
    this._port = Number(args.port || 8080);
    this.router = Router({
      ignoreTrailingSlash: true,
      defaultRoute(req, res) {
        res.statusCode = 404;
        res.end();
      }
    });
  }

  get app() {
    return this._app;
  }

  async componentWillCreate() {
    this.render = MakeWorkerPluginRender(this);
    this._app = await this.render(this.base);
    this.compiler.addCompiler(MiddlewareCompiler);
    this.compiler.addCompiler(ServiceCompiler);
    this.compiler.addCompiler(ControllerCompiler);
    this.compiler.addCompiler(BootstrapCompiler);
    this.server = http.createServer((req, res) => {
      this._app.broadcast('ServerRequest', req, res)
      .then(() => this.router.lookup(req, res))
      .catch(e => {
        res.statusCode = 500;
        res.end(e.message);
      });
    });
  }

  async componentDidCreated() {
    await this.compiler.run();
    if (this.configs) this._app.props(this.configs);
    await new Promise((resolve, reject) => {
      this.server.listen(this._port, (err?: Error) => {
        if (err) return reject(err);
        resolve();
      });
    });
    await this._app.broadcast('ServerStarted');
    console.info(`[pid:${process.pid}] server opened at http://127.0.0.1:${this._port}`);
  }

  async componentWillDestroy() {
    await this._app.broadcast('ServerStopping');
  }

  async componentDidDestroyed() {
    this.server.close();
    await new Promise(resolve => process.nextTick(resolve));
    await this._app.broadcast('ServerStopped');
    console.info(`[pid:${process.pid}] server closed`);
  }

  componentCatchError(err: Error) {
    console.error(err);
  }

  componentReceiveMessage(message:any, socket?:any) {}
}