'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { api } from '@/utils/api';
import Captcha from '@/components/Captcha';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function resetCaptcha() {
    setCaptchaToken('');
    setCaptchaKey((previousKey) => previousKey + 1);
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!captchaToken) {
      setError('Підтвердіть CAPTCHA перед реєстрацією.');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/register', {
        email,
        password,
        captchaToken,
      });

      setSuccess('Користувача успішно зареєстровано.');
      router.push('/login');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err?.response?.data?.message?.message ||
          err?.response?.data?.message ||
          'Не вдалося зареєструвати користувача.',
      );

      resetCaptcha();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="card form" aria-labelledby="register-title">
      <h1 id="register-title">Реєстрація користувача</h1>

      <form onSubmit={handleRegister}>
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
          <label htmlFor="password">Пароль</label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <Captcha
          key={captchaKey}
          onSuccess={(token) => {
            setCaptchaToken(token);
            setError('');
          }}
          onExpire={() => resetCaptcha()}
          onError={() => {
            setError('Помилка CAPTCHA. Спробуйте ще раз.');
            resetCaptcha();
          }}
        />

        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
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