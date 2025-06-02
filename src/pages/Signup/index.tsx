import { UserForm, type UserFormData } from '@/components/UserForm';
import { SIGNUP } from '@/graphql';
import type { SignUpInput, User } from '@/graphql/types';
import { useToast } from '@/hooks/useToast';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router';
import './styles.css';

export function SignUp() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [signUp] = useMutation<{ signUp: User }, { input: SignUpInput }>(
    SIGNUP,
    {
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
    }
  );

  const onSubmit = ({ email, nome, senha }: UserFormData) => {
    signUp({ variables: { input: { email, nome, senha: senha! } } });
  };

  return (
    <main className="signup-page">
      <section className="signup-page__container">
        <div className="signup-page__form form">
          <h1 id="signup-title" className="signup-page__title">
            AccessFlow
          </h1>
          <h2 id="signup-subtitle" className="signup-page__subtitle">
            Gerencie o acesso com segurança e agilidade
          </h2>
          <UserForm onSubmitForm={onSubmit} />
        </div>
      </section>
    </main>
  );
}
