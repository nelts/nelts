import 'reflect-metadata';
// import ControllerComponent from '../../components/controller';
import DecoratorNameSpace from '../namespace';
import * as Compose from 'koa-compose';
import Context from '../../context';
import Plugin from '../../plugin';

export default function Guarder<T extends Plugin>(...args: Compose.Middleware<Context<T>>[]): MethodDecorator {
  return (target, property, descriptor) => {
    let guards = Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_GUARD, descriptor.value);
    if (!guards) guards = [];
    guards.unshift(...args);
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_GUARD, guards, descriptor.value);
  }
}