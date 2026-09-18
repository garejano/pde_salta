# Card 4 — Diário de Classe

> Ver [`../readme.md`](../readme.md) e [`../frontend.md`](../frontend.md) para contexto geral.

## Status: descartado

Confirmado com o usuário: `features/diario-de-classe/` em `estrutura-pedagogica` **já cobre** o
escopo do Diário de Classe do doc-ped. Este card não será implementado — mantido apenas como
registro da decisão, para quem chegar depois não refazer o levantamento.

## Origem da suspeita (levantamento inicial)

`features/diario-de-classe/` já existe e já é funcional de verdade (não é mock): rotas
`listar`/`configurar`, filtro real, chamada a `DiarioDeClasseService` (backend real), painel de
configuração de seções/caracteres, geração de documento via `document-builder`, exportação em
PDF. Os nomes de conceito batiam quase 1:1 com o `frontend-diario-classe` do doc-ped:

- Painel de seções (`DiarioClasseSecoes` / `DIARIO_SECOES_DEFAULT`) ~ `exibirFrequencia` /
  `exibirConteudoMinistrado` / `exibirRelatorioRendimento` da origem.
- Caracteres de chamada (`DiarioClasseCaracteres` / `DIARIO_CARACTERES_DEFAULT`) ~
  `DiarioClasseCaractereResponse` da origem.
- Grids via `document-builder`: `DocGridDiarioComponent`, `DocGridConteudoComponent`,
  `DocGridRendimentoComponent` ~ componentes `Doc*` de origem quase com o mesmo nome.

## Se algo do doc-ped-diario ainda faltar

Caso surja depois algum gap específico (um campo, uma seção, uma regra que a origem tinha e a
feature nativa não cobre), tratar como ajuste pontual na feature nativa existente — não reabrir
como migração completa.
