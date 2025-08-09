/** セル変換時に他列へ安全にアクセスできる共通コンテキスト */
export type CellContext = {
  /** 今処理中の列の元ヘッダ */
  header: string;
  /** 全ヘッダ */
  headers: readonly string[];
  /** 今処理中の行の全セル */
  row: readonly string[];
  /** 行番号（0-based） */
  rowIndex: number;
  /** ヘッダ名で該当セルを取得（見つからなければ undefined） */
  get: (headerName: string) => string | undefined;
};

/** 列ごとの変換規則 */
export type ColumnTransform = {
  /** 列の表示・非表示（true なら隠す） */
  hide?: boolean;

  /** ヘッダ名の変換 */
  mapHeader?: (orig: string) => string;

  /** セル値の変換 */
  mapValue?: (value: string, ctx: CellContext) => string;
};

/** 行を消す（非表示にする）条件の集合 */
export type RowFilter = {
  /** true を返した行は除外 */
  hideIf: (ctx: CellContext) => boolean;
};

/** 並べ替え。明示順 or 比較関数の2系統をサポート */
export type Reorder = {
  /** 列順。ヘッダ名指定（未知列は末尾に維持） */
  columns?: readonly string[];

  /** 行順。比較関数優先。未指定時は元順 */
  rows?:
    | ((a: CellContext, b: CellContext) => number)
    | { byHeader: string; direction?: 'asc' | 'desc'; as?: 'number' | 'date' | 'string' };
};

/** 全体設定 */
export type TablePlan = {
  /** ヘッダ名ごとの列変換規則 */
  columns: Record<string, ColumnTransform>;

  /** 行フィルタ（複数適用可） */
  rowFilters?: readonly RowFilter[];

  /** 並べ替え */
  reorder?: Reorder;
};
