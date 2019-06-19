import 'reflect-metadata';
import ControllerComponent from '../../components/controller';
import DecoratorNameSpace from '../namespace';
import * as Compose from 'koa-compose';
import Context from '../../context';

export default function Guarder(...args: Compose.Middleware<Context>[]) {
  return (
    target: ControllerComponent, 
    property: string, 
    descriptor: PropertyDescriptor
  ) => {
    let guards = Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_GUARD, descriptor.value);
    if (!guards) guards = [];
    guards.unshift(...args);
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_GUARD, guards, descriptor.value);
  }
}