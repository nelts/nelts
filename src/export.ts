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
import _decorator_ipc from './agent/decorators/ipc';
import _decorator_feedback from './agent/decorators/feedback';
import _decorator_auto from './agent/decorators/auto';
import _decorator_schedule from './agent/decorators/schedule';
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
  cookie?: string[],
  [name: string]: any,
}

export type CustomExtendableType<T> = {
  [K in keyof T]: T[K];
}

const Component = {
  Controller: _component_controller,
  Service: _component_service,
  Agent: _component_agent
}

const Decorator = {
  Controller: {
    Prefix: _decorator_prefix,
    Path: _decorator_path,
    Method: _decorator_method,
    Get: _decorator_get,
    Post: _decorator_post,
    Put: _decorator_put,
    Delete: _decorator_delete,
    Request: {
      Static: {
        Filter: _decorator_request_static_filter,
        Validator: {
          Header: _decorator_request_static_validator_header,
          Query: _decorator_request_static_validator_query,
        },
      },
      Dynamic: {
        Loader: _decorator_request_dynamic_loader,
        Filter: _decorator_request_dynamic_filter,
        Validator: {
          Body: _decorator_request_dynamic_validator_body,
          File: _decorator_request_dynamic_validator_file,
        }
      },
    },
    Guard: _decorator_request_guard,
    Response: _decorator_response,
    Middleware: _decorator_middleware,
  },
  Ipc: _decorator_ipc,
  Feedback: _decorator_feedback,
  Auto: _decorator_auto,
  Schedule: _decorator_schedule,
};

const Extra = {
  JSON_SCHEMA,
  Body
}

export {
  LRU,
  Scope,
  Extra,
  Require,
  Plugin,
  Context,
  Component,
  Decorator,
  AjvChecker,
  Middleware,
  AgentPlugin,
  UsedCompose,
  AjvFormatter,
  WorkerPlugin,
  ContextError,
  NextCallback,
  AgentApplciation,
  WorkerApplciation,
  AsyncEventEmitter,
  ComposedMiddleware,
  AsyncEventEmitterListener,
}

export function RunFunctionalResult(target: any) {
  try{
    return Promise.resolve(target);
  } catch(e) {
    return Promise.reject(e);
  }
}