/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
import * as Cookies from 'cookies';
import Plugin from '../plugin';
declare type ParamSchema = {
    [name: string]: string;
};
import Request from './request';
import Response, { fieldObjectSchema, fieldValueSchema } from './response';
import AsyncEventEmitter from '../helper/events';
export interface ContextError extends Error {
    status?: number;
    expose?: boolean;
}
export default class Context extends AsyncEventEmitter {
    readonly app: Plugin;
    readonly req: IncomingMessage;
    readonly res: ServerResponse;
    readonly params: ParamSchema;
    readonly cookies: Cookies;
    readonly request: Request;
    readonly response: Response;
    silent: boolean;
    state: Record<any, any>;
    respond: boolean;
    constructor(app: Plugin, req: IncomingMessage, res: ServerResponse, params?: ParamSchema);
    readonly query: import("./request").RequestQuerySchema;
    readonly header: import("http").IncomingHttpHeaders;
    readonly headers: import("http").IncomingHttpHeaders;
    set(field: string | fieldObjectSchema, val?: fieldValueSchema): void;
    get(field: string): string | string[];
    onerror(err: ContextError): void;
    body: any;
    status: number;
    readonly method: string;
    length: number;
    message: any;
    type: string;
    redirect(url: string, alt?: string): void;
    attachment(filename: string, options: any): void;
    is(types: string | string[]): string | false;
    append(field: string, val: any): void;
    flushHeaders(): void;
}
export declare function ContextProxy(ctx: Context): Context;
export {};
