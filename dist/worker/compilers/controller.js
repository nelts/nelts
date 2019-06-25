"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path = require("path");
const globby_1 = require("globby");
const context_1 = require("../context");
const namespace_1 = require("../decorators/namespace");
const Compose = require("koa-compose");
const ajv_checker_1 = require("../../helper/ajv-checker");
const statuses = require("statuses");
const is_json_1 = require("../../helper/is-json");
const Stream = require("stream");
const export_1 = require("../../export");
async function Controller(plugin) {
    const cwd = plugin.source;
    const files = await globby_1.default([
        'controller/**/*.ts',
        'controller/**/*.js',
        '!controller/**/*.d.ts',
    ], { cwd });
    files.forEach((file) => render(plugin, path.resolve(cwd, file)));
}
exports.default = Controller;
function render(plugin, file) {
    let fileExports = export_1.Require(file);
    if (fileExports.scoped)
        fileExports = fileExports(plugin);
    const controllerPrefix = Reflect.getMetadata(namespace_1.default.CONTROLLER_PREFIX, fileExports) || '/';
    const controllerProperties = Object.getOwnPropertyNames(fileExports.prototype);
    const app = plugin.app;
    for (let i = 0; i < controllerProperties.length; i++) {
        const property = controllerProperties[i];
        const target = fileExports.prototype[property];
        if (property === 'constructor')
            continue;
        const paths = Reflect.getMetadata(namespace_1.default.CONTROLLER_PATH, target) || '/';
        const methods = Reflect.getMetadata(namespace_1.default.CONTROLLER_METHOD, target) || [];
        if (!methods.length)
            continue;
        const CurrentRouterPath = !paths.startsWith('/') ? '/' + paths : paths;
        const CurrentRouterPrefix = controllerPrefix.endsWith('/')
            ? controllerPrefix.substring(0, controllerPrefix.length - 1)
            : controllerPrefix;
        const DECS = {
            REQUEST_STATIC_VALIDATOR_HEADER: Reflect.getMetadata(namespace_1.default.CONTROLLER_STATIC_VALIDATOR_HEADER, target),
            REQUEST_STATIC_VALIDATOR_QUERY: Reflect.getMetadata(namespace_1.default.CONTROLLER_STATIC_VALIDATOR_QUERY, target),
            REQUEST_STATIC_FILTER: Reflect.getMetadata(namespace_1.default.CONTROLLER_STATIC_FILTER, target),
            REQUEST_DYNAMIC_LOADER: Reflect.getMetadata(namespace_1.default.CONTROLLER_DYNAMIC_LOADER, target),
            REQUEST_DYNAMIC_VALIDATOR_BODY: Reflect.getMetadata(namespace_1.default.CONTROLLER_DYNAMIC_VALIDATOR_BODY, target),
            REQUEST_DYNAMIC_VALIDATOR_FILE: Reflect.getMetadata(namespace_1.default.CONTROLLER_DYNAMIC_VALIDATOR_FILE, target),
            REQUEST_DYNAMIC_FILTER: Reflect.getMetadata(namespace_1.default.CONTROLLER_DYNAMIC_FILTER, target),
            REQUEST_GUARD: Reflect.getMetadata(namespace_1.default.CONTROLLER_GUARD, target),
            MIDDLEWARE: Reflect.getMetadata(namespace_1.default.CONTROLLER_MIDDLEWARE, target),
            RESPONSE: Reflect.getMetadata(namespace_1.default.CONTROLLER_RESPONSE, target),
        };
        app.router.on(methods, CurrentRouterPrefix + CurrentRouterPath, (req, res, params) => {
            const ctx = new context_1.default(plugin, req, res, params);
            const fns = addComposeCallback(DECS, fileExports, property, plugin);
            ctx.app.root.broadcast('ContextStart', ctx)
                .then(() => Compose(fns)(ctx))
                .catch(async (e) => {
                if (ctx.listenerCount('error')) {
                    await ctx.emit('error', e);
                }
                else {
                    ctx.status = (e && e.status) || 500;
                    ctx.body = e.message;
                }
                return ctx.rollback(e);
            })
                .then(() => ctx.commit())
                .then(() => ctx.app.root.broadcast('ContextStop', ctx))
                .catch((e) => {
                ctx.status = (e && e.status) || 500;
                ctx.body = e.message;
            })
                .then(() => respond(ctx));
        });
    }
}
function addComposeCallback(options, controller, property, plugin) {
    const callbacks = [];
    callbacks.push(async (ctx, next) => {
        const staticValidators = [];
        if (options.REQUEST_STATIC_VALIDATOR_HEADER)
            staticValidators.push(ajv_checker_1.default(options.REQUEST_STATIC_VALIDATOR_HEADER, ctx.request.headers, 'Header'));
        if (options.REQUEST_STATIC_VALIDATOR_QUERY)
            staticValidators.push(ajv_checker_1.default(options.REQUEST_STATIC_VALIDATOR_QUERY, ctx.request.query, 'Query'));
        await Promise.all(staticValidators);
        await next();
    });
    addContextLife('ContextStaticValidator');
    if (options.REQUEST_STATIC_FILTER)
        callbacks.push(...options.REQUEST_STATIC_FILTER);
    addContextLife('ContextStaticFilter');
    if (options.REQUEST_DYNAMIC_LOADER) {
        callbacks.push(...options.REQUEST_DYNAMIC_LOADER);
        callbacks.push(async (ctx, next) => {
            if (!ctx.request.body && !ctx.request.files)
                throw new Error('miss body or files, please check `@Dynamic.Loader` is working all right?');
            await next();
        });
    }
    addContextLife('ContextDynamicLoader');
    callbacks.push(async (ctx, next) => {
        const dynamicValidators = [];
        if (options.REQUEST_DYNAMIC_VALIDATOR_BODY)
            dynamicValidators.push(ajv_checker_1.default(options.REQUEST_DYNAMIC_VALIDATOR_BODY, ctx.request.body, 'Body'));
        if (options.REQUEST_DYNAMIC_VALIDATOR_FILE)
            dynamicValidators.push(ajv_checker_1.default(options.REQUEST_DYNAMIC_VALIDATOR_FILE, ctx.request.files, 'File'));
        await Promise.all(dynamicValidators);
        await next();
    });
    addContextLife('ContextDynamicValidator');
    if (options.REQUEST_DYNAMIC_FILTER)
        callbacks.push(...options.REQUEST_DYNAMIC_FILTER);
    addContextLife('ContextDynamicFilter');
    if (options.REQUEST_GUARD)
        callbacks.push(...options.REQUEST_GUARD);
    addContextLife('ContextGuard');
    if (options.MIDDLEWARE)
        callbacks.push(...options.MIDDLEWARE);
    addContextLife('ContextMiddleware');
    callbacks.push(async (ctx, next) => {
        const object = new controller(plugin);
        await object[property](ctx);
        await next();
    });
    addContextLife('ContextRuntime');
    if (options.RESPONSE)
        callbacks.push(...options.RESPONSE);
    addContextLife('ContextResponse');
    return callbacks;
    function addContextLife(name) {
        callbacks.push(async (ctx, next) => {
            await ctx.app.root.broadcast(name, ctx);
            await next();
        });
    }
}
function respond(ctx) {
    if (false === ctx.respond)
        return;
    const res = ctx.res;
    let body = ctx.body;
    const code = ctx.status;
    if (statuses.empty[code]) {
        ctx.body = null;
        return res.end();
    }
    if ('HEAD' == ctx.method) {
        if (!res.headersSent && is_json_1.default(body)) {
            ctx.length = Buffer.byteLength(JSON.stringify(body));
        }
        return res.end();
    }
    if (null == body) {
        if (ctx.req.httpVersionMajor >= 2) {
            body = String(code);
        }
        else {
            body = ctx.message || String(code);
        }
        if (!res.headersSent) {
            ctx.type = 'text';
            ctx.length = Buffer.byteLength(body);
        }
        return res.end(body);
    }
    if (Buffer.isBuffer(body))
        return res.end(body);
    if ('string' == typeof body)
        return res.end(body);
    if (body instanceof Stream)
        return body.pipe(res);
    body = JSON.stringify(body);
    if (!res.headersSent) {
        ctx.length = Buffer.byteLength(body);
    }
    res.end(body);
}
