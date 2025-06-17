# Projeto de Gerenciamento de Usuários e Perfis (Frontend)

Este projeto é o frontend da aplicação de gerenciamento de usuários e perfis, desenvolvido com **Vite**, **React**, **TypeScript**, **SWC**, **Apollo Client**, e **CSS BEM com nesting**. A aplicação consome a API GraphQL e oferece uma interface moderna e responsiva para o usuário.

## ⚙️ Tecnologias Utilizadas

- **Vite**: Bundler moderno para aplicações frontend.
- **React**: Biblioteca para criação de interfaces de usuário.
- **TypeScript**: Tipagem estática para maior segurança no desenvolvimento.
- **SWC**: Compilador rápido para JavaScript e TypeScript usado pelo Vite.
- **Apollo Client**: Gerenciamento de estado e comunicação com API GraphQL.
- **CSS (BEM + nesting)**: Estruturação do CSS usando a metodologia BEM e aninhamento para melhor organização.

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SWC](https://img.shields.io/badge/SWC-F7DF1E?style=for-the-badge&logo=https://swc.rs/logo.png&logoColor=black)
![Apollo Client](https://img.shields.io/badge/Apollo--Client-311C87?style=for-the-badge&logo=apollo-graphql&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## 🛠️ Funcionalidades

- **Autenticação via JWT**: Consumo seguro da API com envio do token no cabeçalho `Authorization`.
- **CRUD de Usuários e Perfis**: Consumo das operações GraphQL para criar, ler, atualizar e excluir usuários e perfis.
- **Controle de Acesso na Interface**: Exibição condicional de funcionalidades com base no perfil do usuário (admin/comum).
- **UX Responsiva**: Interface responsiva e organizada com CSS BEM e nesting.

---

## 🚀 Instruções de Execução

1. Clone o repositório:

   ```bash
   git clone https://github.com/pedrolucazx/accessflow.git
   cd accessflow
   ```

2. Instale as dependências:

   ```bash
   yarn install
   ```

3. Configure as variáveis de ambiente:

   - Crie um arquivo `.env` com a URL da sua API GraphQL:
     ```
     VITE_API_URL=http://localhost:4000/
     ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   yarn dev
   ```

5. Acesse a aplicação no navegador:

   ```
   http://localhost:3000
   ```

---

## 🎨 Organização do CSS

- O projeto utiliza **BEM (Block Element Modifier)** para nomeação de classes.
- **Nesting** é utilizado para facilitar a leitura e manutenção do CSS.
- Os arquivos CSS são modularizados por componente.

Exemplo:

```css
.button {
  button__icon {
    margin-right: 8px;
  }

  button--primary {
    background-color: blue;
  }
}
```

---
