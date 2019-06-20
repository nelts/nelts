import 'reflect-metadata';
import DecoratorNameSpace from '../namespace';
export default function Prefix(prefix?: string) {
  return (target: Function) => {
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_PREFIX, prefix || '/', target);
  }
}