import Plugin from '../../plugin';
import Component from './base';

export default class Controller extends Component {
  constructor(plugin: Plugin) {
    super(plugin);
  }

  getService(name: string) {
    if (!name) return this.app.service;
    const plugin: Plugin = this.app.getComponent(name);
    return plugin.service;
  }
}