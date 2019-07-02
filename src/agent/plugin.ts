import Plugin from '../plugin';
import Component from './index';

export default class AgentPlugin extends Plugin<Component> {
  constructor(app: Component, name: string, cwd: string) {
    super(app, name, cwd);
  }
}