import { IncomingMessage, ServerResponse } from "http";
import * as Cookies from 'cookies';
import Plugin from '../plugin';
type ParamSchema = { [name: string]: string };
import Request from './request';
import Response from './response';
import * as util from 'util';

export interface ContextError extends Error {
  status?: number,
  expose?: boolean
}

export default class Context {

  readonly app: Plugin;
  readonly req: IncomingMessage;
  readonly res: ServerResponse;
  readonly params: ParamSchema;
  readonly cookies: Cookies;
  readonly request: Request;
  readonly response: Response;
  public silent: boolean;
  public state: Record<any, any>;
  public respond: boolean;

  constructor(app: Plugin, req: IncomingMessage, res: ServerResponse, params?: ParamSchema) {
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

  get(field: string) {
    return this.request.get(field);
  }

  onerror(err: ContextError) {
    if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));

    if (404 == err.status || err.expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, '  '));
    console.error();
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
}

export function ContextProxy(ctx: Context) {
  return new Proxy(ctx, {
    get(target, property) {
      if (Reflect.has(target, property)) return Reflect.get(target, property);
      return target.state.get(property);
    },
    set(target, property, value) {
      if (Reflect.has(target, property)) return Reflect.set(target, property, value);
      target.state.set(property, value);
    }
  })
}