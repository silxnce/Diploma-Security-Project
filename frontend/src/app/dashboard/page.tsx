'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';

type UserProfile = {
  userId: number;
  email: string;
  role?: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setIsLoading(false);
        router.push('/login');
        return;
      }

      try {
        const response = await api.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
      } catch (err) {
        localStorage.removeItem('accessToken');
        setError('Сесію завершено або токен недійсний.');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('accessToken');
    router.push('/login');
  }

  if (isLoading) {
    return (
      <section className="card" aria-labelledby="loading-title">
        <h1 id="loading-title">Завантаження...</h1>
        <p>Перевіряємо авторизацію користувача.</p>
      </section>
    );
  }

  return (
    <section className="card" aria-labelledby="dashboard-title">
      <h1 id="dashboard-title">Панель користувача</h1>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {profile && (
        <>
          <p>
            Ви авторизовані як: <strong>{profile.email}</strong>
          </p>

          <p>
            Роль користувача:{' '}
            <strong>{profile.role || 'user'}</strong>
          </p>

          <p>
            <a href="/dashboard/edit">Оновити дані профілю</a>
          </p>

          {profile.role === 'admin' && (
            <div className="admin-links">
              <a href="/admin/users">Керування користувачами</a>
              <a href="/admin/security-events">Перегляд подій безпеки</a>
            </div>
          )}

          <div className="grid">
            <article className="card">
              <h2>Безпека акаунта</h2>
              <p>Використовується JWT токен для доступу до захищених ресурсів.</p>
            </article>

            <article className="card">
              <h2>Доступність</h2>
              <p>Інтерфейс підтримує навігацію з клавіатури та семантичну структуру.</p>
            </article>

            <article className="card">
              <h2>Аудит</h2>
              <p>Сайт може бути перевірений через Lighthouse, Axe DevTools та OWASP ZAP.</p>
            </article>
          </div>

          <button
            className="btn"
            type="button"
            onClick={handleLogout}
            style={{ marginTop: '24px' }}
          >
            Вийти
          </button>
        </>
      )}
    </section>
  );
}