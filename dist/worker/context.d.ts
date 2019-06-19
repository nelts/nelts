/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
import * as Cookies from 'cookies';
import Plugin from '../plugin';
declare type ParamSchema = {
    [name: string]: string;
};
import Request from './request';
import Response from './response';
export interface ContextError extends Error {
    status?: number;
    expose?: boolean;
}
export default class Context {
    readonly app: Plugin;
    readonly req: IncomingMessage;
    readonly res: ServerResponse;
    readonly params: ParamSchema;
    readonly cookies: Cookies;
    readonly request: Request;
    readonly response: Response;
    silent: boolean;
    status: number;
    state: Record<any, any>;
    constructor(app: Plugin, req: IncomingMessage, res: ServerResponse, params?: ParamSchema);
    get(field: string): string | string[];
    onerror(err: ContextError): void;
}
export declare function ContextProxy(ctx: Context): Context;
export {};
