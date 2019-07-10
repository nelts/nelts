import 'reflect-metadata';
import * as path from 'path';
import WorkerPlugin from '../plugin';
import globby from 'globby';
import Require from '../../helper/require';
import Namespace from '../../agent/decorators/namespace';
export default async function Bootstrap(plugin: WorkerPlugin) {
  const cwd = plugin.source;
  const files = await globby([ 
    'agent/**/*.ts', 
    'agent/**/*.js', 
    '!agent/**/*.d.ts' 
  ], { cwd });
  if (files.length) {
    for (let i = 0 ; i < files.length ; i++) {
      const file = path.resolve(cwd, files[i]);
      const callback = Require(file);
      const Auto = Reflect.getMetadata(Namespace.AUTO, callback);
      callback.__filepath = file;
      callback.__filename = callback.name;
      if (Auto) {
        if (!callback.__filename) throw new Error('agent must defined with a name.');
        plugin.on('ready', () => plugin.app.messager.createAgent(callback.__filename, callback.__filepath));
      }
    }
  }
}