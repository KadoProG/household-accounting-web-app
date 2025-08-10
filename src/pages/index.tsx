import { Link } from 'react-router-dom';
import AppLayout from '../components/Layouts/AppLayout';

const links = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Rakuten',
    path: '/rakuten',
  },
  {
    label: 'PayPay',
    path: '/paypay',
  },
  {
    label: '楽天銀行',
    path: '/rakuten-bank',
  },
];

export const HomePage = () => {
  return (
    <AppLayout>
      <div className="p-4">
        <h1 className="text-3xl font-semibold">家計簿アプリへようこそ</h1>
        <p>このアプリはあなたの家計管理をサポートします。</p>
        <nav className="mt-4 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">ナビゲーションリンク</h2>
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="inline-block w-full rounded-md border border-border p-2 transition-colors hover:bg-secondary"
                >
                  {link.label} <code className="rounded-full bg-secondary px-2">{link.path}</code>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </AppLayout>
  );
};
