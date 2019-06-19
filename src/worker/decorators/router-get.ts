import 'reflect-metadata';
import ControllerComponent from '../components/controller';
import RouterMethod from './router-method';
import RouterPath from './router-path';

export default function Get(path?: string) {
  return (
    target: ControllerComponent, 
    property: string, 
    descriptor: PropertyDescriptor
  ) => {
    path && RouterPath(path)(target, property, descriptor);
    RouterMethod('GET')(target, property, descriptor);
  }
}