"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const http = require("http");
const plugin_render_1 = require("../helper/plugin-render");
const compiler_1 = require("../compiler");
const Router = require("find-my-way");
const process_1 = require("@nelts/process");
const export_1 = require("../export");
const bootstrap_1 = require("./compilers/bootstrap");
const controller_1 = require("./compilers/controller");
class WorkerComponent extends process_1.Component {
    constructor(processer, args) {
        console.info(`[pid:${process.pid}] server opening...`);
        super(processer, args);
        this._base = args.base ? path.resolve(args.base || '.') : args.cwd;
        this._env = args.env;
        if (args.config) {
            this._configs = export_1.Require(args.config, this._base);
        }
        this._plugins = {};
        this._port = Number(args.port || 8080);
        this.compiler = new compiler_1.default();
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
        this.render = plugin_render_1.default(this, true);
        this._app = await this.render(this.base);
        this.compiler.addCompiler(controller_1.default);
        this.compiler.addCompiler(bootstrap_1.default);
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
        if (this._configs)
            this._app.props(this._configs);
        await new Promise((resolve, reject) => {
            this.server.listen(this._port, (err) => {
                if (err)
                    return reject(err);
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
    componentCatchError(err) {
        console.error(err);
    }
    componentReceiveMessage(message, socket) { }
}
exports.default = WorkerComponent;
