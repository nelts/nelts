import 'reflect-metadata';
import ControllerComponent from '../components/controller';
import DecoratorNameSpace from './namespace';
import * as Compose from 'koa-compose';
import Context from '../context';

export default function Middleware(...args: Compose.Middleware<Context>[]) {
  return (
    target: ControllerComponent, 
    property: string, 
    descriptor: PropertyDescriptor
  ) => {
    let middlewares = Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_MIDDLEWARE, descriptor.value);
    if (!middlewares) middlewares = [];
    middlewares.unshift(...args);
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_MIDDLEWARE, middlewares, descriptor.value);
  }
}