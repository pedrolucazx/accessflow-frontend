import { LOGIN } from '@/graphql';
import type { LoginInput, LoginPayload } from '@/graphql/types';
import { useSession } from '@/hooks/useSession';
import { useToast } from '@/hooks/useToast';
import { useLazyQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import './styles.css';

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
  const { addToast } = useToast();
  const { startSession } = useSession();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const [login, { loading }] = useLazyQuery<
    { login: LoginPayload },
    { input: LoginInput }
  >(LOGIN, {
    onCompleted(data) {
      const { login: user } = data;
      startSession({ token: user?.token, user });
      addToast({
        title: 'Login realizado',
        type: 'success',
        description: 'Você foi autenticado com sucesso.',
      });
      navigate('/');
    },
    onError(error) {
      addToast({
        title: 'Erro ao fazer login',
        type: 'error',
        description: error.message,
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    login({ variables: { input: data } });
  };
  return (
    <main className="login-page">
      <section className="login-page__container">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
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
              className="form__input"
              {...register('email')}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="form__error" role="alert">
                {errors.email.message}
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
              className="form__input"
              {...register('senha')}
              aria-describedby={errors.senha ? 'senha-error' : undefined}
            />
            {errors.senha && (
              <p id="senha-error" className="form__error" role="alert">
                {errors.senha.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="button button--primary form__button"
          >
            Entrar
          </button>
          <button
            type="button"
            disabled={loading}
            aria-busy={loading}
            onClick={() => navigate('/signup')}
            className="button button--secondary form__button"
          >
            Cadastrar
          </button>
        </form>
      </section>
    </main>
  );
}
