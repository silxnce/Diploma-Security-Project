'use client';

import { Turnstile } from '@marsidev/react-turnstile';

type CaptchaProps = {
  onSuccess: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
};

export default function Captcha({
  onSuccess,
  onExpire,
  onError,
}: CaptchaProps) {
  return (
    <div
      className="form-group"
      role="group"
      aria-labelledby="captcha-title"
      aria-describedby="captcha-description"
    >
      <p id="captcha-title">
        Перевірка CAPTCHA
      </p>

      <p id="captcha-description">
        CAPTCHA використовується для захисту форми від автоматизованих
        запитів ботів.
      </p>

      <Turnstile
        siteKey={
          process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
          '3x00000000000000000000FF'
        }
        onSuccess={onSuccess}
        onExpire={onExpire}
        onError={onError}
      />
    </div>
  );
}