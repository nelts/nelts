import 'reflect-metadata';
import ControllerComponent from '../../components/controller';
import * as Compose from 'koa-compose';
import Context from '../../context';
export default function Guarder(...args: Compose.Middleware<Context>[]): (target: ControllerComponent, property: string, descriptor: PropertyDescriptor) => void;
