"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ajv = require("ajv");
function default_1(schema, data) {
    const validator = new ajv({ allErrors: true }).compile(schema);
    const value = validator(data);
    if (!value)
        return Promise.reject(formatAjvErrors(validator.errors));
}
exports.default = default_1;
function formatAjvErrors(errors) {
    const errorTexts = errors.map(error => `[${error.keyword}] ${error.dataPath}${error.schemaPath}: ${error.message}`);
    return new Error(errorTexts.join('\n'));
}
