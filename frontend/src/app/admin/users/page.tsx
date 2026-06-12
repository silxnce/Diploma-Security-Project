/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';

type UserRole = 'user' | 'admin';
type UserStatus = 'active' | 'blocked' | 'inactive';

type User = {
  id: number;
  email: string;
  role: UserRole;
  status: UserStatus;
  failedLoginAttempts: number;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  async function loadUsers() {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const profileResponse = await api.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCurrentUserId(profileResponse.data.userId);

      if (profileResponse.data.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      const usersResponse = await api.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(usersResponse.data);
    } catch {
      localStorage.removeItem('accessToken');
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, []);

    async function changeRole(
    userId: number,
    email: string,
    role: UserRole,
    ) {
    const confirmed = window.confirm(
        `Ви впевнені, що хочете змінити роль користувача ${email} на ${role}?`,
    );

    if (!confirmed) {
        return;
    }

    const token = localStorage.getItem('accessToken');

    try {
        await api.patch(
        `/users/${userId}/role`,
        { role },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        },
        );

        setMessage('Роль користувача успішно змінено.');
        setError('');
        await loadUsers();
    } catch (err: any) {
        setError(
            err?.response?.data?.message?.message ||
            'Не вдалося змінити роль користувача.'
        );
        setMessage('');
    }
    }

    async function blockUser(userId: number, email: string) {
      const confirmed = window.confirm(
          `Ви впевнені, що хочете заблокувати користувача ${email}?`,
      );

      if (!confirmed) {
          return;
      }

      const token = localStorage.getItem('accessToken');

      try {
          await api.patch(
          `/users/${userId}/block`,
          {},
          {
              headers: {
              Authorization: `Bearer ${token}`,
              },
          },
          );

          setMessage('Користувача заблоковано.');
          setError('');
          await loadUsers();
      } catch (err: any) {
          setError(
              err?.response?.data?.message?.message ||
              'Не вдалося заблокувати користувача.'
          );
          setMessage('');
      }
    }

    async function activateUser(userId: number, email: string) {
      const confirmed = window.confirm(
          `Ви впевнені, що хочете активувати користувача ${email}?`,
      );

      if (!confirmed) {
          return;
      }

      const token = localStorage.getItem('accessToken');

      try {
          await api.patch(
          `/users/${userId}/activate`,
          {},
          {
              headers: {
              Authorization: `Bearer ${token}`,
              },
          },
          );

          setMessage('Користувача активовано.');
          setError('');
          await loadUsers();
      } catch (err: any) {
          setError(
              err?.response?.data?.message?.message ||
              'Не вдалося активувати користувача.'
          );
          setMessage('');
      }
    }

  if (isLoading) {
    return (
      <section className="card" aria-labelledby="admin-users-loading">
        <h1 id="admin-users-loading">Завантаження</h1>
        <p>Перевіряємо права доступу адміністратора...</p>
      </section>
    );
  }

  return (
    <section className="card" aria-labelledby="admin-users-title">
      <h1 id="admin-users-title">Керування користувачами</h1>

      <p>
        Ця сторінка доступна лише користувачам з роллю адміністратора.
        Керування виконується через захищені JWT API запити до backend.
      </p>

      <div aria-live="polite">
        {message && (
          <p className="success" role="status">
            {message}
          </p>
        )}

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="table-wrapper" role="region" aria-label="Таблиця користувачів">
        <table className="users-table">
          <caption>
            Список зареєстрованих користувачів системи
          </caption>

          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Email</th>
              <th scope="col">Роль</th>
              <th scope="col">Статус</th>
              <th scope="col">Невдалі входи</th>
              <th scope="col">Останній вхід</th>
              <th scope="col">Створено</th>
              <th scope="col">Оновлено</th>
              <th scope="col">Дії</th>
            </tr>
          </thead>

            <tbody>
            {users.map((user) => {
                const isCurrentUser = user.id === currentUserId;

                return (
                <tr key={user.id}>
                  <td>{user.id}</td>

                  <td>{user.email}</td>

                  <td>
                    <label className="sr-only" htmlFor={`role-${user.id}`}>
                      Змінити роль користувача {user.email}
                    </label>

                    <select
                      id={`role-${user.id}`}
                      value={user.role}
                      disabled={isCurrentUser}
                      onChange={(event) =>
                        changeRole(user.id, user.email, event.target.value as UserRole)
                      }
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>

                    {isCurrentUser && (
                      <span className="help-text">Це ваш обліковий запис</span>
                    )}
                  </td>

                  <td>{user.status}</td>

                  <td>{user.failedLoginAttempts}</td>

                  <td>
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleString('uk-UA')
                      : '-'}
                  </td>

                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString('uk-UA')
                      : '-'}
                  </td>

                  <td>
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleString('uk-UA')
                      : '-'}
                  </td>

                  <td>
                    {user.status === 'blocked' ? (
                      <button
                        className="btn"
                        type="button"
                        disabled={isCurrentUser}
                        onClick={() => activateUser(user.id, user.email)}
                      >
                        Активувати
                      </button>
                    ) : (
                      <button
                        className="btn danger-btn"
                        type="button"
                        disabled={isCurrentUser}
                        onClick={() => blockUser(user.id, user.email)}
                      >
                        Заблокувати
                      </button>
                    )}
                  </td>
                </tr>
                );
            })}
            </tbody>
        </table>
      </div>
    </section>
  );
}