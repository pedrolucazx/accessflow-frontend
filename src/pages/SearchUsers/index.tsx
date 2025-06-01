import { DeleteIcon, EditIcon } from '@/assets/icons';
import { Table, type ITableColumn, type ITableRows } from '@/components/Table';
import { GET_ALL_USERS, GET_USER_BY_PARAMS } from '@/graphql/queyrs';
import type { User, UserFilter } from '@/graphql/types';
import { useToast } from '@/hooks/useToast';
import { formatTimestampToDate } from '@/utils/formatDate';
import { removeEmptyFields } from '@/utils/removeEmptyFields';
import { useLazyQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import './styles.css';

export function SearchUsers() {
  const { addToast } = useToast();
  const { register, handleSubmit, reset } = useForm<UserFilter>();
  const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null);

  const [getAllUsers, { data: usersList }] = useLazyQuery<{
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

  const [getUserByParams] = useLazyQuery<
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

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

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

  return (
    <main className="userManagement" aria-label="Gerenciamento de Usuários">
      <header className="userManagement__header">
        <h1 className="userManagement__title">Gerenciamento de Usuários</h1>
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

      <Table columns={COLUMNS} rows={ROWS} />
    </main>
  );
}
