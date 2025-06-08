import { Spinner } from '@/components/Spinner';
import { UserForm, type UserFormData } from '@/components/UserForm';
import { GET_USER_BY_PARAMS, UPDATE_USER } from '@/graphql';
import type { User, UserFilter, UserInput } from '@/graphql/types';
import { useSession } from '@/hooks/useSession';
import { useToast } from '@/hooks/useToast';
import { removeEmptyFields } from '@/utils/removeEmptyFields';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useCallback, useEffect, useMemo } from 'react';
import './styles.css';

export function Settings() {
  const {
    session: { user },
  } = useSession();

  const { addToast } = useToast();

  const filterByUserId = useMemo(
    () => ({
      filter: removeEmptyFields({ id: Number(user.id) }),
    }),
    [user.id]
  );

  const [getUserByParams, { data, loading: isLoadingUser }] = useLazyQuery<
    { getUserByParams: User },
    { filter: UserFilter }
  >(GET_USER_BY_PARAMS, {
    variables: filterByUserId,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onError: (error) =>
      addToast({
        title: 'Erro ao buscar usuário',
        type: 'error',
        description: error.message,
      }),
  });

  const [editUser, { loading: isLoadingEditUser }] = useMutation<
    { editUser: User },
    { input: UserInput; updateUserId: number }
  >(UPDATE_USER, {
    refetchQueries: [{ query: GET_USER_BY_PARAMS, variables: filterByUserId }],
    awaitRefetchQueries: true,
    onCompleted: () =>
      addToast({
        title: 'Usuário atualizado',
        type: 'success',
        description: 'Usuário atualizado com sucesso!',
      }),
    onError: (error) =>
      addToast({
        title: 'Erro ao atualizar o usuário',
        type: 'error',
        description: error.message,
      }),
  });

  const onSubmit = useCallback(
    (values: UserFormData) => {
      const input: UserInput = {
        email: values.email,
        nome: values.nome,
        senha: values.senha,
        perfis:
          values.perfis?.map(({ value }) => ({ id: Number(value) })) ?? [],
      };

      return editUser({
        variables: { input, updateUserId: Number(user.id) },
      });
    },
    [editUser, user.id]
  );

  useEffect(() => {
    getUserByParams();
  }, [getUserByParams]);

  const defaultValues = useMemo<UserFormData | undefined>(() => {
    const currentUser = data?.getUserByParams;
    if (!currentUser) return undefined;

    return {
      email: currentUser.email ?? '',
      nome: currentUser.nome ?? '',
      perfis:
        currentUser.perfis?.map(({ nome, id }) => ({
          label: nome,
          value: String(id),
          className: id === 1 ? 'badge--admin' : 'badge--common',
        })) ?? [],
    };
  }, [data]);

  const stillLoading = isLoadingUser || isLoadingEditUser || !defaultValues;

  return (
    <main className="settings-page">
      <section className="settings-page__container">
        {stillLoading ? (
          <Spinner />
        ) : (
          <div className="settings-page__form form">
            <h1 id="settings-title" className="settings-page__title">
              AccessFlow
            </h1>
            <h2 id="settings-subtitle" className="settings-page__subtitle">
              Gerencie o acesso com segurança e agilidade
            </h2>

            <UserForm defaultValues={defaultValues} onSubmitForm={onSubmit} />
          </div>
        )}
      </section>
    </main>
  );
}
