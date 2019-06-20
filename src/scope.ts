import Plugin from './plugin';
export default function Scope(callback: (app: Plugin) => Function) {
  const _callback = (plugin: Plugin) => callback(plugin);
  _callback.scoped = true;
  return _callback;
}