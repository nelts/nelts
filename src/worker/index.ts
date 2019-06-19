import * as path from 'path';
import * as http from 'http';
import Plugin from '../plugin';
import PluginRender from '../helper/plugin-render';
import Compiler from '../compiler';
import * as Router from 'find-my-way';
import { Component, Processer } from '@nelts/process';

import BootstrapCompiler from './compilers/bootstrap';
import ControllerCompiler from './compilers/controller';

export type PLUGINS = { [name:string]: Plugin };

export default class DemoComponent extends Component {
  private _base: string;
  private _env: string;
  private _plugins: PLUGINS;
  private _app: Plugin;
  private _port: number;
  public compiler: Compiler;
  public server: http.Server;
  public render: (path: string) => Promise<Plugin>;
  public router: Router.Instance<Router.HTTPVersion.V1>;

  constructor(processer: Processer, args: { [name:string]: any }) {
    super(processer, args);
    this._base = args.base ? path.resolve(args.base || '.') : args.cwd;
    this._env = args.env;
    this._plugins = {};
    this._port = Number(args.port || 8080);
    this.compiler = new Compiler();
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

  get base() {
    return this._base;
  }

  get env() {
    return this._env;
  }

  get plugins() {
    return this._plugins;
  }

  async componentWillCreate() {
    this.render = PluginRender(this, true);
    this._app = await this.render(this.base);
    this.compiler.addCompiler(ControllerCompiler);
    this.compiler.addCompiler(BootstrapCompiler);
    this.server = http.createServer((req, res) => this.router.lookup(req, res));
  }

  async componentDidCreated() {
    await this.compiler.run();
    await new Promise((resolve, reject) => {
      this.server.listen(this._port, (err?: Error) => {
        if (err) return reject(err);
        resolve();
        console.log('server start at http://127.0.0.1:' + this._port);
      });
    });
  }

  async componentWillDestroy() {
    console.log(process.pid, 'componentWillDestroy');
  }

  async componentDidDestroyed() {
    this.server.close();
    console.log(process.pid, 'componentDidDestroyed');
  }

  componentCatchError(err: Error) {
    console.log(err);
  }

  componentReceiveMessage(message:any, socket?:any) {}
}