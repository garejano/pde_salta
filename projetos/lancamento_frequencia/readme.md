# Reestruturação de `AlunoSaidaAntecipada`

## Problema

A entidade atual cruza `Pessoa` com `AulaEvento`, o que cria dois problemas estruturais:

1. **Reenturmação:** `AulaEvento` pertence a uma `Turma` específica. Se o aluno for reenturmado, o registro de saída fica vinculado a uma turma que ele não frequenta mais.
2. **Inativação de aula:** `AulaEvento` pode ser inativado pelo cadastro de horário, tornando o registro órfão.

A informação correta que deve ser registrada é:
> "O aluno saiu da escola no horário HH:MM"  
> — **não** "o aluno saiu da aula X da turma Y"

---

## Schema atual

```
AlunoSaidaAntecipada
├── Id (PK)
├── Pessoa (FK → Pessoa)          ← correto
├── AulaEvento (FK → AulaEvento)  ← PROBLEMA
├── HoraSaida (time)
└── Justificativa (varchar 500, nullable)
```

---

## Schema proposto

Seguir o mesmo padrão de `AlunoFrequencia`: âncora em `Pessoa + Escola + DataAula`, sem vínculo com `AulaEvento`.

```
AlunoSaidaAntecipada
├── Id (PK)
├── Pessoa (FK → Pessoa)   ← mantido
├── Escola (FK → Escola)   ← novo
├── DataAula (date)        ← novo
├── Turno (FK → Turno)     ← novo (desnormalizado do AulaEvento, para o painel de histórico)
├── HoraSaida (time)       ← mantido
└── Justificativa (varchar 500, nullable)  ← mantido
```

**Cardinalidade:** um registro por `Pessoa + Escola + DataAula` (ativo). Mesmo comportamento atual de "upsert por inativação": ao salvar novamente, o registro anterior é inativado e um novo é inserido.

---

## Impacto nos serviços

### `SaidaAntecipadaService.Save`

| Antes | Depois |
|---|---|
| Recebe `HashAulaEvento` | Recebe `HashAulaEvento` (mantido para validação e derivação) |
| Busca evento para validar `PossuiFrequencia` e janela de tempo | Idem — mas agora extrai `EscolaId` e `DataAula` do evento |
| Salva com `AulaEventoId` | Salva com `EscolaId + DataAula` |
| Verifica duplicata por `Pessoa + AulaEvento` | Verifica duplicata por `Pessoa + Escola + DataAula` |

O `HashAulaEvento` continua sendo necessário no request — ele é usado para:
- Validar que o evento existe e tem frequência
- Validar que `HoraSaida` cabe na janela do evento (eventos com `Tempo`)
- Derivar `Escola` via `AulaEvento → Turma → EscolaSerie → Escola`
- Derivar `DataAula` via `AulaEvento.DataInicio.Date`
- Derivar `TurnoId` via `AulaEvento.TurnoId`

### `AlunoSaidaAntecipadaRepository.GetResponseParaChamada`

| Antes | Depois |
|---|---|
| `WHERE AulaEventoId = X AND PessoaId IN (...)` | `WHERE EscolaId = X AND DataAula = Y AND PessoaId IN (...)` |
| Retorna exatamente os registros do evento | Retorna todos os registros da escola+data — filtragem por horário no serviço |

**Lógica de aplicação no `GetChamadaService`:**  
Ao montar a resposta da chamada, verificar se `saida.HoraSaida` está dentro do intervalo do evento selecionado:

```
saida se aplica ao evento SE:
  saida.HoraSaida >= evento.DataInicio.TimeOfDay
  E saida.HoraSaida <= evento.DataTermino.TimeOfDay
```

Para eventos **sem Tempo** (lançamento por turno, não por aula), qualquer saída da escola naquele dia se aplica ao evento.

### `GetPessoasComSaidaEmTempoAnterior`

| Antes | Depois |
|---|---|
| Navega `x.AulaEvento.TurmaId`, `x.AulaEvento.DataInicio`, `x.AulaEvento.Tempo < tempoAtual` | `WHERE EscolaId = X AND DataAula = Y AND HoraSaida < evento.DataInicio.TimeOfDay` |

A semântica muda ligeiramente de "teve saída em um *tempo* anterior" para "saiu antes do início deste evento" — o que é semanticamente mais correto.

### `GetParaDetalheAluno` / `GetParaDetalheAlunos`

Atualmente navega `x.AulaEvento.DataInicio`, `.Turno`, `.Disciplina`, `.Tempo` para enriquecer o painel de histórico.

Após a mudança, `AlunoSaidaAntecipada` não terá mais relação com `AulaEvento`. O enriquecimento do painel de histórico será feito desnormalizando `TurnoId` no registro — o turno é derivado do evento no momento do save e armazenado diretamente.

---

## Scripts de banco

```sql
-- 1. Adicionar colunas novas (com defaults temporários para NOT NULL)
ALTER TABLE AlunoSaidaAntecipada ADD Escola   INT  NOT NULL DEFAULT 0;
ALTER TABLE AlunoSaidaAntecipada ADD DataAula DATE NOT NULL DEFAULT '2000-01-01';
ALTER TABLE AlunoSaidaAntecipada ADD Turno    INT  NOT NULL DEFAULT 0;

-- 2. Migrar dados existentes via join
UPDATE asa
SET
    asa.Escola   = es.Escola,
    asa.DataAula = CAST(ae.DataInicio AS DATE),
    asa.Turno    = ae.Turno
FROM AlunoSaidaAntecipada asa
JOIN AulaEvento  ae ON ae.Id = asa.AulaEvento
JOIN Turma        t ON t.Id  = ae.Turma
JOIN EscolaSerie es ON es.Id = t.EscolaSerie;

-- 3. Remover vínculo com AulaEvento
-- Não existe FK nomeada para AulaEvento — dropar apenas o índice e a coluna.
DROP INDEX IX_AlunoSaidaAntecipada_AulaEvento_Pessoa ON AlunoSaidaAntecipada;

ALTER TABLE AlunoSaidaAntecipada DROP COLUMN AulaEvento;

-- 4. Adicionar FK para Escola
ALTER TABLE AlunoSaidaAntecipada
    ADD CONSTRAINT FK_AlunoSaidaAntecipada_Escola
    FOREIGN KEY (Escola) REFERENCES Escola(Id);

-- 5. Adicionar FK para Turno
ALTER TABLE AlunoSaidaAntecipada
    ADD CONSTRAINT FK_AlunoSaidaAntecipada_Turno
    FOREIGN KEY (Turno) REFERENCES Turno(Id);

-- 6. Remover defaults temporários
-- Checar nomes gerados antes de executar:
--   SELECT name FROM sys.default_constraints WHERE parent_object_id = OBJECT_ID('AlunoSaidaAntecipada');
ALTER TABLE AlunoSaidaAntecipada DROP CONSTRAINT DF__AlunoSaid__Escola_xxxxx;
ALTER TABLE AlunoSaidaAntecipada DROP CONSTRAINT DF__AlunoSaid__DataAu_xxxxx;
ALTER TABLE AlunoSaidaAntecipada DROP CONSTRAINT DF__AlunoSaid__Turno__xxxxx;

-- 7. Índice único filtrado (garante 1 registro ativo por Pessoa+Escola+Data)
CREATE UNIQUE INDEX UX_AlunoSaidaAntecipada_Pessoa_Escola_Data
    ON AlunoSaidaAntecipada (Pessoa, Escola, DataAula)
    WHERE Ativo = 1;
```

---

## Arquivos afetados

| Arquivo | Mudança |
|---|---|
| `AlunoSaidaAntecipada.cs` | Remover `AulaEvento`/`AulaEventoId`, adicionar `EscolaId`/`Escola`, `DataAula` e `TurnoId`/`Turno` |
| `AlunoSaidaAntecipadaMap.cs` | Atualizar mapping EF |
| `IAlunoSaidaAntecipadaRepository.cs` | Atualizar assinatura de `GetResponseParaChamada` e `GetPessoasComSaidaEmTempoAnterior` |
| `AlunoSaidaAntecipadaRepository.cs` | Reescrever queries que navegavam `AulaEvento` |
| `SaidaAntecipadaService.cs` | Ajustar derivação de `EscolaId + DataAula + TurnoId` a partir do evento; atualizar busca de duplicata |
| `GetChamadaService.cs` | Adicionar filtro por horário ao aplicar saída ao evento |
| `AlunoSaidaAntecipadaFixture.cs` | Atualizar fixtures de teste |
| `SaidaAntecipadaServiceTests.cs` | Atualizar testes |
| Script SQL | Criar em `cards/<KEY>/sql/` |
