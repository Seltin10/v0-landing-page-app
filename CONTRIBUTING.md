# Guia de Contribuição - iRun Clube+

Obrigado por considerar contribuir com o iRun Clube+! Este documento fornece diretrizes para manter a qualidade e consistência do código.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Padrões de Código](#padrões-de-código)
- [Estrutura de Commits](#estrutura-de-commits)
- [Pull Requests](#pull-requests)

## 🤝 Código de Conduta

- Seja respeitoso e profissional
- Aceite críticas construtivas
- Foque no que é melhor para o projeto
- Mantenha discussões técnicas e objetivas

## 🚀 Como Contribuir

### 1. Setup do Ambiente

\`\`\`bash
# Clone o repositório
git clone https://github.com/seu-usuario/irun-mvp.git

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute o projeto
pnpm dev
\`\`\`

### 2. Crie uma Branch

\`\`\`bash
# Para novas funcionalidades
git checkout -b feature/nome-da-funcionalidade

# Para correções de bugs
git checkout -b fix/nome-do-bug

# Para melhorias
git checkout -b improvement/nome-da-melhoria
\`\`\`

### 3. Faça suas Alterações

- Siga os padrões de código estabelecidos
- Adicione comentários quando necessário
- Teste suas alterações localmente
- Mantenha commits pequenos e focados

## 💻 Padrões de Código

### TypeScript

\`\`\`typescript
// ✅ BOM: Tipos explícitos e descritivos
interface UserData {
  id: string
  email: string
  name: string
}

async function getUser(userId: string): Promise<UserData | null> {
  // ...
}

// ❌ EVITE: Tipos implícitos ou any
async function getUser(userId) {
  // ...
}
\`\`\`

### React Components

\`\`\`typescript
// ✅ BOM: Componentes funcionais com tipos
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: "primary" | "secondary"
}

export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  )
}

// ❌ EVITE: Componentes sem tipos
export function Button({ label, onClick }) {
  // ...
}
\`\`\`

### Server Actions

\`\`\`typescript
// ✅ BOM: Use "use server" e tratamento de erros
"use server"

export async function createPartner(formData: FormData) {
  try {
    // Validação
    const name = formData.get("name") as string
    if (!name) {
      return { error: "Nome é obrigatório" }
    }

    // Lógica
    const result = await sql`INSERT INTO partners ...`
    
    return { success: true, data: result }
  } catch (error) {
    console.error("[v0] Error creating partner:", error)
    return { error: "Erro ao criar parceiro" }
  }
}
\`\`\`

### Estilização

\`\`\`typescript
// ✅ BOM: Use Tailwind CSS com classes semânticas
<div className="flex items-center justify-between p-4 bg-background">
  <h1 className="text-2xl font-bold text-foreground">Título</h1>
</div>

// ❌ EVITE: Estilos inline ou classes arbitrárias excessivas
<div style={{ display: "flex", padding: "16px" }}>
  <h1 className="text-[24px] font-[700]">Título</h1>
</div>
\`\`\`

### Banco de Dados

\`\`\`typescript
// ✅ BOM: Use prepared statements
const users = await sql`
  SELECT * FROM users WHERE email = ${email}
`

// ❌ EVITE: Concatenação de strings (SQL injection)
const users = await sql`SELECT * FROM users WHERE email = '${email}'`
\`\`\`

## 📝 Estrutura de Commits

Use commits semânticos:

\`\`\`
feat: adiciona filtro de parceiros por categoria
fix: corrige erro ao validar cupom
docs: atualiza README com instruções de setup
style: ajusta espaçamento no dashboard
refactor: reorganiza lógica de autenticação
test: adiciona testes para componente Button
chore: atualiza dependências
\`\`\`

### Formato Detalhado

\`\`\`
tipo(escopo): descrição curta

Descrição mais detalhada do que foi alterado e por quê.

Closes #123
\`\`\`

## 🔍 Pull Requests

### Checklist

Antes de abrir um PR, verifique:

- [ ] O código segue os padrões estabelecidos
- [ ] Todos os testes passam
- [ ] A aplicação roda sem erros
- [ ] Comentários foram adicionados onde necessário
- [ ] A documentação foi atualizada (se aplicável)
- [ ] O commit message segue o padrão semântico

### Template de PR

\`\`\`markdown
## Descrição
Breve descrição das mudanças realizadas.

## Tipo de Mudança
- [ ] Nova funcionalidade
- [ ] Correção de bug
- [ ] Melhoria de performance
- [ ] Refatoração
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Resultado esperado

## Screenshots (se aplicável)
[Adicione screenshots aqui]

## Checklist
- [ ] Código testado localmente
- [ ] Documentação atualizada
- [ ] Sem warnings no console
\`\`\`

## 🐛 Reportando Bugs

Ao reportar bugs, inclua:

1. **Descrição**: O que aconteceu?
2. **Passos para Reproduzir**: Como reproduzir o bug?
3. **Comportamento Esperado**: O que deveria acontecer?
4. **Screenshots**: Se aplicável
5. **Ambiente**: Browser, OS, versão do Node

## 💡 Sugerindo Melhorias

Para sugerir melhorias:

1. Verifique se já não existe uma issue similar
2. Descreva claramente a melhoria proposta
3. Explique os benefícios
4. Forneça exemplos de uso, se possível

## 📚 Recursos Úteis

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

Obrigado por contribuir! 🎉
