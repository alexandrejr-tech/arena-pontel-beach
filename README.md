# Arena Pontel Beach

Aplicação web fullstack para a Arena Pontel Beach - arena de esportes de areia em Campinas/SP.

## Stack Tecnológica

### Frontend
- React 18 + Vite
- React Router DOM
- Tailwind CSS
- Framer Motion
- React Hook Form
- Axios
- React Toastify
- SwiperJS
- React Helmet Async

### Backend
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT Authentication
- Bcrypt
- Multer (uploads)
- Nodemailer
- Express Validator
- Helmet + Rate Limiting

## Estrutura do Projeto

```
arena-pontel-beach/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/      # Header, Footer, Sidebar, ProtectedRoute
│   │   │   ├── home/        # Seções da landing page
│   │   │   ├── auth/        # Formulários de autenticação
│   │   │   ├── dashboard/   # Componentes da área do aluno
│   │   │   └── shared/      # Button, Input, Card, Modal, Loading
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Chamadas à API
│   │   ├── context/         # AuthContext
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # Formatters, validators, constants
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── routes/          # Definição de rotas
│   │   ├── middleware/      # Auth, error handler, validation
│   │   ├── config/          # Database, Multer, Email
│   │   ├── utils/           # Helpers, email templates
│   │   └── server.js        # Entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Schema do banco
│   │   └── seed.js          # Dados iniciais
│   └── package.json
│
└── README.md
```

## Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 1. Clonar o repositório

```bash
git clone <repo-url>
cd arena-pontel-beach
```

### 2. Configurar o Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```
DATABASE_URL=postgresql://user:password@localhost:5432/arena_pontel
JWT_SECRET=sua-chave-secreta-aqui
JWT_REFRESH_SECRET=sua-chave-refresh-aqui
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Configure o banco de dados:

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed
```

Inicie o servidor:

```bash
npm run dev
```

### 3. Configurar o Frontend

```bash
cd frontend
npm install
```

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Inicie o frontend:

```bash
npm run dev
```

Acesse: **http://localhost:5173**

## Planos Disponíveis

O sistema vem com 28 planos pré-configurados:
- **Futevôlei** - Mensal/Trimestral/Semestral (1x, 2x, 3x por semana)
- **Beach Tênis** - Mensal/Trimestral/Semestral (1x, 2x, 3x por semana)
- **Locação de Quadras** - Avulso, Mensal (1h e 1h30)
- **Personal William Trajano** - Avulso, Mensal (1x, 2x, 3x por semana)

## Endpoints da API

### Autenticação (`/api/auth`)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/register` | Cadastro |
| POST | `/login` | Login |
| POST | `/refresh-token` | Renovar token |
| POST | `/forgot-password` | Solicitar reset |
| POST | `/reset-password/:token` | Resetar senha |
| GET | `/me` | Dados do usuário logado |

### Usuários (`/api/users`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/profile` | Perfil |
| PUT | `/profile` | Atualizar perfil |
| PUT | `/change-password` | Alterar senha |
| PUT | `/upload-avatar` | Upload de foto |
| GET | `/admin/all` | Listar alunos (admin) |
| GET | `/admin/stats` | Estatísticas (admin) |
| POST | `/admin/create` | Criar aluno (admin) |
| PUT | `/admin/:id` | Editar aluno (admin) |
| DELETE | `/admin/:id` | Excluir aluno (admin) |
| POST | `/admin/:id/plan` | Atribuir plano (admin) |
| DELETE | `/admin/:id/plan` | Remover plano (admin) |

### Planos (`/api/plans`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Listar planos |
| GET | `/:id` | Detalhes do plano |
| POST | `/` | Criar (admin) |
| PUT | `/:id` | Atualizar (admin) |
| DELETE | `/:id` | Deletar (admin) |

### Agendamentos (`/api/bookings`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/public/schedule` | Agenda pública (sem auth) |
| GET | `/` | Meus agendamentos |
| GET | `/available` | Horários disponíveis |
| POST | `/` | Criar agendamento |
| DELETE | `/:id` | Cancelar |
| GET | `/admin/all` | Todos (admin) |

**Tipos de quadra:**
- `FUTEVOLEI` - Futevôlei (1h)
- `BEACH_TENNIS` - Beach Tênis (1h)
- `LOCACAO` - Locação de Quadra (1h30)
- `EVENTO` - Evento (1h)

### Assinaturas (`/api/subscriptions`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/my-subscription` | Minha assinatura |
| POST | `/subscribe` | Contratar plano |
| PUT | `/cancel` | Cancelar plano |

### Contato (`/api/contact`)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Enviar mensagem |

### Galeria (`/api/gallery`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Listar imagens |
| POST | `/` | Upload (admin) |
| DELETE | `/:id` | Deletar (admin) |

## Scripts Disponíveis

### Backend
```bash
npm run dev          # Servidor com hot reload
npm start            # Produção
npm run prisma:generate  # Gerar client Prisma
npm run prisma:migrate   # Rodar migrations
npm run prisma:seed      # Popular banco
npm run prisma:studio    # Interface visual do banco
```

### Frontend
```bash
npm run dev       # Servidor de desenvolvimento
npm run build     # Build de produção
npm run preview   # Preview do build
```

## Deploy

### Frontend (Netlify)
```bash
cd frontend && npm run build
```
- O arquivo `netlify.toml` já está configurado
- Variáveis de ambiente na Netlify:
  - `VITE_API_URL` - URL do backend
  - `VITE_WHATSAPP_NUMBER` - Número do WhatsApp

### Backend (Railway/Render)
- Configure as variáveis de ambiente:
  - `DATABASE_URL` - URL do PostgreSQL (Supabase)
  - `JWT_SECRET` - Chave secreta JWT
  - `JWT_REFRESH_SECRET` - Chave refresh JWT
  - `FRONTEND_URL` - URL do frontend
- O Prisma migration roda automaticamente no deploy

### Banco de Dados (Supabase)
- Projeto hospedado no Supabase (PostgreSQL)

## Funcionalidades

- Landing page completa com animações
- Autenticação JWT com refresh tokens
- Área do aluno (dashboard, agendamentos, plano, perfil)
- Painel administrativo completo:
  - Dashboard com estatísticas em tempo real
  - Gerenciamento de alunos (criar, editar, excluir)
  - Atribuição de planos aos alunos
  - Visualização de todos os agendamentos
- Sistema de agendamento:
  - Agenda pública visível sem login
  - Cores por modalidade (Futevôlei, Beach Tênis, Locação, Evento)
  - Suporte a diferentes durações (1h e 1h30)
  - Verificação de conflitos de horário
- CRUD de planos
- Upload de imagens (avatar, galeria)
- Formulário de contato com envio de email
- Responsividade total
- SEO com meta tags
- Botão flutuante do WhatsApp

## Licença

Propriedade de Arena Pontel Beach. Todos os direitos reservados.
