
# 简介

**Nelts** 是一套运行在Nodejs环境中的企业应用级服务架构。它提供了一整套完整的编写服务端应用的解决方案。它对比其他同类型架构具有以下的优势：

- **高 [QPS](https://baike.baidu.com/item/QPS):** 通过 [Radix Tree](https://en.wikipedia.org/wiki/Radix_tree) 算法，提供高性能路由匹配能力，能够接近原生[HTTP](https://nodejs.org/dist/latest-v10.x/docs/api/http.html)的性能。
- **面向 [AOP](https://baike.baidu.com/item/AOP/1332219) 编程:** 通过 [TS](https://www.typescriptlang.org/) 提供的装饰器，面向切片编程，使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。
- **插件化业务功能:** 提供自启动与依赖启动模式来解偶业务开发，保证业务服务的复用性。同时支持功能插件、业务插件与混合插件模型，让用户可以随心所欲将服务解偶，提供颗粒度级别的分离度。
- **生态共通:** 复用 [Express](https://www.npmjs.com/package/express) 或者 [Koa](https://www.npmjs.com/package/koa) 的生态，让开发不闭塞。
- **动态Agent进程:** 可以随意分配辅助进程，进程可自启动也可以动态启动，不局限单个Agent进程，这使得架构能够处理非常特殊的场景，提供非常棒的辅助能力。
- **进程网关:** 能够处理进程产生的任意特殊错误或者崩溃，提供可用性。同时提供简单的IPC进程间通信方案，随意启动与关闭进程，类似进程间微服务。

为了让用户可以全面地了解到 **Nelts** 提供的这些特性，我们提供了一套生产实践代码供用户预览和使用，以便能够了解到业务编写的简单方便之处。

> [NILPPM](https://github.com/nilppm/npm): 一套基于nodejs轻量的私有源管理程序。

# 开源

此架构基于 [MIT](https://opensource.org/licenses/MIT) 协议：

- **GitHub** [https://github.com/nelts/nelts](https://github.com/nelts/nelts)
- **NPM** [https://www.npmjs.com/package/@nelts/nelts](https://www.npmjs.com/package/@nelts/nelts)

您可以分别从这2个地方了解到架构的版本更新和changelogs。

# 贡献

通过 [issue](https://github.com/nelts/nelts/issues) 或者 [pull request](https://github.com/nelts/nelts/pulls) 来贡献您的代码。