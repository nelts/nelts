import 'reflect-metadata';
import * as Compose from 'koa-compose';
import Context from '../../context';
export default function StaticFilter(...args: Compose.Middleware<Context>[]): MethodDecorator;
