# Investigação: MTF1 (nota pós-recuperação) some do boletim de alunos transferidos

> Transcrito do anexo `investigacao-mtf1-alunos-transferidos.md` do card EFC-7051 (Jira), enviado em 2026-10-19. Pré-análise feita por outra pessoa/IA antes da sincronização deste card.

## 1. Resumo

Alunos transferidos de uma turma para outra, dentro da mesma escola-série, ficam com a **MTF1 nula** em `rel.BaseDeNotas`, mesmo tendo MT1 e REC1 preenchidos. O boletim lê esse valor e, por isso, não exibe a nota pós-recuperação.

**Causa provável (derivada da leitura do código e sustentada pelos dados):** o processamento roda **duas vezes para o mesmo aluno transferido** (uma por vínculo/matrícula). A passagem que **não calcula** resultados apaga com `null` a MTF1 gravada pela passagem que calcula. Quem roda por último vence, então o problema é **intermitente**.

> **Limites desta análise:** não foi executado o processamento para reproduzir a falha. O diagnóstico vem da leitura do código e de consultas somente leitura ao banco (executadas em 2026-10-13). A causa é uma hipótese forte, não uma reprodução. Nada foi alterado no código nem no banco.

## 2. Exemplo analisado

| Campo | Valor |
|---|---|
| RA | 25428629 |
| Aluno (IdAluno / PessoaId) | 4471568 |
| Escola | São Bernardo do Campo 2 (rede Abaco) |
| Escola-série | 156182 (6º Ano Regular, 2026) |
| Vínculo antigo | `rel.BaseDeAlunos.Id` 8179927 — 6º ano B - T, status *Transferido*, `TurmaPrincipalParaCalculoResultados = False` |
| Vínculo atual | `rel.BaseDeAlunos.Id` 8231980 — 6º ano A - M, status *Matriculado*, `TurmaPrincipalParaCalculoResultados = True` |

**Atenção:** este aluno está **correto no momento da consulta** (Matemática: MT1 5,80, REC1 7,30, MTF1 6,00). Ele não reproduz a falha agora porque o resultado depende da ordem de execução (item 4). Os casos que falham estavam listados no item 3.

## 3. Evidências nos dados (`rel.BaseDeNotas`, escola-série 156182)

Entre as linhas aluno/disciplina com REC1 preenchida:

| Grupo | Linhas com REC1 | Com REC1 e **sem** MTF1 |
|---|---|---|
| Vínculo único (Matriculado, Cancelado ou Transferido) | 129 | **0** |
| Transferidos (2+ vínculos na escola-série; linha da turma ativa) | 15 | **11** |

Alunos transferidos **com a falha** (MTF1 nula em todas as 8 disciplinas, MT1 e PAF preenchidos):

| RA | IdAluno |
|---|---|
| 25418551 | 4416400 |
| 25425543 | 4452633 |
| 25426644 | 4459805 |
| 25439338 | 4531672 |
| 26494461 | 4929537 |

Alunos transferidos **sem** falha: 25428629, 25432572, 25434788.

Observações:

- A falha não depende dos valores de MT1/REC1. Exemplos que falham: MT1 5,50/REC1 5,10; MT1 4,70/REC1 9,10; MT1 5,60/REC1 0,00.
- Nos alunos com falha, a MTF1 tem `DataUltimaAtualizacao` igual à do último processamento (ex.: `2026-10-13 19:36:30`), apesar de nula. Ou seja, a linha foi **regravada com `null`**, e não ignorada.
- Para a MTF1 não existe linha em `dbo.AlunoNota` (confirmado para o RA 25428629: não há `AlunoNota` para as avaliações MTF1 1046915 e 1046919). O valor vive apenas em `rel.BaseDeNotas`.

## 4. Análise do código

### 4.1 O aluno transferido entra duas vezes na lista de processamento

`backend/ProcessadorBoletim.Infra/Repositories/Base/BaseDeAlunosRepository.cs` (`GetParaProcessamento`):

```csharp
return Queryable()
    .Where(x => x.BaseDeTurmas.EscolaSerieId == escolaSerieId)
    .Select(x => new AlunoParaProcessamentoDTO
    {
        PessoaId = x.PessoaId,
        PossuiAlgumaMatriculaAtivaNaSerie = x.PossuiAlgumaMatriculaAtivaNaSerie,
        DeveCalcularResultados = (x.SerieIdParaCalculoResultados == x.BaseDeTurmas.SerieId
                                   && x.TurmaPrincipalParaCalculoResultados)
    })
    .Distinct()
    .ToListAsync();
```

Há uma linha por vínculo em `rel.BaseDeAlunos`. Para o transferido:

| Vínculo | PessoaId | DeveCalcularResultados |
|---|---|---|
| Turma atual | 4471568 | `true` |
| Turma antiga | 4471568 | `false` |

Como `DeveCalcularResultados` difere, o `Distinct()` **não** junta as duas linhas. O `PessoaId` aparece duas vezes na lista.

### 4.2 Cada linha é processada separadamente

`ProcessarEscolaSerieService.ProcessarAlunos` carrega, por página, os dicionários de notas de relatório, transacionais, disciplinas e conselho de classe (indexados por `PessoaId`) **antes** do `foreach`. Depois chama `ProcessarAlunoService.Processar` para cada elemento da página. As duas passagens do mesmo aluno usam, portanto, **a mesma leitura inicial** de `rel.BaseDeNotas`.

### 4.3 Passagem com cálculo (`DeveCalcularResultados = true`)

`ProcessarAlunoService.Processar` executa os serviços de cálculo. `CalcularResultadoEtapaRecuperadaService` preenche a MTF1 (`NotaTransacionalNova`) a partir da nota da etapa (MT1, já com substitutiva aplicada). O `SalvarAlteracoesService`:

- `AtualizarNotaTransacional` só grava `AlunoNota` quando `x.ChamadaTransacional != null`. A MTF1 não tem lançamento transacional, então **não é persistida em `dbo.AlunoNota`**.
- `AtualizarRelatorio` grava `baseDeNotas.Nota = novosDados.NotaASerConsideradaParaCalculo`, ou seja, **grava a MTF1 só em `rel.BaseDeNotas`**.

### 4.4 Passagem sem cálculo (`DeveCalcularResultados = false`)

O bloco de cálculo é pulado (`if (configuracaoAvaliacoes.DeveCalcularResultados && aluno.DeveCalcularResultados)`), mas `FormatarAvaliacoesENotas` e `Salvar` continuam executando. Para a MTF1:

- `NotaRelatorio` = valor atual em `rel` (ex.: 6,00 se uma execução anterior já gravou).
- `NotaTransacionalNova` = `null` (não há `AlunoNota`, então o bloco `if (notaTransacional == null) { continue; }` em `FormatarAvaliacoesENotas` não preenche nada).

Em `AvaliacoesDaColunaDTO.DeveAtualizarRelatorio`:

```csharp
|| NotaRelatorio != NotaASerConsideradaParaCalculo
```

`6,00 != null` é verdadeiro, então o relatório é atualizado e `AtualizarRelatorio` grava **`null`** por cima da nota calculada.

### 4.5 Por que é intermitente

`GetParaProcessamento` não tem `OrderBy`. A ordem das duas linhas do mesmo `PessoaId` não é garantida:

- Se a passagem `true` roda por último, a MTF1 fica preenchida (casos 25428629, 25432572, 25434788).
- Se a passagem `false` roda por último, a MTF1 fica nula (casos 25418551, 25425543, 25426644, 25439338, 26494461).

A cada reprocessamento as duas passagens disputam o valor, o que também explica o `DataUltimaAtualizacao` sempre recente nos casos nulos.

### 4.6 Por que só atinge transferidos

Alunos de vínculo único geram uma única linha em `GetParaProcessamento`, então não há passagem concorrente. Isso bate com os dados: 0 falhas entre 129 linhas de vínculo único.

## 5. O que ainda não está provado

- Não foi executado o processamento (nem em modo debug via `ModoDebug` / `LogService.GerarLogAlteracoes`) para observar as duas passagens e a ordem real.
- A ordem de execução entre as passagens é inferida (query sem `OrderBy`), não observada.
- Não foi verificado se outras colunas calculadas que também não têm `AlunoNota` (além da MTF1) sofrem o mesmo efeito em transferidos. Nos alunos com falha, MT1 e PAF estão preenchidas, o que sugere que estas têm persistência transacional; vale conferir as demais (ex.: MF, MTF2, MTF3, situação).
- O escopo foi a escola-série 156182 (2026). Não foi medido o impacto em outras escolas e séries da rede.

## 6. Sugestão de correção (para avaliação)

**Principal — processar cada aluno uma única vez.** Em `BaseDeAlunosRepository.GetParaProcessamento`, agrupar por `PessoaId`:

```csharp
// esboço
.GroupBy(x => x.PessoaId)
.Select(g => new AlunoParaProcessamentoDTO
{
    PessoaId = g.Key,
    PossuiAlgumaMatriculaAtivaNaSerie = g.Any(x => x.PossuiAlgumaMatriculaAtivaNaSerie),
    DeveCalcularResultados = g.Any(x => x.SerieIdParaCalculoResultados == x.BaseDeTurmas.SerieId
                                         && x.TurmaPrincipalParaCalculoResultados)
})
```

Com isso a passagem `false` deixa de existir para quem tem ao menos um vínculo que deve calcular. É preciso validar a tradução desse `GroupBy` pelo EF Core e a semântica de `Any` para `PossuiAlgumaMatriculaAtivaNaSerie`.

**Defesa adicional (opcional).** Evitar que uma passagem sem cálculo sobrescreva o relatório com notas que ela não calculou, por exemplo não atualizando o relatório quando `DeveCalcularResultados` for falso, ou comparando apenas colunas que existem no transacional. Avaliar o efeito sobre os casos em que a passagem sem cálculo é intencional (ex.: aluno só com vínculo na turma não principal).

**Teste de integração sugerido** (seguindo `backend/ProcessadorBoletim.Test/Docs/Padrão para testes de Integração.md`): escola-série com um aluno transferido (dois registros em `BaseDeAlunos`, um principal e um não), com MT1 e REC1 preenchidas e MTF1 sem `AlunoNota`. Executar o processamento duas vezes e verificar que `rel.BaseDeNotas.Nota` da MTF1 permanece preenchida, independentemente da ordem dos vínculos.

## 7. Pós-correção

- Reprocessar as escolas-série com alunos transferidos. O dado de origem (MT1/REC1) está íntegro em `rel` e em `dbo.AlunoNota`, então o reprocessamento recalcula a MTF1.
- Conferir os RAs com falha listados no item 3 depois do reprocessamento (a MTF1 deve ficar igual à nota pós-recuperação da regra de substitutiva configurada).

## 8. Consultas usadas (somente leitura)

Vínculos do aluno de exemplo:

```sql
SELECT a.Id, a.IdAluno, a.IdAlunoEscola, a.Status, a.MatriculaAtiva,
       a.TurmaPrincipalParaCalculoResultados, a.PossuiAlgumaMatriculaAtivaNaSerie,
       t.NomeTurma, t.IdEscolaSerie, t.IdAnoLetivo
FROM rel.BaseDeAlunos a
JOIN rel.BaseDeTurmas t ON t.Id = a.BaseDeTurmas
WHERE a.Matricula = '25428629';
```

Alunos transferidos da escola-série 156182 com REC1 e MTF1 por disciplina:

```sql
SELECT a.IdAluno, a.Matricula, a.Status, a.TurmaPrincipalParaCalculoResultados AS principal,
       av.NomeDisciplinaMae,
       MAX(CASE WHEN av.SiglaTipoAvaliacao='MT1'  THEN n.Nota END) AS mt1,
       MAX(CASE WHEN av.SiglaTipoAvaliacao='REC1' THEN n.Nota END) AS rec1,
       MAX(CASE WHEN av.SiglaTipoAvaliacao='MTF1' THEN n.Nota END) AS mtf1
FROM rel.BaseDeAlunos a
JOIN rel.BaseDeTurmas t ON t.Id = a.BaseDeTurmas AND t.IdEscolaSerie = 156182
JOIN rel.BaseDeNotas n ON n.BaseDeAlunos = a.Id
JOIN rel.BaseDeAvaliacoes av ON av.Id = n.BaseDeAvaliacoes
    AND av.SiglaTipoAvaliacao IN ('MT1','REC1','MTF1')
WHERE a.IdAluno IN (SELECT a3.IdAluno
                     FROM rel.BaseDeAlunos a3
                     JOIN rel.BaseDeTurmas t3 ON t3.Id = a3.BaseDeTurmas
                     WHERE t3.IdEscolaSerie = 156182
                     GROUP BY a3.IdAluno HAVING COUNT(*) > 1)
GROUP BY a.IdAluno, a.Matricula, a.Status, a.TurmaPrincipalParaCalculoResultados, av.NomeDisciplinaMae
HAVING MAX(CASE WHEN av.SiglaTipoAvaliacao='REC1' THEN n.Nota END) IS NOT NULL
ORDER BY a.IdAluno, av.NomeDisciplinaMae, a.Status;
```

## 9. Arquivos de código relevantes

- `backend/ProcessadorBoletim.Infra/Repositories/Base/BaseDeAlunosRepository.cs` — `GetParaProcessamento` (origem da duplicidade)
- `backend/ProcessadorBoletim.Domain.Services/ProcessamentoBoletim/ProcessarEscolaSerieService.cs` — `ProcessarAlunos`
- `backend/ProcessadorBoletim.Domain.Services/ProcessamentoBoletim/ProcessarAlunoService.cs` — `Processar` e `FormatarAvaliacoesENotas`
- `backend/ProcessadorBoletim.Domain.Services/ProcessamentoBoletim/CalcularResultadoEtapaRecuperadaService.cs` — cálculo da MTF1
- `backend/ProcessadorBoletim.Domain.Services/ProcessamentoBoletim/SalvarAlteracoesService.cs` — `AtualizarNotaTransacional` e `AtualizarRelatorio`
- `backend/ProcessadorBoletim.Domain/DTO/ProcessamentoBoletim/AvaliacoesDaColunaDTO.cs` — `DeveAtualizarRelatorio`
- `backend/ProcessadorBoletim.Domain/DTO/ProcessamentoBoletim/AlunoParaProcessamentoDTO.cs`
