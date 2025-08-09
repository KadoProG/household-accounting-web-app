import { CSVProcessor } from '@/features/CSVProcessor';
import AppLayout from '@/components/Layouts/AppLayout';
import { paypayPlan } from './utils';

export const PayPayPage = () => {
  return (
    <AppLayout>
      <CSVProcessor
        title="PayPayページ"
        description="このページはPayPayのcsvファイルを変換するページです。"
        exportFileName="paypay_export.csv"
        tablePlan={paypayPlan}
      />
    </AppLayout>
  );
};
