import Component from './base';
import Context from '../context';
import WorkerPlugin from '../plugin';

export default class Service<M extends WorkerPlugin, T extends Context<M>> extends Component<M> {
  readonly ctx: T;

  constructor(ctx: T) {
    super(ctx.app);
    this.ctx = ctx;
  }

  get service() {
    return this.app.service;
  }

  getComponentServiceByName(name: string, serviceName?: string) {
    const plugin = this.app.getComponent(name);
    if (!serviceName) return plugin.service;
    return new plugin.service[serviceName](this.ctx);
  }
}