import Plugin from '../../plugin';
import globby from 'globby';
import { Require } from '../../export';
export default async function Service(plugin: Plugin) {
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
      plugin.service[callback.name] = new callback(plugin);
    }
  });
}