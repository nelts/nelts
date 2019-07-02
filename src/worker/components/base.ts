import WorkerPlugin from '../plugin';
export default class Controller {
  readonly app: WorkerPlugin;
  constructor(plugin: WorkerPlugin) {
    this.app = plugin;
  }
}