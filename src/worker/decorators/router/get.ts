import 'reflect-metadata';
// import ControllerComponent from '../../components/controller';
import RouterMethod from './method';
import RouterPath from './path';

export default function Get(path?: string): MethodDecorator {
  return (target, property, descriptor) => {
    path && RouterPath(path)(target, property, descriptor);
    RouterMethod('GET')(target, property, descriptor);
  }
}