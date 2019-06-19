import Plugin from './plugin';
import _component_controller from './worker/components/controller';
import _decorator_prefix from './worker/decorators/router-prefix';
import _decorator_path from './worker/decorators/router-path';
import _decorator_method from './worker/decorators/router-method';
import _decorator_get from './worker/decorators/router-get';
import _decorator_post from './worker/decorators/router-post';
import _decorator_put from './worker/decorators/router-put';
import _decorator_delete from './worker/decorators/router-delete';
import LRU from './helper/lru';
declare const Component: {
    Controller: typeof _component_controller;
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
    };
};
export { LRU, Plugin, Component, Decorator };
