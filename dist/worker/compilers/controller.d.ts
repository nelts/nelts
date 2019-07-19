import 'reflect-metadata';
import WorkerPlugin from '../plugin';
export default function Controller<T extends WorkerPlugin>(plugin: T): Promise<void>;
