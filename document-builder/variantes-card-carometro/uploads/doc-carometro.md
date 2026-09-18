# Documento: Carômetro

Repositório: `estrutura-pedagogica`

---

## O que é

O carômetro é um documento para impressão que exibe os alunos de uma turma em um grid de cards (3 colunas). Cada card mostra foto (ou avatar com iniciais colorido), nome, matrícula (RA) e dados do responsável.

---

## Rota de exemplo

`/exemplos/carometro` — abre o documento já renderizado ao entrar na rota, com 28 alunos mockados.

**Arquivo:** `src/app/features/exemplos/carometro-exemplo/carometro-exemplo.component.ts`

- É um componente standalone registrado em `ExemplosModule` e `ExemplosRoutingModule`
- Abre `showOverlay = true` no `ngOnInit()`
- Usa `header: { show: true, onAllPages: false }` — DocHeader só na p.1
- Usa `nextHeaderEntries: [DocCarometroInfoComponent]` — cabeçalho compacto nas p.2+
- Mock com 28 alunos sem fotos reais (`fotoUrl: null`)

---

## Componentes do document-builder

### `DocCarometroGridComponent`

**Caminho:** `src/shared/document-builder/components/doc-carometro-grid/`

Implementa `Splittable` — quebra automaticamente entre páginas por linhas de 3 cards.

```typescript
export interface DocCarometroGridData {
  alunos: CarometroAlunoData[];
}
```

Constantes de layout:
- `CARD_HEIGHT = 180` — altura de cada card em px
- `ROW_GAP = 10` — espaço entre linhas
- `COLS = 3` — colunas por linha
- `ROW_HEIGHT = 190` — `CARD_HEIGHT + ROW_GAP`

Avatar: quando `fotoUrl` está disponível, exibe a imagem; quando não, gera iniciais com cor determinística por hash do nome (paleta de 8 cores).

### `DocCarometroInfoComponent`

**Caminho:** `src/shared/document-builder/components/doc-carometro-info/`

Componente compacto de identificação usado como `nextHeaderEntries` nas páginas 2+. Reutiliza a interface `DocPresencaInfoData`:

```typescript
// de document-config.ts
interface DocPresencaInfoData {
  tipo: string    // ex: 'Carômetro'
  turma: string   // ex: '9º Ano A — Manhã'
  dateLabel?: string
}
```

---

## Modelo de dados

```typescript
// src/app/features/lancamento-frequencia/models.ts
interface CarometroAlunoData {
  hashPessoa:          string;
  nomePessoa:          string;
  matricula:           string;
  fotoUrl?:            string | null;
  responsavelNome:     string | null;
  responsavelTelefone: string | null;
  responsavelEmail:    string | null;
  responsavelTipo:     'pedagogico' | 'financeiro' | 'nenhum';
}
```

---

## Como construir o DocumentBundle

```typescript
const bundle: DocumentBundle = {
  config: {
    orientation: 'portrait',
    header: { show: true, onAllPages: false },   // DocHeader só na p.1
    footer: { show: true },                       // DocFooter em todas
    componentGap: 8,
    nextHeaderEntries: [
      {
        componentType: DocCarometroInfoComponent,
        data: { tipo: 'Carômetro', turma: '9º Ano A — Manhã' } as DocPresencaInfoData,
      },
    ],
  },
  headerData: { institutionName: 'Nome da Escola', ... },
  label: '9º Ano A — Manhã',
  entries: [
    {
      name: 'Carômetro',
      componentType: DocCarometroGridComponent,
      data: { alunos } as DocCarometroGridData,
    },
  ],
};
```

---

## Uso em produção — `lista-presenca`

**Arquivo:** `src/app/features/lancamento-frequencia/lista-presenca/lista-presenca.component.ts`

Método: `gerarCarometro()` — chama `lancamentoService.getAlunosCarometro(request)`, carrega fotos via `PhotoService.getPhotoUrl(hashPessoa)`, e abre o overlay.

`buildCarometro(item)` também inclui `DocCarometroInfoComponent` como primeiro entry regular (aparece na p.1 abaixo do header institucional) **e** como `nextHeaderEntries` (aparece compacto nas p.2+).

---

## Resumo rápido para próxima sessão de IA

- **Rota exemplo:** `exemplos/carometro` — standalone, abre automaticamente
- **Grid:** `DocCarometroGridComponent` — Splittable, 3 colunas, `data: { alunos: CarometroAlunoData[] }`
- **Cabeçalho compacto p.2+:** `DocCarometroInfoComponent` — via `nextHeaderEntries`, `data: DocPresencaInfoData`
- **Dados dos alunos:** `CarometroAlunoData` em `src/app/features/lancamento-frequencia/models.ts`
- **Fotos:** carregadas assincronamente via `PhotoService.getPhotoUrl(hashPessoa)` antes de abrir overlay
- **Backend (produção):** `POST /lancamentofrequencia/lista-presenca/carometro/get-alunos` → `CarometroDocumentoTurmaData[]`
- **Service:** `LancamentoFrequenciaService.getAlunosCarometro()`



## Planejamento de variantes para o card do aluno

### Contexto

O carômetro tem como objetivo principal permitir que funcionários da escola identifiquem alunos rapidamente pela foto. A foto é o elemento primário; os dados textuais (nome, RA, responsável) são secundários.

**Restrições de layout:**
- Grid: 3 colunas em folha A4 portrait
- Largura aproximada de cada card: ~241px (considerando margens e gaps)
- Altura máxima viável por card para 4 linhas por página: ~220px

**Dados de nome levantados do banco (ano letivo 2026, 258.965 alunos):**

| Qtd. palavras | Qtd. alunos | Máx. chars |
|---|---|---|
| 1–2 | 5.020 | 16 |
| 3 | 57.593 | 27 |
| 4 | 73.239 | 35 |
| 5 | 70.531 | 35 |
| 6 | 50.742 | 42 |
| 7+ | 1.840 | 69 |

- **Média:** 4 palavras / 25 caracteres
- **Pico (95%+ dos alunos):** até 6 palavras / 42 chars
- **Extremos:** até 11 palavras / 69 chars (raro — ~2 casos)
- **RA:** numérico, até 10 dígitos

### Campos nulos — regra geral

Para todos os campos que podem ser `null` (RA, nome do responsável, telefone, e-mail), exibir o label `—` ou `N/A` no lugar. O label deve ter a mesma posição e espaço que o valor preenchido, garantindo que todos os cards tenham a mesma altura independentemente dos dados.

---

### Variante A — Foto no topo, empilhada (Photo-First Stack)

**Conceito:** a foto/avatar ocupa o topo centralizado do card, com tamanho generoso. Abaixo, as informações textuais em blocos verticais compactos.

**Distribuição interna (de cima para baixo):**
1. **Foto/avatar** — 90×90px, centralizado, formato circular ou quadrado com bordas arredondadas (12px). Ocupa ~50% da altura do card.
2. **Nome** — negrito, fonte ~12px, centralizado, máximo 2 linhas com ellipsis na terceira (cobre 99%+ dos casos até 6 palavras). Fonte reduzida automaticamente para nomes com 7+ palavras.
3. **RA** — label `RA` em cinza claro + valor numérico em monoespaçado. Se null: `RA — N/A`.
4. **Responsável** — linha simples: ícone de tipo (pedagógico/financeiro) + nome truncado em 1 linha. Se null: `Responsável — N/A`.

**Prós:** hierarquia visual clara, foto dominante, leitura de cima para baixo natural.  
**Contras:** nomes muito longos pressionam o espaço vertical; com 7+ palavras o nome pode comprimir a foto ou vazar.

---

### Variante B — Foto lateral retrato (ID Card)

**Conceito:** inspirado em carteiras de identidade. A foto ocupa toda a altura esquerda do card em formato retrato (3:4). O lado direito contém as informações textuais.

**Distribuição interna:**
- **Esquerda (~80px de largura):** foto/avatar em formato retrato 80×110px. Ocupa toda a altura do card com `object-fit: cover`. Sem bordas arredondadas na lateral interna (integra com o card).
- **Direita (restante ~155px):** coluna vertical com:
  1. Nome — 2 linhas máximo, negrito, fonte 11–12px, alinhado à esquerda.
  2. RA — linha compacta, fonte 10px cinza.
  3. Separador fino.
  4. Tipo de responsável (badge pequeno: "Pedagógico" / "Financeiro" / "Nenhum").
  5. Nome do responsável — 1 linha, truncado.
  6. Telefone — 1 linha.
  7. E-mail — 1 linha, truncado.

**Prós:** maximiza a área da foto sem crescer em altura; encaixa 4 linhas×3 colunas = 12 cards por página facilmente; espaço generoso para texto à direita.  
**Contras:** foto retrato não é o formato natural de fotos de escola (que tendem a ser quadradas ou busto). Avatar com iniciais fica estreito.

---

### Variante C — Foto herói (Banner Top)

**Conceito:** a foto ocupa toda a largura do card no topo como banner. Abaixo, uma área compacta de texto.

**Distribuição interna (de cima para baixo):**
1. **Foto/avatar** — largura total do card (~241px), altura fixa 110–120px, `object-fit: cover; object-position: top center` (foca no rosto). Borda arredondada no topo (8px).
2. **Nome** — negrito, 11–12px, máximo 2 linhas, padding horizontal de 8px.
3. **RA** — fonte 10px, cinza, 1 linha.
4. **Responsável** — nome do responsável + telefone em 1–2 linhas compactas, fonte 10px.

**Card total:** ~220–230px de altura. Cabe 4 linhas por página (4×230 + 3×10 = 950px, dentro da área útil).

**Prós:** foto é literalmente a metade do card, impossível ignorar. Visual moderno, similar a cards de redes sociais.  
**Contras:** crop horizontal pode cortar cabeça em fotos mal enquadradas. Avatar com iniciais em banner wide fica visualmente estranho — precisaria de um tratamento especial (fundo colorido com iniciais grandes e centralizadas).

---

### Variante D — Foto grande centralizada, informações mínimas (Foto Máxima)

**Conceito:** reduz ao mínimo o espaço textual para maximizar a foto. Funciona melhor quando o objetivo é reconhecimento visual puro — funcionários que já conhecem os nomes usam o carômetro para confirmar, não para aprender.

**Distribuição interna:**
1. **Foto/avatar** — 100×100px circular, centralizado, com 8px de margem em todos os lados.
2. **Nome** — negrito, 11px, centralizado, máximo 3 linhas (cobre 100% dos nomes).
3. **RA** — 1 linha, fonte 10px, cinza.
4. **Responsável** — apenas o nome (sem telefone/e-mail). Se null: `N/A`.

Telefone e e-mail são omitidos — quem quiser contato usa outro canal.

**Prós:** foto domina completamente; card mais limpo e fácil de varrer visualmente.  
**Contras:** perde informações de contato; pode não servir para gestores que usam o carômetro para reuniões com pais.

---

### Variante E — Foto + dados de contato em tooltip/rodapé expansível (Híbrida)

**Conceito:** combina foto grande com dados de contato acessíveis, mas sem poluição visual. Os dados de contato ficam em uma segunda "camada" do card que, na impressão, é compacta.

**Distribuição para impressão:**
1. **Metade superior (foto):** foto/avatar 90×90px centralizada, fundo colorido suave.
2. **Nome:** negrito, 12px, 2 linhas max.
3. **RA:** 1 linha compacta.
4. **Bloco de contato** (fundo levemente diferente, separado por linha fina):
   - Ícone de pessoa + nome responsável (1 linha) | `N/A`
   - Ícone de telefone + número | `N/A`
   - Ícone de e-mail + endereço truncado | `N/A`

O bloco de contato tem padding reduzido e fonte 10px, tornando-o visualmente subordinado à foto sem ser omitido.

**Prós:** mantém todos os dados; hierarquia visual clara pela segmentação do bloco.  
**Contras:** card ligeiramente mais alto (~200–210px); e-mail em fonte 10px pode ser difícil de ler na impressão.

---

### Recomendação para prototipação

Priorizar **Variante A** (simples, alinhada com o padrão atual) e **Variante C** (foto herói, maior impacto visual) para validação com usuários. A Variante B (ID card) é interessante se as fotos forem majoritariamente disponíveis — com avatar de iniciais fica visualmente desequilibrada.
