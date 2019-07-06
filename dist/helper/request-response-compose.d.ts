/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
export declare type NextCallback = () => Promise<any>;
export declare type Middleware = (req: IncomingMessage, res: ServerResponse, next: NextCallback) => any;
export declare type ComposedMiddleware = (req: IncomingMessage, res: ServerResponse, next?: () => Promise<any>) => Promise<void>;
export default function RequstAndResponseCompose(middleware: Middleware[]): ComposedMiddleware;
