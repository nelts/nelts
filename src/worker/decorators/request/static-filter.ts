import 'reflect-metadata';
// import ControllerComponent from '../../components/controller';
import DecoratorNameSpace from '../namespace';
import * as Compose from 'koa-compose';
import Context from '../../context';
import Plugin from '../../plugin';

export default function StaticFilter<T extends Plugin>(...args: Compose.Middleware<Context<T>>[]): MethodDecorator {
  return (target, property, descriptor) => {
    let filters = Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_STATIC_FILTER, descriptor.value);
    if (!filters) filters = [];
    filters.unshift(...args);
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_STATIC_FILTER, filters, descriptor.value);
  }
}