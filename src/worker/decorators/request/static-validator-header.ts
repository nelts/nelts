import 'reflect-metadata';
// import ControllerComponent from '../../components/controller';
import DecoratorNameSpace from '../namespace';
import AjvStringFormater from '../../../helper/ajv-string-formater';

/**
 * header checker
 * @param args object[] | string[]
 * @example
 *  `Decorator.Controller.Request.Static.Validator.Header(
 *    '?test1', 
 *    'test2[]', 
 *    '?test3',
 *    '?test4[]'
 *  )`
 */
export default function StaticValidatorHeader(...args: object[] | string[]): MethodDecorator {
  const types = AjvStringFormater(args);
  return (target, property, descriptor) => {
    Reflect.defineMetadata(DecoratorNameSpace.CONTROLLER_STATIC_VALIDATOR_HEADER, types, descriptor.value);
  }
}