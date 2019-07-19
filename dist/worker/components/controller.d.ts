import WorkerPlugin from '../plugin';
import Component from './base';
export default class Controller<T extends WorkerPlugin> extends Component<T> {
    constructor(plugin: T);
    readonly service: {
        [name: string]: any;
    };
    readonly middleware: {
        [name: string]: any;
    };
    getComponentServiceByName(name: string): {
        [name: string]: any;
    };
}
