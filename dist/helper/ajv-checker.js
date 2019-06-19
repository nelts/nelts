"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ajv = require("ajv");
function default_1(schema, data, type) {
    const validator = new ajv({ allErrors: true }).compile(schema);
    const value = validator(data);
    if (!value)
        return Promise.reject(formatAjvErrors(validator.errors, type));
}
exports.default = default_1;
function formatAjvErrors(errors, type) {
    const errorTexts = errors.map(error => `  - ${type} Validator [${error.keyword}]: ${error.dataPath}${error.schemaPath}: <i><font color="brown">${error.message}</font><i>.`);
    errorTexts.unshift(`<font size="5">Nelts Validator Errors:</font>\n`);
    return new Error(errorTexts.join('\n'));
}
