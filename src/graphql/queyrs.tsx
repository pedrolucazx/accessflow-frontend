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
