import * as ajv from 'ajv';

export default function(schema: object, data: any) {
  const validator = new ajv({ allErrors: true }).compile(schema);
  const value = validator(data);
  if (!value) return Promise.reject(formatAjvErrors(validator.errors));
}

function formatAjvErrors(errors: ajv.ErrorObject[]) {
  const errorTexts = errors.map(error => `[${error.keyword}] ${error.dataPath}${error.schemaPath}: ${error.message}`);
  return new Error(errorTexts.join('\n'));
}