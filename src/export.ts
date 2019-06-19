import Plugin from './plugin';
import _component_controller from './worker/components/controller';
import _decorator_prefix from './worker/decorators/router-prefix';
import _decorator_path from './worker/decorators/router-path';
import _decorator_method from './worker/decorators/router-method';
import _decorator_get from './worker/decorators/router-get';
import _decorator_post from './worker/decorators/router-post';
import _decorator_put from './worker/decorators/router-put';
import _decorator_delete from './worker/decorators/router-delete';
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

const Component = {
  Controller: _component_controller
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
  }
};

export {
  LRU,
  Plugin,
  Component,
  Decorator
}