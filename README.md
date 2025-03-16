# InovAcadêmico - Correção de Bibliografias

Aplicação para correção automatizada de bibliografias acadêmicas usando IA.

## Estrutura do Projeto

Este projeto é composto por duas partes principais:

- **Backend**: API Node.js com Express que integra com o serviço OpenRouter para correção de bibliografias
- **Frontend**: Aplicação Next.js que permite aos usuários submeter e visualizar bibliografias corrigidas

## Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- Axios (para requisições HTTP)
- Dotenv (para variáveis de ambiente)

### Frontend
- Next.js
- React
- TailwindCSS
- Axios

## Pré-requisitos

- Node.js (v14+)
- NPM ou Yarn
- Conta e API key no OpenRouter

## Instalação

```bash
# Instalar dependências do projeto (backend e frontend)
npm install

# OU usando workspaces
npm install -ws
```

## Configuração

### Backend
1. Navegue até a pasta `backend`
2. Crie um arquivo `.env` baseado no `.env.example`:
   ```
   PORT=5000
   OPENROUTER_API_URL=https://api.openrouter.ai/v1/endpoint
   OPENROUTER_API_KEY=sua_api_key_aqui
   MODEL_NAME=gpt-3.5-turbo
   ```

### Frontend
1. Navegue até a pasta `frontend`
2. Crie um arquivo `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

## Executando o Projeto

```bash
# Executar ambos frontend e backend simultaneamente
npm run dev

# Executar apenas o backend
npm run dev:backend

# Executar apenas o frontend
npm run dev:frontend
```

O frontend estará disponível em: http://localhost:3000
O backend estará disponível em: http://localhost:5000

## API Endpoints

- `POST /api/bibliography/correct`: Corrige a bibliografia enviada

## Contribuindo

1. Faça um fork do projeto
2. Crie sua feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request