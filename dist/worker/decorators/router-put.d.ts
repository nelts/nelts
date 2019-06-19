import 'reflect-metadata';
import ControllerComponent from '../components/controller';
export default function Put(path?: string): (target: ControllerComponent, property: string, descriptor: PropertyDescriptor) => void;
