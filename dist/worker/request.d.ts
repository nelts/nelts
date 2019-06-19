/// <reference types="node" />
import { IncomingMessage } from "http";
import Context from './context';
import * as accepts from 'accepts';
export interface RequestQuerySchema {
    [name: string]: string | string[];
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
    body: any;
    files: any;
    private _accept;
    constructor(ctx: Context, req: IncomingMessage);
    readonly accept: accepts.Accepts;
    accepts(...args: string[]): string | false | string[];
    is(types?: string): string | false;
    readonly type: string;
    readonly length: number;
    readonly secure: boolean;
    readonly ips: string[];
    readonly ip: string | string[];
    readonly header: import("http").IncomingHttpHeaders;
    readonly headers: import("http").IncomingHttpHeaders;
    readonly url: string;
    readonly origin: string;
    readonly protocol: string;
    readonly app: import("..").Plugin;
    readonly res: import("http").ServerResponse;
    readonly response: import("./response").default;
    get(field: string): string | string[];
}
