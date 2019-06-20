import Plugin from '../../plugin';
import Component from './base';

export default class Service extends Component {
  constructor(plugin: Plugin) {
    super(plugin);
  }

  get service() {
    return this.app.service;
  }

  getComponentServiceByName(name: string) {
    const plugin = this.app.getComponent(name);
    return plugin.service;
  }
}