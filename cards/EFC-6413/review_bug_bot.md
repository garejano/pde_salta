
frontend/src/app/features/lancamento-frequencia/lista-presenca/lista-presenca.component.ts

  // ── Cache de alunos ───────────────────────────────────────────────────────
  private _alunosCache: ListaPresencaDocumentoTurmaData[] | null = null;
  private _alunosCacheKey = '';
@cursor
cursor Bot
1 minute ago
Unused _alunosCacheKey variable is dead code
Low Severity

_alunosCacheKey is declared and initialized but never read or written to anywhere in the component. The cache invalidation logic only uses _alunosCache = null. This appears to be a leftover from a planned cache-key validation strategy that was never implemented.



----


frontend/src/app/features/lancamento-frequencia/lista-presenca/lista-presenca.component.ts

  private openOverlay(data: ListaPresencaDocumentoTurmaData[]): void {
    this.documents = this.buildDocuments(data, this.tipoDocumento);
    this.activeConfig = { ...this.documents[0].config };
@cursor
cursor Bot
1 minute ago
Crash accessing documents[0] when data array is empty
Medium Severity

Both openOverlay and openCarometroOverlay access this.documents[0].config without checking if documents is empty. The backend returns an empty array with isSuccess = true when no turmas match (e.g., all students cancelled). This causes a runtime error when spreading undefined.config.


...nd/src/shared/document-builder/components/doc-carometro-grid/doc-carometro-grid.component.ts
const CARD_HEIGHT = 128;
const ROW_GAP = 10;
const COLS = 3;
const ROW_HEIGHT = CARD_HEIGHT + ROW_GAP;
@cursor
cursor Bot
1 minute ago
Card height constant mismatches CSS causing layout errors
Medium Severity

CARD_HEIGHT is set to 128 but the CSS .card height is 118px (with box-sizing: border-box). This makes ROW_HEIGHT equal 138 (128 + 10 gap) instead of the correct 128 (118 + 10 gap). The grid gap is effectively double-counted. This causes getRowsThatFit and all split/height calculations to overestimate row sizes, resulting in fewer carômetro cards per page than actually fit.
