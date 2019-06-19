import Plugin from './plugin';
export default function Scope<T>(callback: (app: Plugin) => T): {
    (plugin: Plugin): T;
    scoped: boolean;
};
