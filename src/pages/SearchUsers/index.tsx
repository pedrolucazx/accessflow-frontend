import { AddUserIcon, DeleteIcon, EditIcon } from '@/assets/icons';
import { Modal, type ModalProps } from '@/components/Modal';
import { Spinner } from '@/components/Spinner';
import { Table, type ITableColumn, type ITableRows } from '@/components/Table';
import { DELETE_USER, GET_ALL_USERS, GET_USER_BY_PARAMS } from '@/graphql';
import type { User, UserFilter } from '@/graphql/types';
import { useToast } from '@/hooks/useToast';
import { formatTimestampToDate } from '@/utils/formatDate';
import { removeEmptyFields } from '@/utils/removeEmptyFields';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import './styles.css';

export function SearchUsers() {
  const { addToast } = useToast();

  const { register, handleSubmit, reset } = useForm<UserFilter>();
  const [modalContent, setModalContent] = useState<ModalProps>(
    {} as ModalProps
  );
  const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null);

  const [getAllUsers, { data: usersList, loading: isLoadingUsers, refetch }] =
    useLazyQuery<{
      getAllUsers: User[];
    }>(GET_ALL_USERS, {
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
    onCompleted(data) {
      setFilteredUsers([data.getUserByParams]);
    },
    onError(error) {
      addToast({
        title: 'Erro ao filtrar usuários',
        type: 'error',
        description: error.message,
      });
    },
  });

  const [deleteUser] = useMutation<
    { deleteUser: string },
    { deleteUserId: number }
  >(DELETE_USER, {
    onCompleted(data) {
      addToast({
        title: 'Usuário excluído',
        type: 'success',
        description: data?.deleteUser,
      });
      refetch();
    },
    onError(error) {
      addToast({
        title: 'Erro ao excluir',
        type: 'error',
        description: `Não foi possível deletar o usuário: ${error.message}`,
      });
    },
  });

  const onCloseModal = () => setModalContent({ isOpen: false });

  const onOpenDeleteModal = (id: number) =>
    setModalContent({
      isOpen: true,
      title: 'Confirmar exclusão',
      body: (
        <>
          <p>Você tem certeza que deseja excluir este usuário?</p>
          <p className="modal__warning">Essa ação não pode ser desfeita.</p>
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

  const onSubmit = (data: UserFilter) => {
    const hasFilters = data.id || data.nome || data.email;
    if (hasFilters) {
      getUserByParams({ variables: { filter: removeEmptyFields(data) } });
    } else {
      setFilteredUsers(null);
    }
  };

  const COLUMNS: ITableColumn[] = [
    { name: 'id', label: 'ID' },
    { name: 'name', label: 'Nome' },
    { name: 'email', label: 'Email' },
    { name: 'createdAt', label: 'Data Criação' },
    { name: 'updatedAt', label: 'Data Atualização' },
    { name: 'status', label: 'Status' },
    { name: 'profiles', label: 'Perfis' },
    { name: 'actions', label: 'Ações' },
  ];

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
              className={`badge ${id === 1 ? 'badge--admin' : 'badge--common'}`}
              key={id}
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
          >
            <EditIcon />
          </button>
        </div>
      ),
    }));
  }, [filteredUsers, usersList]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <>
      <main className="userManagement" aria-label="Gerenciamento de Usuários">
        <header className="userManagement__header">
          <h1 className="userManagement__title">Gerenciamento de Usuários</h1>
          <button type="button" className="button button--primary">
            <AddUserIcon /> Novo usuário
          </button>
        </header>

        <form
          className="userManagement__form"
          role="search"
          aria-label="Formulário de filtro de usuários"
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

        {isLoadingUsers || isLoadingUser ? (
          <Spinner />
        ) : (
          <Table columns={COLUMNS} rows={ROWS} />
        )}
      </main>
      <Modal
        isOpen={modalContent.isOpen}
        title={modalContent.title}
        body={modalContent.body}
        onClose={onCloseModal}
        actionButtons={modalContent.actionButtons}
      />
    </>
  );
}
