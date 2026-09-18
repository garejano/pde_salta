# EFC-6379 — Acompanhamento: Melhorias NEE

> **Épico:** Em Progresso | **Última atualização:** 2026-06-11  
> **Jira:** https://gruposalta.atlassian.net/browse/EFC-6379  
> **Repositório:** `notas` — funcionalidade `NecessidadesEducacionaisEspeciais`

---

## Visão Geral do Épico

```
EFC-6379 — Melhorias NEE  [Em Progresso]
├── EFC-6380 — Melhoria no upload de Laudos              ✅ Aprovado em QA
├── EFC-6381 — Melhorias na Tipação de transtorno        🔧 Ajustando
│   ├── EFC-6447 — Subitens não carregados no 2º select  🔨 Em Desenvolvimento
│   ├── EFC-6448 — Descrição "Outros" some após salvar   🔴 Aberta
│   ├── EFC-6449 — Campo diagnóstico editável (legado)   🔴 Aberta
│   └── EFC-6450 — Erro ao exportar dados NEE            🔴 Aberta
├── EFC-6382 — Informar detalhes sobre mediação          ✅ Aprovado em QA
└── EFC-6384 — Melhorias em Relatórios                  ✅ Aprovado em QA
```

---

## Status por Story

| Key | Resumo | Status | Subtasks pendentes |
|-----|--------|--------|--------------------|
| [EFC-6380](https://gruposalta.atlassian.net/browse/EFC-6380) | Melhoria no upload de Laudos | ✅ Aprovado em QA | — |
| [EFC-6381](https://gruposalta.atlassian.net/browse/EFC-6381) | Melhorias na Tipação de transtorno | 🔧 Ajustando | 4 abertas |
| [EFC-6382](https://gruposalta.atlassian.net/browse/EFC-6382) | Permitir informar detalhes sobre a mediação | ✅ Aprovado em QA | — |
| [EFC-6384](https://gruposalta.atlassian.net/browse/EFC-6384) | Melhorias em Relatórios | ✅ Aprovado em QA | — |

---

## O Que Falta Fazer

### EFC-6381 — Em Ajuste (4 subtasks abertas)

| Key | Subtask | Status |
|-----|---------|--------|
| [EFC-6447](https://gruposalta.atlassian.net/browse/EFC-6447) | Subitens aparecem na listagem de transtornos e não são carregados no segundo select | 🔨 Em Desenvolvimento |
| [EFC-6448](https://gruposalta.atlassian.net/browse/EFC-6448) | Descrição do tipo "Outros" não aparece após salvamento | 🔴 Aberta |
| [EFC-6449](https://gruposalta.atlassian.net/browse/EFC-6449) | Campo diagnóstico pode ser editado em casos legados | 🔴 Aberta |
| [EFC-6450](https://gruposalta.atlassian.net/browse/EFC-6450) | Erro ao exportar dados NEE | 🔴 Aberta |

**Contexto do ajuste:** A EFC-6381 foi implementada (tipação de transtorno com lista curada + subitens para TEA/TEAp), mas surgiram 4 bugs durante QA. As 3 subtasks abertas ainda não foram iniciadas.

---

## Progresso Geral

| Categoria | Quantidade |
|-----------|-----------|
| Stories aprovadas em QA | 3 de 4 (EFC-6380, EFC-6382, EFC-6384) |
| Stories em ajuste | 1 (EFC-6381) |
| Subtasks abertas (EFC-6381) | 4 |
| Subtasks em desenvolvimento | 1 (EFC-6447) |

**Bloqueio:** o épico não pode fechar enquanto EFC-6381 e suas 4 subtasks não forem resolvidas.

---

## Arquivos Locais Relacionados

| Arquivo | Conteúdo |
|---------|----------|
| `EFC-6379.md` | Card do épico (sincronizado do Jira) |
| `EFC-6379.tech.md` | Plano técnico detalhado |
| `epic.md` | Notas do épico |
| `mudancas.md` | Registro de mudanças gerais |
| `mudancas-EFC6381.md` | Mudanças específicas da EFC-6381 |
| `sql/01_create_TipoTranstorno.sql` | Criação da tabela TipoTranstorno |
| `sql/02_alter_AlunoNecessidadesEspeciais.sql` | Alteração da tabela de NEE |
| `sql/03_seed_TipoTranstorno.sql` | Seed da lista de transtornos |
| `sql/04_clean_TipoTranstorno.sql` | Limpeza/correção de seed |
| `sql/05_alter_TipoTranstorno_add_hierarquia.sql` | Adição de hierarquia (ParentId) |
