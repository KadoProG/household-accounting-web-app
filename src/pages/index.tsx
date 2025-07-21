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
];

export const HomePage = () => {
  return (
    <AppLayout>
      <div className="p-4">
        <h1>Welcome to the Household Accounting App</h1>
        <p>This app helps you manage your household finances.</p>
        <nav className="mt-4 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Navigation Links</h2>
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="inline-block w-full rounded-md border border-border p-2 transition-colors hover:bg-bg-second dark:border-border-dark hover:dark:bg-bg-base-hover-dark"
                >
                  {link.label}{' '}
                  <code className="rounded-full bg-bg-second px-2 dark:bg-bg-second-dark">
                    {link.path}
                  </code>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </AppLayout>
  );
};
