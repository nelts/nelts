import Component from './base';
import Context from '../context';
export default class Service extends Component {
    readonly ctx: Context;
    constructor(ctx: Context);
    readonly service: {
        [name: string]: any;
    };
    getComponentServiceByName(name: string, serviceName?: string): any;
}
