import Component from './base';
import Context from '../context';
export default class Service extends Component {
    readonly ctx: Context;
    constructor(ctx: Context);
    readonly service: any;
    getComponentServiceByName(name: string, serviceName?: string): any;
}
