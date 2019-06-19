import Plugin from '../plugin';
import Component from '../worker/index';
export default function MakePluginRender(app: Component, isWorker: boolean): (component_path: string) => Promise<Plugin>;
