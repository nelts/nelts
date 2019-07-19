# 安装

**Nelts** 提供了一套完整的脚手架来帮助您完成项目的创建、代码碎片生成、插件安装以及服务的启动重启等功能。

```bash
$ npm i -g pm2
$ pm2 install pm2-intercom
$ npm i -g @nelts/cli
```

通过 `nelts -h`命令我们可以看到具有以下的功能

```bash
shenyunjie:~ shenyunjie$ nelts -h
Usage: nelts [options] [command]

Options:
  -v, --version   output the version number
  -h, --help      output usage information

Commands:
  init [project]  create a new project with nelts.
```

通过`nelts-server -h`命令我们可以看到以下的功能

```bash
shenyunjie:~ shenyunjie$ nelts-server -h
Usage: nelts-server [options] [command]

Options:
  -v, --version    output the version number
  -h, --help       output usage information

Commands:
  dev [options]    run server as dev mode, env = development
  start [options]  run server with pm2, env = production
  restart          restart the production server
  stop             stop the production server
```

> `nelts`命令主要用于开发时候帮助我们解决一些重复劳动的问题，而`nelts-server`主要帮助我们调试、启动、重启和停止服务。

# 创建第一个项目

建议通过脚手架创建项目

```bash
$ nelts init my-project
$ cd my-project
$ npm ci
```

项目创建完毕后，您可以通过调试命令查看服务：

```bash
$ npm run dev
```

您可以打开`http://127.0.0.1:8080`查看到网页内容为`hello world`。

## 编译您的项目

因为项目使用 TS 编写的，那么需要编译后才能使用，编译后会在根目录下生成`dist/`目录，里面就是最终的服务代码。

```bash
$ npm run build
```

## 发布

您可以将生成后的整个项目放置在服务器上，然后运行您需要的命令：

```bash
$ npm run start # 启动服务
$ npm run restart # 重启服务
$ npm run stop # 停止服务
$ pm2 logs # 查看启动日志
```