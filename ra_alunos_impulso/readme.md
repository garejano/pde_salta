O problema: Temos alunos em Escolas (publicas que a administracao eh feita pela empresa que trabalho) que nao sao da nossa rede mas essas escolas utilizam os sistemas, entao mesmo nao sendo alunos diretos nosso em alguns
cenarios eles precisam ter um RA cadastrado para poder usar correcao de redacao.

O techlead que executa esse processo manualmente esta de ferias e passou algumas instrucoes que nao consegui entender bem
estao em: ./instrucao_rodrigo.md


ele tbm mandou uma planilha modelo com alunos que ele ja cadastrou na base para ter um RA.
a planilha de modelo dele: ./Importação de Alunos Impulso.xlsx


A product manager do meu time recebeu uma outra planilha com os alunos que deve ser gerado um RA pra eles: ./Turmas Impulso (ENEM2).xlsx


analise o contexto, se possivel uma parte do ./Importação de Alunos Impulso.xlsx para entender o padrao e as queries.
(vc tem acesso ao mcp do sqlserver se quiser entender os dados reais)


crie um documento que analise esse processo, entende de fato o que deve ser feito e se possivel criar um script (de preferencia sql) para gerar o RA para esses alunos.




 Resumo

  Fluxo para qualquer ambiente (homolog ou produção):

  1. Rodar _scripts/resolve_ids_ra_impulso.sql no banco
     ├── Query 1 → exportar como YYYY-MM-DD_to_ra_manual_<env>.csv em _scripts/
     └── Query 2 → anotar o proximo_ra

  2. python _scripts/gerar_ra_impulso_enem2.py --ra-start <ProximoRA> --env producao

  3. Rodar _scripts/ra_alunos_impulso_enem2.sql no banco

  O que mudou:
  - Os IDs de escola e turma nunca mais são hardcoded — vêm sempre do CSV gerado pelo
  próprio banco
  - Se produção tiver IDs diferentes, o SQL resolve automaticamente pelo nome
  - Se uma turma tiver nome diferente em produção, o script detecta (aluno fica como "não
  mapeado") e o documento explica exatamente como corrigir
