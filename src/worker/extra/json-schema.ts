import * as Fast from 'fast-json-stringify';
import Context from '../context';
export default (schema: Fast.Schema) => {
  return async (ctx: Context, next: Function) => {
    const data = ctx.body;
    if (data === null || data === undefined) return await next();
    ctx.body = Fast(schema)(data);
    ctx.type = 'json';
    await next();
  }
}