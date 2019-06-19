import 'reflect-metadata';
import ControllerComponent from '../components/controller';
export default function Delete(path?: string): (target: ControllerComponent, property: string, descriptor: PropertyDescriptor) => void;
