# 项目结构

这里我们将只对脚手架生成的项目进行描述。

> 这里需要理解一个点，每个项目可以看作一个插件，所以项目即插件，插件即项目。它可以自启动也可以多聚合依赖启动。

## 根目录

- `src/` 插件源文件目录
- `nelts.config.js` 插件参数配置文件
- `logger.js` 日志配置文件
- `.gitignore`
- `package-lock.json`
- `package.json` 插件描述文件
- `README.md` 描述文档
- `tsconfig.json` TS 配置文件


`logger.js`为日志配置文件。我们采用 [log4js](https://www.npmjs.com/package/log4js) 作为我们的日志处理模块。此文件就是用来配置 `log4js`。用法请看[这里](https://github.com/log4js-node/log4js-node#documentation)。


`package.json`文件比较特殊，我们额外增加了以下的属性字段：

- `source: 'dist' | 'src'` 对插件输出调用文件的文件夹描述，一般在开发调试期间，这里设定的值为`src`，而当编译后，这里应该设置为`dist`。插件默认 `dist`，所以在开发的时候理应改为`src`。
- `plugin: { [package name]: package }` 这里指定本插件依赖的自插件列表。

注意 `plugin` 字段结构是这样的

```javascript
type plugin = {
  [options: string]: {
    enable?: boolean,
    env?: string | Array<string>,
    worker?: boolean,
    agent?: string | Array<string>,
    package?: string,
    path?: string
  }
}
```

- `[options].enable` 表示是否启动插件，默认`undefined`启动。
- `[options].env` 表示插件运行的环境，环境一般指`process.env.NODE_ENV`环境，默认`undefined`，可在任意环境上运行。当指定特定环境，那么该插件只在此环境中执行。
- `[options].worker` 表示是否在worker进程上启动，即在服务进程上启动。
- `[options].agent` 表示在哪个agent进程上启动。
- `[options].package` 表示这个依赖插件的模块包名，一般用于生成，它与`path`互斥，优先级略低。
- `[options].path` 表示这个依赖插件的目录，一般用于开发，它与`package`互斥，优先级略高。

## src目录

一般，它具有以下的目录结构

- `src/controller` Controller层文件存放处。该目录下的文件将被自动loader后注入路由到服务中。
- `src/middleware` Middleware层文件存放处。该目录下的文件将自动loader后注入到插件对象上。
- `src/service` Service层文件存放处。该目录下文件将自动loader后注入到插件对象上。
- `app.ts` 插件服务启动初始化文件。

### src/controller

Controller在这里被设计为AOP编程，用于简化路由设定和其他各种中间件嵌入。

```javascript
// src/controller/index.ts
import { Component, Decorator, WorkerPlugin, Context } from '@nelts/nelts';
const Controller = Decorator.Controller;

@Controller.Prefix('/api')
export default class IndexController extends Component.Controller {
  constructor(app: WorkerPlugin) {
    super(app);
  }

  @Controller.Get('/hello')
  async Home(ctx: Context) {
    ctx.body = 'hello world';
  }
}
```

当我们访问`/api/hello`路由，页面将看到 `hello world` 。

### src/middleware

Middleware中间件，类似`KOA`的中间件。

```javascript
import { Context } from '@nelts/nelts';
export default async function LoggerError(ctx: Context, next: Function) {
  ctx.on('error', (err: Error) => console.error(err));
  await next();
}
```

### src/service

Service才是具体的业务逻辑处理文件。我们可以通过在Controller层上调用service下的文件来调用里面的方法。

```javascript
import { Component, NELTS_CONFIGS, Context } from '@nelts/nelts';

export default class SumService extends Component.Service<Context> {
  private configs: NELTS_CONFIGS;
  constructor(ctx: NPMContext) {
    super(ctx);
    this.configs = ctx.app.configs;
  }

  sum(a: number, b: number) {
    return a + b;
  }
}
```

我们可以在Controller上这样调用

```javascript
import { Component, Decorator, WorkerPlugin, Context } from '@nelts/nelts';
const Controller = Decorator.Controller;

@Controller.Prefix('/api')
export default class IndexController extends Component.Controller {
  constructor(app: WorkerPlugin) {
    super(app);
  }

  @Controller.Get('/hello')
  async Home(ctx: Context) {
    const SumService = new this.service.SumService(this.ctx);
    ctx.body = {
      total: SumService.sum(3, 4)
    }
  }
}
```

那么我们在页面`get:/api/hello`上能够看到 `{ total: 7 }`。

### src/app.ts

初始化文件。它主要被用来处理`props`参数注入和生命周期的统一拦截。

```javascript
import { WorkerPlugin, ContextError, Context } from '@nelts/nelts';

export default (plu: WorkerPlugin) => {
  app.on('ServerStarted', () => console.log('nelts life [ServerStarted] invoked.'));
  app.on('ServerStopping', () => console.log('nelts life [ServerStopping] invoked.'));
  app.on('ServerStopped', () => console.log('nelts life [ServerStopped] invoked.'));
  app.on('ContextStaticValidator', (ctx: Context) => console.log('nelts context life [ContextStaticValidator] invoked.'));
  app.on('ContextStaticFilter', (ctx: Context) => console.log('nelts context life [ContextStaticFilter] invoked.'));
  app.on('ContextDynamicLoader', (ctx: Context) => console.log('nelts context life [ContextDynamicLoader] invoked.'));
  app.on('ContextDynamicValidator', (ctx: Context) => console.log('nelts context life [ContextDynamicValidator] invoked.'));
  app.on('ContextDynamicFilter', (ctx: Context) => console.log('nelts context life [ContextDynamicFilter] invoked.'));
  app.on('ContextGuard', (ctx: Context) => console.log('nelts context life [ContextGuard] invoked.'));
  app.on('ContextMiddleware', (ctx: Context) => console.log('nelts context life [ContextMiddleware] invoked.'));
  app.on('ContextRuntime', (ctx: Context) => console.log('nelts context life [ContextRuntime] invoked.'));
  app.on('ContextResponse', (ctx: Context) => console.log('nelts context life [ContextResponse] invoked.'));
  app.on('ContextResolve', (ctx: Context) => console.log('nelts context life status [ContextResolve] invoked.'));
  app.on('ContextReject', (e: Error, ctx: Context) => console.log('nelts context life status [ContextReject] invoked.'));

  // 向子依赖注入参数
  plu.on('props', async configs => await plu.getComponent('@nelts/orm').props({
    sequelize: configs.sequelize,
    redis: configs.redis,
    redis_prefix: configs.redis_prefix,
  }));

  // 请求级别错误容错处理
  plu.on('ContextStart', (ctx: NPMContext) => {
    ctx.on('error', (err: ContextError) => {
      console.error(err);
      ctx.status = err.status || 422;
      ctx.body = {
        status: ctx.status,
        error: err.message,
      }
    });
  });

  // 辅助请求拦截事件
  plu.app.use(async (req, res, next) => {
    console.log(` - [${req.method}] inComingRequest:`, req.url, req.headers);
    await next();
  });
}
```