import { CSVProcessor } from '@/components/features/CSVProcessor';
import AppLayout from '@/components/Layouts/AppLayout';
import { makePayPayCustomValues } from './utils';

export const PayPayPage = () => {
  return (
    <AppLayout>
      <CSVProcessor
        title="PayPayページ"
        description="このページはPayPayのcsvファイルを変換するページです。"
        exportFileName="paypay_export.csv"
        makeCustomValues={makePayPayCustomValues}
      />
    </AppLayout>
  );
};
