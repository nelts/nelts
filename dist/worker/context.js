"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cookies = require("cookies");
const request_1 = require("./request");
const response_1 = require("./response");
const util = require("util");
const events_1 = require("../helper/events");
class Context extends events_1.default {
    constructor(app, req, res, params) {
        super();
        this._stacks = [];
        this._stackStatus = 0;
        this.app = app;
        this.req = req;
        this.res = res;
        this.request = new request_1.default(this, req);
        this.response = new response_1.default(this, res);
        this.params = Object.freeze(params || {});
        this.state = new Map();
        this.cookies = new Cookies(this.req, this.res, {
            keys: app.configs.cookie || ['nelts', 'context'],
            secure: this.request.secure,
        });
    }
    get messager() {
        return this.app.app.messager;
    }
    send(method, data, options) {
        return this.messager.send(method, data, options);
    }
    asyncSend(method, data, options) {
        return this.messager.asyncSend(method, data, options);
    }
    asyncHealth() {
        return this.messager.asyncHealth();
    }
    stash(fn) {
        this._stacks.push(fn);
        return this;
    }
    async commit() {
        if (this._stackStatus !== 0)
            return;
        await this.app.root.broadcast('ContextResolve', this);
        this._stackStatus = 2;
    }
    async rollback(e) {
        if (this._stackStatus !== 0)
            return;
        const stacks = this._stacks.slice(0);
        let i = stacks.length;
        while (i--)
            await stacks[i]();
        await this.app.root.broadcast('ContextReject', e, this);
        this._stackStatus = 1;
    }
    get logger() {
        return this.app.app.logger;
    }
    get query() {
        return this.request.query;
    }
    get header() {
        return this.request.header;
    }
    get headers() {
        return this.request.headers;
    }
    set(field, val) {
        this.response.set(field, val);
    }
    get(field) {
        return this.request.get(field);
    }
    onerror(err) {
        if (!(err instanceof Error))
            throw new TypeError(util.format('non-error thrown: %j', err));
        if (404 == err.status || err.expose)
            return;
        if (this.silent)
            return;
        const msg = err.stack || err.toString();
        this.logger.error('');
        this.logger.error(msg.replace(/^/gm, '  '));
        this.logger.error('');
    }
    get body() {
        return this.response.body;
    }
    set body(value) {
        this.response.body = value;
    }
    get status() {
        return this.response.status;
    }
    set status(value) {
        this.response.status = value;
    }
    get method() {
        return this.req.method;
    }
    get length() {
        return this.response.length;
    }
    set length(value) {
        this.response.length = value;
    }
    get message() {
        return this.response.message;
    }
    set message(value) {
        this.response.message = value;
    }
    get type() {
        return this.response.type;
    }
    set type(value) {
        this.response.type = value;
    }
    redirect(url, alt) {
        this.response.redirect(url, alt);
    }
    attachment(filename, options) {
        this.response.attachment(filename, options);
    }
    is(types) {
        return this.response.is(types);
    }
    append(field, val) {
        return this.response.append(field, val);
    }
    flushHeaders() {
        return this.response.flushHeaders();
    }
}
exports.default = Context;
