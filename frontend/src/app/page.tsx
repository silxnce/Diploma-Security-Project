import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="card">
      <h1>Корпоративний вебсайт із захистом та цифровою доступністю</h1>

      <p>
        Цей вебресурс реалізує базові механізми інформаційної безпеки:
        авторизацію, аутентифікацію, захист даних, CAPTCHA та адаптивний
        інтерфейс відповідно до принципів WCAG 2.1.
      </p>

      <div className="grid">
        <article className="card">
          <h2>Безпека</h2>
          <p>JWT, HTTPS, CAPTCHA, захист від XSS, CSRF та SQL Injection.</p>
        </article>

        <article className="card">
          <h2>Доступність</h2>
          <p>Семантичний HTML, клавіатурна навігація, контрастність і ARIA.</p>
        </article>

        <article className="card">
          <h2>Аудит</h2>
          <p>Перевірка через Lighthouse, Axe DevTools та OWASP ZAP.</p>
        </article>
      </div>

      <p style={{ marginTop: '24px' }}>
        <Link href="/register">Створити акаунт</Link>
      </p>
    </section>
  );
}