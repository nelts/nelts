import 'reflect-metadata';
import ControllerComponent from '../../components/controller';
import DecoratorNameSpace from '../namespace';
import * as Compose from 'koa-compose';
import Context from '../../context';

export default function DynamicLoader(...args: Compose.Middleware<Context>[]) {
  return (
    target: ControllerComponent, 
    property: string, 
    descriptor: PropertyDescriptor
  ) => {
    let loaders = Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_DYNAMIC_LOADER, descriptor.value);
    if (!loaders) loaders = [];
    loaders.unshift(...args);
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_DYNAMIC_LOADER, loaders, descriptor.value);
  }
}