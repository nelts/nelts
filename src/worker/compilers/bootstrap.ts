import * as path from 'path';
import Plugin from '../../plugin';
import globby from 'globby';
export default async function Bootstrap(plugin: Plugin) {
  const cwd = plugin.source;
  const files = await globby([ 
    'app.ts', 
    'app.js', 
    '!app.d.ts' 
  ], { cwd });
  if (files.length) {
    const file = path.resolve(cwd, files[0]);
    const callback = require(file);
    if (typeof callback === 'function') {
      await callback(plugin);
    }
  }
}