import Component from './base';
import Context from '../context';
export default class Service<T extends Context> extends Component {
    readonly ctx: T;
    constructor(ctx: T);
    readonly service: {
        [name: string]: any;
    };
    getComponentServiceByName(name: string, serviceName?: string): any;
}
