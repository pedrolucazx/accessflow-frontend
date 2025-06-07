import { ROUTES } from '@/config/routes';
import { SIGNUP } from '@/graphql';
import type { SignUpInput, User } from '@/graphql/types';
import { useToast } from '@/hooks/useToast';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import './styles.css';

export function SignUp() {
  const schema = z.object({
    nome: z
      .string({ required_error: 'Nome é obrigatória' })
      .min(1, 'Nome é obrigatória'),
    email: z
      .string({ required_error: 'E-mail é obrigatório' })
      .email('E-mail inválido'),
    senha: z
      .string({ required_error: 'Senha é obrigatória' })
      .min(1, 'Senha é obrigatória'),
  });

  type SignUpForm = z.infer<typeof schema>;
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(schema),
  });

  const [signUp, { loading }] = useMutation<
    { signUp: User },
    { input: SignUpInput }
  >(SIGNUP, {
    onCompleted() {
      addToast({
        title: 'Cadastro concluído com sucesso!',
        type: 'success',
        description: 'Sua conta foi criada. Você pode fazer login agora.',
      });
      navigate('/login');
    },
    onError(error) {
      addToast({
        title: 'Falha no cadastro',
        type: 'error',
        description: error.message,
      });
    },
  });
  const onSubmit = (data: SignUpForm) => {
    signUp({ variables: { input: data } });
  };

  return (
    <main className="signup-page">
      <section className="signup-page__container">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          aria-labelledby="signup-title"
          className="signup-page__form form"
        >
          <h1 id="signup-title" className="signup-page__title">
            AccessFlow
          </h1>
          <h2 id="signup-subtitle" className="signup-page__subtitle">
            Gerencie o acesso com segurança e agilidade
          </h2>

          <div className="form__group">
            <label htmlFor="nome" className="form__label">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              className="form__input"
              {...register('nome')}
              aria-describedby={errors.nome ? 'nome-error' : undefined}
            />
            {errors.nome && (
              <p id="nome-error" className="form__error" role="alert">
                {errors.nome.message}
              </p>
            )}
          </div>

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
            Cadastrar
          </button>
          <button
            type="button"
            disabled={loading}
            aria-busy={loading}
            onClick={() => navigate(ROUTES.NOT_PROTECTED.LOGIN)}
            className="button button--secondary form__button"
          >
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
