'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { api } from '@/utils/api';
import Captcha from '@/components/Captcha';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function resetCaptcha() {
    setCaptchaToken('');
    setCaptchaKey((previousKey) => previousKey + 1);
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (!captchaToken) {
      setError('Підтвердіть CAPTCHA перед авторизацією.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        captchaToken,
      });

      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      router.push('/dashboard');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err?.response?.data?.message?.message ||
        'Помилка входу. Перевірте введені дані.'
      );

      resetCaptcha();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="card form" aria-labelledby="login-title">
      <h1 id="login-title">Вхід до системи</h1>

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Електронна пошта</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby="email-help"
          />
          <small id="email-help">Введіть адресу електронної пошти.</small>
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {isLoading ? 'Вхід...' : 'Увійти'}
        </button>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}