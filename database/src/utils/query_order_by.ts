/**
 * A collection result ordering attribute.
 */
export class QueryOrderBy<T> {
  /** The field name. */
  field: string & keyof T;

  /** True when sorting should be descending. */
  descending: boolean;

  /**
   * Constructs a new QueryOrderBy.
   * @param {string} field The field name.
   * @param {boolean} descending True when sorting should be descending.
   */
  constructor(field: string & keyof T, descending: boolean) {
    this.field = field;
    this.descending = descending;
  }
}
