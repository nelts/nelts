import { IncomingMessage } from "http";
import Context from './context';
import * as url from 'url';
import * as typeis from 'type-is';
import * as accepts from 'accepts';

export interface RequestQuerySchema {
  [name:string]: string | string[];
}

export default class Request {
  readonly ctx: Context;
  readonly req: IncomingMessage;
  readonly search: string;
  readonly query: RequestQuerySchema;
  readonly pathname: string;
  readonly path: string;
  readonly href: string;
  readonly host: string;
  readonly hostname: string;
  public body: any;
  public files: any;
  [name: string]: any;

  private _accept: accepts.Accepts;

  constructor(ctx: Context, req: IncomingMessage) {
    const parsed = url.parse(req.url, true);
    this.ctx = ctx;
    this.req = req;
    this.search = parsed.search;
    this.query = Object.freeze(parsed.query || {});
    this.pathname = parsed.pathname;
    this.path = parsed.path;
    this.href = parsed.href;

    // set host and hostname
    let host = this.get('X-Forwarded-Host') as string;
    if (!host) {
      if (this.req.httpVersionMajor >= 2) host = this.get(':authority') as string;
      if (!host) host = this.get('Host') as string;
    }
    if (!host) {
      this.host = '';
      this.hostname = '';
    } else {
      this.host = host.split(/\s*,\s*/, 1)[0];
      if ('[' == this.host[0]) {
        this.hostname = url.parse(`${this.origin}${this.url}`).hostname || '';
      } else {
        this.hostname = host.split(':', 1)[0];
      }
    }
  }

  get accept() {
    return this._accept || (this._accept = accepts(this.req));
  }

  accepts(...args: string[]) {
    return this.accept.types(...args);
  }

  is(types?: string) {
    if (!types) return typeis(this.req);
    if (!Array.isArray(types)) types = [].slice.call(arguments);
    return typeis(this.req, types);
  }

  get type() {
    const type = this.get('Content-Type') as string;
    if (!type) return '';
    return type.split(';')[0];
  }

  get length() {
    const len = this.get('Content-Length');
    if (len == '') return;
    return ~~len;
  }

  get secure() {
    return 'https' == this.protocol;
  }

  get ips() {
    // const proxy = this.app.proxy;
    const val = this.get('X-Forwarded-For') as string;
    return val
      ? val.split(/\s*,\s*/)
      : [];
  }

  get ip() {
    return this.ips[0] || this.req.socket.remoteAddress || '';
  }

  get header() {
    return this.req.headers;
  }

  get headers() {
    return this.req.headers;
  }

  get url() {
    return this.req.url;
  }

  get origin() {
    return `${this.protocol}://${this.host}`;
  }

  get protocol() {
    const proto = this.get('X-Forwarded-Proto') as string;
    return proto ? proto.split(/\s*,\s*/, 1)[0] : 'http';
  }

  get app() {
    return this.ctx.app;
  }

  get res() {
    return this.ctx.res;
  }

  get response() {
    return this.ctx.response;
  }

  get(field: string) {
    const req = this.req;
    switch (field = field.toLowerCase()) {
      case 'referer':
      case 'referrer':
        return req.headers.referrer || req.headers.referer || '';
      default:
        return req.headers[field] || '';
    }
  }
}