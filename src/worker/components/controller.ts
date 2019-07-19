import WorkerPlugin from '../plugin';
import Component from './base';

export default class Controller<T extends WorkerPlugin> extends Component<T> {
  constructor(plugin: T) {
    super(plugin);
  }

  get service() {
    return this.app.service;
  }

  get middleware() {
    return this.app.middleware;
  }

  getComponentServiceByName(name: string) {
    const plugin = this.app.getComponent(name);
    return plugin.service;
  }
}