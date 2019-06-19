"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = require("./plugin");
exports.Plugin = plugin_1.default;
const controller_1 = require("./worker/components/controller");
const router_prefix_1 = require("./worker/decorators/router-prefix");
const router_path_1 = require("./worker/decorators/router-path");
const router_method_1 = require("./worker/decorators/router-method");
const router_get_1 = require("./worker/decorators/router-get");
const router_post_1 = require("./worker/decorators/router-post");
const router_put_1 = require("./worker/decorators/router-put");
const router_delete_1 = require("./worker/decorators/router-delete");
const static_validator_header_1 = require("./worker/decorators/request/static-validator-header");
const static_validator_query_1 = require("./worker/decorators/request/static-validator-query");
const static_filter_1 = require("./worker/decorators/request/static-filter");
const dynamic_loader_1 = require("./worker/decorators/request/dynamic-loader");
const dynamic_validator_body_1 = require("./worker/decorators/request/dynamic-validator-body");
const dynamic_validator_file_1 = require("./worker/decorators/request/dynamic-validator-file");
const dynamic_filter_1 = require("./worker/decorators/request/dynamic-filter");
const guard_1 = require("./worker/decorators/request/guard");
const middleware_1 = require("./worker/decorators/middleware");
const response_1 = require("./worker/decorators/response");
const lru_1 = require("./helper/lru");
exports.LRU = lru_1.default;
const events_1 = require("./helper/events");
exports.AsyncEventEmitter = events_1.default;
const scope_1 = require("./scope");
exports.Scope = scope_1.default;
const Component = {
    Controller: controller_1.default
};
exports.Component = Component;
const Decorator = {
    Controller: {
        Prefix: router_prefix_1.default,
        Path: router_path_1.default,
        Method: router_method_1.default,
        Get: router_get_1.default,
        Post: router_post_1.default,
        Put: router_put_1.default,
        Delete: router_delete_1.default,
        Request: {
            Static: {
                Filter: static_filter_1.default,
                Validator: {
                    Header: static_validator_header_1.default,
                    Query: static_validator_query_1.default,
                },
            },
            Dynamic: {
                Loader: dynamic_loader_1.default,
                Filter: dynamic_filter_1.default,
                Validator: {
                    Body: dynamic_validator_body_1.default,
                    File: dynamic_validator_file_1.default,
                }
            },
        },
        Guard: guard_1.default,
        Response: response_1.default,
        Middleware: middleware_1.default,
    }
};
exports.Decorator = Decorator;
