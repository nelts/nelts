/// <reference types="node" />
import { ServerResponse } from "http";
import Context from './context';
export declare type fieldValueSchema = string | number | string[];
export declare type fieldObjectSchema = {
    [name: string]: fieldValueSchema;
};
export default class Response {
    readonly ctx: Context;
    readonly res: ServerResponse;
    private _body;
    private _explicitStatus;
    [name: string]: any;
    constructor(ctx: Context, res: ServerResponse);
    lastModified: string | Date | number;
    etag: string;
    readonly headerSent: boolean;
    readonly app: import("..").Plugin;
    readonly req: import("http").IncomingMessage;
    readonly request: import("./request").default;
    readonly header: import("http").OutgoingHttpHeaders;
    readonly headers: import("http").OutgoingHttpHeaders;
    status: number;
    message: any;
    type: string;
    length: any;
    body: any;
    get(field: string): string | number | string[];
    set(field: string | fieldObjectSchema, val?: fieldValueSchema): void;
    remove(field: string): void;
    redirect(url: string, alt?: string): void;
    attachment(filename: string, options: any): void;
    is(types: string | string[]): string | false;
    append(field: string, val: any): void;
    flushHeaders(): void;
}
