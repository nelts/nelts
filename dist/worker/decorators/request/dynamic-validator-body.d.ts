import 'reflect-metadata';
import ControllerComponent from '../../components/controller';
export default function DynamicValidatorBody(schema: object): (target: ControllerComponent, property: string, descriptor: PropertyDescriptor) => void;
