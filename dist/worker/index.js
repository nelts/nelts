"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const plugin_render_1 = require("../helper/plugin-render");
const Router = require("find-my-way");
const request_response_compose_1 = require("../helper/request-response-compose");
const messager_1 = require("../messager");
const factory_1 = require("../factory");
const bootstrap_1 = require("./compilers/bootstrap");
const controller_1 = require("./compilers/controller");
const middleware_1 = require("./compilers/middleware");
const service_1 = require("./compilers/service");
const agent_1 = require("./compilers/agent");
class WorkerComponent extends factory_1.default {
    constructor(processer, args) {
        super(processer, args);
        this.logger.info(`[pid:${process.pid}] server opening...`);
        this._port = Number(args.port || 8080);
        this._middlewares = [];
        this.messager = new messager_1.default(this, args.mpid);
        this.router = Router({
            ignoreTrailingSlash: true,
            defaultRoute(req, res) {
                res.statusCode = 404;
                res.end();
            }
        });
    }
    use(...args) {
        this._middlewares.push(...args);
        return this;
    }
    get app() {
        return this._app;
    }
    async componentWillCreate() {
        this.render = plugin_render_1.MakeWorkerPluginRender(this);
        this._app = await this.render(this.base);
        this.compiler.addCompiler(agent_1.default);
        this.compiler.addCompiler(middleware_1.default);
        this.compiler.addCompiler(service_1.default);
        this.compiler.addCompiler(controller_1.default);
        this.compiler.addCompiler(bootstrap_1.default);
        this.server = http.createServer((req, res) => {
            this._handler(req, res).catch((e) => {
                if (res.headersSent)
                    return;
                res.statusCode = e.status || 500;
                res.end(e.message);
            });
        });
    }
    async componentDidCreated() {
        await this.compiler.run();
        if (this.configs)
            await this._app.props(this.configs);
        this._middlewares.push(async (req, res, next) => {
            await this.router.lookup(req, res);
            await next();
        });
        this._handler = request_response_compose_1.default(this._middlewares);
        await new Promise((resolve, reject) => {
            this.server.listen(this._port, (err) => {
                if (err)
                    return reject(err);
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
    componentCatchError(err) {
        this.logger.error(err);
    }
    componentReceiveMessage(message, socket) {
        const name = message.to;
        const pid = process.pid;
        if (name === pid) {
            if (!message.method && message.id && [0, 1].includes(message.code)) {
                this.messager.parse(message.id, message.code, message.data);
            }
            else {
                switch (message.method) {
                    case '__master:done__':
                        if (message.id !== -1)
                            throw new Error('id is invaild on master:ready lifecycle');
                        this._app.broadcast('ready').catch(e => this.logger.error(e));
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
exports.default = WorkerComponent;
