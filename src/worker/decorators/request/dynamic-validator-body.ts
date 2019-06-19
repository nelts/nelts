import 'reflect-metadata';
import ControllerComponent from '../../components/controller';
import DecoratorNameSpace from '../namespace';

/**
 * header checker
 * @param args object[] | string[]
 * @example
 *  `Decorator.Controller.Request.Dynamic.Validator.Body({...})`
 */
export default function DynamicValidatorBody(schema: object) {
  return (
    target: ControllerComponent, 
    property: string, 
    descriptor: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_DYNAMIC_VALIDATOR_BODY, schema, descriptor.value);
  }
}