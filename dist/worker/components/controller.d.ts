import WorkerPlugin from '../plugin';
import Component from './base';
export default class Controller extends Component {
    constructor(plugin: WorkerPlugin);
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
