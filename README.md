# iRun Clube+ 🏃‍♂️

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/contato-2636s-projects/v0-landing-page-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/kqqqLod8QAF)

## 📋 Sobre o Projeto

iRun Clube+ é uma plataforma de recompensas por atividade física que conecta atletas a estabelecimentos parceiros. Os usuários registram suas atividades (corrida, ciclismo, natação), completam metas e ganham cupons de desconto em lojas e serviços parceiros.

### Funcionalidades Principais

- 🏃 **Rastreamento de Atividades**: Integração com Apple Health, Google Fit e Strava
- 🎯 **Sistema de Metas**: Metas diárias, semanais, mensais e calóricas
- 🎁 **Cupons de Recompensa**: Descontos em estabelecimentos parceiros
- 👥 **Painel de Parceiros**: Validação de cupons pelos estabelecimentos
- 🔐 **Painel Administrativo**: Gerenciamento de parceiros, metas e cupons
- 📱 **Mobile-First**: Interface otimizada para dispositivos móveis

## 🚀 Tecnologias

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes UI**: [shadcn/ui](https://ui.shadcn.com/)
- **Banco de Dados**: [Neon PostgreSQL](https://neon.tech/)
- **Autenticação**: Cookie-based sessions
- **Deploy**: [Vercel](https://vercel.com/)

## 📁 Estrutura do Projeto

\`\`\`
irun-mvp/
├── app/                          # Páginas e rotas (Next.js App Router)
│   ├── page.tsx                  # Landing page
│   ├── login/                    # Autenticação de usuários
│   ├── signup/                   # Cadastro de usuários
│   ├── dashboard/                # Dashboard principal do usuário
│   ├── goals/                    # Visualização de metas
│   ├── rewards/                  # Catálogo de recompensas
│   ├── partners/                 # Catálogo de parceiros
│   ├── profile/                  # Perfil do usuário
│   ├── communities/              # Comunidades (em desenvolvimento)
│   ├── partner/                  # Painel de validação de parceiros
│   ├── admin/                    # Painel administrativo
│   └── onboarding/               # Fluxo de consentimento LGPD
├── components/                   # Componentes React reutilizáveis
│   ├── ui/                       # Componentes base (shadcn/ui)
│   ├── bottom-nav.tsx            # Navegação inferior mobile
│   ├── dashboard-header.tsx      # Header do dashboard
│   ├── stats-cards.tsx           # Cards de estatísticas e metas
│   └── ...                       # Outros componentes específicos
├── lib/                          # Utilitários e lógica de negócio
│   ├── db.ts                     # Configuração do banco de dados
│   ├── auth.ts                   # Funções de autenticação
│   ├── activities.ts             # Lógica de atividades
│   ├── coupons.ts                # Lógica de cupons
│   └── ...                       # Outros utilitários
├── scripts/                      # Scripts SQL para banco de dados
│   ├── 001-create-tables.sql    # Schema do banco
│   ├── 002-seed-initial-data.sql # Dados iniciais
│   └── 003-create-admin-user.sql # Criação de admin
├── public/                       # Arquivos estáticos (logos, imagens)
└── styles/                       # Estilos globais
\`\`\`

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

- **users**: Dados dos usuários e configurações de plano
- **activities**: Registro de atividades físicas
- **goals**: Definição de metas (diária, semanal, mensal, calórica)
- **partners**: Estabelecimentos parceiros
- **coupons**: Cupons de desconto disponíveis
- **user_goal_progress**: Progresso dos usuários nas metas
- **user_coupons**: Cupons conquistados pelos usuários
- **admins**: Usuários com permissões administrativas

## 🔧 Configuração e Instalação

### Pré-requisitos

- Node.js 18+ 
- Conta no [Neon](https://neon.tech/) para banco de dados PostgreSQL
- Conta no [Vercel](https://vercel.com/) para deploy (opcional)

### Variáveis de Ambiente

Crie um arquivo `.env.local` com as seguintes variáveis:

\`\`\`env
# Neon Database
DATABASE_URL=postgresql://...
POSTGRES_URL=postgresql://...
\`\`\`

### Instalação

\`\`\`bash
# Clone o repositório
git clone https://github.com/seu-usuario/irun-mvp.git

# Instale as dependências
npm install
# ou
pnpm install

# Execute os scripts SQL para criar as tabelas
# (Use o painel do Neon ou execute via CLI)

# Inicie o servidor de desenvolvimento
npm run dev
\`\`\`

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## 📱 Fluxo de Uso

### Para Usuários

1. **Cadastro**: Criar conta com email e senha
2. **Consentimento LGPD**: Aceitar termos de uso e política de privacidade
3. **Dashboard**: Visualizar metas e progresso
4. **Atividades**: Conectar apps de fitness (Apple Health, Google Fit, Strava)
5. **Metas**: Acompanhar progresso em metas diárias, semanais e mensais
6. **Recompensas**: Resgatar cupons ao completar metas
7. **Parceiros**: Explorar estabelecimentos parceiros por categoria

### Para Parceiros

1. **Login**: Acessar painel com CNPJ e email
2. **Validação**: Validar cupons dos usuários por código
3. **Histórico**: Visualizar cupons validados

### Para Administradores

1. **Login**: Acessar painel administrativo
2. **Gerenciar Parceiros**: Adicionar, editar e remover parceiros
3. **Gerenciar Metas**: Configurar metas e requisitos
4. **Gerenciar Cupons**: Criar e editar cupons de desconto
5. **Estatísticas**: Visualizar métricas do sistema

## 🔐 Segurança

- **Autenticação**: Sistema de sessão baseado em cookies HTTP-only
- **LGPD**: Consentimento explícito para coleta de dados
- **SQL Injection**: Uso de prepared statements (Neon serverless)
- **Validação**: Validação de dados no servidor com TypeScript

> ⚠️ **Nota de Segurança**: Este é um MVP. Em produção, implemente:
> - Hash de senhas (bcrypt, argon2)
> - Rate limiting
> - CSRF protection
> - Validação mais robusta
> - Logs de auditoria

## 🎨 Design System

- **Cores Principais**: 
  - Azul: `#0b2396` (primária)
  - Dourado: `#d9a520` (secundária)
- **Tipografia**: Geist Sans (padrão do Next.js)
- **Componentes**: shadcn/ui com Tailwind CSS
- **Responsividade**: Mobile-first design

## 🚧 Roadmap

- [ ] Integração real com Apple Health
- [ ] Integração real com Google Fit
- [ ] Integração real com Strava
- [ ] Sistema de notificações push
- [ ] Gamificação (badges, rankings)
- [ ] Comunidades e desafios entre usuários
- [ ] Sistema de pagamento para planos premium
- [ ] App mobile nativo (React Native)

## 📄 Licença

Este projeto é privado e proprietário.

## 👥 Contribuindo

Para contribuir com o projeto:

1. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
2. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
3. Push para a branch (`git push origin feature/nova-funcionalidade`)
4. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através do repositório ou da plataforma v0.app.

---

**Desenvolvido com ❤️ usando [v0.app](https://v0.app)**
