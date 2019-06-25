import 'reflect-metadata';
import * as path from 'path';
import Plugin from '../../plugin';
import globby from 'globby';
import Context from '../context';
import DecoratorNameSpace from '../decorators/namespace';
import * as Compose from 'koa-compose';
import { ContextError } from '../context';
import ajvChecker from '../../helper/ajv-checker';
import * as statuses from 'statuses';
import isJSON from '../../helper/is-json';
import * as Stream from 'stream';
import { Require } from '../../export';

interface CONTROLLER_DECS {
  REQUEST_STATIC_VALIDATOR_HEADER: object,
  REQUEST_STATIC_VALIDATOR_QUERY: object,
  REQUEST_STATIC_FILTER: Compose.Middleware<Context>[],
  REQUEST_DYNAMIC_LOADER: Compose.Middleware<Context>[],
  REQUEST_DYNAMIC_VALIDATOR_BODY: object,
  REQUEST_DYNAMIC_VALIDATOR_FILE: object,
  REQUEST_DYNAMIC_FILTER: Compose.Middleware<Context>[],
  REQUEST_GUARD: Compose.Middleware<Context>[],
  MIDDLEWARE: Compose.Middleware<Context>[],
  RESPONSE: Compose.Middleware<Context>[],
}

export default async function Controller(plugin: Plugin) {
  const cwd = plugin.source;
  const files = await globby([
    'controller/**/*.ts', 
    'controller/**/*.js', 
    '!controller/**/*.d.ts', 
  ], { cwd });
  files.forEach((file: string) => render(plugin, path.resolve(cwd, file)));
}

function render(plugin: Plugin, file: string) {
  let fileExports: any = Require(file);
  if (fileExports.scoped) fileExports = fileExports(plugin);
  const controllerPrefix = Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_PREFIX, fileExports) || '/';
  const controllerProperties = Object.getOwnPropertyNames(fileExports.prototype);
  const app = plugin.app;
  for (let i = 0; i < controllerProperties.length; i++) {
    const property = controllerProperties[i];
    const target = fileExports.prototype[property];
    if (property === 'constructor') continue;
    const paths = Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_PATH, target) || '/';
    const methods = Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_METHOD, target) || [];
    if (!methods.length) continue;
    const CurrentRouterPath = !paths.startsWith('/') ? '/' + paths : paths;
    const CurrentRouterPrefix = controllerPrefix.endsWith('/') 
      ? controllerPrefix.substring(0, controllerPrefix.length - 1)
      : controllerPrefix;

    const DECS: CONTROLLER_DECS = {
      REQUEST_STATIC_VALIDATOR_HEADER: Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_STATIC_VALIDATOR_HEADER, target),
      REQUEST_STATIC_VALIDATOR_QUERY: Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_STATIC_VALIDATOR_QUERY, target),
      REQUEST_STATIC_FILTER: Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_STATIC_FILTER, target),
      REQUEST_DYNAMIC_LOADER: Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_DYNAMIC_LOADER, target),
      REQUEST_DYNAMIC_VALIDATOR_BODY: Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_DYNAMIC_VALIDATOR_BODY, target),
      REQUEST_DYNAMIC_VALIDATOR_FILE: Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_DYNAMIC_VALIDATOR_FILE, target),
      REQUEST_DYNAMIC_FILTER: Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_DYNAMIC_FILTER, target),
      REQUEST_GUARD: Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_GUARD, target),
      MIDDLEWARE: Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_MIDDLEWARE, target),
      RESPONSE: Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_RESPONSE, target),
    }

    app.router.on(methods, CurrentRouterPrefix + CurrentRouterPath, (req, res, params) => {
      const ctx = new Context(plugin, req, res, params);
      const fns = addComposeCallback(DECS, fileExports, property, plugin);
      ctx.app.root.broadcast('ContextStart', ctx)
        .then(() => Compose(fns)(ctx))
        .catch(async (e: ContextError) => {
          if (ctx.listenerCount('error')) {
            await ctx.emit('error', e);
          } else {
            ctx.status = (e && e.status) || 500;
            ctx.body = e.message;
          }
          return ctx.rollback(e);
        })
        .then(() => ctx.commit())
        .then(() => ctx.app.root.broadcast('ContextStop', ctx))
        .catch((e: ContextError) => {
          ctx.status = (e && e.status) || 500;
          ctx.body = e.message;
        })
        .then(() => respond(ctx));
    });
  }
}

function addComposeCallback(
  options: CONTROLLER_DECS, 
  controller: any, 
  property: PropertyKey, 
  plugin: Plugin
) {
  const callbacks: Compose.Middleware<Context>[] = [];
  // 校验 headers 和 querys 的参数是否合法
  callbacks.push(async (ctx, next) => {
    const staticValidators = [];
    if (options.REQUEST_STATIC_VALIDATOR_HEADER) staticValidators.push(ajvChecker(options.REQUEST_STATIC_VALIDATOR_HEADER, ctx.request.headers, 'Header'));
    if (options.REQUEST_STATIC_VALIDATOR_QUERY) staticValidators.push(ajvChecker(options.REQUEST_STATIC_VALIDATOR_QUERY, ctx.request.query, 'Query'));
    await Promise.all(staticValidators);
    await next();
  });

  // 广播`ContextStaticValidator`生命周期
  addContextLife('ContextStaticValidator');

  // 静态参数最终处理
  if (options.REQUEST_STATIC_FILTER) callbacks.push(...options.REQUEST_STATIC_FILTER);

  // 广播`ContextStaticFilter`生命周期
  addContextLife('ContextStaticFilter');

  // 如何获取动态参数中间件
  if (options.REQUEST_DYNAMIC_LOADER) {
    callbacks.push(...options.REQUEST_DYNAMIC_LOADER);
    callbacks.push(async (ctx: Context, next: Function) => {
      if (!ctx.request.body && !ctx.request.files) throw new Error('miss body or files, please check `@Dynamic.Loader` is working all right?');
      await next();
    });
  }

  // 广播`ContextDynamicLoader`生命周期
  addContextLife('ContextDynamicLoader');

  // 校验动态参数
  callbacks.push(async (ctx, next) => {
    const dynamicValidators = [];
    if (options.REQUEST_DYNAMIC_VALIDATOR_BODY) dynamicValidators.push(ajvChecker(options.REQUEST_DYNAMIC_VALIDATOR_BODY, ctx.request.body, 'Body'));
    if (options.REQUEST_DYNAMIC_VALIDATOR_FILE) dynamicValidators.push(ajvChecker(options.REQUEST_DYNAMIC_VALIDATOR_FILE, ctx.request.files, 'File'));
    await Promise.all(dynamicValidators);
    await next();
  });

  // 广播`ContextDynamicValidator`生命周期
  addContextLife('ContextDynamicValidator');

  // 动态参数最终处理
  if (options.REQUEST_DYNAMIC_FILTER) callbacks.push(...options.REQUEST_DYNAMIC_FILTER);

  // 广播`ContextDynamicFilter`生命周期
  addContextLife('ContextDynamicFilter');

  // 守卫中间件
  if (options.REQUEST_GUARD) callbacks.push(...options.REQUEST_GUARD);

  // 广播`ContextGuard`生命周期
  addContextLife('ContextGuard');

  // 逻辑中间件
  if (options.MIDDLEWARE) callbacks.push(...options.MIDDLEWARE);

  // 广播`ContextMiddleware`生命周期
  addContextLife('ContextMiddleware');

  // 逻辑处理
  callbacks.push(async (ctx: Context, next: Function) => {
    const object = new controller(plugin);
    await object[property](ctx);
    await next();
  });

  // 广播`ContextRuntime`生命周期
  addContextLife('ContextRuntime');

  // 最终输出处理中间件
  if (options.RESPONSE) callbacks.push(...options.RESPONSE);

  // 广播`ContextResponse`生命周期
  addContextLife('ContextResponse');

  return callbacks;

  function addContextLife(name: string) {
    callbacks.push(async (ctx:Context, next: Function) => {
      await ctx.app.root.broadcast(name, ctx);
      await next();
    })
  }
}

function respond(ctx: Context) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  const res = ctx.res;
  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ('HEAD' == ctx.method) {
    if (!res.headersSent && isJSON(body)) {
      ctx.length = Buffer.byteLength(JSON.stringify(body));
    }
    return res.end();
  }

  // status body
  if (null == body) {
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      body = ctx.message || String(code);
    }
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}