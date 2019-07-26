import Plugin from './plugin';
import WorkerPlugin from './worker/plugin';
import AgentPlugin from './agent/plugin';
import WorkerApplciation from './worker/index';
import AgentApplciation from './agent/index';
import _component_agent from './agent/components/base';
import _component_controller from './worker/components/controller';
import _component_service from './worker/components/service';
import _decorator_prefix from './worker/decorators/router/prefix';
import _decorator_path from './worker/decorators/router/path';
import _decorator_method from './worker/decorators/router/method';
import _decorator_get from './worker/decorators/router/get';
import _decorator_post from './worker/decorators/router/post';
import _decorator_put from './worker/decorators/router/put';
import _decorator_delete from './worker/decorators/router/delete';
import _decorator_request_static_validator_header from './worker/decorators/request/static-validator-header';
import _decorator_request_static_validator_query from './worker/decorators/request/static-validator-query';
import _decorator_request_static_filter from './worker/decorators/request/static-filter';
import _decorator_request_dynamic_loader from './worker/decorators/request/dynamic-loader';
import _decorator_request_dynamic_validator_body from './worker/decorators/request/dynamic-validator-body';
import _decorator_request_dynamic_validator_file from './worker/decorators/request/dynamic-validator-file';
import _decorator_request_dynamic_filter from './worker/decorators/request/dynamic-filter';
import _decorator_request_guard from './worker/decorators/request/guard';
import _decorator_middleware from './worker/decorators/middleware';
import _decorator_response from './worker/decorators/response';
import LRU from './helper/lru';
import AsyncEventEmitter, { AsyncEventEmitterListener } from './helper/events';
import Scope from './scope';
import Context, { ContextError } from './worker/context';
import JSON_SCHEMA from './worker/extra/json-schema';
import * as Body from '@nelts/nelts-body';
import Require from './helper/require';
import UsedCompose, { NextCallback, Middleware, ComposedMiddleware } from './helper/request-response-compose';
import AjvChecker from './helper/ajv-checker';
import AjvFormatter from './helper/ajv-string-formater';
export interface NELTS_CONFIGS {
    cookie?: string[];
    [name: string]: any;
}
export declare type CustomExtendableType<T> = {
    [K in keyof T]: T[K];
};
declare const Component: {
    Controller: typeof _component_controller;
    Service: typeof _component_service;
    Agent: typeof _component_agent;
};
declare const Decorator: {
    Controller: {
        Prefix: typeof _decorator_prefix;
        Path: typeof _decorator_path;
        Method: typeof _decorator_method;
        Get: typeof _decorator_get;
        Post: typeof _decorator_post;
        Put: typeof _decorator_put;
        Delete: typeof _decorator_delete;
        Request: {
            Static: {
                Filter: typeof _decorator_request_static_filter;
                Validator: {
                    Header: typeof _decorator_request_static_validator_header;
                    Query: typeof _decorator_request_static_validator_query;
                };
            };
            Dynamic: {
                Loader: typeof _decorator_request_dynamic_loader;
                Filter: typeof _decorator_request_dynamic_filter;
                Validator: {
                    Body: typeof _decorator_request_dynamic_validator_body;
                    File: typeof _decorator_request_dynamic_validator_file;
                };
            };
        };
        Guard: typeof _decorator_request_guard;
        Response: typeof _decorator_response;
        Middleware: typeof _decorator_middleware;
    };
    Ipc: MethodDecorator;
    Feedback: MethodDecorator;
    Auto: ClassDecorator;
    Schedule: (cron: string | Date | import("moment").Moment, runOnInit?: boolean) => MethodDecorator;
};
declare const Extra: {
    JSON_SCHEMA: typeof JSON_SCHEMA;
    Body: typeof Body;
};
export { LRU, Scope, Extra, Require, Plugin, Context, Component, Decorator, AjvChecker, Middleware, AgentPlugin, UsedCompose, AjvFormatter, WorkerPlugin, ContextError, NextCallback, AgentApplciation, WorkerApplciation, AsyncEventEmitter, ComposedMiddleware, AsyncEventEmitterListener, };
