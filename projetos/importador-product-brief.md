# Importador — Descrição de Produto

## O que é

O **Importador** é uma ferramenta de importação em massa de dados via planilha
(`.xls`/`.xlsx`), pensada para substituir cadastros manuais repetitivos por um
fluxo guiado: o usuário carrega uma planilha e o sistema valida, corrige e
prepara os dados para entrada no sistema — coluna por coluna, com sugestão
automática de correção.

## Problema que resolve

Hoje, cargas de dados em volume (ex.: cadastrar centenas de alocações de
professor por escola/turma/disciplina no início do ano letivo, ou outras
cargas iniciais/pontuais) dependem de:
- Cadastro manual campo a campo na interface, ou
- Scripts/planilhas tratadas fora do sistema, sem validação nem rastreabilidade.

Ambos os caminhos são lentos, sujeitos a erro de digitação/nome (ex.: "9 Ano A"
vs "9º Ano A"), e não dão ao usuário uma forma simples de revisar e corrigir
inconsistências antes de confirmar a carga.

## Para quem é

Equipes operacionais/pedagógicas que precisam cadastrar grandes volumes de
dados estruturados no sistema (ex.: times de implantação, coordenação
pedagógica, RH/folha) — qualquer fluxo hoje resolvido via planilha + cadastro
manual, ou via scripts SQL avulsos.

## Proposta de valor

- **Menos erro de digitação/nomenclatura**: cada valor da planilha é validado
  contra a lista oficial (escolas, turmas, disciplinas, professores etc.);
  divergências são sinalizadas antes da carga entrar no sistema.
- **Correção assistida**: para todo valor não reconhecido, a ferramenta sugere
  a opção mais próxima (por similaridade textual) — o usuário aceita a
  sugestão com um clique em vez de digitar de novo.
- **Fluxo guiado por etapas**: em vez de validar a planilha inteira de uma vez
  (gerando uma lista enorme de erros misturados), o usuário resolve uma
  coluna por vez, com progresso visível.
- **Reutilizável entre features**: não é uma tela única — é um componente
  configurável (`config` por tipo de importação), pensado para ser plugado em
  qualquer fluxo do sistema que precise de carga em massa, sem reescrever a
  lógica de parsing/validação/sugestão a cada vez.
- **Dois modos de uso**: embutido em uma tela existente como qualquer outro
  componente, ou em tela cheia (overlay) quando a importação é o foco
  principal daquele momento do usuário.

## Como funciona (visão de produto)

1. O usuário escolhe/entra em um fluxo de importação já configurado (ex.:
   "Alocação de Professores").
2. Carrega a planilha (upload ou arrastar-e-soltar).
3. O sistema confere se os cabeçalhos da planilha batem com o esperado;
   se não baterem, avisa antes de prosseguir.
4. Cada coluna é validada contra a lista de referência correspondente:
   - Sem divergências → avança sozinho para a próxima coluna.
   - Com divergências → o usuário revisa cada valor problemático, aceita a
     sugestão, corrige manualmente ou marca a linha para remoção.
5. Ao final de todas as colunas, o botão de envio é liberado e o usuário
   confirma a importação.

## Diferenciais em relação ao processo manual/script

| | Cadastro manual / script avulso | Importador |
|---|---|---|
| Validação contra dados oficiais | Não, ou só no momento de salvar | Coluna a coluna, antes de enviar |
| Correção de divergência | Refazer manualmente | Sugestão automática por proximidade |
| Visibilidade do progresso | Nenhuma | Barra de progresso por etapa |
| Reuso entre áreas/times | Baixo (script sob medida) | Alto (config por tipo de importação) |
| Rastreabilidade do que foi corrigido | Nenhuma | Cada valor alterado fica marcado na tabela |

## Status atual

- Componente compartilhado (`app-importador` / `app-importador-overlay`)
  disponível para uso em qualquer feature do `estrutura-pedagogica`.
- Exemplo funcional em `/exemplos/importador`, com um cenário de referência
  (alocação de professores).
- Dados de referência hoje são estáticos/mockados na configuração de cada
  importação — a integração com endpoints reais de escolas/turmas/professores
  (e o envio efetivo do payload gerado) é o próximo passo antes de qualquer
  uso em produção.
- Visual ainda é um protótipo funcional, sem aplicação do Design System
  oficial (ver `importador-design-brief.md`).

## Próximos passos sugeridos

- Definir o primeiro caso de uso real a ser ligado a um endpoint de verdade
  (candidato natural: alocação de professores em cargas iniciais).
- Avaliar necessidade de auditoria/log de quem importou o quê (rastreabilidade
  além da sessão atual do usuário).
