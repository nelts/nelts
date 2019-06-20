import 'reflect-metadata';
import ControllerComponent from '../../components/controller';
export default function Post(path?: string): (target: ControllerComponent, property: string, descriptor: PropertyDescriptor) => void;
