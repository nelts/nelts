import 'reflect-metadata';
// import ControllerComponent from '../../components/controller';
import DecoratorNameSpace from '../namespace';

/**
 * header checker
 * @param args object[] | string[]
 * @example
 *  `Decorator.Controller.Request.Dynamic.Validator.Body({...})`
 */
export default function DynamicValidatorBody(schema: object): MethodDecorator {
  return (target, property, descriptor) => {
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_DYNAMIC_VALIDATOR_BODY, schema, descriptor.value);
  }
}