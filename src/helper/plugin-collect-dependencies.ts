import * as fs from 'fs';
import * as path from 'path';
import Require from '../helper/require';

export interface COLLECT_OPTIONS {
  env: string,
  isWorker: boolean,
  agentName?: string,
}

export interface DEFINE_PLUGIN_OPTIONS {
  enable?: boolean,
  env?: string | Array<string>,
  worker?: boolean,
  agent?: string | Array<string>,
  package?: string,
  path?: string
}

export interface PLUGIN_COLLECT_RESULT {
  name: string,
  dependenties: string[],
}

export default function Collect(cwd: string, node_module_path: string, options: COLLECT_OPTIONS): PLUGIN_COLLECT_RESULT {
  const packageFilename = path.resolve(cwd, 'package.json');
  if (!fs.existsSync(packageFilename)) throw new Error('cannot find package.json');
  const packageExports = Require(packageFilename);
  if (!packageExports.plugin) packageExports.plugin = {};
  const moduleName = packageExports.name;
  const result: string[] = [];

  for (const packageName in packageExports.plugin) {
    const config: DEFINE_PLUGIN_OPTIONS = packageExports.plugin[packageName];

    let item: string;

    // resolve enable
    if (config.enable === undefined) config.enable = true;
    if (!config.enable) continue;

    // resolve env
    if (config.env === undefined) config.env = [];
    if (!Array.isArray(config.env)) config.env = [config.env];
    if (config.env.length && config.env.indexOf(options.env) === -1) continue;

    // resolve worker
    if (options.isWorker && !config.worker) continue;

    // resolve agent
    if (!options.isWorker) {
      if (config.agent === undefined) config.agent = [];
      if (!Array.isArray(config.agent)) config.agent = [config.agent];
      if (config.agent.length && config.agent.indexOf(options.agentName) === -1) continue;
    }

    // resolve path
    if (config.path) {
      if (!path.isAbsolute(config.path)) config.path = path.resolve(cwd, config.path);
      item = config.path;
    } else {
      const packageModulePath = path.resolve(node_module_path, packageName);
      if (!fs.existsSync(packageModulePath)) throw new Error('cannot find the module of `' + packageName + '`');
      item = packageModulePath;
    }

    result.push(item);
  }

  return {
    name: moduleName,
    dependenties: result
  };
}