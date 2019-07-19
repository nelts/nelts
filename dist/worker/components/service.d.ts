import Component from './base';
import Context from '../context';
import WorkerPlugin from '../plugin';
export default class Service<M extends WorkerPlugin, T extends Context<M>> extends Component<M> {
    readonly ctx: T;
    constructor(ctx: T);
    readonly service: {
        [name: string]: any;
    };
    getComponentServiceByName(name: string, serviceName?: string): any;
}
