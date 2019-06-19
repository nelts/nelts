"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formater(args) {
    const result = { type: 'object', properties: {}, required: [] };
    switch (args.length) {
        case 0: throw new Error('validator arguments must be `.length>0`');
        case 1:
            if (typeof args[0] !== 'string')
                return args[0];
            const { schema, isRequired, name } = render(args[0]);
            if (isRequired)
                result.required.push(name);
            result.properties[name] = schema;
            break;
        default:
            args.forEach((arg) => {
                if (typeof arg !== 'string')
                    throw new Error('mutil arguments must be string foreach');
                const { schema, isRequired, name } = render(arg);
                if (isRequired)
                    result.required.push(name);
                result.properties[name] = schema;
            });
    }
    return result;
}
exports.default = formater;
function render(arg) {
    const isRequired = !arg.startsWith('?');
    arg = isRequired ? arg : arg.substring(1);
    const isArray = arg.endsWith('[]');
    arg = isArray ? arg.substring(0, arg.length - 2) : arg;
    const schema = { type: 'string' };
    if (isArray) {
        schema.type = 'array';
        schema.items = {
            type: 'string'
        };
    }
    return {
        schema,
        isRequired,
        name: arg,
    };
}
