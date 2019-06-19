"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const http = require("http");
const plugin_render_1 = require("../helper/plugin-render");
const compiler_1 = require("../compiler");
const Router = require("find-my-way");
const process_1 = require("@nelts/process");
const bootstrap_1 = require("./compilers/bootstrap");
const controller_1 = require("./compilers/controller");
class DemoComponent extends process_1.Component {
    constructor(processer, args) {
        super(processer, args);
        this._base = args.base ? path.resolve(args.base || '.') : args.cwd;
        this._env = args.env;
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
        this.server = http.createServer((req, res) => this.router.lookup(req, res));
    }
    async componentDidCreated() {
        await this.compiler.run();
        await new Promise((resolve, reject) => {
            this.server.listen(this._port, (err) => {
                if (err)
                    return reject(err);
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
    componentCatchError(err) {
        console.log(err);
    }
    componentReceiveMessage(message, socket) { }
}
exports.default = DemoComponent;
