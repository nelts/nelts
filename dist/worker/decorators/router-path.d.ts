import 'reflect-metadata';
import ControllerComponent from '../components/controller';
export default function Path(path?: string): (target: ControllerComponent, property: string, descriptor: PropertyDescriptor) => void;
