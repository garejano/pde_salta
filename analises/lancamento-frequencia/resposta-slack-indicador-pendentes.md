# Resposta técnica — indicador de "pendentes de lançamento" quase zerado

> Gerado em: 2026-10-29
> Origem: dúvida registrada em `analises/info_frequencia.md` (thread do Slack com Raquel Santana, Gustavo Valentim, Gisele Dornelas)
> Complementa: `analises/lancamento-frequencia/analise-fluxo-lancamento-frequencia.md`

## A dúvida original

Cálculo do indicador (sem medida própria no BI):
```
Pendente = Total esperado − lançamento no prazo − lançamento fora do prazo
```
Resultado observado: `46.050.554 − 40.917.192 − 5.133.220 = 143` pendentes — número muitíssimo menor que o padrão histórico. Pistas deixadas na thread:
- Gisele: "tivemos mudanças no lançamento de frequência em **julho**"
- Gustavo Valentim: o indicador depende de como vêm "a data de lançamento em si" e "a data esperada", e ele **repontou o dashboard para o novo banco** nessa mesma época.

## O que o código confirma

### 1. Timing bate exatamente
`projetos/NovoLancamentoFrequencia` foi mergeado em `master` em **2026-07-18** (`git log --merges`, commit `1724c5ae4`, precedido pelo merge para `develop` em 2026-07-14). É a reescrita completa do módulo de lançamento de frequência em `estrutura-pedagogica` analisada em `analise-fluxo-lancamento-frequencia.md`.

### 2. O novo fluxo cria registros automaticamente — sem lançamento manual
`SaveChamadaService.ProcessarUpsert` (`backend/EstruturaPedagogica.Domain.Services/LancamentoFrequencia/SaveChamadaService.cs:86-108`): ao salvar a frequência de **um** tempo/aula, se o tipo não é atraso, chama `Replicar` (linhas 95 e 106).

`Replicar` (linhas 127-150):
```csharp
/// Só alcança eventos ainda sem frequência registrada; registros replicados têm Confirmada=false.
private async Task Replicar(...)
{
   var eventosParaReplicar = await _aulaEventoRepository.GetParaReplicacao(...);
   ...
   var novasFrequencias = eventosParaReplicar.Select(item => new AlunoFrequenciaEntity
   {
      ...
      Confirmada = false
   }).ToList();

   await _alunoFrequenciaRepository.Insert(novasFrequencias);
}
```
Ou seja: **um único clique do professor em um tempo de aula gera linhas físicas de `AlunoFrequencia` para todos os outros tempos/eventos da mesma turma/dia** que ainda não tinham frequência — mesmo que ninguém tenha efetivamente aberto a chamada daquele tempo. Essas linhas ficam marcadas `Confirmada = false` ("lançamento herdado", pendente de confirmação humana), mas **existem na tabela**.

### 3. O campo de "data de lançamento" é `DataInclusao`, distinto de `DataAula`
`AlunoFrequencia` herda de `StatefulEntity` (`backend/EstruturaPedagogica.Domain/Entities/Stateful/AlunoFrequencia.cs:7`), que define:
```csharp
public virtual DateTime DataInclusao { get; set; }   // StatefulEntity.cs:9
...
this.DataInclusao = DateTime.Now;                     // RegistrarInclusao(), StatefulEntity.cs:28
```
- `DataAula` = data esperada da aula (a que o BI provavelmente usa como "total esperado").
- `DataInclusao` = timestamp real da gravação da linha no banco — inclusive das linhas **replicadas automaticamente**, que recebem o mesmo `DataInclusao` do clique original, não um lançamento independente por tempo.

## Hipótese mais provável para o indicador quase-zerado

Se o cálculo do BI classifica "lançamento no prazo"/"fora do prazo" **pela simples existência de uma linha em `AlunoFrequencia` para o par (aluno, evento esperado)** — comparando `DataInclusao` vs. `DataAula`/prazo — então, a partir de 18/07, um único lançamento manual por turma/dia passou a contar como lançamento em **todos os tempos daquela turma/dia**, incluindo os que ninguém de fato conferiu (`Confirmada = false`). Isso faz o "lançamento no prazo + fora do prazo" se aproximar do "total esperado" quase inteiramente, zerando o indicador de pendência — sem que o comportamento real dos professores tenha mudado.

Isso é coerente com a fala do Gustavo Valentim: ele repontou o dashboard para o novo banco/fluxo na mesma época, herdando esse efeito colateral sem que tenha havido "mudança de regra" deliberada no cálculo do indicador em si — a regra do indicador não mudou, mas a **semântica dos dados de origem** mudou.

## Sugestão de verificação / encaminhamento

1. Confirmar com consulta direta se a contagem de "lançado" do BI inclui `Confirmada = 0`. Se sim, isso é a causa raiz.
2. Se for esse o caso, decidir regra de negócio para o indicador: tratar lançamento replicado-e-não-confirmado como "pendente de confirmação" (categoria própria) em vez de "lançado", já que reflete apenas um efeito colateral técnico da réplica, não uma ação humana por tempo de aula.
3. Também vale alinhar que `StatusLancamentoFrequenciaEnum.PendenteConfirmacao` (valor 3) já existe como conceito no backend — é exatamente essa situação (tudo "lançado" mas algo não confirmado) e pode ser a fonte mais confiável para o BI reconstruir o indicador, em vez de inferir prazo a partir de `DataInclusao`/`DataAula` cru.

## Referências de código
- `backend/EstruturaPedagogica.Domain.Services/LancamentoFrequencia/SaveChamadaService.cs:86-150`
- `backend/EstruturaPedagogica.Domain/Entities/Stateful/AlunoFrequencia.cs`
- `backend/EstruturaPedagogica.Domain/Core/Entities/StatefulEntity.cs:9,25-32`
- Merge do projeto: `git log --merges` → `1724c5ae4` (2026-07-18), `1f1b9771e` (2026-07-14, para `develop`)
