repositorio: estrutura-pedagogica
card: EFC-6601 — Documento Carômetro - Persistir configurações do doc a nível de usuário

## Objetivo

Persistir no banco, por usuário, a configuração de personalização do documento **Carômetro** (grade de fotos dos alunos). Hoje essa configuração existe apenas em memória durante o uso da tela — não é lembrada entre sessões.

## Contexto atual

O Carômetro é um documento gerado pelo usuário via `document-builder`, iniciado em:

`c:/projects/estrutura-pedagogica/frontend/src/app/features/lancamento-frequencia/lista-presenca/lista-presenca.component.ts` → `buildCarometro()`

Nessa tela existe o componente `app-doc-carometro-config-panel`, um painel de configuração das personalizações do carômetro (colunas, espaçamento, altura do card, visibilidade de campos, variante/tipo do card).

Atualmente essas configurações valem somente durante o uso da tela — não são persistentes para o usuário.

## Regras de negócio

- **Modelo de dados**: nova tabela `DocumentoCarometroConfiguracao` vinculada ao usuário, contendo:
  - `qt_colunas` — quantidade de colunas do grid
  - `espacamento` — espaçamento entre os cards
  - `altura_card` — altura do card
  - `visivel` — visibilidade de campos: nome do aluno, RA, responsável, telefone, e-mail
  - `formatoCard` — variante visual do card
  - referência ao usuário dono da configuração
- **Carregamento**: ao abrir a tela, a configuração do usuário deve ser carregada e repassada ao painel de configuração, para que ele saiba como se inicializar.
- **Sem configuração salva**: usuários que nunca configuraram nada não têm registro algum; nesse caso, o painel carrega as configurações padrão do sistema.
- **Fluxo de update e restore**: tanto salvar alterações quanto "Restaurar padrões" devem refletir no backend (não apenas resetar a tela).
- **Indicação de alterações pendentes ("dirty")**: o painel deve deixar visível quando o usuário fez alguma alteração que ainda precisa ser salva.
- **Botão Salvar**: se houver alterações pendentes, o botão de salvar (no footer do painel, à direita do botão "Restaurar padrões") fica habilitado; caso contrário, permanece desabilitado.
- **Aviso ao usuário**: mensagem no final do corpo do painel de configuração (usando um componente de alerta/mensagem) informando que as configurações são salvas por usuário.

## Fora de escopo

- Não altera os dados dos alunos exibidos no carômetro (fotos, nome, RA, etc.) — apenas a personalização visual/layout do documento.
- Não há compartilhamento de configuração entre usuários — cada usuário tem a sua própria.
