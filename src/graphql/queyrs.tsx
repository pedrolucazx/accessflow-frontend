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
