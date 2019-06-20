import Plugin from '../../plugin';
import Component from './base';

export default class Controller extends Component {
  constructor(plugin: Plugin) {
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