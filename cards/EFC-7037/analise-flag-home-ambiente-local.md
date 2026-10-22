# Análise — Flag de ambiente para a Home do Aluno (dev local vs. homolog/produção)

> Pedido do tech lead: em desenvolvimento local o `portal-atlas` ainda precisa de uma "Home do aluno" (mesmo que em branco, com os atalhos), porque a Home real agora vive em outro projeto (fora do `/ped`). Em homolog/produção, a rota que levaria à Home deve redirecionar para fora do portal-atlas, para `https://atlasedu.com.br` (prod) ou o equivalente de homolog, sem o prefixo `/ped`.

Esta é só uma análise — nada foi implementado ainda.

---

## 1. "Talvez já exista algo assim" — existe, parcialmente

O `portal-atlas` já tem um módulo de feature flags: `Eleva.Portal/Toggle/Services/` (`BaseToggleService`, `GoogleService`, `BolsaoService`, `DataDogService`, `HangfireService`, `NotificacaoService`, `NpsPesquisaService`). Padrão:

- Chave no `web.config` com sufixo `.Toggle` (ex.: `Bolsao.Toggle`, `GoogleClassroom.Enable.Toggle`).
- `BaseToggleService.GetToggle(string key)` lê via `ConfigurationManager.GetSection("appSettings")` + `bool.TryParse` — **se a chave não existir, retorna `false` automaticamente** (não lança exceção). Isso é relevante para o item 3.
- Um service dedicado por família de flag (ex. `IBolsaoService`/`BolsaoService`) implementando `GetToggle("Chave.Toggle")`, exposto via o facade `Domain.Toggle.<Service>`.
- Para expor ao frontend: `Eleva.Portal.Web/Views/Main/Index.cshtml` (a página que hospeda a SPA) já faz isso para outras flags, ex.:
  ```csharp
  @if (Domain.Toggle.GoogleService.TagManager())
  { ... }
  @if (Domain.Toggle.DataDogService.RUM())
  { <script>window.DD_RUM.init(...)</script> }
  ```
  e também injeta valores de config em `<meta>` tags (ex. `AvaliacoesDigitais.ApiKey`). Esse é o canal existente para passar uma config do `web.config` pro JavaScript do shell.

**Não existe hoje** uma flag específica para "este ambiente tem Home local ou não" — precisa ser criada, mas reaproveitando exatamente essa infraestrutura.

---

## 2. Como o `web.config` varia por ambiente

Descobri que `Eleva.Portal.Web/Web.config` (base) é usado **direto, sem transform**, em build Debug (dev local) — `Web.Debug.config` não mexe em `<appSettings>`.

Já `Web.Publicar.config` (produção) e `Web.PublicarHomologacao.config` (homologação) fazem:
```xml
<appSettings xdt:Transform="Replace">
  ... (lista completa e própria de appSettings, substitui tudo) ...
</appSettings>
```
Ou seja, homolog/produção **não herdam** chaves do `web.config` base — cada um define sua própria lista completa. Combinado com o "falso por omissão" do `GetToggle`, isso dá um caminho simples:

- Colocar a nova chave de toggle **só no `Web.config` base**, com `value="true"`.
- **Não precisar tocar** em `Web.Publicar.config`/`Web.PublicarHomologacao.config` para o toggle em si — como a chave não existe nos blocos `Replace` deles, `GetToggle` retorna `false` automaticamente lá.
- A URL de redirecionamento (que só importa quando o toggle é `false`, ou seja, em homolog/produção) **precisa** ser adicionada explicitamente nos dois arquivos `Replace` (não tem como "herdar" do base), com o valor correto de cada ambiente.

---

## 3. Proposta de configuração

Seguindo a convenção `.Toggle` existente:

| Chave | `Web.config` (base/local) | `Web.PublicarHomologacao.config` | `Web.Publicar.config` |
|---|---|---|---|
| `HomeAluno.Habilitada.Toggle` | `true` | `false` *(ou omitir — dá no mesmo)* | `false` *(ou omitir)* |
| `HomeAluno.UrlRedirecionamento` | *(não usada, pode omitir)* | `https://homolog.atlasedu.dev` | `https://atlasedu.com.br` |

> Recomendo deixar as duas chaves explícitas em todos os três lugares (mesmo que redundante com o comportamento de "ausente = false"), porque é o padrão visual que o resto do `web.config` já segue (ex. `GoogleClassroom.*.Toggle` aparece com `false` explícito nos três arquivos) — fica mais fácil de auditar visualmente do que confiar em omissão silenciosa.

---

## 4. Backend — novo Toggle service

Novo arquivo seguindo o padrão de `BolsaoService` (o mais simples, 1 flag só):

- `Eleva.Portal/Toggle/Services/IHomeAlunoService.cs`
  ```csharp
  public interface IHomeAlunoService : IService
  {
     bool Habilitada();
     string UrlRedirecionamento();
  }
  ```
- `Eleva.Portal/Toggle/Services/HomeAlunoService.cs`
  ```csharp
  public class HomeAlunoService : BaseToggleService, IHomeAlunoService
  {
     public bool Habilitada() => GetToggle("HomeAluno.Habilitada.Toggle");
     public string UrlRedirecionamento() => ConfigurationManager.AppSettings["HomeAluno.UrlRedirecionamento"];
  }
  ```
  (`UrlRedirecionamento` não é um toggle booleano, então lê direto do `ConfigurationManager.AppSettings`, assim como `EssayGrader.UrlBasePortal` e outras URLs de config são lidas em outros serviços do projeto — não dá pra usar `GetToggle` pra isso, só serve pra bool.)

---

## 5. Ponte para o frontend (`Index.cshtml`)

Adicionar, no mesmo estilo do bloco de `TagManager`/`DataDog`:

```razor
<script type="text/javascript">
    window.ambienteTemHome = @(Domain.Toggle.HomeAlunoService.Habilitada() ? "true" : "false");
    window.urlHomeReal = "@Domain.Toggle.HomeAlunoService.UrlRedirecionamento()";
</script>
```

---

## 6. Frontend — `shell.js`, função `AdicionarRotasDeHomes`

Hoje (`app/viewmodels/shell.js`, por volta da linha 1093):

```js
function AdicionarRotasDeHomes(rotasPermitidas) {
    if (self.PossuiPermissao('Home_Professor')) {
        rotasPermitidas.unshift(CriarRotaHome('viewmodels/Home/WelcomeProfessor', 'Home_Professor'));
    }
    else if (self.PossuiPermissao('Home_Aluno')) {
        rotasPermitidas.unshift(CriarRotaHome('viewmodels/Home/WelcomeAlunos', 'Home_Aluno'));
    }
    else if (self.PossuiPermissao('Home_AlunoSE')) {
        rotasPermitidas.unshift(CriarRotaHome('viewmodels/Home/WelcomeAlunos', 'Home_AlunoSE'));
    }
    ...
}
```

Essa função monta a lista de rotas do Durandal (`rotasPermitidas`), que depois vira `router.map(rotasPermitidas).buildNavigationModel()` — ou seja, é chamada **antes** da SPA terminar de montar as rotas, dentro do fluxo de login (`DefinicaoDeUsuarioERouter`).

Proposta: nos dois `else if` de `Home_Aluno`/`Home_AlunoSE`, checar a flag:

```js
else if (self.PossuiPermissao('Home_Aluno')) {
    if (window.ambienteTemHome) {
        rotasPermitidas.unshift(CriarRotaHome('viewmodels/Home/WelcomeAlunos', 'Home_Aluno'));
    } else {
        window.location.href = window.urlHomeReal;
        return;
    }
}
else if (self.PossuiPermissao('Home_AlunoSE')) {
    if (window.ambienteTemHome) {
        rotasPermitidas.unshift(CriarRotaHome('viewmodels/Home/WelcomeAlunos', 'Home_AlunoSE'));
    } else {
        window.location.href = window.urlHomeReal;
        return;
    }
}
```

**Ponto em aberto:** o `return` interrompe só `AdicionarRotasDeHomes` — o resto de `DefinicaoDeUsuarioERouter` (montagem de menu, etc.) continua rodando até o navegador efetivamente navegar para fora (o `window.location.href` não é instantâneo). Isso provavelmente não causa problema visível (a página vai trocar em instantes), mas é uma decisão de UX/robustez que vale confirmar: tudo bem deixar rodar mais um pouco em paralelo com a navegação saindo, ou vale um `return` mais agressivo logo em `DefinicaoDeUsuarioERouter`?

---

## 7. O que significa "mesmo com os atalhos" — achado importante

A `welcomeAlunos.js`/`welcomeAlunos.html` que eu esvaziei (a pedido anterior, quando a Home do aluno antiga foi confirmada como morta) tinha, além do dashboard completo (frequência, notas, eletivas etc.), uma seção separada e menor: **"Funcionalidades"** — um grid de atalhos rápidos (`funcionalidade0` a `funcionalidade4`) para as telas mais usadas, carregado via `GetFuncionalidadesAcessadas()` (`FuncionalidadeController.GetFuncionalidadesAcessadas`, que **continua existindo** — não foi tocado nas remoções do EFC-7037) e clicado via `window.shell.AcessarFuncionalidadePeloAtalho(...)` (função genérica do `shell.js`, também intacta).

Isso bate exatamente com "deve ser só uma tela em branco mesmo com os atalhos": a Home local não precisa do dashboard completo, só precisa manter esse grid de atalhos — que, aliás, é o único pedaço que ainda tem backend 100% funcional (não foi removido em nenhum passo do EFC-7037).

**Proposta:** ao implementar, resgatar do histórico do Git (`git show HEAD:Eleva.Portal.Web/app/viewmodels/Home/welcomeAlunos.js` / `...html`, antes do stub vazio) só a região `#region Funcionalidades` do JS e o bloco HTML correspondente (por volta das linhas 270-330 do `.html` original), e descartar o resto (dashboard de desempenho, frequência, eletivas etc., que dependem de endpoints já removidos nos passos 2-7 do EFC-7037).

---

## 8. Pontos em aberto para decidir antes de implementar

1. **Nomes de chave/variáveis** — `HomeAluno.Habilitada.Toggle` / `HomeAluno.UrlRedirecionamento` / `window.ambienteTemHome` / `window.urlHomeReal` são só uma proposta seguindo a convenção existente; posso ajustar para outro nome se preferir.
pode ser nesse formato
2. **`Home_AlunoSE`** — tratar igual a `Home_Aluno` (mesmo redirecionamento/mesma Home local)? Pela investigação dos passos anteriores, `Home_AlunoSE` já foi removido do `FuncionalidadeEnum` (não existe mais como permissão) — então esse `else if` específico já não é mais alcançável por ninguém. Only o branch de `Home_Aluno` precisa da mudança, de fato.
Home_AlunoSe nao existe, desconsidere
3. **URL de homolog exata** — usei `https://homolog.atlasedu.dev` com base na memória do projeto; confirmar se é essa mesma ou se há uma variante por rede/escola.
sim
4. **Robustez do redirecionamento** — usar `window.location.href` (navegação simples) é suficiente, ou precisa preservar algum parâmetro de deep-link/retorno?
redirecionamento simples
5. **Resgate dos "atalhos"** — confirmar que é só essa seção (Funcionalidades) que deve voltar, e não mais nada do dashboard antigo.
Nao precisa dos atalhos, so um placeholder explicando a tela em em dev local

Nenhum arquivo de código foi alterado nesta etapa — isto é só a análise pedida.
