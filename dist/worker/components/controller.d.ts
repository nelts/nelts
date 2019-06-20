import Plugin from '../../plugin';
import Component from './base';
export default class Controller extends Component {
    constructor(plugin: Plugin);
    readonly service: any;
    readonly middleware: any;
    getComponentServiceByName(name: string): any;
}
