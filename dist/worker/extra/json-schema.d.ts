import * as Fast from 'fast-json-stringify';
import Context from '../context';
import Plugin from '../plugin';
export default function JSONSCHEMA<T extends Plugin>(schema: Fast.Schema): (ctx: Context<T>, next: Function) => Promise<any>;
