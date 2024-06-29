# Vendinha Interfocus

## Deploy e Documentação:
 **O projeto está hospedado no Azure e pode ser acessado pelo seguinte link:**
 - https://deploy-vendinha.azurewebsites.net/

 **Documentação da API no Postman:**
 - https://documenter.getpostman.com/view/32817755/2sA3XY7JPx

## Sobre:
Bem-vindo ao projeto Vendinha Interfocus! Este site foi desenvolvido como parte do processo seletivo de estágio da empresa Interfocus. O projeto tem como objetivo ajudar no controle de dívidas dos clientes de uma vendinha. Com ele, você pode cadastrar novos clientes, adicionar dívidas e acompanhar o status de pagamento de cada uma delas, proporcionando uma gestão mais eficiente e organizada.

## Instalação:

### Requisitos
- **Backend**:
  - Visual Studio 2022
  - .NET Core 8.0
  - PostgreSQL

- **Frontend**:
  - Node.js 14.x ou superior
  - npm 6.x ou superior

### Clone o repositório:

  ```bash
  git clone https://github.com/pivetoo/vendinha-interfocus.git
  ```

 **Ao clonar o repositório, você terá 3 arquivos**:
 1. database-schema
 2. frontend-vendinha
 3. backend-vendinha

### Configuração do Backend

1. Abra o Visual Studio e carregue a solução 'VendinhaInterfocus.sln'.
2. O arquivo do banco de dados está na main: 'database-schema', cole no seu banco de dados PostgreSQL.
3. Configure a sua string de conexão com o banco de dados no arquivo `hibernate.cfg.xml`.
4. Execute o projeto no Visual Studio (pressione F5 ou clique no botão de execução).
5. Após isso, a API estará rodando com a porta 5173

### Configuração do Frontend

1. Navegue até a pasta do projeto frontend:
    ```bash
    cd vendinha-interfocus/frontend-vendinha
    ```
2. Instale as dependências:
    ```bash
    npm install
    ```
3. Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
4. Após isso, abra [http://localhost:5173](http://localhost:5173) no seu navegador.

## Desenvolvido por:

### Rogério Piveto

[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rogerio-piveto/)

[![GitHub](https://img.shields.io/badge/GitHub-%2312100E.svg?logo=github&logoColor=white)](https://github.com/pivetoo)

## Stacks utilizadas:

<img src="https://img.shields.io/static/v1?label=react&message=Frontend&color=blue&style=for-the-badge&logo=REACT"/>
<img src="https://img.shields.io/static/v1?label=C%23&message=Backend&color=purple&style=for-the-badge&logo=CSharp"/>
<img src="https://img.shields.io/static/v1?label=NHibernate&message=ORM&color=red&style=for-the-badge&logo=NHibernate"/>
<img src="https://img.shields.io/static/v1?label=Azure&message=Deploy Frontend%20e%20Backend&color=0078D4&style=for-the-badge&logo=microsoft-azure&logoColor=white"/>
<img src="https://img.shields.io/static/v1?label=AWS&message=Deploy Database&color=FF9900&style=for-the-badge&logo=amazon-aws&logoColor=white"/>