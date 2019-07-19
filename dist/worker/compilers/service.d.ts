import WorkerPlugin from '../plugin';
export default function Service<T extends WorkerPlugin>(plugin: T): Promise<void>;
