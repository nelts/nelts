import { ServerResponse } from "http";
import Context from './context';
import * as assert from 'assert';
import * as statuses from 'statuses';
import getType from '../helper/cache-content-type';
import isJSON from '../helper/is-json';
import * as onFinish from 'on-finished';
import ensureErrorHandler from '../helper/error-inject';
import destroy from '../helper/destroy';
import { ContextError } from './context';
import { extname } from 'path';
import * as contentDisposition from 'content-disposition';
import { is as typeis } from 'type-is';
import Plugin from './plugin';

export type fieldValueSchema = string | number | string[];
export type fieldObjectSchema = { [name: string]: fieldValueSchema };

export default class Response<M extends Plugin, T extends Context<M>> {
  readonly ctx: T;
  readonly res: ServerResponse;
  private _body: any;
  private _explicitStatus: boolean;
  [name: string]: any;
  
  constructor(ctx: T, res: ServerResponse) {
    this.res = res;
    this.ctx = ctx;
  }

  set lastModified(val: string | Date | number) {
    if ('string' == typeof val) val = new Date(val);
    this.set('Last-Modified', (val as Date).toUTCString());
  }

  get lastModified() {
    const date = this.get('last-modified') as string;
    if (date) return new Date(date);
  }

  set etag(val: string) {
    if (!/^(W\/)?"/.test(val)) val = `"${val}"`;
    this.set('ETag', val);
  }

  get etag() {
    return this.get('ETag') as string;
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
    if (this.request) return this.request.headers;
    const res = this.res;
    return typeof res.getHeaders === 'function'
      ? res.getHeaders()
      : (<any>res)._headers || {};
  }

  get headers() {
    return this.header;
  }

  get status() {
    return this.res.statusCode;
  }

  set status(code: number) {
    if (this.headerSent) return;
    assert(code >= 100 && code <= 999, `invalid status code: ${code}`);
    this._explicitStatus = true;
    this.res.statusCode = code;
    if (this.req.httpVersionMajor < 2) this.res.statusMessage = statuses[code];
    if (this.body && statuses.empty[code]) this.body = null;
  }

  get message() {
    return this.res.statusMessage || statuses[this.status];
  }

  set message(msg: any) {
    this.res.statusMessage = msg;
  }

  set type(type: string) {
    type = getType(type);
    if (type) {
      this.set('Content-Type', type);
    } else {
      this.remove('Content-Type');
    }
  }

  get type() {
    const type = this.get('Content-Type') as string;
    if (!type) return '';
    return type.split(';', 1)[0];
  }

  set length(n) {
    this.set('Content-Length', n);
  }

  get length() {
    const len = this.header['content-length'];
    const body = this.body;

    if (null == len) {
      if (!body) return;
      if ('string' == typeof body) return Buffer.byteLength(body);
      if (Buffer.isBuffer(body)) return body.length;
      if (isJSON(body)) return Buffer.byteLength(JSON.stringify(body));
      return;
    }

    return Math.trunc(len as number) || 0;
  }

  get body() {
    return this._body;
  }

  set body(val) {
    const original = this._body;
    this._body = val;

    // no content
    if (null == val) {
      if (!statuses.empty[this.status]) this.status = 204;
      this.remove('Content-Type');
      this.remove('Content-Length');
      this.remove('Transfer-Encoding');
      return;
    }

    // set the status
    if (!this._explicitStatus) this.status = 200;

    // set the content-type only if not yet set
    const setType = !this.header['content-type'];

    // string
    if ('string' == typeof val) {
      if (setType) this.type = /^\s*</.test(val) ? 'html' : 'text';
      this.length = Buffer.byteLength(val);
      return;
    }

    // buffer
    if (Buffer.isBuffer(val)) {
      if (setType) this.type = 'bin';
      this.length = val.length;
      return;
    }

    // stream
    if ('function' == typeof val.pipe) {
      onFinish(this.res, destroy.bind(null, val));
      ensureErrorHandler(val, (err: ContextError) => this.ctx.onerror(err));

      // overwriting
      if (null != original && original != val) this.remove('Content-Length');

      if (setType) this.type = 'bin';
      return;
    }

    // json
    this.remove('Content-Length');
    this.type = 'json';
  }

  get(field: string) {
    return this.header[field.toLowerCase()] || '';
  }

  set(field: string | fieldObjectSchema, val?: fieldValueSchema) {
    if (this.headerSent) return;
    if (2 == arguments.length) {
      if (Array.isArray(val)) val = val.map(v => typeof v === 'string' ? v : String(v));
      else if (typeof val !== 'string') val = String(val);
      this.res.setHeader(field as string, val);
    } else {
      const fields = field as fieldObjectSchema;
      for (const key in fields) {
        this.set(key, fields[key]);
      }
    }
  }

  remove(field: string) {
    if (this.headerSent) return;
    this.res.removeHeader(field);
  }

  redirect(url: string, alt?: string) {
    // location
    if ('back' == url) url = this.ctx.get('Referrer') as string || alt || '/';
    this.set('Location', url);

    // status
    if (!statuses.redirect[this.status]) this.status = 302;

    // html
    if (this.request.accepts('html')) {
      url = escape(url);
      this.type = 'text/html; charset=utf-8';
      this.body = `Redirecting to <a href="${url}">${url}</a>.`;
      return;
    }

    // text
    this.type = 'text/plain; charset=utf-8';
    this.body = `Redirecting to ${url}.`;
  }

  attachment(filename: string, options: any) {
    if (filename) this.type = extname(filename);
    this.set('Content-Disposition', contentDisposition(filename, options));
  }

  is(types: string | string[]) {
    const type = this.type;
    if (!types) return type || false;
    if (!Array.isArray(types)) types = [].slice.call(arguments);
    return typeis(type, types as string[]);
  }

  append(field: string, val: any) {
    const prev = this.get(field);

    if (prev) {
      val = Array.isArray(prev)
        ? prev.concat(val as string[])
        : [prev].concat(val);
    }

    return this.set(field, val);
  }

  flushHeaders() {
    this.res.flushHeaders();
  }
}