"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const factory_1 = require("../factory");
const require_1 = require("../helper/require");
const plugin_render_1 = require("../helper/plugin-render");
const messager_1 = require("../messager");
const namespace_1 = require("./decorators/namespace");
const bootstrap_1 = require("./compilers/bootstrap");
class AgentComponent extends factory_1.default {
    constructor(processer, args) {
        const target = require_1.default(args.file);
        super(processer, args);
        this._targetConstructor = target;
        this._name = args.name;
        this._target = new target(this);
        this.messager = new messager_1.default(this, args.mpid);
    }
    async componentWillCreate() {
        this.render = plugin_render_1.MakeAgentPluginRender(this._name, this);
        this._app = await this.render(this.base);
        this.compiler.addCompiler(bootstrap_1.default);
        this._target.beforeCreate && await this._target.beforeCreate();
    }
    async componentDidCreated() {
        await this.compiler.run();
        if (this.configs)
            await this._app.props(this.configs);
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
    componentCatchError(err) {
        console.error(err);
        this._target.catchError && this._target.catchError(err);
    }
    componentReceiveMessage(message, socket) {
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
                }
                else {
                    let result;
                    try {
                        result = this._target.health(message.data, socket);
                    }
                    catch (e) {
                        result = e;
                    }
                    this._sendValue(result, message, value => Object.assign(value || {}, { time: healthTime }));
                }
            }
            else if (message.method && this._target[message.method]) {
                this.runWidthMethod(message, socket);
            }
            else if (message.id && [0, 1].includes(message.code)) {
                this.messager.parse(message.id, message.code, message.data);
            }
            else {
                throw new Error('No support actions on ipc receiver');
            }
        }
    }
    runWidthMethod(message, socket) {
        const isIPC = Reflect.getMetadata(namespace_1.default.IPC, this._targetConstructor.prototype[message.method]);
        const isFallback = Reflect.getMetadata(namespace_1.default.FEEDBACK, this._targetConstructor.prototype[message.method]);
        if (isIPC) {
            let result;
            try {
                result = this._target[message.method](message.data, socket);
            }
            catch (e) {
                result = e;
            }
            if (isFallback) {
                this._sendValue(result, message);
            }
        }
    }
    _sendValue(result, message, callback) {
        if (Object.prototype.toString.call(result) === '[object Promise]') {
            result.then(value => process.send({
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
        }
        else {
            if (result instanceof Error) {
                process.send({
                    id: message.id,
                    to: message.from,
                    from: process.pid,
                    data: result.message,
                    code: 1
                });
            }
            else {
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
exports.default = AgentComponent;
