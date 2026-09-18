-- =============================================================================
-- diario_config_inserts.sql
-- Gerado por csv_to_sql_diario_config.py em 2026-06-17 12:26:31
-- Origem: C:\projects\pde_salta\_scripts\diario_config_export.csv
--
-- Cada bloco usa IF NOT EXISTS para não sobrescrever registros já migrados.
-- A coluna Rede é resolvida via subquery pelo HashOrigem da Rede.
--
-- Como rodar:
--   No SQL Server Management Studio: abrir e executar (F5)
--   Via sqlcmd: sqlcmd -S HOST -U USER -P PASS -d ElevaPortalHomolog -i diario_config_inserts.sql
-- =============================================================================

SET NOCOUNT ON;
-- [1] Hash=A6F4918D-4D9B-4EA4-B3E0-431CBCDDCC46  Rede=CD72B088-2FDA-4600-9F08-C452E107A091
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('A6F4918D-4D9B-4EA4-B3E0-431CBCDDCC46' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('CD72B088-2FDA-4600-9F08-C452E107A091' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('A6F4918D-4D9B-4EA4-B3E0-431CBCDDCC46' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:13:56',
        1097334,
        '2026-03-06 16:20:56',
        r.Id,
        'P',
        'F',
        'T',
        'N',
        '-',
        1,
        0,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('CD72B088-2FDA-4600-9F08-C452E107A091' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [1]: Rede não encontrada no SQL Server para Hash=CD72B088-2FDA-4600-9F08-C452E107A091. Linha ignorada.';
    ELSE
        PRINT 'INSERT [1]: Hash=A6F4918D-4D9B-4EA4-B3E0-431CBCDDCC46';
END
ELSE
    PRINT 'SKIP [1]: Hash=A6F4918D-4D9B-4EA4-B3E0-431CBCDDCC46 ou Rede=CD72B088-2FDA-4600-9F08-C452E107A091 já existe.';
-- [2] Hash=7BFDD8FF-D645-4EFB-9B89-355864D953BA  Rede=7F9E9798-3D78-44F6-8338-8D0C4495B641
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('7BFDD8FF-D645-4EFB-9B89-355864D953BA' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('7F9E9798-3D78-44F6-8338-8D0C4495B641' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('7BFDD8FF-D645-4EFB-9B89-355864D953BA' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:14:06',
        1097334,
        '2023-08-03 14:24:13',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('7F9E9798-3D78-44F6-8338-8D0C4495B641' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [2]: Rede não encontrada no SQL Server para Hash=7F9E9798-3D78-44F6-8338-8D0C4495B641. Linha ignorada.';
    ELSE
        PRINT 'INSERT [2]: Hash=7BFDD8FF-D645-4EFB-9B89-355864D953BA';
END
ELSE
    PRINT 'SKIP [2]: Hash=7BFDD8FF-D645-4EFB-9B89-355864D953BA ou Rede=7F9E9798-3D78-44F6-8338-8D0C4495B641 já existe.';
-- [3] Hash=E559024D-3CD6-4BD1-8819-C87B413B8CE3  Rede=281C9ABF-3A98-479B-BEB6-FD2FA3F0B828
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('E559024D-3CD6-4BD1-8819-C87B413B8CE3' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('281C9ABF-3A98-479B-BEB6-FD2FA3F0B828' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('E559024D-3CD6-4BD1-8819-C87B413B8CE3' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:14:14',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('281C9ABF-3A98-479B-BEB6-FD2FA3F0B828' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [3]: Rede não encontrada no SQL Server para Hash=281C9ABF-3A98-479B-BEB6-FD2FA3F0B828. Linha ignorada.';
    ELSE
        PRINT 'INSERT [3]: Hash=E559024D-3CD6-4BD1-8819-C87B413B8CE3';
END
ELSE
    PRINT 'SKIP [3]: Hash=E559024D-3CD6-4BD1-8819-C87B413B8CE3 ou Rede=281C9ABF-3A98-479B-BEB6-FD2FA3F0B828 já existe.';
-- [4] Hash=56688E7D-7B16-42D5-8219-3043F9F10696  Rede=3FF515EB-AFCF-4908-853C-F373C1034242
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('56688E7D-7B16-42D5-8219-3043F9F10696' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('3FF515EB-AFCF-4908-853C-F373C1034242' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('56688E7D-7B16-42D5-8219-3043F9F10696' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:14:21',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('3FF515EB-AFCF-4908-853C-F373C1034242' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [4]: Rede não encontrada no SQL Server para Hash=3FF515EB-AFCF-4908-853C-F373C1034242. Linha ignorada.';
    ELSE
        PRINT 'INSERT [4]: Hash=56688E7D-7B16-42D5-8219-3043F9F10696';
END
ELSE
    PRINT 'SKIP [4]: Hash=56688E7D-7B16-42D5-8219-3043F9F10696 ou Rede=3FF515EB-AFCF-4908-853C-F373C1034242 já existe.';
-- [5] Hash=5CCAF9BF-8329-40E0-9EE6-F841A07B247F  Rede=36466060-A0A1-44F9-BCB4-817AF7503D05
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('5CCAF9BF-8329-40E0-9EE6-F841A07B247F' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('36466060-A0A1-44F9-BCB4-817AF7503D05' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('5CCAF9BF-8329-40E0-9EE6-F841A07B247F' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:14:29',
        1097334,
        '2023-12-20 11:02:29',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('36466060-A0A1-44F9-BCB4-817AF7503D05' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [5]: Rede não encontrada no SQL Server para Hash=36466060-A0A1-44F9-BCB4-817AF7503D05. Linha ignorada.';
    ELSE
        PRINT 'INSERT [5]: Hash=5CCAF9BF-8329-40E0-9EE6-F841A07B247F';
END
ELSE
    PRINT 'SKIP [5]: Hash=5CCAF9BF-8329-40E0-9EE6-F841A07B247F ou Rede=36466060-A0A1-44F9-BCB4-817AF7503D05 já existe.';
-- [6] Hash=76C3A24F-AA20-48C5-B733-4BEFB2EF848A  Rede=FE0BB407-CAEA-40EE-88D0-5945312878BF
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('76C3A24F-AA20-48C5-B733-4BEFB2EF848A' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('FE0BB407-CAEA-40EE-88D0-5945312878BF' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('76C3A24F-AA20-48C5-B733-4BEFB2EF848A' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:14:39',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('FE0BB407-CAEA-40EE-88D0-5945312878BF' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [6]: Rede não encontrada no SQL Server para Hash=FE0BB407-CAEA-40EE-88D0-5945312878BF. Linha ignorada.';
    ELSE
        PRINT 'INSERT [6]: Hash=76C3A24F-AA20-48C5-B733-4BEFB2EF848A';
END
ELSE
    PRINT 'SKIP [6]: Hash=76C3A24F-AA20-48C5-B733-4BEFB2EF848A ou Rede=FE0BB407-CAEA-40EE-88D0-5945312878BF já existe.';
-- [7] Hash=A08FAA7E-8BD3-484E-9012-28462083D447  Rede=98CD62E1-0350-4DB8-9181-420BA0EEE1FC
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('A08FAA7E-8BD3-484E-9012-28462083D447' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('98CD62E1-0350-4DB8-9181-420BA0EEE1FC' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('A08FAA7E-8BD3-484E-9012-28462083D447' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:15:04',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('98CD62E1-0350-4DB8-9181-420BA0EEE1FC' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [7]: Rede não encontrada no SQL Server para Hash=98CD62E1-0350-4DB8-9181-420BA0EEE1FC. Linha ignorada.';
    ELSE
        PRINT 'INSERT [7]: Hash=A08FAA7E-8BD3-484E-9012-28462083D447';
END
ELSE
    PRINT 'SKIP [7]: Hash=A08FAA7E-8BD3-484E-9012-28462083D447 ou Rede=98CD62E1-0350-4DB8-9181-420BA0EEE1FC já existe.';
-- [8] Hash=58A3E33E-869A-4B12-8719-837FC81F0786  Rede=A9FB9003-E33C-49B0-88D2-BE28F7535074
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('58A3E33E-869A-4B12-8719-837FC81F0786' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('A9FB9003-E33C-49B0-88D2-BE28F7535074' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('58A3E33E-869A-4B12-8719-837FC81F0786' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:15:11',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('A9FB9003-E33C-49B0-88D2-BE28F7535074' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [8]: Rede não encontrada no SQL Server para Hash=A9FB9003-E33C-49B0-88D2-BE28F7535074. Linha ignorada.';
    ELSE
        PRINT 'INSERT [8]: Hash=58A3E33E-869A-4B12-8719-837FC81F0786';
END
ELSE
    PRINT 'SKIP [8]: Hash=58A3E33E-869A-4B12-8719-837FC81F0786 ou Rede=A9FB9003-E33C-49B0-88D2-BE28F7535074 já existe.';
-- [9] Hash=00955AC6-0CB1-4F40-BCEF-9737DDC50A00  Rede=F0B705EE-98A3-4F0A-8FFB-6FE4226902D7
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('00955AC6-0CB1-4F40-BCEF-9737DDC50A00' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('F0B705EE-98A3-4F0A-8FFB-6FE4226902D7' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('00955AC6-0CB1-4F40-BCEF-9737DDC50A00' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:15:19',
        1097334,
        '2023-12-20 11:02:32',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('F0B705EE-98A3-4F0A-8FFB-6FE4226902D7' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [9]: Rede não encontrada no SQL Server para Hash=F0B705EE-98A3-4F0A-8FFB-6FE4226902D7. Linha ignorada.';
    ELSE
        PRINT 'INSERT [9]: Hash=00955AC6-0CB1-4F40-BCEF-9737DDC50A00';
END
ELSE
    PRINT 'SKIP [9]: Hash=00955AC6-0CB1-4F40-BCEF-9737DDC50A00 ou Rede=F0B705EE-98A3-4F0A-8FFB-6FE4226902D7 já existe.';
-- [10] Hash=CC10426D-6DDB-4A67-A49C-644CACBE3F0A  Rede=6D6EECDF-0F89-4898-931A-61B4737928C4
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('CC10426D-6DDB-4A67-A49C-644CACBE3F0A' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('6D6EECDF-0F89-4898-931A-61B4737928C4' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('CC10426D-6DDB-4A67-A49C-644CACBE3F0A' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:15:52',
        1097334,
        '2026-02-12 07:51:03',
        r.Id,
        '.',
        'F',
        'T',
        '*',
        '-',
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('6D6EECDF-0F89-4898-931A-61B4737928C4' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [10]: Rede não encontrada no SQL Server para Hash=6D6EECDF-0F89-4898-931A-61B4737928C4. Linha ignorada.';
    ELSE
        PRINT 'INSERT [10]: Hash=CC10426D-6DDB-4A67-A49C-644CACBE3F0A';
END
ELSE
    PRINT 'SKIP [10]: Hash=CC10426D-6DDB-4A67-A49C-644CACBE3F0A ou Rede=6D6EECDF-0F89-4898-931A-61B4737928C4 já existe.';
-- [11] Hash=07DF4638-56E2-4CBB-9CBB-7091736BE5E5  Rede=6F65561C-27ED-42EE-80D4-5F25F98597B6
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('07DF4638-56E2-4CBB-9CBB-7091736BE5E5' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('6F65561C-27ED-42EE-80D4-5F25F98597B6' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('07DF4638-56E2-4CBB-9CBB-7091736BE5E5' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:15:59',
        1097334,
        '2026-04-08 11:17:28',
        r.Id,
        '.',
        'F',
        'T',
        'N',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('6F65561C-27ED-42EE-80D4-5F25F98597B6' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [11]: Rede não encontrada no SQL Server para Hash=6F65561C-27ED-42EE-80D4-5F25F98597B6. Linha ignorada.';
    ELSE
        PRINT 'INSERT [11]: Hash=07DF4638-56E2-4CBB-9CBB-7091736BE5E5';
END
ELSE
    PRINT 'SKIP [11]: Hash=07DF4638-56E2-4CBB-9CBB-7091736BE5E5 ou Rede=6F65561C-27ED-42EE-80D4-5F25F98597B6 já existe.';
-- [12] Hash=276E0532-E6B7-4FAF-8715-507AAE38D9FC  Rede=EC6DBA66-4C13-4BC0-B4C3-A0936BB3250B
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('276E0532-E6B7-4FAF-8715-507AAE38D9FC' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('EC6DBA66-4C13-4BC0-B4C3-A0936BB3250B' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('276E0532-E6B7-4FAF-8715-507AAE38D9FC' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:16:06',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('EC6DBA66-4C13-4BC0-B4C3-A0936BB3250B' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [12]: Rede não encontrada no SQL Server para Hash=EC6DBA66-4C13-4BC0-B4C3-A0936BB3250B. Linha ignorada.';
    ELSE
        PRINT 'INSERT [12]: Hash=276E0532-E6B7-4FAF-8715-507AAE38D9FC';
END
ELSE
    PRINT 'SKIP [12]: Hash=276E0532-E6B7-4FAF-8715-507AAE38D9FC ou Rede=EC6DBA66-4C13-4BC0-B4C3-A0936BB3250B já existe.';
-- [13] Hash=8F136F38-8238-46B8-9B56-00519A830B69  Rede=FA92111D-7B8E-43B8-A57F-5E490EA6CCD4
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('8F136F38-8238-46B8-9B56-00519A830B69' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('FA92111D-7B8E-43B8-A57F-5E490EA6CCD4' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('8F136F38-8238-46B8-9B56-00519A830B69' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:16:14',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('FA92111D-7B8E-43B8-A57F-5E490EA6CCD4' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [13]: Rede não encontrada no SQL Server para Hash=FA92111D-7B8E-43B8-A57F-5E490EA6CCD4. Linha ignorada.';
    ELSE
        PRINT 'INSERT [13]: Hash=8F136F38-8238-46B8-9B56-00519A830B69';
END
ELSE
    PRINT 'SKIP [13]: Hash=8F136F38-8238-46B8-9B56-00519A830B69 ou Rede=FA92111D-7B8E-43B8-A57F-5E490EA6CCD4 já existe.';
-- [14] Hash=48FAA336-C934-43B8-A687-E0F600873DAA  Rede=C832900C-4ED2-434D-AF28-FF5A7B3B143F
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('48FAA336-C934-43B8-A687-E0F600873DAA' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('C832900C-4ED2-434D-AF28-FF5A7B3B143F' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('48FAA336-C934-43B8-A687-E0F600873DAA' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:16:41',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('C832900C-4ED2-434D-AF28-FF5A7B3B143F' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [14]: Rede não encontrada no SQL Server para Hash=C832900C-4ED2-434D-AF28-FF5A7B3B143F. Linha ignorada.';
    ELSE
        PRINT 'INSERT [14]: Hash=48FAA336-C934-43B8-A687-E0F600873DAA';
END
ELSE
    PRINT 'SKIP [14]: Hash=48FAA336-C934-43B8-A687-E0F600873DAA ou Rede=C832900C-4ED2-434D-AF28-FF5A7B3B143F já existe.';
-- [15] Hash=DDF2AA4C-4072-4D53-8637-C44E7BB50E39  Rede=29FB62C7-9E0F-4AB4-8489-F35CCBF453C7
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('DDF2AA4C-4072-4D53-8637-C44E7BB50E39' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('29FB62C7-9E0F-4AB4-8489-F35CCBF453C7' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('DDF2AA4C-4072-4D53-8637-C44E7BB50E39' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:16:49',
        1097334,
        '2023-06-30 11:34:19',
        r.Id,
        '.',
        'F',
        'T',
        '',
        '/',
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('29FB62C7-9E0F-4AB4-8489-F35CCBF453C7' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [15]: Rede não encontrada no SQL Server para Hash=29FB62C7-9E0F-4AB4-8489-F35CCBF453C7. Linha ignorada.';
    ELSE
        PRINT 'INSERT [15]: Hash=DDF2AA4C-4072-4D53-8637-C44E7BB50E39';
END
ELSE
    PRINT 'SKIP [15]: Hash=DDF2AA4C-4072-4D53-8637-C44E7BB50E39 ou Rede=29FB62C7-9E0F-4AB4-8489-F35CCBF453C7 já existe.';
-- [16] Hash=BAC7DE2F-E66D-43E2-A448-7BBB66406B6A  Rede=E4309AD7-E17B-475B-9A7D-A935C5ECFCE1
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('BAC7DE2F-E66D-43E2-A448-7BBB66406B6A' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('E4309AD7-E17B-475B-9A7D-A935C5ECFCE1' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('BAC7DE2F-E66D-43E2-A448-7BBB66406B6A' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:16:55',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('E4309AD7-E17B-475B-9A7D-A935C5ECFCE1' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [16]: Rede não encontrada no SQL Server para Hash=E4309AD7-E17B-475B-9A7D-A935C5ECFCE1. Linha ignorada.';
    ELSE
        PRINT 'INSERT [16]: Hash=BAC7DE2F-E66D-43E2-A448-7BBB66406B6A';
END
ELSE
    PRINT 'SKIP [16]: Hash=BAC7DE2F-E66D-43E2-A448-7BBB66406B6A ou Rede=E4309AD7-E17B-475B-9A7D-A935C5ECFCE1 já existe.';
-- [17] Hash=8DAA9190-C669-499F-A655-840FACD1D77C  Rede=8505AEAB-FEF1-4CD8-8307-205CCA3CFE3C
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('8DAA9190-C669-499F-A655-840FACD1D77C' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('8505AEAB-FEF1-4CD8-8307-205CCA3CFE3C' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('8DAA9190-C669-499F-A655-840FACD1D77C' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:17:11',
        1097334,
        '2023-06-30 11:35:11',
        r.Id,
        '.',
        'F',
        'T',
        '',
        '/',
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('8505AEAB-FEF1-4CD8-8307-205CCA3CFE3C' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [17]: Rede não encontrada no SQL Server para Hash=8505AEAB-FEF1-4CD8-8307-205CCA3CFE3C. Linha ignorada.';
    ELSE
        PRINT 'INSERT [17]: Hash=8DAA9190-C669-499F-A655-840FACD1D77C';
END
ELSE
    PRINT 'SKIP [17]: Hash=8DAA9190-C669-499F-A655-840FACD1D77C ou Rede=8505AEAB-FEF1-4CD8-8307-205CCA3CFE3C já existe.';
-- [18] Hash=66FEAAA4-2B1B-4F69-AC94-2E2F470BD5B3  Rede=35A4C874-DAD6-48F1-B6F1-7521E8943F5E
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('66FEAAA4-2B1B-4F69-AC94-2E2F470BD5B3' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('35A4C874-DAD6-48F1-B6F1-7521E8943F5E' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('66FEAAA4-2B1B-4F69-AC94-2E2F470BD5B3' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:17:17',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('35A4C874-DAD6-48F1-B6F1-7521E8943F5E' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [18]: Rede não encontrada no SQL Server para Hash=35A4C874-DAD6-48F1-B6F1-7521E8943F5E. Linha ignorada.';
    ELSE
        PRINT 'INSERT [18]: Hash=66FEAAA4-2B1B-4F69-AC94-2E2F470BD5B3';
END
ELSE
    PRINT 'SKIP [18]: Hash=66FEAAA4-2B1B-4F69-AC94-2E2F470BD5B3 ou Rede=35A4C874-DAD6-48F1-B6F1-7521E8943F5E já existe.';
-- [19] Hash=0449B835-7215-4834-A13D-3334AAD1EA4B  Rede=D38DE1F7-7C29-4E9B-A751-F886DC1097B5
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('0449B835-7215-4834-A13D-3334AAD1EA4B' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('D38DE1F7-7C29-4E9B-A751-F886DC1097B5' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('0449B835-7215-4834-A13D-3334AAD1EA4B' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:17:40',
        1097334,
        '2023-06-02 11:15:25',
        r.Id,
        '.',
        'F',
        'T',
        '',
        '/',
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('D38DE1F7-7C29-4E9B-A751-F886DC1097B5' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [19]: Rede não encontrada no SQL Server para Hash=D38DE1F7-7C29-4E9B-A751-F886DC1097B5. Linha ignorada.';
    ELSE
        PRINT 'INSERT [19]: Hash=0449B835-7215-4834-A13D-3334AAD1EA4B';
END
ELSE
    PRINT 'SKIP [19]: Hash=0449B835-7215-4834-A13D-3334AAD1EA4B ou Rede=D38DE1F7-7C29-4E9B-A751-F886DC1097B5 já existe.';
-- [20] Hash=36E3BC80-6182-4BAF-8C0D-8D3E0E59D9DC  Rede=A7D29956-021C-4873-A23D-E1D35C4B040E
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('36E3BC80-6182-4BAF-8C0D-8D3E0E59D9DC' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('A7D29956-021C-4873-A23D-E1D35C4B040E' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('36E3BC80-6182-4BAF-8C0D-8D3E0E59D9DC' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:17:47',
        1097334,
        '2023-12-20 11:02:36',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('A7D29956-021C-4873-A23D-E1D35C4B040E' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [20]: Rede não encontrada no SQL Server para Hash=A7D29956-021C-4873-A23D-E1D35C4B040E. Linha ignorada.';
    ELSE
        PRINT 'INSERT [20]: Hash=36E3BC80-6182-4BAF-8C0D-8D3E0E59D9DC';
END
ELSE
    PRINT 'SKIP [20]: Hash=36E3BC80-6182-4BAF-8C0D-8D3E0E59D9DC ou Rede=A7D29956-021C-4873-A23D-E1D35C4B040E já existe.';
-- [21] Hash=2EA8404F-8C1E-4EC0-90DF-67C207CB5D7F  Rede=5126B65B-6C94-41E8-887B-0E5BDD787D26
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('2EA8404F-8C1E-4EC0-90DF-67C207CB5D7F' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('5126B65B-6C94-41E8-887B-0E5BDD787D26' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('2EA8404F-8C1E-4EC0-90DF-67C207CB5D7F' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:17:54',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('5126B65B-6C94-41E8-887B-0E5BDD787D26' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [21]: Rede não encontrada no SQL Server para Hash=5126B65B-6C94-41E8-887B-0E5BDD787D26. Linha ignorada.';
    ELSE
        PRINT 'INSERT [21]: Hash=2EA8404F-8C1E-4EC0-90DF-67C207CB5D7F';
END
ELSE
    PRINT 'SKIP [21]: Hash=2EA8404F-8C1E-4EC0-90DF-67C207CB5D7F ou Rede=5126B65B-6C94-41E8-887B-0E5BDD787D26 já existe.';
-- [22] Hash=3924AA2F-BCCE-4308-BB6B-C5550E6AEE22  Rede=1DA65227-960B-4B48-BD86-27DFB10C01EF
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('3924AA2F-BCCE-4308-BB6B-C5550E6AEE22' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('1DA65227-960B-4B48-BD86-27DFB10C01EF' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('3924AA2F-BCCE-4308-BB6B-C5550E6AEE22' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:18:02',
        1097334,
        '2023-06-30 15:16:12',
        r.Id,
        '.',
        'F',
        'T',
        '',
        '/',
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('1DA65227-960B-4B48-BD86-27DFB10C01EF' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [22]: Rede não encontrada no SQL Server para Hash=1DA65227-960B-4B48-BD86-27DFB10C01EF. Linha ignorada.';
    ELSE
        PRINT 'INSERT [22]: Hash=3924AA2F-BCCE-4308-BB6B-C5550E6AEE22';
END
ELSE
    PRINT 'SKIP [22]: Hash=3924AA2F-BCCE-4308-BB6B-C5550E6AEE22 ou Rede=1DA65227-960B-4B48-BD86-27DFB10C01EF já existe.';
-- [23] Hash=6076555D-8C81-451C-BBB9-40D12EEB750A  Rede=401EA009-E166-4674-B402-C82BE12357D2
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('6076555D-8C81-451C-BBB9-40D12EEB750A' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('401EA009-E166-4674-B402-C82BE12357D2' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('6076555D-8C81-451C-BBB9-40D12EEB750A' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:18:08',
        1097334,
        '2023-06-30 15:16:04',
        r.Id,
        '.',
        'F',
        'T',
        '',
        '/',
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('401EA009-E166-4674-B402-C82BE12357D2' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [23]: Rede não encontrada no SQL Server para Hash=401EA009-E166-4674-B402-C82BE12357D2. Linha ignorada.';
    ELSE
        PRINT 'INSERT [23]: Hash=6076555D-8C81-451C-BBB9-40D12EEB750A';
END
ELSE
    PRINT 'SKIP [23]: Hash=6076555D-8C81-451C-BBB9-40D12EEB750A ou Rede=401EA009-E166-4674-B402-C82BE12357D2 já existe.';
-- [24] Hash=1F4B41CD-2263-4D78-B31F-9AEDBD6A832F  Rede=3355BE09-C2A3-414D-BE87-AAEAE9A40C36
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('1F4B41CD-2263-4D78-B31F-9AEDBD6A832F' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('3355BE09-C2A3-414D-BE87-AAEAE9A40C36' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('1F4B41CD-2263-4D78-B31F-9AEDBD6A832F' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:18:13',
        1097334,
        '2023-06-12 17:38:29',
        r.Id,
        '.',
        'F',
        'T',
        '',
        '-',
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('3355BE09-C2A3-414D-BE87-AAEAE9A40C36' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [24]: Rede não encontrada no SQL Server para Hash=3355BE09-C2A3-414D-BE87-AAEAE9A40C36. Linha ignorada.';
    ELSE
        PRINT 'INSERT [24]: Hash=1F4B41CD-2263-4D78-B31F-9AEDBD6A832F';
END
ELSE
    PRINT 'SKIP [24]: Hash=1F4B41CD-2263-4D78-B31F-9AEDBD6A832F ou Rede=3355BE09-C2A3-414D-BE87-AAEAE9A40C36 já existe.';
-- [25] Hash=69CBCF8A-4108-4476-821C-193C2A301F50  Rede=D8B596BF-6442-4BC2-AC61-ED5B01AD7849
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('69CBCF8A-4108-4476-821C-193C2A301F50' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('D8B596BF-6442-4BC2-AC61-ED5B01AD7849' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('69CBCF8A-4108-4476-821C-193C2A301F50' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:18:21',
        1097334,
        '2023-12-20 11:02:39',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('D8B596BF-6442-4BC2-AC61-ED5B01AD7849' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [25]: Rede não encontrada no SQL Server para Hash=D8B596BF-6442-4BC2-AC61-ED5B01AD7849. Linha ignorada.';
    ELSE
        PRINT 'INSERT [25]: Hash=69CBCF8A-4108-4476-821C-193C2A301F50';
END
ELSE
    PRINT 'SKIP [25]: Hash=69CBCF8A-4108-4476-821C-193C2A301F50 ou Rede=D8B596BF-6442-4BC2-AC61-ED5B01AD7849 já existe.';
-- [26] Hash=606BCDCB-EDD5-45B9-85DA-B003544DD93D  Rede=4F79ADEC-4D7F-43E8-B4EF-B0172DC000DB
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('606BCDCB-EDD5-45B9-85DA-B003544DD93D' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('4F79ADEC-4D7F-43E8-B4EF-B0172DC000DB' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('606BCDCB-EDD5-45B9-85DA-B003544DD93D' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:18:27',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('4F79ADEC-4D7F-43E8-B4EF-B0172DC000DB' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [26]: Rede não encontrada no SQL Server para Hash=4F79ADEC-4D7F-43E8-B4EF-B0172DC000DB. Linha ignorada.';
    ELSE
        PRINT 'INSERT [26]: Hash=606BCDCB-EDD5-45B9-85DA-B003544DD93D';
END
ELSE
    PRINT 'SKIP [26]: Hash=606BCDCB-EDD5-45B9-85DA-B003544DD93D ou Rede=4F79ADEC-4D7F-43E8-B4EF-B0172DC000DB já existe.';
-- [27] Hash=814554DD-C370-4315-A5C1-CB1E150F6472  Rede=6F2E00CB-95CB-4BC6-BB20-3E20365C7CD1
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('814554DD-C370-4315-A5C1-CB1E150F6472' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('6F2E00CB-95CB-4BC6-BB20-3E20365C7CD1' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('814554DD-C370-4315-A5C1-CB1E150F6472' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:18:32',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('6F2E00CB-95CB-4BC6-BB20-3E20365C7CD1' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [27]: Rede não encontrada no SQL Server para Hash=6F2E00CB-95CB-4BC6-BB20-3E20365C7CD1. Linha ignorada.';
    ELSE
        PRINT 'INSERT [27]: Hash=814554DD-C370-4315-A5C1-CB1E150F6472';
END
ELSE
    PRINT 'SKIP [27]: Hash=814554DD-C370-4315-A5C1-CB1E150F6472 ou Rede=6F2E00CB-95CB-4BC6-BB20-3E20365C7CD1 já existe.';
-- [28] Hash=A58F2CE3-75F7-40FF-8DA5-041FEEFFC94A  Rede=73380414-983F-4271-82DF-0CCBF19F08EE
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('A58F2CE3-75F7-40FF-8DA5-041FEEFFC94A' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('73380414-983F-4271-82DF-0CCBF19F08EE' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('A58F2CE3-75F7-40FF-8DA5-041FEEFFC94A' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:18:37',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('73380414-983F-4271-82DF-0CCBF19F08EE' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [28]: Rede não encontrada no SQL Server para Hash=73380414-983F-4271-82DF-0CCBF19F08EE. Linha ignorada.';
    ELSE
        PRINT 'INSERT [28]: Hash=A58F2CE3-75F7-40FF-8DA5-041FEEFFC94A';
END
ELSE
    PRINT 'SKIP [28]: Hash=A58F2CE3-75F7-40FF-8DA5-041FEEFFC94A ou Rede=73380414-983F-4271-82DF-0CCBF19F08EE já existe.';
-- [29] Hash=8EFA5A40-F016-4033-9251-15AD504B0F90  Rede=4DFBC7B4-E1A2-469E-AA1D-C51260E92D2D
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('8EFA5A40-F016-4033-9251-15AD504B0F90' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('4DFBC7B4-E1A2-469E-AA1D-C51260E92D2D' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('8EFA5A40-F016-4033-9251-15AD504B0F90' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:18:43',
        1097334,
        '2025-11-10 09:48:24',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('4DFBC7B4-E1A2-469E-AA1D-C51260E92D2D' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [29]: Rede não encontrada no SQL Server para Hash=4DFBC7B4-E1A2-469E-AA1D-C51260E92D2D. Linha ignorada.';
    ELSE
        PRINT 'INSERT [29]: Hash=8EFA5A40-F016-4033-9251-15AD504B0F90';
END
ELSE
    PRINT 'SKIP [29]: Hash=8EFA5A40-F016-4033-9251-15AD504B0F90 ou Rede=4DFBC7B4-E1A2-469E-AA1D-C51260E92D2D já existe.';
-- [30] Hash=5105E454-3406-400F-821E-56F68FD1FB12  Rede=1996EB5F-5FF4-42AC-AC99-B099B5746743
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('5105E454-3406-400F-821E-56F68FD1FB12' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('1996EB5F-5FF4-42AC-AC99-B099B5746743' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('5105E454-3406-400F-821E-56F68FD1FB12' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:18:49',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('1996EB5F-5FF4-42AC-AC99-B099B5746743' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [30]: Rede não encontrada no SQL Server para Hash=1996EB5F-5FF4-42AC-AC99-B099B5746743. Linha ignorada.';
    ELSE
        PRINT 'INSERT [30]: Hash=5105E454-3406-400F-821E-56F68FD1FB12';
END
ELSE
    PRINT 'SKIP [30]: Hash=5105E454-3406-400F-821E-56F68FD1FB12 ou Rede=1996EB5F-5FF4-42AC-AC99-B099B5746743 já existe.';
-- [31] Hash=F5961B37-6B9D-44A6-9DCD-2FE89F938737  Rede=F0067DD5-8916-4DB5-AD4A-E42438A10623
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('F5961B37-6B9D-44A6-9DCD-2FE89F938737' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('F0067DD5-8916-4DB5-AD4A-E42438A10623' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('F5961B37-6B9D-44A6-9DCD-2FE89F938737' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:18:55',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('F0067DD5-8916-4DB5-AD4A-E42438A10623' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [31]: Rede não encontrada no SQL Server para Hash=F0067DD5-8916-4DB5-AD4A-E42438A10623. Linha ignorada.';
    ELSE
        PRINT 'INSERT [31]: Hash=F5961B37-6B9D-44A6-9DCD-2FE89F938737';
END
ELSE
    PRINT 'SKIP [31]: Hash=F5961B37-6B9D-44A6-9DCD-2FE89F938737 ou Rede=F0067DD5-8916-4DB5-AD4A-E42438A10623 já existe.';
-- [32] Hash=21219F1F-D0FB-41BF-8006-4A230E98A696  Rede=546E7980-8F99-440E-B944-6519B7184CE1
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('21219F1F-D0FB-41BF-8006-4A230E98A696' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('546E7980-8F99-440E-B944-6519B7184CE1' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('21219F1F-D0FB-41BF-8006-4A230E98A696' AS UNIQUEIDENTIFIER),
        1,
        '2023-04-19 19:19:00',
        1097334,
        '2023-05-26 08:28:24',
        r.Id,
        '.',
        'F',
        'T',
        '',
        '/',
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('546E7980-8F99-440E-B944-6519B7184CE1' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [32]: Rede não encontrada no SQL Server para Hash=546E7980-8F99-440E-B944-6519B7184CE1. Linha ignorada.';
    ELSE
        PRINT 'INSERT [32]: Hash=21219F1F-D0FB-41BF-8006-4A230E98A696';
END
ELSE
    PRINT 'SKIP [32]: Hash=21219F1F-D0FB-41BF-8006-4A230E98A696 ou Rede=546E7980-8F99-440E-B944-6519B7184CE1 já existe.';
-- [33] Hash=F5302CEC-D8AC-4272-ACBD-1B5FAF7A3F3C  Rede=A43C39F2-91B7-4425-8921-1849090C1804
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('F5302CEC-D8AC-4272-ACBD-1B5FAF7A3F3C' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('A43C39F2-91B7-4425-8921-1849090C1804' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('F5302CEC-D8AC-4272-ACBD-1B5FAF7A3F3C' AS UNIQUEIDENTIFIER),
        1,
        '2025-05-20 10:37:39',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        '',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('A43C39F2-91B7-4425-8921-1849090C1804' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [33]: Rede não encontrada no SQL Server para Hash=A43C39F2-91B7-4425-8921-1849090C1804. Linha ignorada.';
    ELSE
        PRINT 'INSERT [33]: Hash=F5302CEC-D8AC-4272-ACBD-1B5FAF7A3F3C';
END
ELSE
    PRINT 'SKIP [33]: Hash=F5302CEC-D8AC-4272-ACBD-1B5FAF7A3F3C ou Rede=A43C39F2-91B7-4425-8921-1849090C1804 já existe.';
-- [34] Hash=F3C0B104-1D18-4081-B1AE-C005B415E0A7  Rede=E5DCC20C-9D95-4D0B-BB66-9846C3A62F32
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('F3C0B104-1D18-4081-B1AE-C005B415E0A7' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('E5DCC20C-9D95-4D0B-BB66-9846C3A62F32' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('F3C0B104-1D18-4081-B1AE-C005B415E0A7' AS UNIQUEIDENTIFIER),
        1,
        '2026-01-20 15:03:13',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        'N',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('E5DCC20C-9D95-4D0B-BB66-9846C3A62F32' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [34]: Rede não encontrada no SQL Server para Hash=E5DCC20C-9D95-4D0B-BB66-9846C3A62F32. Linha ignorada.';
    ELSE
        PRINT 'INSERT [34]: Hash=F3C0B104-1D18-4081-B1AE-C005B415E0A7';
END
ELSE
    PRINT 'SKIP [34]: Hash=F3C0B104-1D18-4081-B1AE-C005B415E0A7 ou Rede=E5DCC20C-9D95-4D0B-BB66-9846C3A62F32 já existe.';
-- [35] Hash=1E8F0792-8D55-4E8B-A57B-6FCF5BA3A4A5  Rede=037F5B48-2D4B-4D80-B075-76749D7F3492
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('1E8F0792-8D55-4E8B-A57B-6FCF5BA3A4A5' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('037F5B48-2D4B-4D80-B075-76749D7F3492' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    SELECT
        CAST('1E8F0792-8D55-4E8B-A57B-6FCF5BA3A4A5' AS UNIQUEIDENTIFIER),
        1,
        '2026-02-25 10:53:47',
        1097334,
        '',
        r.Id,
        '.',
        'F',
        'T',
        'N',
        NULL,
        1,
        1,
        1
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('037F5B48-2D4B-4D80-B075-76749D7F3492' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [35]: Rede não encontrada no SQL Server para Hash=037F5B48-2D4B-4D80-B075-76749D7F3492. Linha ignorada.';
    ELSE
        PRINT 'INSERT [35]: Hash=1E8F0792-8D55-4E8B-A57B-6FCF5BA3A4A5';
END
ELSE
    PRINT 'SKIP [35]: Hash=1E8F0792-8D55-4E8B-A57B-6FCF5BA3A4A5 ou Rede=037F5B48-2D4B-4D80-B075-76749D7F3492 já existe.';
PRINT '---';
PRINT 'Migração concluída.';
