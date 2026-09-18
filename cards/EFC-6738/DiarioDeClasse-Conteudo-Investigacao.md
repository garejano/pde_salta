# Investigação — Perda do campo "Conteúdo" no Diário de Classe

**Tela:** `atlasedu.com.br/ped/#DiarioDeClasse`
**Relato:** usuários informam que, em algumas vezes, o conteúdo lançado na aula (campo "Conteúdo") desaparece.
**Data da investigação:** 2026-08-13
**Tipo:** investigação estática de código (sem acesso a banco/logs de produção nesta sessão)

---

## 1. Contexto — fluxo da funcionalidade

A tela "Diário de Classe" permite que o professor registre, por aula, dois campos de texto livre:

- **Conteúdo** → armazenado como `AnotacoesParaAluno`
- **Atividades/Observações** → armazenado como `DeverDeCasa`

### Caminho de leitura
`GetDiarioDeClasse` (tela) → `DiarioClasse_LancamentoController.GetDiarioDeClasse` → `LancamentoService.GetDiarioDeClasse` → `ViewDiarioDeClasseRepository.GetPorAula(idAula)` → view de banco `ViewDiarioDeClasse` (mapeada em `ViewDiarioDeClasseMap.cs`, `Mutable(false)`) → `.FirstOrDefault()`.

### Caminho de escrita
"Salvar" (tela) → `DiarioClasse_LancamentoController.UpdateDiarioDeClasse` → `LancamentoService.UpdateDiarioDeClasse` → `UpdateAnotacoes` / `UpdateDeverDeCasa`, que operam diretamente sobre as tabelas base (`AulaEventoAnotacoes`, `AulaEventoDeverDeCasa`), usando um padrão de **histórico com soft delete**: a cada alteração, o registro atual é inativado (`ControleDeEstado.RegistrarInativacao`) e um novo registro ativo é inserido.

### Arquivos envolvidos

| Camada | Arquivo |
|---|---|
| View (SPA) | `Eleva.Portal.Web/app/views/DiarioClasse/Lancamento/Listagem.html` |
| Viewmodel (SPA) | `Eleva.Portal.Web/app/viewmodels/DiarioClasse/Lancamento/Listagem.js` |
| Service (SPA) | `Eleva.Portal.Web/app/services/DiarioClasse.Lancamento.js` |
| Controller | `Eleva.Portal.Web/Controllers/DiarioClasse_LancamentoController.cs` |
| Service (domínio) | `Eleva.Portal/DiarioClasse/Services/LancamentoService.cs` |
| Repositório (leitura) | `Eleva.Portal/DiarioClasse/Repositories/ViewDiarioDeClasseRepository.cs` |
| Repositório (escrita) | `Eleva.Portal/DiarioClasse/Repositories/AulaEventoAnotacoesRepository.cs` |
| DTOs | `Eleva.Portal/DiarioClasse/DTO/LancamentoSaveRequest.cs`, `LancamentoGetResponse.cs` |

---

## 2. Achados

### 2.1 — Bug confirmado: chave de propriedade errada ao limpar o estado da tela (front-end)

**Arquivo:** `Eleva.Portal.Web/app/viewmodels/DiarioClasse/Lancamento/Listagem.js:300`

```js
function BloquearExibicao() {
   self.filtroAplicado(false);
   self.filtroVazio(false);
   self.diarioDeClasse({ Anotacoes: '', DeverDeCasa: '' });   // <-- deveria ser AnotacoesParaAluno
};
```

Em todo o restante do arquivo a propriedade usada é `AnotacoesParaAluno` (linhas 311-313, 320, 335). O campo "Conteúdo" no HTML está vinculado a `diarioDeClasse().AnotacoesParaAluno` (`Listagem.html:111`), então, sempre que `BloquearExibicao()` é executado, `diarioDeClasse().AnotacoesParaAluno` passa a ser `undefined` (o objeto tem a chave `Anotacoes`, não `AnotacoesParaAluno`).

**Por que hoje isso normalmente não é visível:** `BloquearExibicao()` também seta `filtroAplicado(false)` na mesma chamada, o que oculta o painel (`data-bind="visible: filtroAplicado()"` em `Listagem.html:100`). Como as atualizações do Knockout são síncronas, o painel some antes que o usuário consiga clicar em "Salvar" com o estado corrompido — nas condições atuais isso é um defeito real, porém de baixo risco direto de perda de dado.

**Risco:** é um estado inconsistente que fica "escondido" atrás de outra proteção (visibilidade do painel). Qualquer mudança futura nesse fluxo (ex.: exibir o painel de outra forma, permitir salvar via teclado, etc.) pode expor esse `undefined` e fazer com que um "Salvar" envie o campo vazio para o servidor.

**Correção sugerida:** trocar `Anotacoes` por `AnotacoesParaAluno` na linha 300.

---

### 2.2 — Risco de design: o servidor apaga o conteúdo anterior sempre que recebe o campo vazio, sem distinguir intenção do usuário

**Arquivo:** `Eleva.Portal/DiarioClasse/Services/LancamentoService.cs`

```csharp
// linha 354 em diante
public void UpdateDiarioDeClasse(LancamentoSaveRequest dto)
{
   ...
   if (string.IsNullOrWhiteSpace(dto.AnotacoesParaAluno)) { dto.AnotacoesParaAluno = null; }
   else { dto.AnotacoesParaAluno = dto.AnotacoesParaAluno.Trim(); }
   ...
   UpdateAnotacoes(aulaEvento, dto);
   ...
}

// linha 392
private void UpdateAnotacoes(AulaEvento aulaEvento, LancamentoSaveRequest dto)
{
   var atual = Domain.DiarioClasse.AulaEventoAnotacoesRepository
              .GetPorAulaDisponivelParaAluno(dto.IdAula, true)
              .FirstOrDefault();

   if (DeveInativarAnotacaoAtual(atual, dto)) { InativarAnotacaoAtual(atual); }
   if (DeveInserirNovaAnotacao(atual, dto)) { InserirNovaAnotacao(aulaEvento, dto); }
}
```

```csharp
// linha 416 — decide se inativa o registro atual
private bool DeveInativarAnotacaoAtual(AulaEventoAnotacoes atual, LancamentoSaveRequest dto)
{
   var resultado = false;
   if (atual != null)
   {
      if (atual.Anotacoes != dto.AnotacoesParaAluno) { resultado = true; }
   }
   return resultado;
}

// linha 53 — decide se insere um novo registro
private bool DeveInserirNovaAnotacao(AulaEventoAnotacoes atual, LancamentoSaveRequest nova)
{
   var resultado = false;
   if (!string.IsNullOrWhiteSpace(nova.AnotacoesParaAluno))
   {
      if (atual == null) { resultado = true; }
      else if (atual.Anotacoes != nova.AnotacoesParaAluno) { resultado = true; }
   }
   return resultado;
}
```

**O problema:** se `dto.AnotacoesParaAluno` chegar vazio/nulo ao servidor — seja porque o usuário de fato limpou o campo, seja por **qualquer outro motivo** (bug de front-end como o item 2.1, estado não carregado corretamente, uma requisição disparada com o objeto errado, etc.) — o comportamento é:

1. `DeveInativarAnotacaoAtual` → `true` (o texto atual é diferente de vazio) → o registro existente é inativado (soft delete).
2. `DeveInserirNovaAnotacao` → `false` (o novo valor é vazio) → nada é inserido no lugar.

**Resultado: o conteúdo anteriormente salvo é apagado silenciosamente, sem nenhuma confirmação, aviso ou distinção entre "o usuário quis limpar o campo" e "o campo chegou vazio por engano".** Esse é, na avaliação técnica, o ponto mais provável para explicar uma perda real e definitiva do conteúdo no banco.

**Correção sugerida (a discutir com o time):** exigir uma ação explícita para limpar o campo (ex.: um botão "Limpar" dedicado), ou registrar em log/auditoria toda inativação motivada por payload vazio, incluindo o payload recebido, para permitir diagnóstico e recuperação futura.

---

### 2.3 — Hipótese não confirmada: leitura sem ordenação determinística sobre a view

**Arquivo:** `Eleva.Portal/DiarioClasse/Repositories/ViewDiarioDeClasseRepository.cs:8`

```csharp
public IQueryable<ViewDiarioDeClasse> GetPorAula(int idAula)
{
   IQueryable<ViewDiarioDeClasse> queryable = Queryable().Where(q => q.IdAula == idAula);
   return queryable;
}
```

Usado em `LancamentoService.GetDiarioDeClasse` (linha 328) com `.FirstOrDefault()`, **sem `OrderBy`**.

`ViewDiarioDeClasse` é uma view de banco (`Mutable(false)`), cujo script **não está versionado neste repositório** — não foi possível localizar a definição SQL para confirmar como ela junta `AulaEventoAnotacoes`/`AulaEventoDeverDeCasa` por aula.

**Hipótese:** se essa view não filtrar estritamente pelo registro ativo (`ControleDeEstado.Ativo = 1`) e puder retornar mais de uma linha por aula (por exemplo, incluindo o histórico de versões antigas/inativadas geradas pelo padrão de update descrito no item 2.2), um `SELECT TOP 1` sem `ORDER BY` não garante qual linha volta. Isso poderia explicar um comportamento **intermitente** ("às vezes some") sem que o dado tenha sido de fato apagado — o professor veria o campo vazio ao reabrir a aula, mesmo com o conteúdo ainda presente (porém inativo/antigo) no banco.

**Por que não foi confirmado:** não há acesso ao banco de dados nesta sessão de investigação (conexão com `pegasus.eleva.local` indisponível) e o script da view não está no repositório de código.

**Ação necessária:** um dev com acesso ao banco deve obter a definição da view (`sp_helptext` / `OBJECT_DEFINITION` sobre `ViewDiarioDeClasse`) e confirmar se ela filtra por registro ativo e se garante uma linha única por aula.

---

## 3. Resumo e prioridade sugerida

| # | Achado | Confiança | Impacto se confirmado |
|---|---|---|---|
| 2.2 | Update apaga conteúdo anterior quando o payload chega vazio, sem distinção de intenção | Confirmado no código | Alto — perda real e definitiva de dado |
| 2.3 | Leitura via `FirstOrDefault()` sem `ORDER BY` sobre view com possível histórico | Hipótese, não confirmada (falta acesso à view no banco) | Alto — explica o padrão "intermitente" relatado |
| 2.1 | Typo `Anotacoes`/`AnotacoesParaAluno` em `BloquearExibicao()` | Confirmado no código | Baixo hoje (mascarado pela ocultação do painel), mas é um estado inconsistente que deve ser corrigido |

**Sugestão de próximos passos para o time de dev:**

1. Obter a definição da view `ViewDiarioDeClasse` no banco e validar a hipótese do item 2.3.
2. Corrigir o typo do item 2.1.
3. Decidir e implementar uma salvaguarda para o cenário do item 2.2 (ex.: log de auditoria em toda inativação, ou impedir que um payload vazio apague conteúdo sem uma ação explícita do usuário).
4. Se possível, levantar nos logs de aplicação/banco casos reais reportados pelos usuários (aula + data/hora) para cruzar com o histórico de `AulaEventoAnotacoes` (registros inativados) e confirmar qual dos cenários acima efetivamente ocorreu.
