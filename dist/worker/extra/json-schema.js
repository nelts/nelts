"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fast = require("fast-json-stringify");
exports.default = (schema) => {
    return async (ctx, next) => {
        const data = ctx.body;
        if (data === null || data === undefined)
            return await next();
        ctx.body = Fast(schema)(data);
        ctx.type = 'json';
        await next();
    };
};
