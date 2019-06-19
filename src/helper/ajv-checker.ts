import * as ajv from 'ajv';

export default function(schema: object, data: any, type: string) {
  const validator = new ajv({ allErrors: true }).compile(schema);
  const value = validator(data);
  if (!value) return Promise.reject(formatAjvErrors(validator.errors, type));
}

function formatAjvErrors(errors: ajv.ErrorObject[], type: string) {
  const errorTexts = errors.map(error => `  - ${type} Validator [${error.keyword}]: ${error.dataPath}${error.schemaPath}: <i><font color="brown">${error.message}</font><i>.`);
  errorTexts.unshift(`<font size="5">Nelts Validator Errors:</font>\n`);
  return new Error(errorTexts.join('\n'));
}