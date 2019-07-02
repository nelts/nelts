export default function Scope<T>(callback: (app: T) => Function) {
  const _callback = (plugin: T) => callback(plugin);
  _callback.scoped = true;
  return _callback;
}