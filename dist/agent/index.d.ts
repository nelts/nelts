import 'reflect-metadata';
import { Processer, WidgetComponent } from '@nelts/process';
import Factory, { InCommingMessage } from '../factory';
import AgentPlugin from './plugin';
import Messager, { ProcessMessageReceiveDataType } from '../messager';
export default class AgentComponent extends Factory<AgentPlugin> implements WidgetComponent {
    private _target;
    private _app;
    private _name;
    messager: Messager<AgentComponent>;
    private _targetConstructor;
    render: (path: string) => Promise<AgentPlugin>;
    constructor(processer: Processer, args: InCommingMessage);
    componentWillCreate(): Promise<void>;
    componentDidCreated(): Promise<void>;
    componentWillDestroy(): Promise<void>;
    componentDidDestroyed(): Promise<void>;
    componentCatchError(err: Error): void;
    componentReceiveMessage(message: ProcessMessageReceiveDataType, socket?: any): void;
    private runWidthMethod;
    private _sendValue;
}
