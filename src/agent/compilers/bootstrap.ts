import * as path from 'path';
import AgentPlugin from '../plugin';
import globby from 'globby';
import Require from '../../helper/require';
export default async function Bootstrap(plugin: AgentPlugin) {
  const cwd = plugin.source;
  const files = await globby([ 
    'agent.ts', 
    'agent.js', 
    '!agent.d.ts' 
  ], { cwd });
  if (files.length) {
    const file = path.resolve(cwd, files[0]);
    const callback = Require(file);
    if (typeof callback === 'function') {
      await callback(plugin);
    }
  }
}