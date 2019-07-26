"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const statuses = require("statuses");
const cache_content_type_1 = require("../helper/cache-content-type");
const is_json_1 = require("../helper/is-json");
const onFinish = require("on-finished");
const error_inject_1 = require("../helper/error-inject");
const destroy_1 = require("../helper/destroy");
const path_1 = require("path");
const contentDisposition = require("content-disposition");
const type_is_1 = require("type-is");
class Response {
    constructor(ctx, res) {
        this.res = res;
        this.ctx = ctx;
    }
    set lastModified(val) {
        if ('string' == typeof val)
            val = new Date(val);
        this.set('Last-Modified', val.toUTCString());
    }
    get lastModified() {
        const date = this.get('last-modified');
        if (date)
            return new Date(date);
    }
    set etag(val) {
        if (!/^(W\/)?"/.test(val))
            val = `"${val}"`;
        this.set('ETag', val);
    }
    get etag() {
        return this.get('ETag');
    }
    get headerSent() {
        return this.res.headersSent;
    }
    get app() {
        return this.ctx.app;
    }
    get req() {
        return this.ctx.req;
    }
    get request() {
        return this.ctx.request;
    }
    get header() {
        if (this.request)
            return this.request.headers;
        const res = this.res;
        return typeof res.getHeaders === 'function'
            ? res.getHeaders()
            : res._headers || {};
    }
    get headers() {
        return this.header;
    }
    get status() {
        return this.res.statusCode;
    }
    set status(code) {
        if (this.headerSent)
            return;
        assert(code >= 100 && code <= 999, `invalid status code: ${code}`);
        this._explicitStatus = true;
        this.res.statusCode = code;
        if (this.req.httpVersionMajor < 2)
            this.res.statusMessage = statuses[code];
        if (this.body && statuses.empty[code])
            this.body = null;
    }
    get message() {
        return this.res.statusMessage || statuses[this.status];
    }
    set message(msg) {
        this.res.statusMessage = msg;
    }
    set type(type) {
        type = cache_content_type_1.default(type);
        if (type) {
            this.set('Content-Type', type);
        }
        else {
            this.remove('Content-Type');
        }
    }
    get type() {
        const type = this.get('Content-Type');
        if (!type)
            return '';
        return type.split(';', 1)[0];
    }
    set length(n) {
        this.set('Content-Length', n);
    }
    get length() {
        const len = this.header['content-length'];
        const body = this.body;
        if (null == len) {
            if (!body)
                return;
            if ('string' == typeof body)
                return Buffer.byteLength(body);
            if (Buffer.isBuffer(body))
                return body.length;
            if (is_json_1.default(body))
                return Buffer.byteLength(JSON.stringify(body));
            return;
        }
        return Math.trunc(len) || 0;
    }
    get body() {
        return this._body;
    }
    set body(val) {
        const original = this._body;
        this._body = val;
        if (null == val) {
            if (!statuses.empty[this.status])
                this.status = 204;
            this.remove('Content-Type');
            this.remove('Content-Length');
            this.remove('Transfer-Encoding');
            return;
        }
        if (!this._explicitStatus)
            this.status = 200;
        const setType = !this.header['content-type'];
        if ('string' == typeof val) {
            if (setType)
                this.type = /^\s*</.test(val) ? 'html' : 'text';
            this.length = Buffer.byteLength(val);
            return;
        }
        if (Buffer.isBuffer(val)) {
            if (setType)
                this.type = 'bin';
            this.length = val.length;
            return;
        }
        if ('function' == typeof val.pipe) {
            onFinish(this.res, destroy_1.default.bind(null, val));
            error_inject_1.default(val, (err) => this.ctx.onerror(err));
            if (null != original && original != val)
                this.remove('Content-Length');
            if (setType)
                this.type = 'bin';
            return;
        }
        this.remove('Content-Length');
        this.type = 'json';
    }
    get(field) {
        return this.header[field.toLowerCase()] || '';
    }
    set(field, val) {
        if (this.headerSent)
            return;
        if (2 == arguments.length) {
            if (Array.isArray(val))
                val = val.map(v => typeof v === 'string' ? v : String(v));
            else if (typeof val !== 'string')
                val = String(val);
            this.res.setHeader(field, val);
        }
        else {
            const fields = field;
            for (const key in fields) {
                this.set(key, fields[key]);
            }
        }
    }
    remove(field) {
        if (this.headerSent)
            return;
        this.res.removeHeader(field);
    }
    redirect(url, alt) {
        if ('back' == url)
            url = this.ctx.get('Referrer') || alt || '/';
        this.set('Location', url);
        if (!statuses.redirect[this.status])
            this.status = 302;
        if (this.request.accepts('html')) {
            url = escape(url);
            this.type = 'text/html; charset=utf-8';
            this.body = `Redirecting to <a href="${url}">${url}</a>.`;
            return;
        }
        this.type = 'text/plain; charset=utf-8';
        this.body = `Redirecting to ${url}.`;
    }
    attachment(filename, options) {
        if (filename)
            this.type = path_1.extname(filename);
        this.set('Content-Disposition', contentDisposition(filename, options));
    }
    is(types) {
        const type = this.type;
        if (!types)
            return type || false;
        if (!Array.isArray(types))
            types = [].slice.call(arguments);
        return type_is_1.is(type, types);
    }
    append(field, val) {
        const prev = this.get(field);
        if (prev) {
            val = Array.isArray(prev)
                ? prev.concat(val)
                : [prev].concat(val);
        }
        return this.set(field, val);
    }
    flushHeaders() {
        this.res.flushHeaders();
    }
}
exports.default = Response;
