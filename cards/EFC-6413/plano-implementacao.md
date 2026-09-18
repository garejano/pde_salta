# Plano: EFC-6413 — Documento Carômetro

## Contexto

O módulo de Frequência já possui três documentos para lista de presença (diária, semanal, mensal) gerados via uma infraestrutura `document-builder` robusta em `estrutura-pedagogica`. O carômetro é um quarto tipo de documento nessa mesma tela, com uma diferença fundamental: exibe **foto + dados de responsável** por aluno, não uma grade de datas. Isso exige:
1. Um novo componente `Splittable` que renderiza grid de cards (não linhas de tabela).
2. Um novo endpoint de backend que enriqueça os dados do aluno com URL da foto e contato do responsável.

---

## Design de Referência

- Arquivo: `cards/EFC-6413/claude-design/carometro-cards.jsx`
- **CardA** (variação "refinado clássico" — base a usar):
  - Avatar 40×40 arredondado à esquerda
  - Nome (Archivo bold 13px, 2 linhas máx.) + RA à direita
  - Linha tracejada separadora
  - Bloco do responsável: label colorido por tipo (pedagógico=primary / financeiro=secondary), nome, telefone, e-mail
  - `border: 1px solid neutral-light2`, `borderRadius: 8`, padding 10×12
- Grid: 3 colunas, gap 10px. A4 portrait: ~228px/coluna. Landscape: ~343px/coluna.

---

## Arquitetura — O Que Já Existe e Será Reaproveitado

| Existente | Localização |
|-----------|-------------|
| `DocumentBundle`, `DocumentEntry`, `DocumentConfig`, `DocHeaderData` | `frontend/src/shared/document-builder/models/` |
| `Splittable`, `LayoutComponent`, `Page` | `frontend/src/shared/document-builder/models/layout.models.ts` |
| `DocHeaderComponent`, `DocFooterComponent`, `DocumentViewerComponent`, `PrintOverlayComponent` | `frontend/src/shared/document-builder/components/` |
| `document-builder.module.ts` | `frontend/src/shared/document-builder/document-builder.module.ts` |
| `ListaPresencaComponent` (filter UI, gerarDocumento, buildBundle switch) | `frontend/src/app/features/lancamento-frequencia/lista-presenca/lista-presenca.component.ts` |
| `LancamentoFrequenciaService` | `frontend/src/app/features/lancamento-frequencia/services/lancamento-frequencia.service.ts` |
| `ListaPresencaTurmaResponse`, `CabecalhoDocumentoResponse`, `ListaPresencaDocumentoRequest` | `frontend/src/app/features/lancamento-frequencia/models.ts` |
| `ListaPresencaController` | `backend/EstruturaPedagogica.Api/Controllers/ListaPresencaController.cs` |
| `GetAlunosListaPresencaService` | `backend/EstruturaPedagogica.Domain.Services/LancamentoFrequencia/GetAlunosListaPresencaService.cs` |
| `PhotoService` (lógica SHA-256 de fotoUrl) | `frontend/src/app/components/avatar/services/photo.service.ts` |
| `ViewAlunoContato` (DB — tem `NomePedagogico`, `EmailPedagogico`, `TelefoneCelularPedagogico`, `NomeFinanceiro`, etc.) | Schema do banco |

---

## Plano de Implementação

### 1. Backend — DTOs

**Arquivo novo** (ou em `ListaPresencaDtos.cs`):
```csharp
public record CarometroAlunoResponse(
    Guid   HashPessoa,
    string NomePessoa,
    string Matricula,
    int    NumeroOrdem,
    string? FotoUrl,           // pré-computada via SHA-256
    string? ResponsavelNome,
    string? ResponsavelTelefone,
    string? ResponsavelEmail,
    string  ResponsavelTipo    // "pedagogico" | "financeiro" | "nenhum"
);

public record CarometroDocumentoTurmaData(
    ListaPresencaTurmaResponse       Turma,
    IReadOnlyList<CarometroAlunoResponse> Alunos,
    CabecalhoDocumentoResponse?      Cabecalho
);
```

### 2. Backend — Service

**Arquivo novo**: `backend/EstruturaPedagogica.Domain.Services/LancamentoFrequencia/GetAlunosCarometroService.cs`

- Reutiliza base query de `GetAlunosListaPresencaService` (alunos da turma, ordenados por NumeroOrdem).
- Adiciona LEFT JOIN com `ViewAlunoContato`:
  - Se `NomePedagogico` não nulo → responsável pedagógico (prioridade)
  - Senão → responsável financeiro (fallback)
  - Senão → `ResponsavelTipo = "nenhum"`
- Computa `FotoUrl`:
  ```csharp
  var hash = SHA256.HashData(Encoding.UTF8.GetBytes($"Ef2SbuEEKSfY8#{hashPessoa}"));
  var hex = Convert.ToHexString(hash).ToLowerInvariant();
  return $"https://picture-service.gruposaltaedu.com/aluno/{hex}.jpg?token={pseudoToken}";
  ```
  O `pseudoToken` já está disponível no contexto de autenticação (verificar como `GetAlunosListaPresencaService` usa `UsuarioService` ou `ClaimsPrincipal`).

### 3. Backend — Endpoint

Em `ListaPresencaController.cs`, adicionar:
```csharp
[HttpPost("carometro/get-alunos")]
public async Task<IActionResult> GetAlunosCarometro(
    [FromBody] ListaPresencaDocumentoRequest request)
{
    var result = await _getAlunosCarometroService.ExecuteAsync(request);
    return Ok(result);
}
```
- Mesma `[Authorize]` e verificação de `Funcionalidade` já usadas nos endpoints adjacentes.

### 4. Frontend — Novos modelos em `models.ts`

```typescript
export interface CarometroAlunoData {
  hashPessoa:          string;
  nomePessoa:          string;
  matricula:           string;
  fotoUrl:             string | null;
  responsavelNome:     string | null;
  responsavelTelefone: string | null;
  responsavelEmail:    string | null;
  responsavelTipo:     'pedagogico' | 'financeiro' | 'nenhum';
}

export interface CarometroDocumentoTurmaData {
  turma:     ListaPresencaTurmaResponse;
  alunos:    CarometroAlunoData[];
  cabecalho: CabecalhoDocumentoResponse | null;
}

export interface DocCarometroGridData {
  alunos: CarometroAlunoData[];
}
```

### 5. Frontend — `LancamentoFrequenciaService`

Adicionar método:
```typescript
getAlunosCarometro(request: ListaPresencaDocumentoRequest): Observable<...> {
  return this.api.post<CarometroDocumentoTurmaData[]>(
    'lancamentofrequencia/carometro/get-alunos', request
  );
}
```

### 6. Frontend — `DocCarometroGridComponent` (peça central)

**Pasta**: `frontend/src/shared/document-builder/components/doc-carometro-grid/`
- `doc-carometro-grid.component.ts` — implements `Splittable`
- `doc-carometro-grid.component.html` — grid 3 colunas de cards CardA
- `doc-carometro-grid.component.scss` — estilos dos cards (fiéis ao design)

**Interface `Splittable`**:
```typescript
readonly CARD_HEIGHT = 118; // px — medir empiricamente após first render
readonly COLS = 3;

getRowsThatFit(availableHeight: number): number {
  return Math.floor(availableHeight / this.CARD_HEIGHT);
}

split(rowCount: number): SplitResult {
  const cutIdx = rowCount * this.COLS;
  this.displayAlunos = this.data.alunos.slice(0, cutIdx);
  const tail = createDocCarometroGridLayoutComponent(
    this.data.alunos.slice(cutIdx)
  );
  return { headHeight: rowCount * this.CARD_HEIGHT, tail };
}
```

**Template do card** (CardA do design):
- `<img [src]="aluno.fotoUrl" (error)="showInitials($event)">` com `<div class="avatar-initials">` como fallback
- RA, nome, separador, bloco responsável com cor por tipo
- `break-inside: avoid` via CSS

Declarar e exportar em `document-builder.module.ts`.

### 7. Frontend — `lista-presenca.component.ts`

Mudanças cirúrgicas:

```typescript
// 1. Ampliar TipoDocumento
type TipoDocumento = 'diaria' | 'semanal' | 'mensal' | 'carometro';

// 2. No switch do gerarDocumento — novo branch
case 'carometro':
  this.lancamentoService.getAlunosCarometro(request).subscribe(result => {
    this.openOverlay(this.buildCarometros(result.data));
  });
  break;

// 3. Novo método buildCarometro
private buildCarometro(item: CarometroDocumentoTurmaData, ...): DocumentBundle {
  return {
    config: {
      orientation: 'portrait',
      header: { show: true, onAllPages: false },
      footer: { show: true },
      componentGap: 8,
    },
    headerData,
    label,
    entries: [{
      name: 'Carômetro',
      componentType: DocCarometroGridComponent,
      data: { alunos: item.alunos } as DocCarometroGridData,
    }],
  };
}
```

Adicionar "Carômetro" no seletor de tipo no template HTML (mesmo padrão dos outros tipos).

---

## Regras de Negócio a Garantir

- **Responsável:** pedagógico tem prioridade; fallback para financeiro; se nenhum, não exibir bloco.
- **Foto:** carregar via URL; se erro 404/403, exibir iniciais coloridas (paleta existente no frontend).
- **Grid 3 colunas:** portrait e landscape. Em landscape os cards ficam mais largos, o CARD_HEIGHT se mantém.
- **Perfis:** visibilidade de turmas idêntica à lista-presença (reutilizar lógica de `possuiVisaoCoordenacao`).
- **Paginação:** `DocCarometroGridComponent` split garante máx. ~12 alunos/página (4 linhas × 3 colunas com card ~118px em portrait A4 ~1040px útil).

---

## Verificação

1. **Backend**: chamar `POST /api/lancamentofrequencia/carometro/get-alunos` com `hashTurmas` reais via Swagger/Postman — verificar que `fotoUrl`, `responsavelNome` e `responsavelTipo` chegam preenchidos.
2. **Frontend**: selecionar tipo "Carômetro" na tela `/lancamento-frequencia/lista-presenca`, escolher turma(s), clicar "Gerar" — validar:
   - Grid 3 colunas renderizado corretamente
   - Fotos carregando (fallback para iniciais quando sem foto)
   - Responsável pedagógico exibido; fallback financeiro quando sem RP
   - Paginação: turma com >12 alunos deve gerar múltiplas páginas
   - Funciona em portrait e landscape (trocar via painel de configuração do viewer)
   - Cabeçalho (escola, CNPJ) e rodapé (paginação) presentes
