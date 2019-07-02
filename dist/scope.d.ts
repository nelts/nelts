export default function Scope<T>(callback: (app: T) => Function): {
    (plugin: T): Function;
    scoped: boolean;
};
