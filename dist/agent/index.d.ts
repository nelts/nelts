import { Processer } from '@nelts/process';
import Factory from '../factory';
import AgentPlugin from './plugin';
export default class AgentComponent extends Factory<AgentPlugin> {
    constructor(processer: Processer, args: {
        [name: string]: any;
    });
}
