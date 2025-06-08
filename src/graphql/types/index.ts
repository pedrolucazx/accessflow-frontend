export interface LoginInput {
  email: string;
  senha: string;
}

export interface Perfil {
  id: number;
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

export interface SignUpInput {
  nome: string;
  email: string;
  senha: string;
}

export type User = {
  id: number;
  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
  data_criacao?: string;
  data_update?: string;
  perfis: Perfil[];
};

export interface UserFilter {
  id?: number;
  nome?: string;
  email?: string;
}

export interface UserInput {
  nome: string;
  email: string;
  senha?: string;
  perfis: { id: number }[];
}

export type Profile = {
  id: number;
  nome: string;
  descricao?: string;
};

export type ProfileFilter = {
  id?: number;
  nome?: string;
  descricao?: string;
};

export type ProfileInput = {
  nome: string;
  descricao?: string;
};

export type Metrics = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalProfiles: number;
};
