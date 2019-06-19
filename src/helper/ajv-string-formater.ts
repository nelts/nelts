/**
 * smart formater as jsonschema for strings
 * @param args object[] | string[]
 * @example
 *  - `field`
 *  - `?field`
 *  - `field[]`
 *  - `?field[]`
 */
export default function formater(args: object[] | string[]) {
  const result: any = { type: 'object', properties: {}, required: [] };
  switch (args.length) {
    case 0: throw new Error('validator arguments must be `.length>0`');
    case 1: 
      if (typeof args[0] !== 'string') return args[0];
      const { schema, isRequired, name } = render(args[0] as string);
      if (isRequired) result.required.push(name);
      result.properties[name] = schema;
      break;
    default:
      args.forEach((arg: object | string) => {
        if (typeof arg !== 'string') throw new Error('mutil arguments must be string foreach');
        const { schema, isRequired, name } = render(arg as string);
        if (isRequired) result.required.push(name);
        result.properties[name] = schema;
      });
  }
  return result;
}

function render(arg: string) {
  const isRequired = !arg.startsWith('?');
  arg = isRequired ? arg : arg.substring(1);
  const isArray = arg.endsWith('[]');
  arg = isArray ? arg.substring(0, arg.length - 2) : arg;
  const schema: any = { type: 'string' };
  if (isArray) {
    schema.type = 'array';
    schema.items = {
      type: 'string'
    }
  }
  return {
    schema, 
    isRequired,
    name: arg,
  }
}

