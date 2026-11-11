# Migração de Banco — Diário de Classe

Ambos os bancos são **PostgreSQL**. A migração envolve:
1. Criar a tabela `DiarioDeClasseConfiguracao` no banco do `estrutura-pedagogica`
2. Popular com os dados existentes em `documentacao-pedagogica`

---

## 1. Entidade a criar — `DiarioDeClasseConfiguracao`

Baseada na entity `DiarioClasseConfiguracao` do `documentacao-pedagogica` e no padrão `StatefulEntity` do `estrutura-pedagogica`.

### C# Entity

```csharp
// EstruturaPedagogica.Domain/Entities/DiarioDeClasseConfiguracao.cs
public class DiarioDeClasseConfiguracao : StatefulEntity
{
    public virtual Rede Rede { get; set; }
    public virtual int RedeId { get; set; }

    public virtual string CaracterParaIndicarPresenca { get; set; }
    public virtual string CaracterParaIndicarFalta { get; set; }
    public virtual string CaracterParaIndicarPendencia { get; set; }
    public virtual string CaracterParaIndicarTransferencia { get; set; }
    public virtual string CaracterParaIndicarNEE { get; set; }

    public virtual bool ExibirFrequencia { get; set; }
    public virtual bool ExibirConteudoMinistrado { get; set; }
    public virtual bool ExibirRelatorioRendimento { get; set; }
}
```

### C# Mapping (EF Fluent API)

```csharp
// EstruturaPedagogica.Infra/Mapping/Stateful/DiarioDeClasseConfiguracaoMap.cs
public class DiarioDeClasseConfiguracaoMap : IEntityMap<DiarioDeClasseConfiguracao>
{
    public void Configure(EntityTypeBuilder<DiarioDeClasseConfiguracao> builder)
    {
        builder.IsStatefulEntity();

        builder.Property(x => x.RedeId)
               .HasColumnName("Rede")
               .IsRequired();
        builder.HasOne(x => x.Rede)
               .WithMany()
               .HasForeignKey(x => x.RedeId);

        builder.Property(x => x.CaracterParaIndicarPresenca).IsRequired();
        builder.Property(x => x.CaracterParaIndicarFalta).IsRequired();
        builder.Property(x => x.CaracterParaIndicarTransferencia).IsRequired();
        builder.Property(x => x.CaracterParaIndicarNEE).IsRequired();
        builder.Property(x => x.CaracterParaIndicarPendencia).IsRequired(false);

        builder.Property(x => x.ExibirFrequencia).IsRequired();
        builder.Property(x => x.ExibirConteudoMinistrado).IsRequired();
        builder.Property(x => x.ExibirRelatorioRendimento).IsRequired();
    }
}
```

> Registrar o mapping no `ApplicationContext.cs` do `EstruturaPedagogica.Infra`.

---

## 2. SQL — Criação da tabela

> Verificar o nome do schema padrão do `estrutura-pedagogica` antes de aplicar (observar as tabelas existentes).

```sql
-- estrutura-pedagogica DB
CREATE TABLE "DiarioDeClasseConfiguracao" (
    "Id"                            SERIAL          PRIMARY KEY,
    "Hash"                          UUID            NOT NULL DEFAULT gen_random_uuid(),
    "Ativo"                         BOOLEAN         NOT NULL DEFAULT TRUE,
    "DataInclusao"                  TIMESTAMP       NOT NULL,
    "UsuarioInclusao"               INTEGER         NOT NULL,
    "DataUltimaAlteracao"           TIMESTAMP       NULL,
    "UsuarioUltimaAlteracao"        INTEGER         NULL,
    "DataInativacao"                TIMESTAMP       NULL,
    "UsuarioInativacao"             INTEGER         NULL,
    "Rede"                          INTEGER         NOT NULL REFERENCES "Rede"("Id"),
    "CaracterParaIndicarPresenca"   VARCHAR(10)     NOT NULL,
    "CaracterParaIndicarFalta"      VARCHAR(10)     NOT NULL,
    "CaracterParaIndicarTransferencia" VARCHAR(10)  NOT NULL,
    "CaracterParaIndicarNEE"        VARCHAR(10)     NOT NULL,
    "CaracterParaIndicarPendencia"  VARCHAR(10)     NULL,
    "ExibirFrequencia"              BOOLEAN         NOT NULL DEFAULT TRUE,
    "ExibirConteudoMinistrado"      BOOLEAN         NOT NULL DEFAULT TRUE,
    "ExibirRelatorioRendimento"     BOOLEAN         NOT NULL DEFAULT TRUE
);

CREATE UNIQUE INDEX "IX_DiarioDeClasseConfiguracao_Hash"
    ON "DiarioDeClasseConfiguracao" ("Hash");

CREATE UNIQUE INDEX "IX_DiarioDeClasseConfiguracao_Rede"
    ON "DiarioDeClasseConfiguracao" ("Rede")
    WHERE "Ativo" = TRUE;
```

> **❓ Verificar:** o nome exato da tabela `Rede` e do campo PK no `estrutura-pedagogica` (pode ser `"Rede"."Id"` ou ter schema diferente). Conferir em `EstruturaPedagogica.Infra/Mapping/Stateful/RedeMap.cs`.

---

## 3. SQL — Migração de dados

Os bancos são separados. A migração de dados deve ser feita com um script que:
1. Lê de `documentacao-pedagogica`
2. Faz join via `Rede.HashOrigem` (doc-ped) = `Rede.Hash` (estrutura-pedagogica) — `HashOrigem` é o campo em doc-ped que armazena o hash da Rede no banco do estrutura-pedagogica
3. Insere em `estrutura-pedagogica`

### Opção A — script psql com `dblink` (se os dois DBs estiverem no mesmo servidor Postgres)

```sql
-- Executar no banco do estrutura-pedagogica
-- Pré-requisito: extensão dblink habilitada

CREATE EXTENSION IF NOT EXISTS dblink;

INSERT INTO "DiarioDeClasseConfiguracao" (
    "Hash",
    "Ativo",
    "DataInclusao",
    "UsuarioInclusao",
    "DataUltimaAlteracao",
    "UsuarioUltimaAlteracao",
    "Rede",
    "CaracterParaIndicarPresenca",
    "CaracterParaIndicarFalta",
    "CaracterParaIndicarTransferencia",
    "CaracterParaIndicarNEE",
    "CaracterParaIndicarPendencia",
    "ExibirFrequencia",
    "ExibirConteudoMinistrado",
    "ExibirRelatorioRendimento"
)
SELECT
    dc."Hash",
    dc."Ativo",
    dc."DataInclusao",
    1,                                  -- UsuarioInclusao: usar ID de usuário sistema
    dc."DataUltimaAlteracao",
    NULL,
    ep_rede."Id",                       -- Id da Rede no estrutura-pedagogica (via Hash)
    dc."CaracterParaIndicarPresenca",
    dc."CaracterParaIndicarFalta",
    dc."CaracterParaIndicarTransferencia",
    dc."CaracterParaIndicarNEE",
    dc."CaracterParaIndicarPendencia",
    dc."ExibirFrequencia",
    dc."ExibirConteudoMinistrado",
    dc."ExibirRelatorioRendimento"
FROM dblink(
    'host=<HOST> dbname=<DOCPED_DB> user=<USER> password=<PASS>',
    'SELECT
        dc."Hash",
        dc."Ativo",
        dc."DataInclusao",
        dc."DataUltimaAlteracao",
        dc."CaracterParaIndicarPresenca",
        dc."CaracterParaIndicarFalta",
        dc."CaracterParaIndicarTransferencia",
        dc."CaracterParaIndicarNEE",
        dc."CaracterParaIndicarPendencia",
        dc."ExibirFrequencia",
        dc."ExibirConteudoMinistrado",
        dc."ExibirRelatorioRendimento",
        r."HashOrigem" AS rede_hash_origem  -- HashOrigem = Hash da Rede no banco do estrutura-pedagogica
     FROM "DiarioClasseConfiguracao" dc
     INNER JOIN "Rede" r ON r."Id" = dc."Rede"
     WHERE dc."Ativo" = TRUE
       AND r."HashOrigem" IS NOT NULL'
) AS dc(
    "Hash" UUID,
    "Ativo" BOOLEAN,
    "DataInclusao" TIMESTAMP,
    "DataUltimaAlteracao" TIMESTAMP,
    "CaracterParaIndicarPresenca" VARCHAR,
    "CaracterParaIndicarFalta" VARCHAR,
    "CaracterParaIndicarTransferencia" VARCHAR,
    "CaracterParaIndicarNEE" VARCHAR,
    "CaracterParaIndicarPendencia" VARCHAR,
    "ExibirFrequencia" BOOLEAN,
    "ExibirConteudoMinistrado" BOOLEAN,
    "ExibirRelatorioRendimento" BOOLEAN,
    rede_hash_origem UUID
)
-- Join via Hash da Rede no estrutura-pedagogica (= HashOrigem no doc-ped)
INNER JOIN "Rede" ep_rede ON ep_rede."Hash" = dc.rede_hash_origem;
```

### Opção B — script Python/CSV (se os DBs estiverem em servidores diferentes)

Se `dblink` não for viável, exportar de `documentacao-pedagogica` para CSV e importar em `estrutura-pedagogica`:

```sql
-- No banco documentacao-pedagogica: exportar
COPY (
    SELECT
        dc."Hash",
        dc."Ativo",
        dc."DataInclusao",
        dc."DataUltimaAlteracao",
        dc."CaracterParaIndicarPresenca",
        dc."CaracterParaIndicarFalta",
        dc."CaracterParaIndicarTransferencia",
        dc."CaracterParaIndicarNEE",
        dc."CaracterParaIndicarPendencia",
        dc."ExibirFrequencia",
        dc."ExibirConteudoMinistrado",
        dc."ExibirRelatorioRendimento",
        r."HashOrigem" AS rede_hash_origem  -- HashOrigem = Hash da Rede no estrutura-pedagogica
    FROM "DiarioClasseConfiguracao" dc
    INNER JOIN "Rede" r ON r."Id" = dc."Rede"
    WHERE dc."Ativo" = TRUE
      AND r."HashOrigem" IS NOT NULL
) TO '/tmp/diario_configuracao.csv' CSV HEADER;
```

```sql
-- No banco estrutura-pedagogica: importar via tabela temporária
CREATE TEMP TABLE _import_diario_config (
    hash UUID, ativo BOOLEAN, data_inclusao TIMESTAMP,
    data_ultima_alteracao TIMESTAMP,
    caract_presenca VARCHAR, caract_falta VARCHAR,
    caract_transferencia VARCHAR, caract_nee VARCHAR,
    caract_pendencia VARCHAR,
    exibir_freq BOOLEAN, exibir_conteudo BOOLEAN, exibir_rendimento BOOLEAN,
    rede_hash_origem UUID  -- HashOrigem do doc-ped = Hash da Rede no estrutura-pedagogica
);

COPY _import_diario_config FROM '/tmp/diario_configuracao.csv' CSV HEADER;

INSERT INTO "DiarioDeClasseConfiguracao" (
    "Hash", "Ativo", "DataInclusao", "UsuarioInclusao",
    "DataUltimaAlteracao", "Rede",
    "CaracterParaIndicarPresenca", "CaracterParaIndicarFalta",
    "CaracterParaIndicarTransferencia", "CaracterParaIndicarNEE",
    "CaracterParaIndicarPendencia",
    "ExibirFrequencia", "ExibirConteudoMinistrado", "ExibirRelatorioRendimento"
)
SELECT
    i.hash, i.ativo, i.data_inclusao, 1,
    i.data_ultima_alteracao, r."Id",
    i.caract_presenca, i.caract_falta, i.caract_transferencia, i.caract_nee,
    i.caract_pendencia,
    i.exibir_freq, i.exibir_conteudo, i.exibir_rendimento
FROM _import_diario_config i
INNER JOIN "Rede" r ON r."Hash" = i.rede_hash_origem;
```

---

## 4. Checklist de aplicação

- [ ] Verificar nome/schema da tabela `Rede` no `estrutura-pedagogica` (`RedeMap.cs`)
- [ ] Confirmar se `StatefulEntity` no `estrutura-pedagogica` usa os mesmos nomes de coluna (consultar um `Map` existente, ex: `ConfiguracaoPeriodoLetivoMap.cs`)
- [ ] Registrar `DiarioDeClasseConfiguracao` no `ApplicationContext.cs`
- [ ] Aplicar o `CREATE TABLE` em homologação e verificar
- [ ] Executar a migração de dados em homologação e validar contagem + spot check
- [ ] Repetir em produção na janela de deploy
