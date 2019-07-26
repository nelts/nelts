import 'reflect-metadata';
import { Moment } from 'moment';
export declare type ScheduleDecoratorType = {
    cron: string | Date | Moment;
    runOnInit?: boolean;
};
declare const _default: (cron: string | Date | Moment, runOnInit?: boolean) => MethodDecorator;
export default _default;
