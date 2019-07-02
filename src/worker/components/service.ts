import Component from './base';
import Context from '../context';

export default class Service<T extends Context> extends Component {
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