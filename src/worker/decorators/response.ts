import 'reflect-metadata';
import ControllerComponent from '../components/controller';
import DecoratorNameSpace from './namespace';
import * as Compose from 'koa-compose';
import Context from '../context';

export default function Response(...args: Compose.Middleware<Context>[]) {
  return (
    target: ControllerComponent, 
    property: string, 
    descriptor: PropertyDescriptor
  ) => {
    let responses = Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_RESPONSE, descriptor.value);
    if (!responses) responses = [];
    responses.unshift(...args);
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_RESPONSE, responses, descriptor.value);
  }
}