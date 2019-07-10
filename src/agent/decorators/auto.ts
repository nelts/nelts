import 'reflect-metadata';
// import Component from '../components/base';
import DecoratorNameSpace from './namespace';

export default <ClassDecorator>(target => Reflect.defineMetadata(DecoratorNameSpace.AUTO, true, target));