# Revisão de PR — feature/EFC-6515 → develop
_Gerado em: 2026-07-02 10:55_

> Nota técnica: o diff correto para avaliar as mudanças introduzidas pela feature é `git diff develop...feature/EFC-6515` (merge-base → feature). A ordem inversa sugerida no procedimento (`feature/EFC-6515...develop`) retorna, neste repositório, apenas as mudanças exclusivas de `develop` desde a divergência (múltiplos merge-bases), por isso foi corrigida para produzir uma revisão relevante. 72 arquivos alterados, +6010/-143 linhas.

## Conformidade com o Spec

| Critério | Implementado | Testado | Observação |
|---|---|---|---|
| CA-01 | Parcial | Parcial | Backend valida ano mínimo 2015 e filtra segmentos sem documentação pedagógica (testado). Frontend marca Rede/Segmento como obrigatórios e usa `selectFirst` para Ano Letivo. A obrigatoriedade "seleção automática do ano mais recente" depende de o backend já retornar ordenado — não há teste que comprove isso explicitamente. |
| CA-02 | Parcial | N/A | Todas as colunas exigidas existem na listagem, mas o selo de "possui Carga Horária" usa apenas `series[0]`, produzindo resultado incorreto para disciplinas com múltiplas séries (ver achado Frontend #4). |
| CA-03 | Sim | Sim | Filtro `ParteDaMatrizCurricular && !OcultarNaMatrizCurricular` sobre ativos, coberto por testes de integração. |
| CA-04 | Sim | Não | `NomeVariaPorSerie` implementado no backend e refletido no frontend via `pill-list` com indicador "+N". Falta teste de integração que cubra o cenário de nomes divergentes entre séries. |
| CA-05 | Parcial | N/A | Busca textual client-side implementada; não foi localizado componente/lógica de paginação na listagem (`listar-matriz-curricular.component.ts/html`). |
| CA-06 | Parcial | Não | Séries e disciplinas disponíveis são reaproveitadas do filtro sem nova chamada. Porém no backend há chamada redundante (`GetRedeSerieId` + `GetRedeSeries` buscando o mesmo dado) e no frontend as Áreas do Conhecimento são buscadas via HTTP a cada abertura do painel — contrariando o espírito do critério. |
| CA-07 | Sim | N/A | Um único `FormularioMatrizComponent` (flag `edicao`) atende inclusão e edição. |
| CA-08 | Sim | Sim | Regras de disciplina mãe (não arquivada, exclui já visíveis, reexibe ocultas) implementadas e cobertas por testes de integração; frontend consome a lista pronta sem regra própria. |
| CA-09 | Sim | N/A | Pré-seleção de todas as séries do segmento e aplicação do nome padrão implementadas no frontend a partir dos dados já carregados (CA-06); não é necessário endpoint dedicado, pois o critério não exige dado específico por disciplina além do que o filtro já fornece. |
| CA-10 | Parcial | N/A | Enriquecimento Curricular (padrão desligado), nome e carga horária por série presentes. O campo Área do Conhecimento não aparece nem é enviado no modo de **inclusão** (só aparece na edição) — lacuna frente ao CA-10. |
| CA-11 | Sim | N/A | Botão Salvar e `validarSeries()` bloqueiam envio sem ao menos uma série selecionada. |
| CA-12 | Sim | N/A | `aplicarNomeATodas()` / `aplicarCargaATodas()` implementados. |
| CA-13 | Não | N/A | O aviso exibido no painel de inclusão não corresponde ao texto exigido pelo critério de aceite (texto atual é uma paráfrase resumida, não o texto especificado). |
| CA-14 | Sim | Sim | `PossuiAvaliacoesRegulares/Diversificadas = false` fixados em `SaveNew`/`Update`, com teste dedicado. |
| CA-15 | Parcial | Não | Frontend bloqueia a troca de disciplina na UI (campo somente leitura), mas o backend não valida que `HashDisciplina` do `UpdateRequest` seja o mesmo já vinculado ao registro — nada impede a troca via chamada direta à API. Sem teste que tente essa troca e verifique rejeição. |
| CA-16 | Sim | N/A | Botão Salvar usa `!isDirty`, comparado ao estado original (área, enriquecimento, séries, nomes, cargas). |
| CA-17 | Sim | Parcial | Validação de nome duplicado por série implementada nos dois fluxos e propagada ao usuário via `HandleApiError`; testada apenas para `SaveNew`, faltando teste equivalente para `Update`. |
| CA-18 | Sim | Sim | Padrão Disable+Insert de `RedeSerieDisciplina` mantém o registro ativo no Configurador e o remove da Matriz; coberto por testes de integração e replicado corretamente na UI (remoção/desmarcação de série). |
| CA-19 | Sim | Sim | Disciplina/série oculta reaparece no dropdown de inclusão e pode ser reinserida; testado no backend. |
| CA-20 | Parcial | Não | Frontend interpreta corretamente os 3 formatos de entrada e preserva o formato digitado na exibição. O backend, porém, não valida nem reprocessa o valor recebido — a extension `CargaHorariaParser` criada para isso nunca é chamada, então a consistência entre `CargaFormatada` e `CargaEmMinutos` depende inteiramente do cliente. |
| CA-21 | Parcial | Não | Os dois campos (formato digitado e minutos totais) são persistidos, mas sem validação/derivação server-side — o backend simplesmente grava o que o cliente envia, sem garantir que os dois valores sejam consistentes entre si. |
| CA-22 | Parcial | Não | Total recalculado automaticamente a cada alteração (backend soma `CargaEmMinutos` ativos), mas o formato persistido (`"XhYY"`/`"Xh"`) não corresponde a `hh:MM` exigido; no frontend o total não é exibido no modo inclusão e não tem zero-padding da hora (ex.: "5:07"). |
| CA-23 | Sim | Parcial | Exportação gera uma linha por Série×Disciplina (via `RedeSerieDisciplinaRepository.GetParaExport`); testes cobrem sucesso/vazio/erro de validação, mas não verificam explicitamente a granularidade linha-a-linha com múltiplas séries/disciplinas. |
| Complemento — Id 49 (Funcionalidade.MatrizCurricular) | Sim | N/A | Confirmado em `Funcionalidade.cs`. |
| Complemento — CargaHoraria: total da série atualizado direto (sem Disable+Insert) | **Não** | Não | `SaveMatrizCurricularService` (SaveNew/Update) e `RemoverMatrizCurricularService` aplicam Disable+Insert também para o registro de total da série, contrariando explicitamente o complemento técnico do spec. |
| Complemento — RedeSerieDisciplina segue Disable+Insert | Sim | Sim | Confirmado nos 3 services de escrita. |
| Complemento — Nomes tratados com StringExtensions | Sim | N/A | `RemoverEspacosExtras()` aplicado antes de persistir. |
| Complemento — Validação de unicidade de nome no backend | Sim | Parcial | Implementada; falta teste para o caminho `Update`. |

## Backend

### backend/EstruturaPedagogica.Domain.Services/MatrizCurricular/SaveMatrizCurricularService.cs
- **Linhas 17-22** — Erros silenciosos: `ResolverAreaConhecimentoId` retorna `null` silenciosamente quando o `HashAreaConhecimento` informado não existe, salvando o registro sem área e sem comunicar erro ao usuário. Sugestão: retornar erro explícito quando o hash for informado mas não encontrado.
- **Linhas 29-31 e 188-190** — Regras duplicadas: a validação de campos obrigatórios (ano/rede/segmento) reimplementa manualmente o que `ValidacaoMatrizCurricularService.ValidarRequest` já faz, em vez de reutilizá-lo. Sugestão: chamar `ValidarRequest` também aqui.
- **Linhas 47-56 e 206-215** — Includes/consulta redundante: `GetRedeSerieId` é chamado logo após `GetRedeSeries`, que já retorna os mesmos IDs em `BaseResponse.Id`. Sugestão: reaproveitar `redeSeries.Select(x => x.Id)` e eliminar a segunda consulta.
- **Linhas 88-97 e 247-256** — N+1: `GetNomeDocumentosOficiaisRepetido` é chamado dentro de um loop por série, uma query por iteração. Sugestão: buscar em lote os nomes já usados nas `redeSerieIds` afetadas antes do loop.
- **Linhas 99-326 (múltiplos trechos)** — N+1: `Insert`/`Disable` chamados individualmente dentro de `foreach`, quando os repositórios já expõem overloads em lote (`Insert(List<T>)`/`Disable(List<T>)`). Sugestão: acumular as entidades numa lista e persistir em uma única chamada por operação.
- **Linhas 140-149 e 330-339** — Extensions não utilizadas / CA-20-21: `CargaFormatada`/`CargaEmMinutos` são gravados exatamente como recebidos do cliente, sem usar a extension `CargaHorariaParser` criada para parsear/validar os 3 formatos. Sugestão: parsear e validar o valor no backend antes de persistir, tornando-o a fonte de verdade.
- **Linhas 162-175 e 352-365** — Divergência do spec: o registro de total da série usa o mesmo ciclo Disable+Insert das demais cargas horárias, quando o complemento técnico exige atualização direta (`Update`) para esse registro específico. Sugestão: usar `Update` quando o registro de total já existir.
- **Linha 373-379** — Regras duplicadas: `FormatarMinutos` está duplicado (também em `RemoverMatrizCurricularService.cs`) e produz formato `"XhYY"`, divergente do `hh:MM` exigido por CA-22. Sugestão: extrair para um único método/extension no formato correto.
- **Arquivo inteiro (linhas 24-371)** — Regras duplicadas: `SaveNew` e `Update` replicam quase integralmente a mesma sequência de validação → resolução de séries → checagem de nome duplicado → gravação. Sugestão: extrair um método privado compartilhado para o trecho comum.

### backend/EstruturaPedagogica.Domain.Services/MatrizCurricular/RemoverMatrizCurricularService.cs
- **Linhas 20-22** — Regras duplicadas: reimplementa a validação de campos obrigatórios com forma diferente (`== null || == Guid.Empty`) da usada em `SaveMatrizCurricularService` (`.IsNullOrEmpty()`), em vez de reaproveitar `ValidacaoMatrizCurricularService.ValidarRequest`.
- **Linhas 60-114** — N+1: mesmo padrão de `Insert`/`Disable` individuais em loop descrito acima.
- **Linhas 100-113** — Mesma divergência do complemento técnico: total da série tratado com Disable+Insert em vez de atualização direta.
- **Linhas 121-127** — Duplicação de `FormatarMinutos`, mesmo problema de formato citado acima.

### backend/EstruturaPedagogica.Domain.Services/MatrizCurricular/ValidacaoMatrizCurricularService.cs
- **Linhas 21-27** — A lógica de validação central não é reutilizada pelos demais services (ver achados acima), reduzindo sua utilidade e gerando duplicidade de regra de negócio.
- **Cobertura de testes** — Não existe `ValidacaoMatrizCurricularServiceTests.cs`; a interface é sempre mockada nos testes dos outros services, deixando `ValidarRequest`/`GetRedesDoUsuario` sem cobertura própria.

### backend/EstruturaPedagogica.Api/Controllers/MatrizCurricularController.cs
- **Linhas 154-162** (`GetAreasConhecimento`) — Lógica de negócio em controller: o controller injeta o repositório diretamente e faz `OrderBy`/`Select` para montar a resposta, diferente do padrão do restante do projeto (controller apenas chama service e retorna `Result(...)`). Sugestão: mover essa consulta para um service (ex.: `IFilterMatrizCurricularService` ou serviço dedicado).

### backend/EstruturaPedagogica.Infra/Repositories/Stateful/CargaHorariaRepository.cs / ICargaHorariaRepository.cs
- **Linhas 30-60** — Código morto: `GetParaExport` neste repositório nunca é chamado (a exportação real usa `IRedeSerieDisciplinaRepository.GetParaExport`); além de órfão, agrupa por nome de série, o que colidiria caso duas séries diferentes tenham o mesmo nome em segmentos distintos. Sugestão: remover o método não utilizado.

### backend/EstruturaPedagogica.Extensions/CargaHorariaParser.cs
- **Arquivo inteiro** — Extension criada especificamente para os requisitos de CA-20/CA-21, mas nunca referenciada em nenhum service. Sugestão: integrar ao fluxo de `SaveMatrizCurricularService` (ver achado acima) ou remover se a decisão de design for delegar 100% ao frontend (o que contrariaria o spec).

## Frontend

### frontend/src/app/features/matriz-curricular/formulario-matriz/formulario-matriz.component.html
- **Linhas ~285-320** — Modais como componentes separados (bloqueante): o modal de confirmação de remoção está embutido diretamente no template do componente pai, em vez de ser um componente Angular dedicado (o próprio projeto já tem o padrão correto em `configurador-disciplinas/remover/remover-disciplina.component.ts`). Sugestão: extrair para um componente standalone dedicado, adaptável via `@Input()`.
- **Linha ~92** — CA-13: o texto do aviso de inclusão não corresponde ao texto especificado no critério de aceite. Sugestão: usar o texto exato exigido.
- **Linhas ~28-53** — CA-10: campo "Área do Conhecimento" só aparece no bloco `*ngIf="edicao"`, ausente no modo de inclusão.
- **Linha ~199** — CA-22: total de carga horária só é exibido quando `edicao === true`, ficando invisível durante a inclusão.

### frontend/src/app/features/matriz-curricular/formulario-matriz/formulario-matriz.component.ts
- **Linhas ~132-135** (`startEditar`) — CA-06: `getAreasConhecimento()` é chamado via nova requisição HTTP toda vez que o painel de edição é aberto, em vez de reaproveitar dado já obtido no filtro da listagem (como é feito com `series`/`disciplinasDisponiveis`). Sugestão: mover a busca para o `forkJoin` da listagem e passar como parâmetro ao painel.
- **Linha ~227** (`onDisciplinaChange`) — Tipagem: usa tipo inline `{ hash: string; descricao: string } | null` em vez de reaproveitar `ResponseModel`, já usado em `disciplinas: ResponseModel[]`.
- **Linhas ~246-250** (`totalFormatado`) — CA-22: sem zero-padding na hora (ex.: "5:07" em vez de "05:07").
- **Linhas ~369-376** (`saveInclusao`) — CA-10: `hashAreaConhecimento` não é incluído no `MatrizCurricularSaveRequest` da inclusão, apesar de existir na interface — confirmar se é intencional (área definida só na edição) ou lacuna.

### frontend/src/shared/dynamic-components/carga-horaria-input/carga-horaria-input.component.ts
- **Linha ~13** — Componentes standalone (bloqueante): componente novo criado com `standalone: false`. Observação: todo o módulo `dynamic-components` segue esse padrão (declarado via NgModule), então isso é consistente com o restante do módulo — mas, pelo critério estrito do projeto para código novo, deve ser sinalizado; vale decisão explícita da equipe sobre se esse módulo é uma exceção aceita.

### frontend/src/app/features/matriz-curricular/listar/listar-matriz-curricular.component.html
- **Linhas ~111-121** — Bug funcional (impacta CA-02/CA-22): o selo de "possui Carga Horária" usa apenas `disciplina.series[0]?.temCargaHoraria`, ignorando as demais séries da disciplina. Sugestão: usar uma condição que considere todas as séries (ex.: `every`/`some` conforme a regra de negócio desejada).

### frontend/src/app/features/matriz-curricular/listar/listar-matriz-curricular.component.ts / .html
- CA-05: não foi encontrado mecanismo de paginação client-side (apenas busca textual). Sugestão: aplicar paginação sobre os dados já carregados, como em outras listagens do projeto (ex. `dia-letivo-extra/listar`).

### frontend/src/shared/dynamic-components/multi-select-field/multi-select-field.component.ts
- **Linha ~96** — Remoção de `distinctUntilChanged()` do pipe de `valueChanges`, afetando todos os consumidores do componente compartilhado (não só Matriz Curricular). O `subscribe` tem uma guarda via `JSON.stringify` que parece cobrir o caso, mas é uma mudança de comportamento em componente compartilhado sem justificativa no escopo desta feature — vale confirmar a motivação com quem fez a alteração.

### frontend/src/app/features/lancamento-frequencia/** (fora de escopo)
- Alterações em `frequencia-tab-navigator`, `justificativas`, `lista-presenca` e `listar.component.scss` (responsividade mobile + `BreakpointObserver`) e a correção em `filtro-frequencia.service.ts:40` (`possuiVisaoCoordenacao` → `possuiLancamentoFrequencia`) não têm relação aparente com Matriz Curricular. Não violam os critérios técnicos analisados, mas recomenda-se confirmar se devem estar neste PR ou em PR(s) separado(s), já que ampliam o escopo de revisão sem descrição correspondente nos critérios de aceite.

## Avaliação Geral

A feature está funcionalmente completa na maior parte dos critérios de listagem, filtro e painel de inclusão/edição, com boa cobertura de testes de integração no backend para os fluxos principais (CA-03, CA-08, CA-14, CA-18, CA-19). Os pontos mais relevantes a corrigir antes do merge são:

1. **Carga horária não validada no backend (CA-20/21/22)** — a extension criada para essa finalidade (`CargaHorariaParser`) nunca é usada; o backend confia inteiramente no frontend para consistência entre valor digitado e minutos totais, e o formato de total persistido diverge do `hh:MM` exigido.
2. **Total da série usando Disable+Insert** em vez de atualização direta, contrariando explicitamente um complemento técnico do spec — pode gerar histórico de registros desnecessário e inconsistências de auditoria.
3. **Modal embutido no template pai** (`formulario-matriz.component.html`) é uma violação bloqueante de um padrão arquitetural já estabelecido no próprio repositório.
4. **Texto do aviso de inclusão (CA-13)** não corresponde ao texto exigido — correção simples e direta.
5. **Duplicação relevante de lógica** entre `SaveNew`/`Update` e entre os três services de escrita (validação, N+1 em loops de Insert/Disable, formatação de minutos) — não bloqueante para funcionamento, mas aumenta risco de regressão em manutenções futuras.
6. **Lacunas de teste pontuais**: `Update` sem teste de duplicidade de nome, `ValidacaoMatrizCurricularService` sem teste próprio, ausência de teste para o flag `NomeVariaPorSerie`.
7. **CA-15 (imutabilidade da disciplina na edição)** é garantida apenas pela UI — o backend não valida que a disciplina do `UpdateRequest` seja a mesma já vinculada ao registro, o que é uma lacuna de integridade caso a API seja chamada diretamente.

Nenhum dos achados de frontend quebra completamente um fluxo (CA-01/05/06/10/22 estão "Parcial", refletindo lacunas específicas e localizadas), mas o conjunto indica que uma rodada de ajustes é necessária antes de considerar o PR pronto para merge, especialmente nos pontos 1 a 4 acima, que têm relação direta com requisitos explícitos do spec.
