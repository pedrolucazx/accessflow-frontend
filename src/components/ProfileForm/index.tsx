import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import './styles.css';

const userSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  descricao: z.string().min(3, 'Descrição é obrigatória').optional(),
});

export type ProfileFormData = z.infer<typeof userSchema>;

interface ProfileFormProps {
  defaultValues?: Partial<ProfileFormData>;
  onSubmitForm: (values: ProfileFormData) => void;
}

export function ProfileForm({ defaultValues, onSubmitForm }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  return (
    <main className="profile-form">
      <section className="profile-form__container">
        <form
          noValidate
          className="profile-form__form"
          aria-labelledby="profile-form-title"
          onSubmit={handleSubmit(onSubmitForm)}
        >
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
            <label htmlFor="descricao" className="form__label">
              Descrição
            </label>
            <input
              id="descricao"
              type="text"
              className="form__input"
              {...register('descricao')}
            />
          </div>

          <button type="submit" className="button button--primary form__button">
            {defaultValues ? 'Atualizar' : 'Cadastrar'}
          </button>
        </form>
      </section>
    </main>
  );
}
