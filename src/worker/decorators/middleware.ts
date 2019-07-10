import 'reflect-metadata';
// import ControllerComponent from '../components/controller';
import DecoratorNameSpace from './namespace';
import * as Compose from 'koa-compose';
import Context from '../context';

export default function Middleware(...args: Compose.Middleware<Context>[]): MethodDecorator {
  return (target, property, descriptor) => {
    let middlewares = Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_MIDDLEWARE, descriptor.value);
    if (!middlewares) middlewares = [];
    middlewares.unshift(...args);
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_MIDDLEWARE, middlewares, descriptor.value);
  }
}