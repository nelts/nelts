import * as fs from 'fs';
import * as path from 'path';
import PluginCollectDependencies from './plugin-collect-dependencies';
import Plugin from '../plugin';
import Component from '../worker/index';

export default function MakePluginRender(app: Component, isWorker: boolean) {
  const base = app.base;
  const node_module_path = path.resolve(base, 'node_modules');
  if (!fs.existsSync(node_module_path)) throw new Error('cannot find node_modules path');

  async function dispatch(component_path: string) {
    const { name, dependenties } = PluginCollectDependencies(component_path, node_module_path, { env: app.env, isWorker });
    if (!app.plugins[name]) app.plugins[name] = new Plugin(app, name, component_path);
    const childrens = await Promise.all(dependenties.map(dep => dispatch(dep)));
    app.plugins[name].setComponent(...childrens.map(child => child.name));
    app.compiler.addPlugin(app.plugins[name]);
    return app.plugins[name];
  }

  return dispatch;
}