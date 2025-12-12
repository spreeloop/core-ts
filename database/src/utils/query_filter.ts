export type OpStr = '<' | '<=' | '==' | '>' | '>=' | '!=' | 'in';

/**
 * Retrieves the value from a nested object based on a dot-separated path.
 *
 * @param {Record<string, unknown>} obj - The object to navigate.
 * @param {string} path - The dot-separated string representing the path to the desired value.
 * @return {unknown} - The value at the specified path, or `undefined` if the path is invalid.
 */
export function getNestedValue(
  obj: Record<string, unknown>,
  path: string
): unknown {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key] as Record<string, unknown>;
    } else {
      // Return undefined if the path is invalid.
      return undefined;
    }
  }
  return current;
}

/**
 * Verifies if the provided data match all given filter.
 * @param {QueryFilter[]} filters The list of filter we wan apply.
 * @param {Record<string, unknown>} value The data to check.
 * @return {boolean} true if the value match the filter and false other wise.
 */
export function allFiltersMatch(
  filters: QueryFilter[],
  value: Record<string, unknown>
): boolean {
  for (const docQuery of filters) {
    const condition = docQuery.opStr;
    const valueData = getNestedValue(value, docQuery.fieldPath);
    const comparableData = valueData as string | number;
    if (
      (condition == '==' &&
        !(docQuery.value instanceof Array) &&
        comparableData == docQuery.value) ||
      (condition == '>' &&
        !(docQuery.value instanceof Array) &&
        docQuery.value &&
        comparableData > docQuery.value) ||
      (condition == '>=' &&
        !(docQuery.value instanceof Array) &&
        docQuery.value &&
        comparableData >= docQuery.value) ||
      (condition == '<' &&
        !(docQuery.value instanceof Array) &&
        docQuery.value &&
        comparableData < docQuery.value) ||
      (condition == '<=' &&
        !(docQuery.value instanceof Array) &&
        docQuery.value &&
        comparableData <= docQuery.value) ||
      (condition == '!=' &&
        !(docQuery.value instanceof Array) &&
        comparableData != docQuery.value) ||
      (condition == 'in' &&
        docQuery.value instanceof Array &&
        docQuery.value.indexOf(comparableData.toString()) !== -1)
    ) {
      continue;
    } else {
      return false;
    }
  }
  return true;
}

/**
 * Represents a database query filter option.
 */
export class QueryFilter {
  fieldPath: string;
  opStr: OpStr;
  value: string | number | boolean | string[] | null;

  /**
   * Constructs a new QueryFilter.
   * @param {string} fieldPath The path to compare.
   * @param {OpStr} opStr The operation string.
   * @param {string | number | boolean | string[] | null} value The value for comparison.
   */
  constructor(
    fieldPath: string,
    opStr: OpStr,
    value: string | number | boolean | string[] | null
  ) {
    this.fieldPath = fieldPath;
    this.opStr = opStr;
    this.value = value;
  }
}
