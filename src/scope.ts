import Plugin from './plugin';
export default function Scope<T>(callback: (app: Plugin) => T) {
  const _callback = (plugin: Plugin) => callback(plugin);
  _callback.scoped = true;
  return _callback;
}