import 'reflect-metadata';
import ControllerComponent from '../../components/controller';
import DecoratorNameSpace from '../namespace';

export default function Path(path?: string) {
  return (
    target: ControllerComponent, 
    property: string, 
    descriptor: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(
      DecoratorNameSpace.CONTROLLER_PATH, 
      path || '/', 
      descriptor.value
    );
  }
}