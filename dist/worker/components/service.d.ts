import Plugin from '../../plugin';
import Component from './base';
export default class Service extends Component {
    constructor(plugin: Plugin);
    readonly service: any;
    getComponentServiceByName(name: string): any;
}
