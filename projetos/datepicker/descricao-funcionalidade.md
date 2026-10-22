# Datepicker (`app-datepicker`) — Descrição Funcional

Componente Angular de seleção de data(s), usado em `estrutura-pedagogica` (`shared/components/datepicker`). Combina um input compacto com um calendário em dropdown.

## Modos de operação

O componente tem 3 tipos declarados, mas só 2 funcionam hoje:

1. **Single** — seleciona um único dia.
2. **WeekRange** — ao clicar em qualquer dia do calendário, seleciona a **semana inteira** daquele dia (domingo a sábado), não o dia isolado.
3. **Range** — existe no enum mas lança erro ("não implementado"). Não precisa ser considerado no design agora.

## Estrutura visual

### Estado fechado (input)
- Caixa retangular com borda arredondada (8px), ~180px de largura no modo Single e ~280px no WeekRange (dois campos de data).
- **Single**: um campo de texto (`dd/mm/aaaa`, somente leitura, funciona como "display").
- **WeekRange**: dois campos de texto separados por um hífen `—`, representando início e fim da semana selecionada.
- Botão "limpar" (X) à direita dos campos — fica desabilitado/esmaecido quando não há data selecionada.
- Botão de ícone de calendário à direita, que abre/fecha o dropdown.
- Hover/focus na caixa inteira muda a cor da borda e aplica um fundo levemente acinzentado (feedback de interatividade).
- Um tooltip aparece ao passar o mouse sobre a área do input explicando a regra de negócio (ex.: no modo semana, a mudança só vale a partir do dia escolhido).

### Dropdown do calendário
Abre ancorado abaixo do input ao clicar no botão de calendário (ou em qualquer parte do input). Fecha ao clicar fora (do input e do próprio dropdown).

- **Cabeçalho de navegação**: seta esquerda / rótulo "Mês - Ano" / seta direita. As setas desabilitam visualmente (cor cinza + cursor bloqueado) quando não há mês anterior/posterior dentro do intervalo permitido (`min`/`max`).
- **Linha de dias da semana**: Dom, Seg, Ter, Qua, Qui, Sex, Sáb.
- **Grade de dias**: 6 linhas × 7 colunas. Sempre preenchida por completo — dias do mês anterior e do mês seguinte aparecem para completar a primeira e últimas linhas, mas ficam visualmente "apagados" (cor clara) e não clicáveis.
- **Domingos sempre desabilitados** para clique (regra fixa, independente de `min`/`max` — parece refletir que não há aula aos domingos).
- **Dia de hoje**: contorno próprio (borda colorida), distinto do dia selecionado.
- **Dia selecionado** (Single) ou **semana selecionada** (WeekRange, via destaque de cada dia da linha): fundo sólido na cor de destaque (magenta/pink), texto branco.
- **Dias desabilitados** (fora do intervalo `min`/`max`, ou passados via `disabled`/`periodDisabled`): cor acinzentada, não clicáveis, podem ter tooltip próprio explicando o motivo.
- Hover num dia habilitado: fundo rosa claro + texto em negrito, cursor pointer. Hover num dia desabilitado não aplica esse destaque.

## Regras de negócio / comportamento

- `min`, `max` e `start` (datas) + `type` são obrigatórios. Definem o intervalo navegável do calendário e o mês/dia inicial exibido.
- Fora do intervalo `[min, max]`, os dias são automaticamente desabilitados (mês parcial do início e do fim do intervalo).
- `disabled`: lista de dias específicos a desabilitar, cada um com tooltip próprio.
- `periodDisabled`: lista de períodos (intervalos de datas) a desabilitar de uma vez.
- Navegação entre meses é restrita ao intervalo `min`/`max` (setas somem/desabilitam nos limites).
- No modo WeekRange, selecionar qualquer dia da semana (mesmo um dia desabilitado adjacente dentro da própria semana) define `start`/`end` como domingo/sábado daquela linha do grid.
- Emite um evento `change` com `{ start, end, startLabel, endLabel }` sempre que uma data é selecionada.
- Botão de limpar reseta os campos de texto (mas não necessariamente reabre em "sem seleção" visual no grid — é um reset do label exibido).
- Cada instância do componente mantém seu próprio estado de calendário (não há compartilhamento entre múltiplos datepickers na mesma tela).

## Identidade visual (cores atuais, como referência — não como restrição)

- Azul (`#242CC2`): ícone de calendário, setas de navegação ativas, destaque do rótulo mês/ano.
- Magenta/pink (`#9D0364`): dia selecionado, contorno do dia "hoje", hover geral do grid.
- Cinza (`#ADB2BA`, `#65686E`): placeholders, ícones/dias desabilitados, borda padrão da caixa.
- Fundo hover do dia: rosa claro (`#D89AC1`).
- Fonte: Nunito-Regular.

## Pontos relevantes para o design

- É um componente compacto, pensado para caber em barras de filtro (ao lado de outros campos), não um calendário de página inteira.
- Precisa comunicar claramente 3 estados por dia: habilitado, desabilitado, selecionado — mais um 4º estado "hoje" que não é o mesmo que selecionado.
- No modo semana, o destaque de seleção deveria idealmente comunicar "é a semana inteira", não um dia isolado (hoje o destaque é só no dia clicado via `grid-day-selected`, o que pode valer a pena revisar com o design).
- Testes automatizados dependem de atributos `data-testid` previsíveis por dia (`<prefixo>-dia-ano-mes-dia`), por isso qualquer redesenho do grid deve manter a possibilidade de identificar cada célula de dia individualmente.
