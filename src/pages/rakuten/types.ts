export type CustomRow = {
  visible?: boolean;
  titleChange?: (title: string) => string;
  valueChange?: (value: string) => string;
};
