# EFC-6738 — Análise técnica sobre a investigação do suporte

> Valida os 3 achados de `DiarioDeClasse-Conteudo-Investigacao.md` (investigação estática, sem acesso a banco, datada de 2026-08-13) contra o código real em `c:/projects/portal-atlas`. Repositório identificado a partir do card: `portal-atlas` (não `estrutura-pedagogica`/`documentacao-pedagogica` — esses módulos não têm `Eleva.Portal.Web`/`Eleva.Portal`).

---

## Resumo da validação

**Atualizado em 2026-09-11 com confirmação via dados reais do `ElevaPortalHomolog`** (ver seção 4).

| # | Achado do suporte | Status após conferência no código | Status após conferência no banco |
|---|---|---|---|
| 2.1 | Typo `Anotacoes` vs `AnotacoesParaAluno` em `BloquearExibicao()` (Listagem.js:300) | **Confirmado**, código idêntico ao relatado, ainda presente no HEAD atual | — (bug de front-end, não observável via dados) |
| 2.2 | `UpdateAnotacoes` apaga o registro atual quando o payload chega vazio, sem distinguir intenção | **Confirmado**, código idêntico ao relatado | **CONFIRMADO — causa raiz.** Encontrados casos reais e recentes (jun/jul-2026) de aulas cujo conteúdo foi inativado e nunca substituído |
| 2.3 | `GetPorAula` sem `OrderBy` sobre a view pode retornar linha errada se a view não filtrar por ativo | Evidência indireta reforçava a hipótese | **REFUTADO.** A view devolve exatamente 1 linha por aula, mesmo para aulas com até 97 registros de histórico inativos |

Todos os arquivos citados existem e batem linha a linha com o que o suporte reportou. Não há motivo para desconfiar da precisão da investigação estática — a única correção é que a causa raiz identificada com mais confiança mudou de 2.3 para 2.2 após checar dados reais (ver seção 4).

---

## 1. Achado 2.1 (typo no front-end) — confirmado, mas historicamente inofensivo

Conferido em `Eleva.Portal.Web/app/viewmodels/DiarioClasse/Lancamento/Listagem.js:300`:

```js
self.diarioDeClasse({ Anotacoes: '', DeverDeCasa: '' });   // deveria ser AnotacoesParaAluno
```

`git log` mostra que esse arquivo não é alterado desde **2024-08-21** (`EFC-4250`). Ou seja, esse typo é **antigo (~2 anos)**, não uma regressão recente — o que é consistente com o relato do professor descrever o sumiço a partir de 26/06 e não desde sempre: **este bug isoladamente não explica o início recente do problema**.

Concordo com a avaliação do suporte: hoje ele é mascarado porque `BloquearExibicao()` também esconde o painel (`filtroAplicado(false)`) antes que o usuário consiga salvar com o estado quebrado. Correção de baixo risco e deve ser feita, mas não é a causa raiz do sumiço relatado.

---

## 2. Achado 2.2 (apagamento silencioso em payload vazio) — confirmado, é a causa mais provável de perda **definitiva**

Conferido em `LancamentoService.cs:392-400` (`UpdateAnotacoes`) e `:416-426` (`DeveInativarAnotacaoAtual`) — código idêntico ao citado pelo suporte. `git log` mostra a última alteração em **2024-10-11**, também sem relação temporal com o início do problema em 26/06.

O comportamento é real: se `dto.AnotacoesParaAluno` chegar `null`/vazio por qualquer motivo, o registro ativo é inativado (soft delete) e nada é inserido no lugar — perda definitiva e silenciosa, sem log de auditoria do payload recebido.

**Ponto adicional não coberto pela investigação original:** como o front-end é o único cliente conhecido desse endpoint e não muda há ~2 anos, para esse cenário se manifestar friamente (bug 2.1) o usuário precisaria burlar a ocultação do painel (ex.: `Enter` no campo de texto disparando `AplicarFiltro`/algum atalho, múltiplas abas, requisição reenviada por retry de rede, etc.). Vale perguntar ao professor da Butantã se ele usa múltiplas abas do navegador ou se há algum padrão de uso incomum (ex.: deixar a tela aberta e voltar depois de muito tempo) — isso ajudaria a confirmar se 2.1→2.2 é de fato o caminho, ou se é outra fonte de payload vazio (ex.: token de sessão expirado retornando resposta inesperada que o JS trata como "salvar mesmo assim").

---

## 3. Achado 2.3 (leitura sem `ORDER BY` sobre a view) — REFUTADO com dados reais

Conferido em `ViewDiarioDeClasseRepository.cs:8-13` — `GetPorAula` de fato não tem `OrderBy`, e é consumido em `LancamentoService.GetDiarioDeClasse` (linha 328-338) com `.FirstOrDefault()`. Isso é um code smell real, mas a seção 4 abaixo mostra que **na prática não causa o sintoma relatado**, porque a view já devolve no máximo 1 linha por aula.

> Nota de processo: antes de acessar o banco, chequei o `db_map` (`_pde/db_map/schema/views.yaml`) — `ViewDiarioDeClasse` está catalogada lá (43 colunas, domínio `outros`), mas o db_map só armazena schema de colunas, não o corpo SQL da view. Não havia como confirmar a hipótese só com o db_map; segui para o MCP `sqlserver` (somente leitura, homolog) para fechar o ponto, primeiro tentando obter o texto da view.

---

## 4. Confirmação via dados reais (`ElevaPortalHomolog`, homolog, somente leitura)

### 4.1 — Não foi possível ler o texto da view (limitação de permissão, não do achado)

```sql
SELECT OBJECT_DEFINITION(OBJECT_ID('ViewDiarioDeClasse'))
```

Retornou `NULL`. Testado também via `sys.sql_modules` e repetido para outras views do mesmo banco (`ViewAlocacaoProfessores`, `ViewDisciplinaEletivaPorTurma`) — todas retornam `NULL`. Ou seja, **não é a view estar `WITH ENCRYPTION`** (`OBJECTPROPERTY(..., 'IsEncrypted') = 0`), é o usuário `mcp.readonly` que não tem permissão `VIEW DEFINITION` no banco. Não dá para ler o corpo SQL de nenhuma view por esse caminho com essas credenciais.

### 4.2 — Testei o comportamento da view diretamente com dados, e ela é determinística

Primeiro identifiquei aulas com muito histórico de inativações em `AulaEventoAnotacoes` (exatamente o padrão do achado 2.2 — dezenas de registros inativos por uma única aula):

```sql
SELECT AulaEvento, COUNT(*) AS Qtd, SUM(CASE WHEN Ativo=1 THEN 1 ELSE 0 END) AS QtdAtivos
FROM AulaEventoAnotacoes GROUP BY AulaEvento HAVING COUNT(*) > 1 ORDER BY Qtd DESC
```

Top resultado: aula com **97 registros de histórico**, sempre com exatamente 1 ativo. Consultei `ViewDiarioDeClasse` para essas mesmas aulas:

```sql
SELECT IdAula, COUNT(*), MIN(AnotacoesParaAluno), MAX(AnotacoesParaAluno)
FROM ViewDiarioDeClasse WHERE IdAula IN (4370703, 4334057, 4362856, 4350724, 4384250)
GROUP BY IdAula
```

**Resultado: exatamente 1 linha por `IdAula` em todos os casos, com o conteúdo do registro ativo.** Mesmo a aula com 97 versões no histórico devolve 1 linha só, com o texto certo. Isso **refuta diretamente o achado 2.3** — a view já filtra corretamente por ativo (internamente, mesmo sem eu conseguir ler o SQL), então o `FirstOrDefault()` sem `ORderBy` no repositório é um code smell sem efeito prático hoje.

### 4.3 — Achado 2.2 confirmado com casos reais e recentes

Busquei o cenário exato do achado 2.2: aulas com histórico de inativação e **zero registros ativos hoje** — ou seja, tiveram conteúdo, ele foi inativado, e nada foi inserido no lugar (perda definitiva e visível para o professor):

```sql
SELECT AulaEvento, COUNT(*) AS QtdHistorico
FROM AulaEventoAnotacoes
GROUP BY AulaEvento
HAVING COUNT(*) > 1 AND SUM(CASE WHEN Ativo=1 THEN 1 ELSE 0 END) = 0
```

Existem múltiplos casos. Filtrando por `DataInativacao >= '2026-06-01'` (mesma janela do relato, "dias 26/06 até a presente data") apareceram **13 aulas reais** com esse padrão, entre 2026-06-08 e 2026-07-09, por exemplo:

| AulaEvento | Conteúdo perdido (última versão ativa) | Inativado em |
|---|---|---|
| 108230757 | "Indígenas Brasileiros e seus respectivos troncos linguísticos." | 2026-06-23 22:21 |
| 108213126 | "Incas, Astecas e Maias." | 2026-06-23 22:16 |
| 103895674 | "Diferentes sensações e perspectivas" / "Experimento l introdutório" | 2026-06-29 |
| 99159939 | "Revolução copernicana e epistemologia moderna." (após correção de typo "epostemologia"→"epistemologia") | 2026-07-03 |
| 105075003 | "Aula 0: Apresentação e combinados" / "Módulo 1: Introdução ao estudo de língua" | 2026-07-09 |

Um exemplo mais antigo (`AulaEvento 84402331`, 2024-07-09) mostra o padrão com clareza: 6 registros inseridos em rajada em ~1 segundo com o **mesmo texto** ("Aula 01: Adaptação\nBrincadeiras de trilhas..."), cada um inativando o anterior — e o último (após ficar ativo por 38s) foi inativado **sem nenhuma inserção seguinte**, ficando a aula sem nenhum registro ativo até hoje. Isso é exatamente o fluxo `DeveInativarAnotacaoAtual = true` + `DeveInserirNovaAnotacao = false` do achado 2.2: um payload chegou vazio/diferente, inativou o texto existente, e nada foi salvo no lugar.

**Não localizei o caso específico citado no card** (Butantã / Matemática A / 8º Ano Regular) com esse padrão exato — as aulas dessa turma/disciplina que encontrei no homolog (16-24/06/2026) estão todas com `Ativo = true` e conteúdo presente. Isso não invalida o relato do professor: pode ser (a) outra turma/seção de Matemática na mesma escola, (b) uma aula posterior a 24/06 que ainda não está refletida nesta cópia homolog, ou (c) o professor reinseriu o conteúdo depois do sumiço original e a versão atual já está correta. De qualquer forma, o padrão do achado 2.2 está comprovadamente ativo e recente na mesma janela de tempo do relato, em outras escolas/turmas — não é uma hipótese teórica.

---

## 5. "Pode ser duplo clique?" — validado no código do front-end

Conferido `UpdateDiarioDeClasse` completo (`Listagem.js:329-355`) e o binding do botão (`Listagem.html:128`).

**Duplo clique literal (dois cliques quase simultâneos abrindo 2 requisições concorrentes) está bloqueado pelo próprio código:**

```js
self.UpdateDiarioDeClasse = function () {
   if (self.atualizando()) { return; }   // guarda de reentrância
   let dto = { IdAula: ..., AnotacoesParaAluno: ..., DeverDeCasa: ... };
   self.atualizando(true);               // setado de forma SÍNCRONA, antes do POST
   return service.UpdateDiarioDeClasse(dto).then(...)...
};
```

`self.atualizando(true)` é setado de forma síncrona, antes de qualquer `await`/callback assíncrono. Como JS é single-threaded e o Knockout processa um evento de clique por vez, um segundo clique que chegue enquanto o primeiro POST ainda está em voo **sempre** encontra `atualizando() == true` e retorna sem fazer nada — não há como dois cliques gerarem duas requisições HTTP concorrentes. Confirmei também que `plugins/http.post` (`durandal/plugins/http.js:99-108`) é um wrapper simples de `$.ajax`, sem retry automático que pudesse duplicar a chamada na camada de rede.

**Porém, o botão não tem proteção visual** — `<a data-bind="click: UpdateDiarioDeClasse">Salvar</a>` não tem `enable`/`disable`/`css` ligado a `atualizando()`. Um segundo clique durante o salvamento é silenciosamente ignorado pelo guard, mas o usuário não vê nenhum feedback disso (sem spinner, sem botão desabilitado) — o que incentiva cliques repetidos por impaciência.

**Achado mais preciso: existe, sim, uma janela de corrida real — mas não é "dois cliques ao mesmo tempo", é "um clique logo após o sucesso do anterior" — e ela liga diretamente 2.1 → 2.2:**

```js
return service.UpdateDiarioDeClasse(dto).then(function (response) {
   if (response) {
      app.alertaSucesso('Diário de classe registrado com sucesso!');
      BloquearExibicao();   // <- reseta diarioDeClasse({ Anotacoes: '', DeverDeCasa: '' }) — o typo do achado 2.1
      GetAulas();
   }
   else { return app.alertaErro(...); }
   self.atualizando(false);   // <- reabre a guarda de reentrância NA MESMA CALLBACK, logo em seguida
}).fail(function () { self.atualizando(false); });
```

Sequência possível:
1. Clique 1 salva com sucesso → dentro do `.then()`: `BloquearExibicao()` roda **primeiro**, corrompendo `diarioDeClasse` (`AnotacoesParaAluno` vira `undefined`, achado 2.1) e mandando `filtroAplicado(false)` (que deveria esconder o painel/botão); logo em seguida, na mesma função, `self.atualizando(false)` já libera a guarda de reentrância.
2. O binding `visible: filtroAplicado()` do painel (`Listagem.html:100`) depende do Knockout re-renderizar o DOM — não é instantâneo do ponto de vista do usuário. Se o professor clicar em "Salvar" de novo nesse intervalo curtíssimo (ex.: clique duplo por impaciência, já que não há feedback visual do "Salvar" anterior), a guarda `if (self.atualizando())` **já está liberada** (passo 1) e o clique passa.
3. Esse segundo `UpdateDiarioDeClasse()` lê `self.diarioDeClasse().AnotacoesParaAluno`, que agora é `undefined` (efeito do typo do achado 2.1) — reproduzindo exatamente o payload vazio do achado 2.2, e apagando o conteúdo que acabou de ser salvo com sucesso.

Isso é uma explicação **mais precisa e sustentada pelo código** do que "duplo clique gera duas requisições concorrentes" (isso está bloqueado): o mecanismo real é **um clique repetido logo após o sucesso do primeiro**, que só é perigoso por causa do typo do achado 2.1 dentro de `BloquearExibicao()`. Corrigir o typo (`Anotacoes` → `AnotacoesParaAluno`) fecha essa janela específica, mas não impede outras origens de payload vazio.

**Ressalva sobre o exemplo `AulaEvento 84402331`:** o gap de 38s entre a última inserção e a inativação final é longo demais para esse tipo de corrida de clique (que seria de milissegundos) — sugere que, nesse caso específico, a causa foi outra (ex.: o professor voltou à tela depois de um tempo e algum outro fluxo disparou `BloquearExibicao()` — trocar um filtro, reabrir a aula, etc. — deixando `diarioDeClasse` corrompido antes de um novo "Salvar"). O mecanismo de corrida acima explica bem casos de perda **imediatamente após um salvamento bem-sucedido**, mas não é a única porta de entrada para payload vazio.

---

## Avaliação geral e recomendação de prioridade (atualizada após consulta ao banco)

1. **2.2 é a causa raiz confirmada.** Há casos reais, recentes (jun/jul-2026, mesma janela do card) de aulas com conteúdo definitivamente perdido — inativado e nunca substituído. Isso não é mais hipótese, é comportamento observado nos dados.
2. **2.3 está refutado.** A view `ViewDiarioDeClasse` é determinística — devolve 1 linha por aula mesmo com dezenas de versões no histórico. O `FirstOrDefault()` sem `OrderBy` é um code smell (vale corrigir por defesa em profundidade, já que nada garante que a view sempre terá essa garantia), mas não é a causa do sintoma relatado.
3. **2.1 (typo) é o gatilho mais provável, mas via um mecanismo mais específico do que "duplo clique gera 2 requisições".** Validei no código (seção 5): duplo clique literal está bloqueado pela guarda `atualizando()`, setada de forma síncrona. O que é real é uma janela de corrida entre o sucesso de um "Salvar" (que já libera a guarda e corrompe `diarioDeClasse` via o typo, nessa ordem) e o Knockout esconder visualmente o painel — um clique repetido nesse intervalo passa pela guarda e envia `AnotacoesParaAluno: undefined`, reproduzindo o payload vazio do achado 2.2. Isso explica perdas que ocorrem **logo após um salvamento bem-sucedido**. O exemplo `AulaEvento 84402331` (gap de 38s antes da inativação final) não se encaixa nessa janela de corrida especificamente — indica que existe pelo menos mais uma via de payload vazio ainda não identificada (ex.: reabertura da aula/troca de filtro tempos depois, deixando o estado corrompido para um "Salvar" posterior).

**Próximos passos recomendados:**
1. **Corrigir o achado 2.2** — impedir que um payload vazio apague conteúdo existente sem uma ação explícita (ex.: exigir um "Limpar conteúdo" dedicado, ou pelo menos logar o payload recebido em toda inativação para auditoria/recuperação). Essa é a correção que fecha o problema independentemente da origem do payload vazio.
2. **Corrigir o typo do achado 2.1** (`Anotacoes` → `AnotacoesParaAluno` em `BloquearExibicao()`) — fecha especificamente a janela de corrida "clique logo após salvar com sucesso" descrita na seção 5.
3. Adicionar `disable`/`css` no botão "Salvar" ligado a `atualizando()`, para dar feedback visual e desencorajar cliques repetidos por impaciência (mitigação de UX, não resolve a causa raiz sozinha).
4. Opcional/defesa em profundidade: adicionar `OrderBy` determinístico em `ViewDiarioDeClasseRepository.GetPorAula`, já que hoje depende de um comportamento não documentado da view.

---

## 6. Correções aplicadas em `portal-atlas` (2026-09-11)

A pedido, implementei os 3 pontos acima (exceto o item 4, opcional) diretamente no working tree de `c:/projects/portal-atlas` (branch atual no HEAD, `git status` limpo antes de editar). **Nada foi commitado/enviado** — as mudanças estão pendentes de revisão e commit manual.

### 6.1 — Front-end: fecha a janela de corrida (typo + guarda de coerência)

`Eleva.Portal.Web/app/viewmodels/DiarioClasse/Lancamento/Listagem.js`

```diff
 function BloquearExibicao() {
    self.filtroAplicado(false);
    self.filtroVazio(false);
-   self.diarioDeClasse({ Anotacoes: '', DeverDeCasa: '' });
+   self.diarioDeClasse({ AnotacoesParaAluno: '', DeverDeCasa: '' });
 };
```

```diff
 self.UpdateDiarioDeClasse = function () {
-   if (self.atualizando()) { return; }
+   if (self.atualizando() || !self.filtroAplicado()) { return; }
```

O segundo guard é a correção mais importante da dupla: mesmo que outro bug volte a corromper `diarioDeClasse`, `UpdateDiarioDeClasse` agora só executa enquanto o painel estiver de fato aplicado/visível (`filtroAplicado() == true`). Isso fecha a janela de corrida da seção 5 (clique logo após um "Salvar" bem-sucedido) de forma robusta, e não depende só do typo estar corrigido.

`Eleva.Portal.Web/app/views/DiarioClasse/Lancamento/Listagem.html`

```diff
-<a role="button" href="#" class="btn btn-salvar" data-bind="click: UpdateDiarioDeClasse">Salvar</a>
+<a role="button" href="#" class="btn btn-salvar" data-bind="click: UpdateDiarioDeClasse, css: { disabled: atualizando }">Salvar</a>
```

Padrão `css: { disabled: flag }` já usado no próprio código-base para `<a class="btn btn-salvar">` (`NotasResultados/Exportacao.html:62`) — dá feedback visual durante o salvamento e desencoraja cliques repetidos.

### 6.2 — Back-end: elimina o "salvamento silencioso" (achado 2.2)

`Eleva.Portal/DiarioClasse/Services/LancamentoService.cs`

```diff
 private bool DeveInativarAnotacaoAtual(AulaEventoAnotacoes atual, LancamentoSaveRequest dto)
 {
    var resultado = false;
-   if (atual != null)
+   if (atual != null && !string.IsNullOrWhiteSpace(dto.AnotacoesParaAluno))
    {
       if (atual.Anotacoes != dto.AnotacoesParaAluno) { resultado = true; }
    }
    return resultado;
 }
```

Mesma mudança aplicada, por coerência, em `DeveInativarDeverDeCasaAtual`/`dto.DeverDeCasa` (mesmo padrão exato, mesma exposição ao bug, embora não fosse o campo reportado no card).

**Efeito:** um payload que chegue vazio/nulo — seja por que motivo for (corrupção de estado no front, sessão, bug futuro ainda não identificado) — deixa de conseguir inativar um conteúdo existente sem inserir nada no lugar. O registro ativo atual é preservado nesse cenário.

**Trade-off assumido (avaliar com o time/produto):** com essa mudança, o fluxo atual da tela **não tem mais como limpar um "Conteúdo"/"Atividades" já preenchido** apagando o texto do campo e clicando "Salvar" — o servidor vai ignorar silenciosamente essa tentativa e manter o valor anterior (não é mais possível gerar um estado "vazio" a partir de um estado "preenchido" por essa via). Isso segue a correção sugerida pelo próprio suporte no achado 2.2 ("exigir uma ação explícita para limpar o campo"), mas hoje a tela não tem um botão de "Limpar" dedicado — se o time considerar essa capacidade necessária, será preciso adicionar essa ação explícita separadamente (fora do escopo desta correção).

### 6.3 — O que não foi alterado

- **`ViewDiarioDeClasseRepository.GetPorAula`** (sem `OrderBy`) foi deixado como está — a seção 4.2 comprovou que não causa o sintoma hoje, e adicionar ordenação sem entender o motivo da view já ser determinística é risco desnecessário sem benefício comprovado.
- Nenhum log/auditoria de inativação foi adicionado — ficou fora do escopo pedido; se quiserem rastreabilidade adicional (para saber quantas vezes esse guard está sendo acionado em produção), é um passo futuro separado.

---

## 7. Query para levantar o impacto (`cards/EFC-6738/sql/identificar_conteudo_perdido.sql`)

Query pronta para rodar em qualquer banco com o mesmo schema (homolog ou produção) para listar todas as aulas afetadas pelo achado 2.2 — tanto no campo "Conteúdo" (`AulaEventoAnotacoes`) quanto em "Atividades/Observações" (`AulaEventoDeverDeCasa`, mesmo padrão, mesma correção aplicada). Lógica: aulas com mais de 1 versão no histórico e **zero registros ativos hoje** = conteúdo real que foi apagado e nunca substituído.

**Rodada em `ElevaPortalHomolog` (janela `>= 2026-06-01`, mesma do card):**

| Campo | Casos encontrados |
|---|---|
| Conteúdo (`AnotacoesParaAluno`) | 7 aulas, em 6 escolas diferentes |
| Atividades/Observações (`DeverDeCasa`) | 15 aulas, em 13 escolas diferentes |

Ou seja, **o problema não é isolado à Butantã** — atinge múltiplas escolas/turmas/disciplinas na mesma janela de tempo, incluindo o campo "Atividades/Observações" que não estava no relato original do card mas compartilha exatamente o mesmo bug de backend. Isso reforça a decisão de corrigir os dois campos simetricamente (seção 6.2).

> Nota: o caso específico do card (Butantã / Matemática A / 8º Ano Regular) não aparece nessa lista — segue sem confirmação direta nos dados disponíveis (ver seção 4.3).
5. Se possível, pedir ao professor da Butantã a turma/horário exato da aula afetada para cruzar com os dados e confirmar se é o mesmo padrão do achado 2.2.
