import { gql } from '@apollo/client';

export const LOGIN = gql`
  query Login($input: LoginInput) {
    login(input: $input) {
      id
      nome
      email
      ativo
      token
      perfis {
        id
        nome
        descricao
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation SignUp($input: SignUpInput) {
    signUp(input: $input) {
      id
      nome
      email
      ativo
      data_criacao
      data_update
      perfis {
        id
        nome
        descricao
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query {
    getAllUsers {
      id
      nome
      email
      ativo
      data_criacao
      data_update
      perfis {
        id
        nome
        descricao
      }
    }
  }
`;

export const GET_USER_BY_PARAMS = gql`
  query GetUserByParams($filter: UserFilter!) {
    getUserByParams(filter: $filter) {
      id
      nome
      email
      ativo
      data_criacao
      data_update
      perfis {
        id
        nome
        descricao
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: Int!) {
    deleteUser(id: $deleteUserId)
  }
`;

export const GET_ALL_PROFILES = gql`
  query {
    getAllProfiles {
      id
      nome
      descricao
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput) {
    createUser(input: $input) {
      id
      nome
      email
      ativo
      data_criacao
      data_update
      perfis {
        id
        nome
        descricao
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UserUpdateInput!, $updateUserId: Int!) {
    updateUser(input: $input, id: $updateUserId) {
      id
      nome
      email
      ativo
      data_criacao
      data_update
      perfis {
        id
        nome
        descricao
      }
    }
  }
`;
