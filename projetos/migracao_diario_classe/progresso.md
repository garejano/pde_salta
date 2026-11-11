# Progresso — Migração Diário de Classe (EFC-6443)

> Última atualização: 2026-06-09 — Fase 9 concluída

---

## Fases

| # | Escopo | Status | Notas |
|---|--------|--------|-------|
| 1 | **Backend — Entity + Migration SQL** (`DiarioDeClasseConfiguracao`) | 🟡 Parcial | Tabela criada no SQL Server. Migração de dados pendente — usar `_scripts/migrar_diario_configuracao.py` |
| 2 | **Backend — DTOs e interfaces de domínio** | ✅ Concluído | 14 DTOs + 3 interfaces criados |
| 3 | **Backend — Endpoint de dados do documento** (`get-documento`) | ✅ Concluído | Endpoint `POST /api/diariodeclasse/get-documento` operacional |
| 4 | **Backend — Endpoint de configuração** (get + save) | ✅ Concluído | `POST /api/diariodeclasse/get-configuracao` e `save-configuracao` |
| 5 | **Frontend — FilterConfig** + `filtro-diario-de-classe.service.ts` | ✅ Concluído | FilterConfig + serviço + scaffold `diario-de-classe/listar` |
| 6 | **Frontend — Tela principal** (`listar.component`) | ✅ Concluído | Service + models + listar completo com overlay |
| 7 | **Frontend — Blocos do documento** (3 components) | ✅ Concluído | DocGridDiarioComponent + DocGridConteudoComponent + DocGridRendimentoComponent |
| 8 | **Frontend — Documento** (DocumentBundle + overlay) | ✅ Concluído | Concluído pelas Fases 6 + 7 |
| 9 | **Frontend — Painel de configuração** (Personalizar documento) | ✅ Concluído | `DiarioConfiguracaoComponent` no painel direito do overlay |
| 10 | **Roteamento** + permissões + testes E2E | ⬜ Pendente | Depende de 6 |

---

## Fase 2 — Arquivos criados

### DTOs (`EstruturaPedagogica.Domain/DTO/DiarioDeClasse/`)

| Arquivo | Tipo |
|---------|------|
| `DiarioDeClasseDocumentoRequest.cs` | Request — hashes + flags exibição + período |
| `DiarioDeClasseInternalGetRequest.cs` | Request interno — IDs numéricos resolvidos |
| `DiarioDeClasseConfiguracaoRequest.cs` | Request — GET configuração por rede |
| `DiarioDeClasseConfiguracaoSaveRequest.cs` | Request — POST salvar configuração |
| `DiarioDeClasseDocumentoResponse.cs` | Response principal do documento |
| `DiarioDeClasseCaracterResponse.cs` | Os 5 caracteres de frequência |
| `DiarioDeClasseAulaResponse.cs` | Hash + data de cada aula |
| `DiarioDeClasseAlunoResponse.cs` | Nome, matrícula + lista de chamadas |
| `DiarioDeClasseConteudoResponse.cs` | Conteúdo ministrado por data |
| `DiarioDeClasseRendimentoResponse.cs` | Grid de rendimento (colunas + alunos) |
| `DiarioDeClasseRendimentoColunaResponse.cs` | Cabeçalho do grid de rendimento |
| `DiarioDeClasseRendimentoAlunoResponse.cs` | Linha do grid de rendimento por aluno |
| `DiarioDeClasseRendimentoNotaResponse.cs` | Nota individual por coluna |
| `DiarioDeClasseConfiguracaoResponse.cs` | Response da configuração por rede |

### Interfaces (`EstruturaPedagogica.Domain.Services/DiarioDeClasse/Interfaces/`)

| Arquivo | Descrição |
|---------|-----------|
| `IGetDocumentoDiarioDeClasseService.cs` | Interface do serviço principal |
| `IGetConfiguracaoDiarioDeClasseService.cs` | Interface do serviço de leitura de config |
| `ISaveConfiguracaoDiarioDeClasseService.cs` | Interface do serviço de salvar config |

---

## Pendências críticas

- **`db-migration.md`** precisa ser reescrito em T-SQL (atualmente em PostgreSQL — errado)
- **Fase 1** (entity C# + SQL de criação de tabela + migração de dados) deve ser executada antes das Fases 3 e 4
- Verificar os `HashTurma`/`HashDisciplina` usados na view `ModuloDocumentacaoPedagogica.ConteudoDiarioClasse` — confirmar se são hashes do `estrutura-pedagogica` ou do sistema de origem

---

## Referências rápidas

| O quê | Onde |
|-------|------|
| Análise completa da Fase 3 | `C:\Users\gustavo.arejano\.claude\plans\analise-bem-a-fase-valiant-crown.md` |
| Plano de implementação | `migracao_diario_classe/plano-implementacao.md` |
| Mapeamento geral | `migracao_diario_classe/readme.md` |
| Migração de banco | `migracao_diario_classe/db-migration.md` (reescrever em T-SQL) |
| Card Jira | [EFC-6443](https://gruposalta.atlassian.net/browse/EFC-6443) |
