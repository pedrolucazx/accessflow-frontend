import { AddUserIcon, DeleteIcon, EditIcon } from '@/assets/icons';
import { Modal, type ModalProps } from '@/components/Modal';
import { ProfileForm, type ProfileFormData } from '@/components/ProfileForm';
import { Spinner } from '@/components/Spinner';
import { Table, type ITableColumn, type ITableRows } from '@/components/Table';
import {
  CREATE_PROFILE,
  DELETE_PROFILE,
  GET_ALL_PROFILES,
  GET_PROFILE_BY_PARAMS,
  UPDATE_PROFILE,
} from '@/graphql';
import type {
  Perfil,
  Profile,
  ProfileFilter,
  ProfileInput,
} from '@/graphql/types';
import { useToast } from '@/hooks/useToast';
import { removeEmptyFields } from '@/utils/removeEmptyFields';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import './styles.css';

export function SearchProfiles() {
  const { addToast } = useToast();
  const { register, handleSubmit, reset } = useForm<ProfileFilter>();
  const [modalContent, setModalContent] = useState<ModalProps>(
    {} as ModalProps
  );
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[] | null>(
    null
  );

  const {
    data: profileList,
    loading: isLoadingProfiles,
    refetch: refetchProfiles,
  } = useQuery<{ getAllProfiles: Perfil[] }>(GET_ALL_PROFILES, {
    onError(error) {
      addToast({
        title: 'Erro ao carregar perfis',
        type: 'error',
        description: error.message,
      });
    },
  });

  const [getProfileByParams, { loading: isLoadingProfile }] = useLazyQuery<
    { getProfileByParams: Profile },
    { filter: ProfileFilter }
  >(GET_PROFILE_BY_PARAMS, {
    onCompleted: ({ getProfileByParams }) => {
      return setFilteredProfiles([getProfileByParams]);
    },
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
      title: `Perfil ${actions[action]}`,
      type: 'success',
      description: `Perfil ${actions[action]} com sucesso!`,
    });
    onCloseModal();
    refetchProfiles();
    reset();
  };

  const handleMutationError = (action: string, error: Error) =>
    addToast({
      title: `Erro ao ${action}`,
      type: 'error',
      description: error.message,
    });

  const [deleteProfile, { loading: isLoadingDeleteProfile }] = useMutation<
    { deleteProfile: string },
    { deleteProfileId: number }
  >(DELETE_PROFILE, {
    onCompleted: () => handleMutationFeedback('deleted'),
    onError: (error) => handleMutationError('excluir o perfil', error),
  });

  const [createProfile, { loading: isLoadingCreateProfile }] = useMutation<
    { createProfile: Profile },
    { input: ProfileInput }
  >(CREATE_PROFILE, {
    onCompleted: () => handleMutationFeedback('created'),
    onError: (error) => handleMutationError('criar o perfil', error),
  });

  const [editProfile, { loading: isLoadingEditProfile }] = useMutation<
    { editProfile: Profile },
    { input: ProfileInput; updateProfileId: number }
  >(UPDATE_PROFILE, {
    onCompleted: () => handleMutationFeedback('updated'),
    onError: (error) => handleMutationError('atualizar o perfil', error),
  });

  const isLoading = useMemo(
    () =>
      isLoadingProfiles ||
      isLoadingProfile ||
      isLoadingCreateProfile ||
      isLoadingDeleteProfile ||
      isLoadingEditProfile,
    [
      isLoadingEditProfile,
      isLoadingCreateProfile,
      isLoadingProfiles,
      isLoadingDeleteProfile,
      isLoadingDeleteProfile,
    ]
  );

  const onCloseModal = () => setModalContent({ isOpen: false });

  const onOpenCreateProfileModal = () => {
    return setModalContent({
      isOpen: true,
      title: 'Cadastrar Perfil',
      body: (
        <ProfileForm
          onSubmitForm={(values) => {
            return createProfile({
              variables: {
                input: {
                  nome: values?.nome,
                  descricao: values?.descricao,
                },
              },
            });
          }}
        />
      ),
    });
  };

  const onOpenEditProfileModal = (profile: ProfileFormData, id: number) => {
    return setModalContent({
      isOpen: true,
      title: 'Editar Perfil',
      body: (
        <ProfileForm
          defaultValues={profile}
          onSubmitForm={(values) => {
            return editProfile({
              variables: {
                input: {
                  nome: values?.nome,
                  descricao: values?.descricao,
                },
                updateProfileId: id,
              },
            });
          }}
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
          <p>Tem certeza de que deseja excluir este perfil?</p>
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
            deleteProfile({ variables: { deleteProfileId: id } });
            onCloseModal();
          },
          className: 'modal__button--primary',
        },
      ],
    });
  };

  const onSubmit = (data: ProfileFilter) => {
    const hasFilters = data.id || data.nome || data.descricao;
    return hasFilters
      ? getProfileByParams({
          variables: { filter: removeEmptyFields(data) },
        })
      : setFilteredProfiles(null);
  };

  const COLUMNS: ITableColumn[] = [
    { name: 'id', label: 'ID' },
    { name: 'name', label: 'Nome' },
    { name: 'description', label: 'Descrição' },
    { name: 'actions', label: 'Ações' },
  ];

  const ROWS: ITableRows[] = useMemo(() => {
    const source = filteredProfiles ?? profileList?.getAllProfiles ?? [];

    return source.map((profile) => ({
      id: profile?.id,
      name: (
        <div className="profileManagement__badge">
          <span
            className={`badge ${profile?.nome === 'admin' ? 'badge--admin' : 'badge--common'}`}
          >
            {profile?.nome}
          </span>
        </div>
      ),
      description: profile?.descricao,
      actions: (
        <div className="profileManagement__actions">
          <button
            className="profileManagement__button profileManagement__button--delete"
            aria-label="Deletar perfil"
            onClick={() => onOpenDeleteModal(profile?.id)}
          >
            <DeleteIcon />
          </button>
          <button
            className="profileManagement__button profileManagement__button--edit"
            aria-label="Editar perfil"
            onClick={() => onOpenEditProfileModal(profile, profile?.id)}
          >
            <EditIcon />
          </button>
        </div>
      ),
    }));
  }, [filteredProfiles, profileList]);

  return (
    <>
      <main className="profileManagement" aria-label="Gerenciamento de Perfis">
        <header className="profileManagement__header">
          <h1 className="profileManagement__title">Gerenciamento de Perfis</h1>
          <button
            type="button"
            className="button button--primary"
            onClick={onOpenCreateProfileModal}
          >
            <AddUserIcon /> Novo perfil
          </button>
        </header>

        <form
          className="profileManagement__form"
          role="search"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="form__group">
            <label htmlFor="id" className="form__label">
              ID
            </label>
            <input
              id="id-filter"
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
              id="nome-filter"
              type="text"
              placeholder="Nome"
              className="form__input"
              {...register('nome')}
            />
          </div>
          <div className="form__group">
            <label htmlFor="descricao" className="form__label">
              Descrição
            </label>
            <input
              id="descricao"
              type="descricao"
              placeholder="Descrição"
              className="form__input"
              {...register('descricao')}
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
                setFilteredProfiles(null);
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
