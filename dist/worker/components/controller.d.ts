import Plugin from '../../plugin';
import Component from './base';
export default class Controller extends Component {
    constructor(plugin: Plugin);
    getService(name: string): {
        [name: string]: any;
    };
}
