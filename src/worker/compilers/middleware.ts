import WorkerPlugin from '../plugin';
import globby from 'globby';
import { Require } from '../../export';
export default async function Middleware(plugin: WorkerPlugin) {
  const cwd = plugin.source;
  const files = await globby([ 
    'middleware/**/*.ts', 
    'middleware/**/*.js', 
    '!middleware/**/*.d.ts' 
  ], { cwd });
  if (!plugin.middleware) plugin.middleware = {};
  files.forEach(file => {
    const callback = Require(file, cwd);
    if (typeof callback === 'function' && callback.name) {
      plugin.middleware[callback.name] = callback;
    }
  });
}