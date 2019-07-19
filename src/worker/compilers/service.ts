import WorkerPlugin from '../plugin';
import globby from 'globby';
import Require from '../../helper/require';
export default async function Service<T extends WorkerPlugin>(plugin: T) {
  const cwd = plugin.source;
  const files = await globby([ 
    'service/**/*.ts', 
    'service/**/*.js', 
    '!service/**/*.d.ts' 
  ], { cwd });
  if (!plugin.service) plugin.service = {};
  files.forEach(file => {
    const callback = Require(file, cwd);
    if (typeof callback === 'function' && callback.name) {
      plugin.service[callback.name] = callback;
    }
  });
}