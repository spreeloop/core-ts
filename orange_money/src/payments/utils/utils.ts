import Joi from 'joi';

/**
 * Checks if the data is valid type.
 * @param {Record<string, unknown>} data .
 * @param {Joi.PartialSchemaMap<T>} schema .
 * @return {Record<string, unknown>}
 */
export function validateData<T>(
  data: unknown,
  schema: Joi.ObjectSchema<T>
): { isValidData: true; data: T } | { isValidData: false; message: string } {
  const { error, value } = schema.unknown(true).validate(data, {
    abortEarly: false,
    convert: false,
  });
  if (error) {
    return {
      isValidData: false,
      message: JSON.stringify(
        error.details.map((e) => e.message),
        null,
        ' '
      ),
    };
  }
  return {
    isValidData: true,
    data: value,
  };
}
