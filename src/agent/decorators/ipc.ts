import 'reflect-metadata';
import Component from '../components/base';
import DecoratorNameSpace from './namespace';

export default (
  target: Component, 
  property: string, 
  descriptor: PropertyDescriptor
) => Reflect.defineMetadata(DecoratorNameSpace.IPC, true, descriptor.value);