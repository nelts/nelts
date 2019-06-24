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
        console.error();
        console.error(msg.replace(/^/gm, '  '));
        console.error();
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
function ContextProxy(ctx) {
    return new Proxy(ctx, {
        get(target, property) {
            if (Reflect.has(target, property))
                return Reflect.get(target, property);
            return target.state.get(property);
        },
        set(target, property, value) {
            if (Reflect.has(target, property))
                return Reflect.set(target, property, value);
            target.state.set(property, value);
        }
    });
}
exports.ContextProxy = ContextProxy;
