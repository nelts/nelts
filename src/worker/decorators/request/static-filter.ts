import 'reflect-metadata';
import ControllerComponent from '../../components/controller';
import DecoratorNameSpace from '../namespace';
import * as Compose from 'koa-compose';
import Context from '../../context';

export default function StaticFilter(...args: Compose.Middleware<Context>[]) {
  return (
    target: ControllerComponent, 
    property: string, 
    descriptor: PropertyDescriptor
  ) => {
    let filters = Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_STATIC_FILTER, descriptor.value);
    if (!filters) filters = [];
    filters.unshift(...args);
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_STATIC_FILTER, filters, descriptor.value);
  }
}