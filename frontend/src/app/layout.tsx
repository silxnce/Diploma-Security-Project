import type { Metadata } from 'next';
import Header from '@/components/Header';
import './globals.css';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Security Project',
  description: 'Вебсайт для демонстрації забезпечення захищеності і цифрової доступності',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <a href="#main-content" className="skip-link">
          Перейти до основного контенту
        </a>
        <Header />
        <main id="main-content" className="main">
          <div className="container">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}