import 'reflect-metadata';
import DecoratorNameSpace from '../namespace';
export default function Prefix(prefix?: string): ClassDecorator {
  return target => Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_PREFIX, prefix || '/', target);
}