import { CSVProcessor } from '@/components/features/CSVProcessor';
import AppLayout from '@/components/Layouts/AppLayout';
import { makeRakutenCustomValues } from './utils';

export const RakutenPage = () => {
  return (
    <AppLayout>
      <CSVProcessor
        title="楽天ページ"
        description="このページは楽天カードのcsvファイルを変換するページです。"
        exportFileName="rakuten_export.csv"
        makeCustomValues={makeRakutenCustomValues}
      />
    </AppLayout>
  );
};
