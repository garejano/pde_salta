# Epic EFC-6379 — Melhorias NEE

> **Repositório:** notas | **Funcionalidade:** NecessidadesEducacionaisEspeciais  
> **Status geral:** Backlog | **Última sincronização:** 2026-06-02

---

## Visão Geral

Conjunto de melhorias no módulo de Necessidades Educacionais Especiais (NEE) levantadas por usuários que utilizam o módulo no dia a dia. As demandas cobrem upload de laudos, tipação de transtornos, mediação do aluno e relatórios gerenciais.

---

## Stories

### EFC-6380 — Melhoria no upload de Laudos

**Problema:** Laudos clínicos extensos são rejeitados pelo sistema por exceder o limite de tamanho configurado (hardcode de 10 MB no serviço, com API Gateway também em 10 MB — possível desalinhamento).

**Critérios de Aceitação:**
- Aceitar upload de laudos além do limite atual (novo limite a definir após investigação técnica).
- Exibir mensagem de erro clara com o limite máximo quando o arquivo for rejeitado.
- Upload concluído sem truncamento ou corrupção para laudos com múltiplas páginas.
- Laudo disponível para consulta após upload bem-sucedido.

**Escopo técnico:**
- Investigar e alinhar o limite entre o serviço e o API Gateway.
- Avaliar se 10 MB é suficiente ou se é necessário migrar para upload direto S3 / multipart upload.
- Externalizar o limite para configuração (remover hardcode).
- Ajustar mensagem de erro no frontend.

---

### EFC-6381 — Melhorias na Tipação de transtorno

**Problema:** Dois campos do formulário NEE precisam de evolução:
1. Campo **"possui laudo"** tem apenas "sim" e "não" — falta a opção "em avaliação".
2. Campo **"tipo de transtorno"** é texto livre — precisa virar lista suspensa baseada em CID, com opção "outros" e compatibilidade retroativa com registros legados (texto livre).

**Critérios de Aceitação:**
- Campo "possui laudo" com 3 opções: sim, não, em avaliação.
- Campo "tipo de transtorno" como lista suspensa de CIDs com opção "outros" ao final.
- Lista de CIDs mantida em entidade própria (importável/gerenciável).
- Consultas e exportações funcionam para registros legados (texto) e novos (opção selecionada).

**Escopo técnico:**
- Adicionar opção "em avaliação" ao campo `possuiLaudo`.
- Criar entidade para lista de CIDs e importar lista padrão.
- Migrar campo `tipoTranstorno` de texto livre para referência ao CID (mantendo compatibilidade retroativa).
- Ajustar queries de consulta/exportação para tratar ambos os formatos.

---

### EFC-6382 — Permitir informar detalhes sobre a mediação do aluno

**Problema:** O módulo NEE não captura informações de mediação. A coordenação precisa saber o tipo de mediação e o nome do mediador, e precisa filtrar alunos com avaliação mediada.

**Critérios de Aceitação:**
- Campo de tipo de mediação: **mediação exclusiva**, **mediação compartilhada**, **sem mediador**.
- Campo de texto para nome do mediador.
- Filtro de NEE com opção **"avaliação mediada"**.

**Escopo técnico:**
- Adicionar campos `tipoMediacao` (enum) e `nomeMediador` (texto) ao model NEE.
- Migration para as novas colunas.
- Expor campos na API (criação, edição, consulta).
- Atualizar formulário NEE no frontend.
- Adicionar opção "avaliação mediada" ao filtro de listagem.

---

### EFC-6384 — Melhorias em Relatórios

**Problema:** O relatório de NEE exibe histórico acumulado de múltiplos anos, sem distinguir matrícula ativa de histórico — a coordenação não consegue ver a "foto atual" dos alunos NEE vigentes.

**Critérios de Aceitação:**
- Relatório exibe apenas alunos com registro NEE ativo no ano letivo corrente.
- Distinção clara entre matrícula ativa NEE e histórico.

**Escopo técnico:**
- Investigar e corrigir a query do relatório (filtrar por ano letivo vigente e/ou matrícula ativa).
- Validar critério de "aluno NEE ativo" com a equipe pedagógica.
- Ajustar frontend se necessário.

---

## Arquivos Prováveis a Modificar

Todos os itens estão no repositório `notas`, na funcionalidade `NecessidadesEducacionaisEspeciais`. Pontos de entrada prováveis:

| Camada | O que muda |
|--------|-----------|
| Model/Entidade | Campos `possuiLaudo`, `tipoTranstorno`, `tipoMediacao`, `nomeMediador`; nova entidade CID |
| Migration | Novas colunas de mediação; possível ajuste em `tipoTranstorno` |
| Serviço/Controller | Upload de laudos; CRUD do NEE; relatório |
| Frontend — formulário | Campos de tipação e mediação |
| Frontend — filtro | Opção "avaliação mediada" |
| Frontend — upload | Mensagem de erro com limite |
| Config/Infra | Limite de tamanho do upload (externalizar hardcode) |

---

## Links

| Card | Link |
|------|------|
| EFC-6379 (Epic) | https://gruposalta.atlassian.net/browse/EFC-6379 |
| EFC-6380 | https://gruposalta.atlassian.net/browse/EFC-6380 |
| EFC-6381 | https://gruposalta.atlassian.net/browse/EFC-6381 |
| EFC-6382 | https://gruposalta.atlassian.net/browse/EFC-6382 |
| EFC-6384 | https://gruposalta.atlassian.net/browse/EFC-6384 |
