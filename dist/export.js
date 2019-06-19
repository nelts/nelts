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
const lru_1 = require("./helper/lru");
exports.LRU = lru_1.default;
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
    }
};
exports.Decorator = Decorator;
