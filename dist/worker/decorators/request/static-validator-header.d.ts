import 'reflect-metadata';
import ControllerComponent from '../../components/controller';
export default function StaticValidatorHeader(...args: object[] | string[]): (target: ControllerComponent, property: string, descriptor: PropertyDescriptor) => void;
