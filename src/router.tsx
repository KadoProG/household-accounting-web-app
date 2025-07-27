import type { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages';
import { NotFoundPage } from './pages/not-found';
import { RakutenPage } from '@/pages/rakuten';
import { PayPayPage } from './pages/paypay';

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rakuten" element={<RakutenPage />} />
        <Route path="/paypay" element={<PayPayPage />} />

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
