import 'reflect-metadata';
import ControllerComponent from '../../components/controller';
import RouterMethod from './method';
import RouterPath from './path';

export default function Post(path?: string) {
  return (
    target: ControllerComponent, 
    property: string, 
    descriptor: PropertyDescriptor
  ) => {
    path && RouterPath(path)(target, property, descriptor);
    RouterMethod('POST')(target, property, descriptor);
  }
}