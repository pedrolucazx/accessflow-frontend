import { GET_ALL_PROFILES } from '@/graphql';
import type { Perfil } from '@/graphql/types';
import { useSession } from '@/hooks/useSession';
import { useToast } from '@/hooks/useToast';
import { useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CustomSelect, type IOption } from '../CustomSelect';
import './styles.css';

const userSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(3, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
  perfis: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .min(1, 'Selecione ao menos um perfil'),
});

export type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  defaultValues?: Partial<UserFormData>;
  onSubmitForm: (values: UserFormData) => void;
}

export function UserForm({ defaultValues, onSubmitForm }: UserFormProps) {
  const { addToast } = useToast();
  const { isAdmin, user } = useSession();
  const isOwnUser = Number(user?.id) === defaultValues?.id;
  const showSenha = !defaultValues || isOwnUser;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  const { data: profileList } = useQuery<{
    getAllProfiles: Perfil[];
  }>(GET_ALL_PROFILES, {
    skip: !isAdmin,
    onError(error) {
      addToast({
        title: 'Erro ao carregar perfis',
        type: 'error',
        description: error.message,
      });
    },
  });

  const options: IOption[] = useMemo(
    () =>
      profileList?.getAllProfiles?.map(({ nome, id }) => ({
        label: nome,
        value: String(id),
        className: id === 1 ? 'badge--admin' : 'badge--common',
      })) || [],
    [profileList]
  );

  return (
    <main className="user-form">
      <section className="user-form__container">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmitForm)}
          aria-labelledby="user-form-title"
          className="user-form__form"
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

          {showSenha && (
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
          )}

          {isAdmin && (
            <div className="form__group">
              <label htmlFor="perfis" className="form__label">
                Perfis
              </label>
              <CustomSelect
                isMulti
                name="perfis"
                control={control}
                options={options}
                placeholder="Selecione um ou mais perfis"
                aria-describedby={errors.perfis ? 'perfis-error' : undefined}
              />
              {errors.perfis && (
                <p id="perfis-error" className="form__error" role="alert">
                  {errors.perfis.message}
                </p>
              )}
            </div>
          )}

          <button type="submit" className="button button--primary form__button">
            {defaultValues ? 'Atualizar' : 'Cadastrar'}
          </button>
        </form>
      </section>
    </main>
  );
}
