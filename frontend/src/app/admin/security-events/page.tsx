'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';

type SecurityEvent = {
  id: number;
  type: string;
  ip: string;
  method: string;
  url: string;
  userAgent?: string | null;
  payload?: string | null;
  blocked: boolean;
  createdAt: string;
};

export default function AdminSecurityEventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  async function loadSecurityEvents() {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setIsLoading(false);
      router.push('/login');
      return;
    }

    try {
      const profileResponse = await api.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (profileResponse.data.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      const eventsResponse = await api.get('/security/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvents(eventsResponse.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err?.response?.data?.message?.message ||
          err?.response?.data?.message ||
          'Не вдалося завантажити події безпеки.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSecurityEvents();
  }, []);

  if (isLoading) {
    return (
      <section className="card" aria-labelledby="security-events-loading">
        <h1 id="security-events-loading">Завантаження</h1>
        <p>Перевіряємо права доступу адміністратора...</p>
      </section>
    );
  }

  return (
    <section className="card" aria-labelledby="security-events-title">
      <h1 id="security-events-title">Події безпеки</h1>

      <p>
        Ця сторінка доступна лише адміністраторам. Тут відображаються
        зафіксовані підозрілі запити, спроби XSS, SQL Injection та інші події
        безпеки.
      </p>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <div
        className="table-wrapper"
        role="region"
        aria-label="Таблиця подій безпеки"
      >
        <table className="users-table">
          <caption>Журнал подій безпеки системи</caption>

          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Тип</th>
              <th scope="col">IP</th>
              <th scope="col">Метод</th>
              <th scope="col">URL</th>
              <th scope="col">User Agent</th>
              <th scope="col">Payload запиту</th>
              <th scope="col">Заблоковано</th>
              <th scope="col">Дата</th>
            </tr>
          </thead>

          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={9}>Подій безпеки поки немає.</td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.type}</td>
                  <td>{event.ip}</td>
                  <td>{event.method}</td>
                  <td>{event.url}</td>
                  <td>{event.userAgent || '-'}</td>
                  <td>
                    <pre className="payload-preview">
                      {event.payload || '-'}
                    </pre>
                  </td>
                  <td>{event.blocked ? 'Так' : 'Ні'}</td>
                  <td>
                    {event.createdAt
                      ? new Date(event.createdAt).toLocaleString('uk-UA')
                      : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}