'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Головна' },
  { href: '/login', label: 'Вхід' },
  { href: '/register', label: 'Реєстрація' },
  { href: '/dashboard', label: 'Кабінет' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="header">
      <div className="container nav">
        <Link
          href="/"
          className="logo"
          aria-label="SecureWeb, перейти на головну сторінку"
        >
          SecureWeb
        </Link>

        <nav aria-label="Головна навігація">
          <ul className="nav-links">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}