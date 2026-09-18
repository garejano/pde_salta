-- EFC-6758 / EFC-6760 / EFC-6761 / EFC-6762 (parte de dado) / EFC-6763 — Ajustes de texto na
-- Anamnese (Painel do Aluno).
--
-- Todos os 4 cards são AJUSTE DE DADO, não de código: o texto de cada pergunta vem de
-- AnamneseVirtual.Pergunta.Texto (endpoint getanamnese só repassa o que está cadastrado; nada disso
-- é hardcoded no front — confirmado em cards/EFC-6547/EFC-6547.analise-campos-hardcoded.md).
--
-- Cada UPDATE trava tanto o Id quanto o texto ATUAL esperado no WHERE — se 0 linha for afetada,
-- o texto já mudou desde a investigação (2026-08-31) e o UPDATE correspondente deve ser revisado
-- antes de rodar de novo, não simplesmente reexecutado.
--
-- Banco compartilhado com portal-atlas (schema AnamneseVirtual) — rodar primeiro em
-- ElevaPortalHomolog e validar a tela antes de aplicar em produção. Usuário mcp.readonly do MCP é
-- somente leitura; rodar manualmente.

-- ============================================================================
-- EFC-6763 — Textos da seção "Controle Esfíncteres" (Infantil)
-- ============================================================================
UPDATE AnamneseVirtual.Pergunta
   SET Texto = 'Como é o controle vesical?'
 WHERE Id = 115 AND Texto = 'Como é o controle vesical (bexiga)?';

UPDATE AnamneseVirtual.Pergunta
   SET Texto = 'Como é o controle anal?'
 WHERE Id = 116 AND Texto = 'Como é o controle anal (fezes)?';

-- ============================================================================
-- EFC-6761 — Campo condicional de "Dorme sozinho?" (Sono, Infantil)
-- ============================================================================
UPDATE AnamneseVirtual.Pergunta
   SET Texto = 'Com quem?'
 WHERE Id = 98 AND Texto = 'Se não, com quem?';

-- ============================================================================
-- EFC-6758 — Textos condicionais das Áreas de Interesse e Rotinas de Estudo (Regular)
-- ============================================================================
UPDATE AnamneseVirtual.Pergunta
   SET Texto = 'Qual dificuldade?'
 WHERE Id = 95 AND Texto = 'Se sim, qual a dificuldade?';
-- "Apresentou dificuldades em escolas anteriores?" (Sim) -> acima

UPDATE AnamneseVirtual.Pergunta
   SET Texto = 'Por que?'
 WHERE Id = 150 AND Texto = 'Se não, por quê?';
-- "Gosta de ir para a escola?" (Não) -> acima

UPDATE AnamneseVirtual.Pergunta
   SET Texto = 'Com quem?'
 WHERE Id = 177 AND Texto = 'Se acompanhado, com quem?';
-- "Estuda sozinho ou acompanhado?" (Acompanhado) -> acima

UPDATE AnamneseVirtual.Pergunta
   SET Texto = 'Qual?'
 WHERE Id = 181 AND Texto = 'Se sim, qual?';
-- "Demonstra sinais de interesse em alguma carreira específica?" (Sim) -> acima

UPDATE AnamneseVirtual.Pergunta
   SET Texto = 'De quais disciplinas?'
 WHERE Id = 183 AND Texto = 'Se sim, de quais disciplinas?';
-- "Já fez ou faz aula particular?" (Sim) -> acima

-- ============================================================================
-- EFC-6760 — Textos condicionais da seção Comportamento (Regular)
--
-- Confirmado via AnamneseVirtual.PerguntaCondicionalOpcaoResposta.PerguntaBit (gatilho por
-- resposta Sim/Não) qual filho pertence a qual pai -- os 3 Ids abaixo tinham o MESMO texto
-- "Se sim, qual(is)?", por isso a checagem por PerguntaBit foi necessária antes de gerar este
-- script (não dava pra distinguir só pelo texto). O card pede "Qual(is)" sem "?" só para "Tem um
-- sonho?" -- padronizado com "?" nos 3, igual aos outros dois, por consistência (provável erro de
-- digitação no card; ajustar aqui se o time confirmar que era intencional).
-- ============================================================================
UPDATE AnamneseVirtual.Pergunta
   SET Texto = 'Qual(is)?'
 WHERE Id = 161 AND Texto = 'Se sim, qual(is)?';
-- "Passou por perdas ou mudanças significativas/situações traumáticas?" (Sim) -> acima

UPDATE AnamneseVirtual.Pergunta
   SET Texto = 'Qual(is)?'
 WHERE Id = 165 AND Texto = 'Se sim, qual(is)?';
-- "Tem algum medo?" (Sim) -> acima

UPDATE AnamneseVirtual.Pergunta
   SET Texto = 'Qual(is)?'
 WHERE Id = 188 AND Texto = 'Se sim, qual(is)?';
-- "Tem um sonho?" (Sim) -> acima

-- ============================================================================
-- EFC-6762 (parte de dado) — "Com que idade engatinhou?" (Desenvolvimento Psicomotor, Infantil)
--
-- A pergunta já existe e já está vinculada/ativa na versão Infantil (PerguntaVersaoAnamnese.Id
-- 124) — não faltava cadastro, só o texto estava fora do padrão das perguntas irmãs ("Com que
-- idade sentou?", "...sustentou a cabeça?", etc.), por isso parecia "sumida" na tela. A parte de
-- placeholder explicativo desse mesmo card é código (anamnese-form.mapper.ts), já implementada.
-- ============================================================================
UPDATE AnamneseVirtual.Pergunta
   SET Texto = 'Com que idade engatinhou?'
 WHERE Id = 110 AND Texto = 'E engatinhou?';

-- ============================================================================
-- Verificação pós-execução — deve retornar os 12 Ids com os textos já corrigidos.
-- ============================================================================
SELECT Id, Texto
  FROM AnamneseVirtual.Pergunta
 WHERE Id IN (115, 116, 98, 95, 150, 177, 181, 183, 161, 165, 188, 110)
 ORDER BY Id;
