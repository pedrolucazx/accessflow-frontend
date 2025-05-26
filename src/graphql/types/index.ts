export interface LoginInput {
  email: string;
  senha: string;
}

export interface Perfil {
  id: string;
  nome: string;
  descricao: string;
}

export interface LoginPayload {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  token: string;
  perfis: Perfil[];
}
