/// <reference types="node" />
/// <reference types="accepts" />
import { IncomingMessage, ServerResponse } from "http";
import * as Cookies from 'cookies';
import Plugin from './plugin';
declare type ParamSchema = {
    [name: string]: string;
};
import Request from './request';
import Response, { fieldObjectSchema, fieldValueSchema } from './response';
import AsyncEventEmitter from '../helper/events';
import { ContextError } from './context';
import { ProcessMessageSendOptions } from '../messager';
declare type StackCallback = () => Promise<any>;
export interface ContextError extends Error {
    status?: number;
    expose?: boolean;
}
export default class Context<T extends Plugin> extends AsyncEventEmitter {
    readonly app: T;
    readonly req: IncomingMessage;
    readonly res: ServerResponse;
    readonly params: ParamSchema;
    readonly cookies: Cookies;
    readonly request: Request<T, Context<T>>;
    readonly response: Response<T, Context<T>>;
    private _stacks;
    private _stackStatus;
    silent: boolean;
    state: Map<any, any>;
    respond: boolean;
    [label: string]: any;
    constructor(app: T, req: IncomingMessage, res: ServerResponse, params?: ParamSchema);
    throw(message: Error | string, code?: number): void;
    error(message: Error | string, code?: number): ContextError;
    readonly messager: import("../messager").default<import(".").default>;
    send(method: string, data?: any, options?: ProcessMessageSendOptions): number;
    asyncSend(method: string, data?: any, options?: ProcessMessageSendOptions): Promise<unknown>;
    asyncHealth(): Promise<unknown>;
    stash(fn: StackCallback): this;
    commit(): Promise<void>;
    rollback(e: ContextError): Promise<void>;
    readonly logger: import("log4js").Logger;
    readonly query: import("./request").RequestQuerySchema;
    readonly header: import("http").IncomingHttpHeaders;
    readonly headers: import("http").IncomingHttpHeaders;
    set(field: string | fieldObjectSchema, val?: fieldValueSchema): void;
    get(field: string): string | string[];
    onerror(err: ContextError): void;
    readonly accept: import("accepts").Accepts;
    readonly url: string;
    ip: string;
    body: any;
    status: number;
    readonly method: string;
    length: number;
    message: any;
    type: string;
    lastModified: string | Date | number;
    etag: string;
    readonly headerSent: boolean;
    redirect(url: string, alt?: string): void;
    attachment(filename: string, options: any): void;
    is(types: string | string[]): string | false;
    append(field: string, val: any): void;
    flushHeaders(): void;
    remove(value: string): void;
}
export {};
