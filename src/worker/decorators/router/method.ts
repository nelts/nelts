import 'reflect-metadata';
import * as FindMyWay from 'find-my-way';
// import ControllerComponent from '../../components/controller';
import DecoratorNameSpace from '../namespace';

export default function Method(method?: FindMyWay.HTTPMethod): MethodDecorator {
  return (target, property, descriptor) => {
    let methods: FindMyWay.HTTPMethod[] = Reflect.getMetadata(DecoratorNameSpace.CONTROLLER_METHOD, descriptor.value);
    if (!methods) methods = [];
    methods.push(method || 'GET');
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_METHOD, methods, descriptor.value);
  }
}