import { AddUserIcon, DeleteIcon, EditIcon } from '@/assets/icons';
import { Modal, type ModalProps } from '@/components/Modal';
import { Spinner } from '@/components/Spinner';
import { Table, type ITableColumn, type ITableRows } from '@/components/Table';
import { UserForm, type UserFormData } from '@/components/UserForm';
import {
  CREATE_USER,
  DELETE_USER,
  GET_ALL_USERS,
  GET_USER_BY_PARAMS,
  UPDATE_USER,
} from '@/graphql';
import type { User, UserFilter, UserInput } from '@/graphql/types';
import { useToast } from '@/hooks/useToast';
import { formatTimestampToDate } from '@/utils/formatDate';
import { removeEmptyFields } from '@/utils/removeEmptyFields';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import './styles.css';

export function SearchUsers() {
  const { addToast } = useToast();
  const { register, handleSubmit, reset } = useForm<UserFilter>();
  const [modalContent, setModalContent] = useState<ModalProps>(
    {} as ModalProps
  );
  const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null);

  const {
    data: usersList,
    loading: isLoadingUsers,
    refetch: refetchUsers,
  } = useQuery<{ getAllUsers: User[] }>(GET_ALL_USERS, {
    onError(error) {
      addToast({
        title: 'Erro ao carregar usuários',
        type: 'error',
        description: error.message,
      });
    },
  });

  const [getUserByParams, { loading: isLoadingUser }] = useLazyQuery<
    { getUserByParams: User },
    { filter: UserFilter }
  >(GET_USER_BY_PARAMS, {
    onCompleted: ({ getUserByParams }) => setFilteredUsers([getUserByParams]),
    onError: (error) =>
      addToast({
        title: 'Erro ao filtrar usuários',
        type: 'error',
        description: error.message,
      }),
  });

  const handleMutationFeedback = (
    action: 'created' | 'updated' | 'deleted'
  ) => {
    const actions = {
      created: 'criado',
      updated: 'atualizado',
      deleted: 'excluído',
    };

    addToast({
      title: `Usuário ${actions[action]}`,
      type: 'success',
      description: `Usuário ${actions[action]} com sucesso!`,
    });
    onCloseModal();
    refetchUsers();
    reset();
  };

  const handleMutationError = (action: string, error: Error) =>
    addToast({
      title: `Erro ao ${action}`,
      type: 'error',
      description: error.message,
    });

  const [deleteUser, { loading: isLoadingDeleteUser }] = useMutation<
    { deleteUser: string },
    { deleteUserId: number }
  >(DELETE_USER, {
    onCompleted: () => handleMutationFeedback('deleted'),
    onError: (error) => handleMutationError('excluir o usuário', error),
  });

  const [createUser, { loading: isLoadingCreateUser }] = useMutation<
    { createUser: User },
    { input: UserInput }
  >(CREATE_USER, {
    onCompleted: () => handleMutationFeedback('created'),
    onError: (error) => handleMutationError('criar o usuário', error),
  });

  const [editUser, { loading: isLoadingEditUser }] = useMutation<
    { editUser: User },
    { input: UserInput; updateUserId: number }
  >(UPDATE_USER, {
    onCompleted: () => handleMutationFeedback('updated'),
    onError: (error) => handleMutationError('atualizar o usuário', error),
  });

  const isLoading = useMemo(
    () =>
      isLoadingUsers ||
      isLoadingUser ||
      isLoadingCreateUser ||
      isLoadingDeleteUser ||
      isLoadingEditUser,
    [
      isLoadingEditUser,
      isLoadingCreateUser,
      isLoadingUsers,
      isLoadingDeleteUser,
      isLoadingDeleteUser,
    ]
  );

  const onCloseModal = () => setModalContent({ isOpen: false });

  const onOpenCreateUserModal = () => {
    return setModalContent({
      isOpen: true,
      title: 'Cadastrar Usuário',
      body: (
        <UserForm
          onSubmitForm={(values) => {
            const data: UserInput = {
              email: values?.email,
              nome: values?.nome,
              senha: values?.senha,
              perfis:
                values?.perfis?.map(({ value }) => ({
                  id: Number(value),
                })) ?? [],
            };

            return createUser({ variables: { input: data } });
          }}
        />
      ),
    });
  };

  const onOpenEditUserModal = (user: UserFormData, id: number) => {
    return setModalContent({
      isOpen: true,
      title: 'Editar Usuário',
      body: (
        <UserForm
          onSubmitForm={(values) => {
            const data: UserInput = {
              email: values?.email,
              nome: values?.nome,
              senha: values?.senha,
              perfis:
                values?.perfis?.map(({ value }) => ({
                  id: Number(value),
                })) ?? [],
            };
            return editUser({
              variables: { input: data, updateUserId: id },
            });
          }}
          defaultValues={user}
        />
      ),
    });
  };

  const onOpenDeleteModal = (id: number) => {
    setModalContent({
      isOpen: true,
      title: 'Confirmar exclusão',
      body: (
        <>
          <p>Tem certeza de que deseja excluir este usuário?</p>
          <p className="modal__warning">Essa ação não poderá ser desfeita.</p>
        </>
      ),
      actionButtons: [
        {
          label: 'Cancelar',
          onClick: onCloseModal,
          className: 'modal__button--secondary',
        },
        {
          label: 'Excluir',
          onClick: () => {
            deleteUser({ variables: { deleteUserId: id } });
            onCloseModal();
          },
          className: 'modal__button--primary',
        },
      ],
    });
  };

  const onSubmit = (data: UserFilter) => {
    const hasFilters = data.id || data.nome || data.email;

    return hasFilters
      ? getUserByParams({ variables: { filter: removeEmptyFields(data) } })
      : setFilteredUsers(null);
  };

  const COLUMNS: ITableColumn[] = useMemo(
    () => [
      { name: 'id', label: 'ID' },
      { name: 'name', label: 'Nome' },
      { name: 'email', label: 'Email' },
      { name: 'createdAt', label: 'Criado em' },
      { name: 'updatedAt', label: 'Atualizado em' },
      { name: 'status', label: 'Status' },
      { name: 'profiles', label: 'Perfis' },
      { name: 'actions', label: 'Ações' },
    ],
    []
  );

  const ROWS: ITableRows[] = useMemo(() => {
    const source = filteredUsers ?? usersList?.getAllUsers ?? [];

    return source.map((user) => ({
      id: user?.id,
      name: user?.nome,
      email: user?.email,
      createdAt: formatTimestampToDate(Number(user.data_criacao!)),
      updatedAt: formatTimestampToDate(Number(user.data_update!)),
      status: (
        <div className="userManagement__badge">
          <span
            className={`badge ${user?.ativo ? 'badge--active' : 'badge--inactive'}`}
          >
            {user?.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      ),
      profiles: (
        <div className="userManagement__badge">
          {user?.perfis?.map(({ nome, id }) => (
            <span
              key={id}
              className={`badge ${id === 1 ? 'badge--admin' : 'badge--common'}`}
            >
              {nome}
            </span>
          ))}
        </div>
      ),
      actions: (
        <div className="userManagement__actions">
          <button
            className="userManagement__button userManagement__button--delete"
            aria-label="Deletar usuário"
            onClick={() => onOpenDeleteModal(user?.id)}
          >
            <DeleteIcon />
          </button>
          <button
            className="userManagement__button userManagement__button--edit"
            aria-label="Editar usuário"
            onClick={() =>
              onOpenEditUserModal(
                {
                  ...user,
                  perfis: user.perfis?.map(({ id, nome }) => ({
                    label: nome,
                    value: String(id),
                    className: id === 1 ? 'badge--admin' : 'badge--common',
                  })),
                },
                user?.id
              )
            }
          >
            <EditIcon />
          </button>
        </div>
      ),
    }));
  }, [filteredUsers, usersList]);

  return (
    <>
      <main className="userManagement" aria-label="Gerenciamento de Usuários">
        <header className="userManagement__header">
          <h1 className="userManagement__title">Gerenciamento de Usuários</h1>
          <button
            type="button"
            className="button button--primary"
            onClick={onOpenCreateUserModal}
          >
            <AddUserIcon /> Novo usuário
          </button>
        </header>

        <form
          className="userManagement__form"
          role="search"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="form__group">
            <label htmlFor="id" className="form__label">
              ID
            </label>
            <input
              id="id"
              type="number"
              placeholder="ID"
              className="form__input"
              {...register('id', { valueAsNumber: true })}
            />
          </div>
          <div className="form__group">
            <label htmlFor="nome" className="form__label">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              placeholder="Nome"
              className="form__input"
              {...register('nome')}
            />
          </div>
          <div className="form__group">
            <label htmlFor="email" className="form__label">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="E-mail"
              className="form__input"
              {...register('email')}
            />
          </div>
          <div className="form__actions">
            <button type="submit" className="button button--primary">
              Filtrar
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setFilteredUsers(null);
              }}
              className="button button--secondary"
            >
              Limpar
            </button>
          </div>
        </form>

        {isLoading ? <Spinner /> : <Table columns={COLUMNS} rows={ROWS} />}
      </main>
      <Modal {...modalContent} onClose={onCloseModal} />
    </>
  );
}
