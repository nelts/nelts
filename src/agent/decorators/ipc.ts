import 'reflect-metadata';
// import Component from '../components/base';
import DecoratorNameSpace from './namespace';

export default <MethodDecorator>((target, property, descriptor) => Reflect.defineMetadata(DecoratorNameSpace.IPC, true, descriptor.value));