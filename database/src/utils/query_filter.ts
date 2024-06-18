export type OpStr = '<' | '<=' | '==' | '>' | '>=' | '!=' | 'in';

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
