import 'reflect-metadata';
import ControllerComponent from '../../components/controller';
import RouterMethod from './method';
import RouterPath from './path';

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