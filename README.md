<div align="center">
  <img src="frontend/public/graduation-cap-theme.svg" width="150" alt="InovAcadêmico Logo">

  # InovAcadêmico - Correção de Bibliografias

  [![Licença MIT](https://img.shields.io/badge/Licença-MIT-blue.svg)](LICENSE)
  [![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-green.svg)](https://github.com/DiegoNogueiraDev/inovacademico)
  [![GitHub Stars](https://img.shields.io/github/stars/DiegoNogueiraDev/inovacademico.svg)](https://github.com/DiegoNogueiraDev/inovacademico/stargazers)

</div>

## 📋 Sobre o Projeto

**InovAcadêmico** é uma plataforma online que utiliza Inteligência Artificial para correção automatizada de referências bibliográficas acadêmicas. O projeto visa automatizar e padronizar o processo de formatação de bibliografias em trabalhos acadêmicos, seguindo normas estabelecidas como ABNT, APA, Vancouver e outras.

> **🎉 PROMOÇÃO**: TUDO DE GRAÇA POR TEMPO LIMITADO!

## ✨ Principais Funcionalidades

### 🔄 Correção Automatizada de Bibliografias
- **Múltiplos estilos de formatação**: ABNT, APA, Vancouver, Chicago, MLA e outros
- **Detecção inteligente de estilos**: Identifica automaticamente o estilo mais próximo da entrada
- **Correção em tempo real**: Resultados rápidos com feedback visual do antes e depois
- **Processamento em lote**: Possibilidade de corrigir múltiplas referências de uma vez

### 📊 Gerenciador de Referências
- **Biblioteca pessoal**: Armazene e organize todas as suas referências
- **Categorização por temas**: Organize por assunto, projeto ou trabalho acadêmico
- **Exportação em múltiplos formatos**: .bib, .ris, .txt, .docx
- **Integração com editores de texto**: (Funcionalidade futura)

### 🧠 Recursos de IA Avançados
- **Preenchimento automático**: Completa referências parciais buscando metadados online
- **Sugestões de melhoria**: Identifica e sugere melhorias mesmo em referências já formatadas
- **Reconhecimento de DOI/ISBN**: Auto-completa referências a partir de identificadores únicos
- **Treinamento especializado**: Modelo de IA ajustado especificamente para normas bibliográficas brasileiras e internacionais

### 📱 Interface do Usuário
- **Design responsivo**: Funcionalidade completa em dispositivos móveis e desktop
- **Tema escuro**: Interface moderna com esquema de cores em tons de rosa, laranja e preto
- **Acessibilidade**: Componentes acessíveis seguindo diretrizes WCAG
- **Animações suaves**: Feedback visual em tempo real para melhor experiência do usuário

### 📦 Recursos Adicionais
- **Histórico completo**: Todas as correções ficam salvas para acesso posterior
- **Sistema de feedback**: Ajude a melhorar o algoritmo reportando correções imprecisas
- **Exportação em massa**: Exporte todas as suas referências de uma só vez
- **Sincronização na nuvem**: (Funcionalidade futura) Acesse suas bibliografias em qualquer dispositivo

## 🔧 Arquitetura do Projeto

O InovAcadêmico segue uma arquitetura cliente-servidor moderna, dividida em duas partes principais:

### Backend (API RESTful)
- **Tecnologia base**: Node.js com Express.js
- **Integração IA**: Conexão com OpenRouter para processamento de linguagem natural
- **Autenticação**: JWT para gerenciamento de sessões (implementação futura)
- **Validação**: Schema validation com Joi
- **Logging**: Sistema completo de logs para monitoramento e depuração
- **Processamento assíncrono**: Tarefas pesadas processadas em segundo plano

### Frontend (SPA)
- **Framework**: Next.js com React
- **Estilização**: TailwindCSS para UI responsiva e customizada
- **Animações**: Framer Motion para transições suaves
- **Componentes**: Headless UI para acessibilidade
- **Gerenciamento de estado**: React Context API / Hooks
- **Comunicação API**: Axios para requisições HTTP
- **Validação de formulários**: React Hook Form com Yup

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js**: Ambiente de execução JavaScript server-side
- **Express.js**: Framework web para criação de APIs
- **Axios**: Cliente HTTP para requisições externas
- **Dotenv**: Gerenciamento de variáveis de ambiente
- **Cors**: Middleware para habilitar CORS
- **Morgan**: HTTP request logger
- **OpenRouter API**: Gateway para modelos de IA avançados

### Frontend
- **Next.js**: Framework React com SSR e otimização
- **React**: Biblioteca para construção de interfaces
- **TailwindCSS**: Framework CSS utilitário
- **Framer Motion**: Biblioteca de animações para React
- **Headless UI**: Componentes acessíveis sem estilo predefinido
- **React Hook Form**: Biblioteca para formulários
- **Axios**: Cliente HTTP para requisições à API
- **ESLint/Prettier**: Ferramentas de linting e formatação

## 📋 Requisitos do Sistema

- **Node.js**: v14.x ou superior
- **NPM**: v6.x ou superior (ou Yarn v1.22+)
- **Conta OpenRouter**: Para acesso aos modelos de IA
- **Navegadores**: Chrome, Firefox, Safari ou Edge (2 versões mais recentes)
- **Armazenamento**: Mínimo de 512MB para instalação completa
- **Memória**: Recomendado 1GB+ de RAM para desenvolvimento

## 🚀 Configuração e Instalação

### Passos Iniciais

```bash
# Clone o repositório
git clone https://github.com/DiegoNogueiraDev/inovacademico.git
cd inovacademico

# Instalar dependências (todas as workspaces)
npm install
```

### Configuração do Backend

1. Navegue até a pasta `backend`
2. Crie um arquivo `.env` baseado no modelo `.env.example`:
   ```
   PORT=5000
   OPENROUTER_API_URL=https://api.openrouter.ai/v1/endpoint
   OPENROUTER_API_KEY=sua_api_key_aqui
   MODEL_NAME=gpt-3.5-turbo
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

### Configuração do Frontend

1. Navegue até a pasta `frontend`
2. Crie um arquivo `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_APP_VERSION=0.1.0
   NEXT_PUBLIC_GA_ID=seu_ga_id (opcional)
   ```

## 🏃‍♂️ Executando o Projeto

```bash
# Executar todo o projeto (backend e frontend)
npm run dev

# Executar apenas o backend
npm run dev:backend

# Executar apenas o frontend
npm run dev:frontend

# Executar testes
npm run test

# Build para produção
npm run build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Documentação API: http://localhost:5000/api-docs (quando implementada)

## 📝 API Endpoints

### API de Bibliografia

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/bibliography/correct` | Corrige bibliografia submetida |
| GET | `/api/bibliography/history` | Retorna histórico de correções |
| GET | `/api/bibliography/styles` | Lista estilos disponíveis |

### API de Feedback

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/feedback` | Envia feedback sobre correção |
| GET | `/api/feedback/stats` | Estatísticas de feedback (admin) |

### API de Usuário (Futuro)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/user/register` | Registro de novo usuário |
| POST | `/api/user/login` | Login de usuário |
| GET | `/api/user/profile` | Informações do perfil |

## 🎨 Design e UX

- **Tema principal**: Escuro com gradientes em tons de rosa e laranja
- **Tipografia**: Sans-serif moderna e legível (Inter)
- **Animações**: Transições suaves, feedback visual para ações
- **Layout**: Responsivo com breakpoints para mobile, tablet e desktop
- **Acessibilidade**: Contraste adequado, textos alternativos, navegação por teclado
- **Feedback**: Alertas interativos, mensagens de sucesso/erro personalizadas
- **Estados visuais**: Hover, focus, active, disabled para todos componentes interativos

## 🔄 Fluxo de Trabalho

### Correção de Bibliografia
1. Usuário cola referências na área de texto
2. Seleciona estilo desejado (opcional, detecta automaticamente se não especificado)
3. Clica em "Corrigir Bibliografia"
4. Sistema mostra animação de carregamento durante processamento
5. Resultados são exibidos em formato comparativo (antes/depois)
6. Opções para copiar, exportar ou salvar no histórico

### Gerenciamento de Referências
1. Usuário acessa seção "Gerenciador de Referências"
2. Visualiza biblioteca de referências salvas anteriormente
3. Pode categorizar, filtrar, editar ou excluir referências
4. Exportação em lote para diferentes formatos

## 📢 Sistema de Feedback

O sistema possui um mecanismo integrado de feedback para melhorar continuamente:

- **Avaliação de correções**: Usuários podem avaliar qualidade das correções
- **Comentários**: Espaço para explicar problemas ou sugerir melhorias
- **Melhoria contínua**: Feedbacks são usados para refinar o modelo de IA
- **Reporte de bugs**: Interface dedicada para reportar problemas técnicos

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estes passos:

1. Faça um fork do repositório
2. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
3. Faça commit das alterações: `git commit -m 'feat: Adiciona nova funcionalidade'`
4. Envie para o seu fork: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

Por favor, siga as convenções de commit e padrões de código do projeto.

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE) - veja o arquivo LICENSE para detalhes.

```
MIT License

Copyright (c) 2023 Diego Nogueira

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📬 Contato e Suporte

- **GitHub**: [DiegoNogueiraDev/inovacademico](https://github.com/DiegoNogueiraDev/inovacademico)
- **Issues**: Use a [seção de issues](https://github.com/DiegoNogueiraDev/inovacademico/issues) para reportar problemas
- **Feature Requests**: Envie sugestões através das issues com tag "enhancement"

---

<div align="center">
  <p>Feito com ❤️ para a comunidade acadêmica</p>
  <p>© 2023 InovAcadêmico | Todos os direitos reservados</p>
</div>