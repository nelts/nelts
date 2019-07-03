import * as fs from 'fs';
import * as path from 'path';
import WorkerPlugin from '../worker/plugin';
import WorkerApplication from '../worker/index';
import PluginCollectDependencies from './plugin-collect-dependencies';
import findNodeModules from './find-node-modules';

export function MakeWorkerPluginRender(app: WorkerApplication) {
  const base = app.base;
  let node_module_paths = findNodeModules({ cwd: base, relative: false });
  if (!node_module_paths.length) throw new Error('cannot find node_modules path');
  const node_module_path = node_module_paths[0];
  async function dispatch(component_path: string, root?: WorkerPlugin) {
    const { name, dependenties } = PluginCollectDependencies(
      component_path, 
      node_module_path, 
      { env: app.env, isWorker: true }
    );
    if (!app.plugins[name]) app.plugins[name] = new WorkerPlugin(app, name, component_path);
    if (!root) root = app.plugins[name];
    app.plugins[name].root = root;
    const childrens = await Promise.all(dependenties.map(dep => dispatch(dep, root)));
    app.plugins[name].setComponent(...childrens.map(child => child.name));
    app.compiler.addPlugin(app.plugins[name]);
    return app.plugins[name];
  }

  return dispatch;
}