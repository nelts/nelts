"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const plugin_render_1 = require("../helper/plugin-render");
const Router = require("find-my-way");
const factory_1 = require("../factory");
const bootstrap_1 = require("./compilers/bootstrap");
const controller_1 = require("./compilers/controller");
const middleware_1 = require("./compilers/middleware");
const service_1 = require("./compilers/service");
class WorkerComponent extends factory_1.default {
    constructor(processer, args) {
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
        this.render = plugin_render_1.MakeWorkerPluginRender(this);
        this._app = await this.render(this.base);
        this.compiler.addCompiler(middleware_1.default);
        this.compiler.addCompiler(service_1.default);
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
        if (this.configs)
            this._app.props(this.configs);
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
