-- EFC-6451 — Adiciona coluna DescricaoTooltip em StatusLancamentoFrequencia
-- Executar em: ElevaPortalHomolog (e depois em Prod)

-- 1. Adicionar coluna
ALTER TABLE StatusLancamentoFrequencia
    ADD DescricaoTooltip NVARCHAR(500) NULL;
GO

-- 2. Popular com os textos de tooltip (baseados nos CAs do EFC-6451)
UPDATE StatusLancamentoFrequencia SET DescricaoTooltip = 'Nenhuma marcação registrada para esta turma hoje.'
WHERE Id = 1; -- Pendente de lançamento

UPDATE StatusLancamentoFrequencia SET DescricaoTooltip = 'Alguns tempos de aula já foram lançados, mas ainda há tempos pendentes.'
WHERE Id = 2; -- Lançamento parcial

UPDATE StatusLancamentoFrequencia SET DescricaoTooltip = 'Frequência preenchida automaticamente ou herdada de outro tempo. Aguarda confirmação do professor ou coordenador.'
WHERE Id = 3; -- Pendente confirmação

UPDATE StatusLancamentoFrequencia SET DescricaoTooltip = 'Todos os tempos de aula foram registrados e confirmados.'
WHERE Id = 4; -- Lançado
GO

-- 3. Verificar resultado
SELECT Id, Descricao, DescricaoTooltip, Ordem
FROM StatusLancamentoFrequencia
ORDER BY Ordem;
GO
