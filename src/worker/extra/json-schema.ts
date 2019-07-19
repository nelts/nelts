import * as Fast from 'fast-json-stringify';
import Context from '../context';
import Plugin from '../plugin';
export default function JSONSCHEMA<T extends Plugin>(schema: Fast.Schema) {
  return async (ctx: Context<T>, next: Function) => {
    const data = ctx.body;
    if (data === null || data === undefined) return await next();
    ctx.body = Fast(schema)(data);
    ctx.type = 'json';
    await next();
  }
}