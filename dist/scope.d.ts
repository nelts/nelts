import Plugin from './plugin';
export default function Scope(callback: (app: Plugin) => Function): {
    (plugin: Plugin): Function;
    scoped: boolean;
};
