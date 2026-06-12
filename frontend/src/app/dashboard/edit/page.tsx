'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';

type UserProfile = {
  userId: number;
  email: string;
  role?: string;
};

export default function EditProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
        setEmail(response.data.email);
      } catch {
        localStorage.removeItem('accessToken');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profile) {
      return;
    }

    const confirmed = window.confirm(
      'Ви впевнені, що хочете оновити дані профілю?',
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem('accessToken');

    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const payload: {
        email?: string;
        password?: string;
      } = {};

      if (email && email !== profile.email) {
        payload.email = email;
      }

      if (password) {
        payload.password = password;
      }

      if (!payload.email && !payload.password) {
        setError('Немає змін для збереження.');
        return;
      }

      await api.patch(`/users/me`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess('Дані профілю успішно оновлено.');

      if (payload.email || payload.password) {
        localStorage.removeItem('accessToken');

        setTimeout(() => {
          router.push('/login');
        }, 1000);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err?.response?.data?.message?.message ||
          err?.response?.data?.message ||
          'Не вдалося оновити дані профілю.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <section className="card" aria-labelledby="edit-profile-loading">
        <h1 id="edit-profile-loading">Завантаження...</h1>
        <p>Завантажуємо дані профілю.</p>
      </section>
    );
  }

  return (
    <section className="card form" aria-labelledby="edit-profile-title">
      <h1 id="edit-profile-title">Оновлення даних профілю</h1>

      <p>
        На цій сторінці можна оновити електронну пошту або пароль користувача.
        Після зміни даних потрібно повторно увійти в систему.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Електронна пошта</label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Новий пароль</label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-describedby="password-help"
          />

          <small id="password-help">
            Залиште поле порожнім, якщо не хочете змінювати пароль.
          </small>
        </div>

        <button className="btn" type="submit" disabled={isSaving}>
          {isSaving ? 'Збереження...' : 'Зберегти зміни'}
        </button>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="success" role="status">
            {success}
          </p>
        )}
      </form>
    </section>
  );
}