import { useLazyQuery } from '@apollo/client';
import { useState } from 'react';
import { z } from 'zod';
import { LOGIN } from '../../graphql/queyrs';
import { formatZodErrors } from '../../utils/formatZodErrors';
import './styles.css';
import type { LoginInput, LoginPayload } from '../../graphql/types';

export function LoginPage() {
  const schema = z.object({
    email: z
      .string({ required_error: 'E-mail é obrigatório' })
      .email('E-mail inválido'),
    senha: z
      .string({ required_error: 'Senha é obrigatória' })
      .min(1, 'Senha é obrigatória'),
  });

  type LoginForm = z.infer<typeof schema>;
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    senha: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginForm, string>>
  >({});

  const [login, { loading }] = useLazyQuery<
    { login: LoginPayload },
    { input: LoginInput }
  >(LOGIN, {
    onCompleted(data) {
      console.log(data);
    },
    onError(error) {
      console.error(error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = schema.safeParse(formData);
    if (!result.success) setErrors(formatZodErrors<LoginForm>(result.error));
    login({ variables: { input: result.data! } });
  };

  return (
    <main className="login-page">
      <section className="login-page__container">
        <form
          noValidate
          onSubmit={handleSubmit}
          aria-labelledby="login-title"
          className="login-page__form form"
        >
          <h1 id="login-title" className="login-page__title">
            AccessFlow
          </h1>
          <h2 id="login-subtitle" className="login-page__subtitle">
            Gerencie o acesso com segurança e agilidade
          </h2>

          <div className="form__group">
            <label htmlFor="email" className="form__label">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              className="form__input"
              aria-describedby={errors.email ? 'email-error' : undefined}
              onChange={handleChange}
            />
            {errors.email && (
              <p id="email-error" className="form__error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form__group">
            <label htmlFor="senha" className="form__label">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={formData.senha}
              className="form__input"
              aria-describedby={errors.senha ? 'senha-error' : undefined}
              onChange={handleChange}
            />
            {errors.senha && (
              <p id="senha-error" className="form__error" role="alert">
                {errors.senha}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="button button--primary form__button login-page__submit"
          >
            Entrar
          </button>
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="button button--secondary form__button login-page__submit"
          >
            Cadastrar
          </button>
        </form>
      </section>
    </main>
  );
}
