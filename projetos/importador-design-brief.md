# Como o Importador funciona

## Objetivo
Ferramenta para importar dados em massa a partir de planilha (`.xls`/`.xlsx`). O usuário carrega o arquivo, o sistema valida os dados **coluna por coluna** contra listas de referência (ex.: escolas, turmas, disciplinas, professores), sugere correções para valores não reconhecidos, e ao final gera o payload para envio.

## Fluxo (estados da tela)

1. **Vazio** — nenhum arquivo carregado ainda.
2. **Carregando** — lendo o arquivo e depois validando coluna a coluna (com barra de progresso por etapa).
3. **Tabela + Inspeção** — arquivo processado: mostra a planilha e o painel de correção da coluna (etapa) atual.
4. **Pronto para enviar** — quando todas as colunas estão validadas, o botão de envio é habilitado.

Cada **coluna da planilha = uma etapa**. O usuário resolve os erros da etapa atual (ou ela já vem sem erros) e o fluxo avança automaticamente para a próxima coluna, até acabar.

## Layout da tela

### Cabeçalho (fixo no topo)
- **Botão "Carregar arquivo"** — abre o seletor de arquivo (também aceita drag-and-drop).
- **Mensagem de erro de arquivo** — aparece ao lado do botão quando o arquivo é inválido (extensão errada, maior que 10MB, ou cabeçalhos da planilha não batem com as colunas esperadas).
- **Indicador de progresso das etapas** — texto "Etapa X de Y" + nome da coluna atual + barra de progresso preenchendo conforme avança.
- **Botão "Enviar dados para importação"** — fica desabilitado (cinza) até a última etapa estar sem erros pendentes; quando habilitado, fica destacado (verde).

### Estado "carregando"
Card central com:
- Spinner circular.
- Título ("Lendo arquivo..." / "Validando dados...").
- Pills com nome do arquivo, nº de linhas e nº de colunas.
- Um **stepper horizontal** com um círculo por coluna: check verde quando concluída, pulsando quando é a atual, cinza quando ainda não chegou — com o label da coluna embaixo de cada círculo.

### Estado "vazio"
Card central simples: ícone grande, texto "Nenhum arquivo carregado" + subtítulo + botão de carregar novamente.

### Estado "tabela + inspeção" (o principal, dividido em duas colunas)

**Esquerda — tabela de dados (maior, ocupa o espaço restante)**
- Tabela com cabeçalho fixo (sticky) listando as colunas da planilha.
- A coluna correspondente à etapa atual fica **destacada** no cabeçalho.
- Cada célula pode ter **múltiplos valores** (separados por `;`), exibidos como "chips"/spans dentro da célula.
- Valores **inválidos** (sem correspondência na lista de referência) aparecem destacados em vermelho/tracejado, só na coluna da etapa atual.
- Valores já **corrigidos** aparecem com estilo diferente (ex.: sublinhado/cor de "alterado").
- Clique em uma célula seleciona ela (fica com borda de destaque) — a navegação também funciona por setas do teclado.

**Direita — painel de inspeção da coluna atual (largura fixa, ~700px)**
- Cabeçalho: nome da coluna + botão "Aplicar sugestões" (ícone de varinha, aplica automaticamente a melhor sugestão pra todos os erros) + botão "Confirmar e avançar" (aparece quando não há mais erros pendentes).
- Contador "X/Y pendentes".
- **Lista de cards de erro** (um por valor não reconhecido, agrupando todas as linhas afetadas):
  - Colapsado: nome do valor original (riscado se já corrigido) → seta → melhor sugestão com % de proximidade (badge com ícone de varinha), ou o valor já aplicado com um check.
  - Botão de ação à esquerda do card: ícone de lixeira (marcar linha p/ remoção), ou "restaurar" quando já corrigido/removido.
  - Expandido (clique no card): mostra lista de **sugestões por proximidade** (% de similaridade) e depois **todas as opções** da lista de referência, cada uma clicável para aplicar.

### Variante tela cheia (overlay)
Quando usado via `app-importador-overlay`: uma barra superior (cor de destaque, ex. azul institucional) com botão de voltar/fechar à esquerda e o título da importação centralizado, cobrindo 100% da viewport — o conteúdo do importador ocupa o restante da tela abaixo dessa barra.

## Observações importantes para o redesign
- O visual atual é **um protótipo funcional** (paleta simples: azul/verde/vermelho genéricos, `material-symbols-outlined`), migrado de um playground interno — **não segue o Design System oficial ainda**. É esperado que cores, tipografia, espaçamentos e estilo dos cards/botões sejam totalmente redesenhados.
- Estados que talvez não apareçam no print (por serem interações): hover nos botões, card de erro expandido, drag-and-drop de arquivo sobre a área de upload, navegação por teclado na tabela, e o stepper de carregamento.
- Pontos de atenção estrutural que devem se manter no redesign: destaque visual da coluna/etapa atual na tabela, diferenciação clara entre valor **inválido** / **corrigido** / **removido** na célula, e o contraste entre "sugestão automática" vs "todas as opções" no painel de inspeção.
