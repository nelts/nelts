import 'reflect-metadata';
// import ControllerComponent from '../components/controller';
import DecoratorNameSpace from './namespace';
import * as Compose from 'koa-compose';
import Context from '../context';
import Plugin from '../plugin';

export default function Response<T extends Plugin>(...args: Compose.Middleware<Context<T>>[]): MethodDecorator {
  return (target, property, descriptor) => {
    let responses = Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_RESPONSE, descriptor.value);
    if (!responses) responses = [];
    responses.unshift(...args);
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_RESPONSE, responses, descriptor.value);
  }
}