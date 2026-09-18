# Acompanhamento dos ajustes (sub-cards) do EFC-6547 — Aba Anamnese

> Doc de trabalho, não sincronizado do Jira — usar para anotações, decisão de manter/descartar cada ajuste, e status de implementação. Os dados de cada card (descrição, CA relacionado) estão nos arquivos `cards/EFC-<KEY>/EFC-<KEY>.md`, sincronizados via `/jira_sync` em 2026-08-31.

Card pai: [EFC-6547 — Aba Anamnese](https://gruposalta.atlassian.net/browse/EFC-6547) (status Jira: **Aguardando Ajuste**). Todos os 9 sub-cards abaixo foram criados como subtarefas tipo **Fix**, status **Aberto**.

---

## Como usar este doc

Para cada linha, preencher a coluna **Decisão** com uma das opções:
- `[ ]` — ainda não avaliado (default)
- `manter` — seguir para implementação como está
- `descartar` — não implementar (registrar o motivo em Notas)
- `ajustar escopo` — implementar, mas com mudança de escopo (registrar em Notas)

---

## Lista de ajustes

| # | Key | Resumo | Área | Decisão | Notas |
|---|-----|--------|------|---------|-------|
| 1 | [EFC-6754](https://gruposalta.atlassian.net/browse/EFC-6754) | Indicador 100% sem perguntas respondidas | Backend (cálculo percentual) | `manter` | **Implementado e commitado** (`ajuste percentual listagem aluno`) — `AlunoEscolaRepository.GetParaPainelAluno` força 0% quando não há nenhuma resposta ativa em `AnamnesePessoaResposta`, em vez de confiar no cache `AlunoEscola.PercentualAnamnese`. Validado por testes automatizados; aguardando validação manual do usuário em homolog. |
| 2 | [EFC-6755](https://gruposalta.atlassian.net/browse/EFC-6755) | Campo "Quais (especifique)?" aparece mesmo com "Nenhuma" selecionada | Backend + Frontend (form-section-builder) | `manter` | **Implementado e validado pelo usuário.** Causa raiz: gatilho configurado via `OpcaoRespostaDiferente` (não `OpcaoRespostaIgual`), que o backend nunca lia. Adicionado `HashOpcaoGatilhoNegado` no DTO + `visivelSeOpcaoNaoSelecionada` no motor genérico `form-section-builder` (extensão aditiva, não quebra outros consumidores). |
| 3 | [EFC-6758](https://gruposalta.atlassian.net/browse/EFC-6758) | Ajuste nos textos condicionais das áreas de interesse | Dado (`AnamneseVirtual.Pergunta.Texto`) | `[ ]` | Script pronto: `cards/EFC-6547/sql/ajustes-textos-anamnese.sql` (Ids 95, 150, 177, 181, 183) — ainda não executado. |
| 4 | [EFC-6760](https://gruposalta.atlassian.net/browse/EFC-6760) | Ajuste nos textos condicionais na seção comportamento | Dado (`AnamneseVirtual.Pergunta.Texto`) | `[ ]` | Script pronto: `cards/EFC-6547/sql/ajustes-textos-anamnese.sql` (Ids 161/165/188 — pai de cada um confirmado via `PerguntaCondicionalOpcaoResposta.PerguntaBit`, os 3 tinham texto idêntico) — ainda não executado. |
| 5 | [EFC-6761](https://gruposalta.atlassian.net/browse/EFC-6761) | Campo condicional de "Dorme sozinho?" com texto diferente | Dado (`AnamneseVirtual.Pergunta.Texto`) | `[ ]` | Script pronto: `cards/EFC-6547/sql/ajustes-textos-anamnese.sql` (Id 98) — ainda não executado. |
| 6 | [EFC-6762](https://gruposalta.atlassian.net/browse/EFC-6762) | Falta placeholder e opção "engatinhou" em Desenvolvimento Psicomotor | Misto: dado (texto de `Pergunta.Id 110`) + frontend (placeholder, `anamnese-form.mapper.ts`) | `manter` | **Código implementado** (`aplicarPlaceholderCampoIdade` em `anamnese-form.mapper.ts` — aplica "Ex.: 10 meses, 1 ano, 1 ano e 3 meses" nos campos `Inteiro` do grupo "Desenvolvimento Psicomotor", sem afetar outros campos `Inteiro` do formulário). **Parte de dado movida pro script** `cards/EFC-6547/sql/ajustes-textos-anamnese.sql` (Id 110, "E engatinhou?" → "Com que idade engatinhou?") — ainda não executado. Nota: mesmo gap de placeholder existe em "Desenvolvimento da Fala" (Ids 118/120) mas está fora do escopo deste card — não alterado. |
| 7 | [EFC-6763](https://gruposalta.atlassian.net/browse/EFC-6763) | Textos da seção "Controle Esfíncteres" diferentes dos requisitos | Dado (`AnamneseVirtual.Pergunta.Texto`) | `[ ]` | Script pronto: `cards/EFC-6547/sql/ajustes-textos-anamnese.sql` (Ids 115/116) — ainda não executado. |
| 8 | [EFC-6764](https://gruposalta.atlassian.net/browse/EFC-6764) | Troca de ano letivo não recarrega a aba Anamnese | Frontend (`ficha.component.ts`) | `manter` | **Implementado e validado pelo usuário** (testado com o aluno RA 80009019 / Coleguium MG, que tem anamnese nos 3 segmentos — Infantil até 2019, Fund. Anos Iniciais 2020–2024, Fund. Anos Finais 2025–2026). Causa raiz real (a 1ª investigação estava incompleta): `AnamneseTabComponent` era vinculado a `[request]="requestBase"`, mas o seletor de Ano Letivo só atualizava `requestParaAtendimento`/`requestOcorrencias` — havia até um comentário explícito no código dizendo que só essas duas abas deveriam reagir. Anamnese nunca recebia a troca. Corrigido com um `requestAnamnese` análogo aos outros dois, atualizado em `selecionarAnoLetivo()`. Nota de domínio (usuário): Anamnese é por (Pessoa × VersaoAnamnese) — 1 versão por **segmento** (Infantil/Regular), não por ano em si; segmentos diferentes podem apontar pra mesma VersaoAnamnese. O que precisa acontecer é a chamada a `getanamnese` ser refeita a cada troca de ano (o backend resolve a versão certa via Série/EscolaSerie/RedeSerieVersaoAnamnese) — o front não tenta prever se o segmento mudou, só garante que recarrega sempre. |
| 9 | [EFC-6765](https://gruposalta.atlassian.net/browse/EFC-6765) | "Nenhuma" deve desmarcar as outras opções (possui deficiência) | Backend + Frontend (`CheckboxGroupFieldComponent`) | `manter` | **Implementado e validado pelo usuário.** `OpcaoRespostaAnamnese.Unica` já existia no banco (dado correto) mas não era exposto na API — exposto em `OpcaoAnamneseResponse.Unica` e a exclusividade implementada em `CheckboxGroupFieldComponent.toggle()`. |

---

## Observações gerais

- Todos, exceto o #1 (EFC-6754), são ajustes de **texto/UX no frontend** da aba Anamnese (motor `form-section-builder`, ver `cards/EFC-6547/EFC-6547.status-form-section-builder.md`) — provável que vários possam ser agrupados numa única branch/PR de "ajustes de texto pós-QA", já que tocam configs de seções distintas mas com o mesmo tipo de mudança.
- Nenhum dos 9 cards tem comentários no Jira até a sincronização (2026-08-31).
- Se algum ajuste for descartado, considerar deixar um comentário no próprio card do Jira explicando o motivo (fora do escopo desta skill — feito manualmente pelo usuário, já que `/jira_sync` é somente leitura).
