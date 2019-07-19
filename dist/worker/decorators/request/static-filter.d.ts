import 'reflect-metadata';
import * as Compose from 'koa-compose';
import Context from '../../context';
import Plugin from '../../plugin';
export default function StaticFilter<T extends Plugin>(...args: Compose.Middleware<Context<T>>[]): MethodDecorator;
