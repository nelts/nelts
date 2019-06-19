import 'reflect-metadata';
import ControllerComponent from '../../components/controller';
export default function DynamicValidatorFile(schema: object): (target: ControllerComponent, property: string, descriptor: PropertyDescriptor) => void;
