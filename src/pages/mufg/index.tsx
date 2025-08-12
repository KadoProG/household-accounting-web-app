import { CSVProcessor } from '@/features/CSVProcessor';
import AppLayout from '@/components/Layouts/AppLayout';
import { mufgPlan } from './utils';

export const MufgPage = () => {
  return (
    <AppLayout>
      <CSVProcessor
        title="三菱UFJページ"
        description="このページは三菱UFJ銀行のcsvファイルを変換するページです。"
        exportFileName="mufg_export.csv"
        tablePlan={mufgPlan}
      />
    </AppLayout>
  );
};
