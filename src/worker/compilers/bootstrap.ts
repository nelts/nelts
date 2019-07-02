import * as path from 'path';
import WorkerPlugin from '../plugin';
import globby from 'globby';
import { Require } from '../../export';
export default async function Bootstrap(plugin: WorkerPlugin) {
  const cwd = plugin.source;
  const files = await globby([ 
    'app.ts', 
    'app.js', 
    '!app.d.ts' 
  ], { cwd });
  if (files.length) {
    const file = path.resolve(cwd, files[0]);
    const callback = Require(file);
    if (typeof callback === 'function') {
      await callback(plugin);
    }
  }
}