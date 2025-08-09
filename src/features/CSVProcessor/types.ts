export type ColumnRule = {
  visible?: boolean;
  /**
   *
   * @param title その列のタイトルが入る
   */
  mapTitle?: (title: string) => string;
  /**
   *
   * @param value その列の値が入る
   * @param titleValues [0] にはタイトル情報、[1] には値情報が格納される
   */
  valueChange?: (
    /** cellの値 */
    value: string,
    /** [0]にはタイトルの配列、[1] には値の配列 */
    titleValues: readonly [string[], string[]]
  ) => string;
};
