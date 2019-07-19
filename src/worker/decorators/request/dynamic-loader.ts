import 'reflect-metadata';
// import ControllerComponent from '../../components/controller';
import DecoratorNameSpace from '../namespace';
import * as Compose from 'koa-compose';
import Context from '../../context';
import Plugin from '../../plugin';

export default function DynamicLoader<T extends Plugin>(...args: Compose.Middleware<Context<T>>[]): MethodDecorator {
  return (target, property, descriptor) => {
    let loaders = Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_DYNAMIC_LOADER, descriptor.value);
    if (!loaders) loaders = [];
    loaders.unshift(...args);
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_DYNAMIC_LOADER, loaders, descriptor.value);
  }
}