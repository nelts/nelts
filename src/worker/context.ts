import { IncomingMessage, ServerResponse } from "http";
import * as Cookies from 'cookies';
import Plugin from './plugin';
type ParamSchema = { [name: string]: string };
import Request from './request';
import Response, { fieldObjectSchema, fieldValueSchema } from './response';
import * as util from 'util';
import AsyncEventEmitter from '../helper/events';
import { ContextError } from './context';
import { ProcessMessageSendOptions } from '../messager';

type StackCallback = () => PromiseLike<void>;
type StackStatus = 0 | 1 | 2;

export interface ContextError extends Error {
  status?: number,
  expose?: boolean
}

export default class Context<T extends Plugin> extends AsyncEventEmitter {

  readonly app: T;
  readonly req: IncomingMessage;
  readonly res: ServerResponse;
  readonly params: ParamSchema;
  readonly cookies: Cookies;
  readonly request: Request<T, Context<T>>;
  readonly response: Response<T, Context<T>>;
  private _stacks: StackCallback[];
  private _stackStatus: StackStatus;
  public silent: boolean;
  public state: Map<any, any>;
  public respond: boolean;
  [label: string]: any;

  constructor(app: T, req: IncomingMessage, res: ServerResponse, params?: ParamSchema) {
    super();
    this._stacks = [];
    this._stackStatus = 0;
    this.app = app;
    this.req = req;
    this.res = res;
    this.request = new Request(this, req);
    this.response = new Response(this, res);
    this.params = Object.freeze(params || {});
    this.state = new Map();
    this.cookies = new Cookies(this.req, this.res, {
      keys: app.configs.cookie || ['nelts', 'context'],
      secure: this.request.secure,
    });
  }

  throw(message: Error | string, code?: number) {
    throw this.error(message, code);
  }

  error(message: Error | string, code?: number) {
    const error: ContextError = typeof message === 'string' ? new Error(message) : message;
    error.status = code || 500;
    return error;
  }

  get messager() {
    return this.app.app.messager;
  }

  send(method: string, data?: any, options?: ProcessMessageSendOptions) {
    return this.messager.send(method, data, options);
  }

  asyncSend(method: string, data?: any, options?: ProcessMessageSendOptions) {
    return this.messager.asyncSend(method, data, options);
  }

  asyncHealth() {
    return this.messager.asyncHealth();
  }

  stash(fn: StackCallback) {
    this._stacks.push(fn);
    return this;
  }

  async commit() {
    if (this._stackStatus !== 0) return;
    await this.app.root.broadcast('ContextResolve', this);
    this._stackStatus = 2;
  }

  async rollback(e: ContextError) {
    if (this._stackStatus !== 0) return;
    const stacks = this._stacks.slice(0);
    let i = stacks.length;
    while (i--) await stacks[i]();
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

  set(field: string | fieldObjectSchema, val?: fieldValueSchema) {
    this.response.set(field, val);
  }

  get(field: string) {
    return this.request.get(field);
  }

  onerror(err: ContextError) {
    if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));

    if (404 == err.status || err.expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    this.logger.error('');
    this.logger.error(msg.replace(/^/gm, '  '));
    this.logger.error('');
  }

  get accept() {
    return this.request.accept;
  }

  get url() {
    return this.request.url;
  }

  set ip(value: string) {
    this.request.ip = value;
  }

  get ip() {
    return this.request.ip;
  }

  get body() {
    return this.response.body;
  }

  set body(value: any) {
    this.response.body = value;
  }

  get status() {
    return this.response.status;
  }

  set status(value: number) {
    this.response.status = value;
  }

  get method() {
    return this.req.method;
  }

  get length() {
    return this.response.length;
  }

  set length(value: number) {
    this.response.length = value;
  }

  get message() {
    return this.response.message;
  }

  set message(value: any) {
    this.response.message = value;
  }

  get type() {
    return this.response.type;
  }

  set type(value: string) {
    this.response.type = value;
  }

  set lastModified(val: string | Date | number) {
    this.response.lastModified = val;
  }

  get lastModified() {
    return this.response.lastModified;
  }

  set etag(val: string) {
    this.response.etag = val;
  }

  get etag() {
    return this.response.etag;
  }

  get headerSent() {
    return this.response.headerSent;
  }

  redirect(url: string, alt?: string) {
    this.response.redirect(url, alt);
  }

  attachment(filename: string, options: any) {
    this.response.attachment(filename, options);
  }

  is(types: string | string[]) {
    return this.response.is(types);
  }

  append(field: string, val: any) {
    return this.response.append(field, val);
  }

  flushHeaders() {
    return this.response.flushHeaders();
  }

  remove(value: string) {
    return this.response.remove(value);
  }
}

// export function ContextProxy(ctx: Context) {
//   return new Proxy(ctx, {
//     get(target, property) {
//       if (Reflect.has(target, property)) return Reflect.get(target, property);
//       return target.state.get(property);
//     },
//     set(target, property, value) {
//       if (Reflect.has(target, property)) return Reflect.set(target, property, value); 
//       target.state.set(property, value);
//       return true;
//     }
//   })
// }