import 'reflect-metadata';
import * as FindMyWay from 'find-my-way';
import ControllerComponent from '../../components/controller';
export default function Method(method?: FindMyWay.HTTPMethod): (target: ControllerComponent, property: string, descriptor: PropertyDescriptor) => void;
