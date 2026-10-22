# Análise — Imprimir / Gerar PDF do Boletim no Painel (EFC-6816)

> Análise de viabilidade, sem implementação. Pergunta: o monolito (portal-atlas) tem opção de gerar PDF/imprimir o boletim — isso pode ser replicado no novo Painel do Aluno (`estrutura-pedagogica`)?

---

## Como funciona hoje no portal-atlas

**Não existe geração de PDF no servidor.** O que parece "gerar PDF" é, na verdade, o diálogo de impressão nativo do navegador:

- `Impressao.asp` (linha ~813): `<body ... <% if imprimirAutomatico and not erro then %> onload="window.print();" <% end if %>>`
- O JS (`PainelAluno/Boletim.js`, `Boletim/Alunos.js`) tem duas funções:
  - `ExibirBoletim()` → `GetBoletim('N', 'N')` (impressao=N, cabecalho=N) — visualização na tela, sem cabeçalho.
  - `ImprimirBoletim()` → `GetBoletim('S', 'S')` (impressao=S, cabecalho=S) — mesma página, mas com `Impressao=S` no POST, carregada num **segundo iframe oculto** (`boletimImpressao`, `style="display:none"`). Esse segundo load dispara `onload="window.print()"` automaticamente.
- O usuário então usa o diálogo nativo do navegador para escolher impressora **ou "Salvar como PDF"** (um destino padrão em Chrome/Edge). Não há arquivo PDF gerado/baixado pelo backend — é inteiramente client-side.
- Busquei por geração de PDF real (iTextSharp, wkhtmltopdf, etc.) em `portal-atlas` e no repositório `processador-boletim` (que cuida de cálculo/processamento de boletim, não de documento) — não encontrei nada. Confirma que não existe um "PDF de verdade" por trás disso.

---

## Viabilidade no novo Painel

**Sim, é implementável, e com pouco esforço** — o mecanismo é 100% reaproveitável:

- O endpoint `getBoletimAcesso` (já implementado) devolve `Token`, `Identificador`, `IdAnoLetivo`, `HashEscola`, `HashSerie`, `HashTurma`, `HashAlunoEscola` — **os mesmos dados usados tanto para visualizar quanto para imprimir**. Não precisa de nenhuma mudança no backend.
- A única diferença entre "visualizar" e "imprimir/gerar PDF" é **trocar os valores `Impressao`/`Cabecalho` de `'N'` para `'S'`** no POST já existente em `ModalBoletimComponent.submeterFormularioBoletim`, e mandar esse POST para um **segundo iframe oculto** (dedicado a impressão) em vez do iframe visível — exatamente o padrão que o próprio portal-atlas já usa (`boletimVisualizacao` vs `boletimImpressao`).
- Como o `Impressao.asp` já embute `onload="window.print()"` quando `Impressao=S`, não precisamos escrever nenhuma lógica de print nós mesmos — só carregar a página certa no lugar certo.

### Proposta de implementação

1. **Frontend (`modal-boletim.component.*`):**
   - Adicionar um segundo `<iframe>` oculto (`style="display:none"`, `name="boletim-impressao"`) no template, só pra esse fluxo.
   - Adicionar um botão "Imprimir / Gerar PDF" no modal.
   - No clique, reaproveitar `submeterFormularioBoletim`, mas parametrizado para montar o form com `Impressao: 'S'`, `Cabecalho: 'S'` e `form.target = 'boletim-impressao'` — reusa o mesmo `acesso` (token/identificador/hashes) já carregado para a visualização, sem nova chamada ao backend.
2. **Backend:** nenhuma mudança necessária.
3. **portal-atlas:** nenhuma mudança necessária.

### Limitações / pontos de atenção

- **Não é um PDF "de verdade" controlado por nós** — é o diálogo de impressão do navegador. O nome do arquivo, a possibilidade de cancelar, e o destino (impressora física vs "Salvar como PDF") ficam a critério do usuário/navegador — igual ao comportamento atual do portal-atlas, então não é uma regressão, só não dá pra ter um botão "Baixar PDF" que baixa o arquivo direto sem diálogo.
- **Bloqueadores de pop-up:** como é só um iframe (não `window.open`), não deve ser bloqueado, mas vale testar — `window.print()` disparado via `onload` de iframe funciona de forma confiável nos navegadores modernos.
- **Mesma dependência de "mesmo domínio"** já documentada para a visualização (CSP `frame-ancestors`) — como a visualização já está funcionando em homolog, a impressão deve funcionar igual, já que é o mesmo mecanismo de iframe.
- Teste do ambiente local (`localhost`) terá a mesma limitação de CSP já conhecida — só testável de verdade em homolog/produção.

---

## Conclusão

Reaproveitamento quase total do que já existe; o esforço estimado é baixo (um botão + um segundo iframe oculto + parametrizar os flags já existentes). Recomendo implementar quando o usuário confirmar que quer seguir.
