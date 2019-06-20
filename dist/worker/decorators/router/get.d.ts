import 'reflect-metadata';
import ControllerComponent from '../../components/controller';
export default function Get(path?: string): (target: ControllerComponent, property: string, descriptor: PropertyDescriptor) => void;
