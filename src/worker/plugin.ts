import Plugin from '../plugin';
import Component from './index';

export default class WorkerPlugin extends Plugin<Component> {
  public service: {[name: string]: any} = {};
  public middleware: {[name: string]: any} = {};

  constructor(app: Component, name: string, cwd: string) {
    super(app, name, cwd);
  }

  get server() {
    return this.app.server;
  }

  getComponent(name: string) {
    return super._getComponent<WorkerPlugin>(name);
  }
}