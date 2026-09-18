# EFC-6443 — Descrição Refinada

> Documento gerado para atualizar o Jira. Baseado nos arquivos em `migracao_diario_classe/`.  
> Cenários E2E: [`EFC-6443-e2e.md`](./EFC-6443-e2e.md)

---

## DESCRIÇÃO REFINADA (colar no campo "Descrição" do Jira)

---

### Contexto

O Diário de Classe existe hoje como uma aplicação Angular independente no repositório `documentacao-pedagogica`, que chama backends de frequência e de barramento pedagógico para compor o documento. Com a migração do módulo de frequência para o `estrutura-pedagogica`, o Diário passa a ter todos os seus dados disponíveis nesse repositório — o que cria a oportunidade de migrar o documento por completo, simplificando sua arquitetura e eliminando dependências cruzadas.

---

### O que será entregue

#### Backend — `estrutura-pedagogica`

Criar três controllers sob o namespace `api/diariodeclasse/`:

| Rota | Método | Responsabilidade |
|------|--------|-----------------|
| `api/diariodeclasse/get-documento` | POST | Retorna todos os dados do documento (cabeçalho, aulas, alunos com chamadas, conteúdos, rendimento) |
| `api/diariodeclasse/configuracao` | GET | Lista configurações de caracteres das redes acessíveis ao usuário |
| `api/diariodeclasse/configuracao/save` | POST | Salva configuração de caracteres de uma rede |
| `api/diariodeclasse/filtro/disciplinas` | POST | Disciplinas disponíveis para uma turma/ano letivo |

Criar a entidade `DiarioDeClasseConfiguracao` (nova tabela no banco do `estrutura-pedagogica`) com os 5 caracteres de frequência e as 3 flags de exibição de seção. Popular via script SQL com migração dos dados já cadastrados em `documentacao-pedagogica`.

Adicionar `DiarioDeClasse` e `DiarioDeClasse_Configuracao` no enum `Funcionalidade`.

#### Frontend — `estrutura-pedagogica`

Nova feature `diario-de-classe` com:

- **Tela principal** (`/diario-de-classe/listar`) — filtro declarativo com `FiltroComponent` (Rede → Escola → Série → Turma → Disciplina + campos de data). Ao aplicar o filtro, exibe botão "Gerar Diário".
- **Documento** — monta `DocumentBundle[]` com os blocos abaixo e abre overlay de impressão/PDF, seguindo o padrão de `lista-presenca`:
  - `DocPresencaInfoComponent` — cabeçalho da turma *(reutilizar existente)*
  - `DocGridDiarioComponent` — grade de chamada datas × alunos *(novo — migrar de doc-ped)*
  - `DocGridConteudoComponent` — tabela de conteúdo ministrado *(novo — migrar de doc-ped)*
  - `DocGridRendimentoComponent` — relatório de rendimento por etapa *(novo — migrar de doc-ped)*
  - `DocSignatureComponent` — assinaturas *(reutilizar existente)*
  - Cada bloco só entra no documento se a flag `exibir*` da configuração da rede for `true`.
- **Tela de configuração** (`/diario-de-classe/configurar`) — acessível via aba ao lado de "Diário de Classe". Permite que usuários com permissão `DiarioDeClasse_Configuracao` editem os 5 caracteres de frequência por rede, com preview em tempo real da tabela de chamada.
- **Painel "Configurar Documento"** (dentro do overlay) — painel lateral com as seções do documento (Frequência, Conteúdo ministrado, Relatório de rendimento, Nome do professor) como toggles. Ao vivo — não persiste no banco.

#### Frontend — `documentacao-pedagogica`

Rota e componente de diário de classe mantidos como fallback por 1 sprint após a feature entrar em produção, depois removidos.

---

### Fatiamento em subtarefas

| # | Escopo | Dependências |
|---|--------|-------------|
| 1 | **Backend — Entity + SQL** (`DiarioDeClasseConfiguracao`, mapping EF, script de criação + migração de dados) | — |
| 2 | **Backend — DTOs e interfaces de domínio** | — |
| 3 | **Backend — Endpoint `get-documento`** | 1 + 2 |
| 4 | **Backend — Endpoints de configuração** (get + save) | 1 + 2 |
| 5 | **Frontend — FilterConfig** + `filtro-diario-de-classe.service.ts` | — |
| 6 | **Frontend — Tela principal** (`listar.component`) com filtro | 5 |
| 7 | **Frontend — Blocos do documento** (`doc-grid-diario`, `doc-grid-conteudo`, `doc-grid-rendimento`) | — |
| 8 | **Frontend — Documento** (monta `DocumentBundle[]` + overlay de impressão/PDF) | 3 + 6 + 7 |
| 9 | **Frontend — Tela de configuração** de caracteres por rede | 4 |
| 10 | **Frontend — Painel "Configurar Documento"** no overlay | 8 |
| 11 | **Roteamento + item de menu** + smoke test E2E em homolog | 8 + 9 + 10 |

---

### Critérios de Aceite

- **CA-01:** Usuário professor consegue acessar `/diario-de-classe/listar`, aplicar filtro completo (rede, escola, série, turma, disciplina, período) e gerar o documento.
- **CA-02:** O documento exibe apenas as seções habilitadas na configuração da rede (frequência, conteúdo ministrado, rendimento).
- **CA-03:** O documento pode ser impresso e exportado como PDF a partir do overlay.
- **CA-04:** Usuário com permissão `DiarioDeClasse_Configuracao` consegue editar e salvar os caracteres de frequência de uma rede na tela `/diario-de-classe/configurar`.
- **CA-05:** O preview na tela de configuração atualiza em tempo real conforme o usuário edita os caracteres.
- **CA-06:** Usuário sem permissão `DiarioDeClasse` não consegue acessar a feature (guard de rota).
- **CA-07:** Os dados do documento no `estrutura-pedagogica` são idênticos aos do `documentacao-pedagogica` para o mesmo filtro (validação cruzada em homolog).

---

## Referências técnicas

| Artefato | Caminho |
|----------|---------|
| Readme da migração | `migracao_diario_classe/readme.md` |
| Plano de implementação (fases) | `migracao_diario_classe/plano-implementacao.md` |
| Script SQL (criação + migração) | `migracao_diario_classe/db-migration.md` |
| Design da tela de configuração | `migracao_diario_classe/clade_design_configuracoes/Configuração Diário de Classe.html` |
| Plano de implementação da tela de config | `migracao_diario_classe/plano-impl-configuracao.md` |
| Descrição funcional da tela de config | `migracao_diario_classe/design-configuracao-caracteres.md` |
| Separação painel ao-vivo vs. tela de config | `migracao_diario_classe/melhoria_aba_configuracao.md` |
