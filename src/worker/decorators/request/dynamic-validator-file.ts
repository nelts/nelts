import 'reflect-metadata';
import ControllerComponent from '../../components/controller';
import DecoratorNameSpace from '../namespace';

/**
 * header checker
 * @param args object[] | string[]
 * @example
 *  `Decorator.Controller.Request.Dynamic.Validator.File({...})`
 */
export default function DynamicValidatorFile(schema: object) {
  return (
    target: ControllerComponent, 
    property: string, 
    descriptor: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_DYNAMIC_VALIDATOR_FILE, schema, descriptor.value);
  }
}