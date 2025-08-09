import { CSVProcessor } from '@/features/CSVProcessor';
import AppLayout from '@/components/Layouts/AppLayout';
import { rakutenBankPlan } from './utils';

export const RakutenBankPage = () => {
  return (
    <AppLayout>
      <CSVProcessor
        title="楽天銀行ページ"
        description="このページは楽天銀行のcsvファイルを変換するページです。"
        exportFileName="rakuten_bank_export.csv"
        tablePlan={rakutenBankPlan}
        encoding="SHIFT_JIS"
      />
    </AppLayout>
  );
};
