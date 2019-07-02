import * as fs from 'fs';
import * as path from 'path';
import WorkerPlugin from '../worker/plugin';
// import AgentPlugin from '../agent/plugin';
import WorkerApplication from '../worker/index';
// import AgentApplication from '../agent/index';
import PluginCollectDependencies from './plugin-collect-dependencies';

export function MakeWorkerPluginRender(app: WorkerApplication) {
  const base = app.base;
  const node_module_path = path.resolve(base, 'node_modules');
  if (!fs.existsSync(node_module_path)) throw new Error('cannot find node_modules path');

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