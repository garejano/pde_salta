// Editar dia letivo extra — shared visual kit (Eleva Design System)
// Static, design-system-styled atoms + the modal shell used by all variations.
// Tokens come from colors_and_type.css (var(--*)). Checkbox marks use the
// product's green (--color-positive #28975A), matching the live screenshots.

const T = {
  indigo: 'var(--color-primary)',          // #242CC2
  indigoDark: 'var(--color-primary-dark1)',// #191F88
  green: 'var(--color-positive)',          // #28975A
  ink: 'var(--color-neutral-dark3)',       // #0F0F10
  ink2: 'var(--color-neutral-dark2)',      // #3D3F42
  muted: 'var(--color-neutral-dark1)',     // #65686E
  border: 'var(--color-neutral-light1)',   // #C3C8D1
  borderSubtle: 'var(--color-neutral-light2)', // #EBEDF1
  surface: 'var(--color-neutral-light3)',  // #F8F9FB
  error: 'var(--color-error)',             // #E65637
  white: '#fff',
  archivo: 'var(--font-display-family)',
  nunito: 'var(--font-body-family)',
  ui: 'var(--font-ui-family)',
};

// ── Data (from the live modal) ──────────────────────────────────────
const DISCIPLINAS = ['Arte 1','Ciências 1','Dia Lab 1','Educação Física 1','Geografia 1',
  'História 1','Inglês 1','Literatura 1','LIV 1','Matemática 1','Português 1','Prova 1','Redação 1','Zoom 1'];
const TURMAS = [
  { nome: '6º ano A', turno: 'T' }, { nome: '7º ano A', turno: 'M' },
  { nome: '8º ano A', turno: 'M' }, { nome: '9º ano A', turno: 'M' },
  { nome: '1ª série A', turno: 'M' }, { nome: '2ª série A', turno: 'M' },
  { nome: '3ª série A', turno: 'M' }, { nome: '3ª série B', turno: 'M' },
];
const SERIES_MANHA = ['7º Ano Regular','8º Ano Regular','9º Ano Regular','1ª Série Regular','2ª Série Regular','3ª Série Regular'];
const SERIES_TARDE = ['6º Ano Regular'];

// ── Atoms ───────────────────────────────────────────────────────────
const Ast = () => <span style={{ color: T.error, marginLeft: 3 }}>*</span>;

const FieldLabel = ({ children, required }) => (
  <label style={{ fontFamily: T.archivo, fontWeight: 700, fontSize: 13, color: T.ink, lineHeight: 1, display: 'block', marginBottom: 8 }}>
    {children}{required && <Ast />}
  </label>
);

// Green check box, the product's checkbox style
const Check = ({ size = 16, on = true, partial = false }) => (
  <span style={{
    width: size, height: size, borderRadius: 4, flexShrink: 0,
    border: on ? 'none' : `1.5px solid ${T.border}`,
    background: on ? T.green : T.white,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  }}>
    {on && !partial && (
      <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 16 16" fill="none">
        <path d="M3.5 8.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
    {on && partial && <span style={{ width: size * 0.5, height: 2, background: '#fff', borderRadius: 1 }} />}
  </span>
);

const CheckItem = ({ label, size = 16, on = true, strong = false, gap = 8 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap, userSelect: 'none' }}>
    <Check size={size} on={on} />
    <span style={{ fontFamily: T.nunito, fontWeight: strong ? 700 : 400, fontSize: 14, color: T.ink, whiteSpace: 'nowrap' }}>{label}</span>
  </span>
);

const Select = ({ value, filled = true }) => (
  <div style={{
    height: 40, borderRadius: 8, border: `1px solid ${T.border}`,
    background: filled ? T.surface : T.white, padding: '0 14px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  }}>
    <span style={{ fontFamily: T.nunito, fontSize: 15, color: T.ink }}>{value}</span>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 10l5 5 5-5" stroke={T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);

const DateField = ({ value }) => (
  <div style={{
    height: 40, borderRadius: 8, border: `1px solid ${T.border}`, background: T.white,
    padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  }}>
    <span style={{ fontFamily: T.nunito, fontSize: 15, color: T.ink }}>{value}</span>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </svg>
  </div>
);

const TextField = ({ value, placeholder }) => (
  <div style={{ height: 40, borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, padding: '0 14px', display: 'flex', alignItems: 'center' }}>
    <span style={{ fontFamily: T.nunito, fontSize: 15, color: value ? T.ink : T.muted }}>{value || placeholder}</span>
  </div>
);

const TextArea = ({ value, rows = 3 }) => (
  <div style={{ minHeight: 22 * rows + 22, borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, padding: '11px 14px' }}>
    <span style={{ fontFamily: T.nunito, fontSize: 15, color: T.ink }}>{value}</span>
  </div>
);

const Search = ({ placeholder = 'Buscar turma ou disciplina', width }) => (
  <div style={{ height: 40, width, borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
    <span style={{ fontFamily: T.nunito, fontSize: 14, color: T.muted }}>{placeholder}</span>
  </div>
);

// Faux scrollbar thumb (native bars are hidden inside .dc-card)
const ScrollThumb = ({ top = 8, height = 70, right = 4 }) => (
  <div style={{ position: 'absolute', top, right, width: 6, height, borderRadius: 999, background: T.border }} />
);

const Btn = ({ kind = 'ghost', children }) => {
  const styles = {
    ghost: { background: 'transparent', color: T.indigo },
    danger: { background: 'transparent', color: T.error },
    outline: { background: '#fff', color: T.indigo, boxShadow: `inset 0 0 0 1px ${T.indigo}` },
    fill: { background: T.indigo, color: '#fff' },
  };
  return (
    <span style={{
      ...styles[kind], fontFamily: T.archivo, fontWeight: 700, fontSize: 15,
      height: 44, padding: (kind === 'fill' || kind === 'outline') ? '0 22px' : '0 14px', borderRadius: 8,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap',
    }}>{children}</span>
  );
};

const CloseBtn = () => (
  <span style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.indigo} strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
  </span>
);

// Section heading inside the form ("Filtrar por turno e série")
const SectionHead = ({ children }) => (
  <div style={{ fontFamily: T.archivo, fontWeight: 700, fontSize: 15, color: T.ink, marginBottom: 12 }}>{children}</div>
);

// ── Turno + série filter block (shared) ─────────────────────────────
const TurnoSerieFilter = () => (
  <div>
    <SectionHead>Filtrar por turno e série</SectionHead>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CheckItem label="Manhã" strong />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px', paddingLeft: 26 }}>
        {SERIES_MANHA.map(s => <CheckItem key={s} label={s} />)}
      </div>
      <CheckItem label="Tarde" strong />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px', paddingLeft: 26 }}>
        {SERIES_TARDE.map(s => <CheckItem key={s} label={s} />)}
      </div>
    </div>
  </div>
);

// One expanded turma group (header checkbox + wrapped disciplines)
const TurmaGroupExpanded = ({ turma, divider = true }) => (
  <div style={{ padding: '14px 0', borderBottom: divider ? `1px solid ${T.borderSubtle}` : 'none' }}>
    <div style={{ marginBottom: 12 }}>
      <CheckItem label={`${turma.nome} - ${turma.turno}`} strong />
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 18px', paddingLeft: 26 }}>
      {DISCIPLINAS.map(d => <CheckItem key={d} label={d} />)}
    </div>
  </div>
);

// ── Summary strip — "o que foi selecionado" ─────────────────────────
const SummaryBar = ({ turmas = 8, disciplinas = 112, turnos = 2, padded = true }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10, padding: padded ? '10px 14px' : 0,
    background: padded ? 'var(--color-primary-light3)' : 'transparent', borderRadius: 8,
  }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
    <span style={{ fontFamily: T.nunito, fontSize: 14, color: T.ink2 }}>
      <b style={{ color: T.ink }}>{turmas}</b> turmas · <b style={{ color: T.ink }}>{disciplinas}</b> disciplinas · <b style={{ color: T.ink }}>{turnos}</b> turnos selecionados
    </span>
  </div>
);

// Small count pill used on collapsed accordion rows
const CountPill = ({ children }) => (
  <span style={{
    fontFamily: T.archivo, fontWeight: 700, fontSize: 12, color: T.indigo,
    background: 'var(--color-primary-light3)', borderRadius: 999, padding: '3px 10px', whiteSpace: 'nowrap',
  }}>{children}</span>
);

// ── Modal shell — pinned header + footer, scrollable body ───────────
const ModalShell = ({ title, width, height, children, footer, tabs, aboveFooter, bodyStyle = {} }) => (
  <div style={{
    width, height, background: '#fff', borderRadius: 16, overflow: 'hidden',
    boxShadow: 'var(--shadow-center-xlarge)', display: 'flex', flexDirection: 'column',
  }}>
    {/* header (fixed) */}
    <div style={{ flexShrink: 0, padding: '18px 24px', borderBottom: `1px solid ${T.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h3 style={{ margin: 0, fontFamily: T.archivo, fontWeight: 700, fontSize: 20, color: T.ink, whiteSpace: 'nowrap', flexShrink: 0 }}>{title}</h3>
      <CloseBtn />
    </div>
    {tabs}
    {/* body (scrolls) */}
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 24, position: 'relative', ...bodyStyle }}>{children}</div>
    {aboveFooter && (
      <div style={{ flexShrink: 0, padding: '12px 24px', borderTop: `1px solid ${T.borderSubtle}` }}>{aboveFooter}</div>
    )}
    {/* footer (fixed) */}
    <div style={{ flexShrink: 0, padding: '12px 20px', borderTop: aboveFooter ? 'none' : `1px solid ${T.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
      {footer}
    </div>
  </div>
);

// Small uppercase eyebrow label (panel pattern)
const Eyebrow = ({ children }) => (
  <div style={{ fontFamily: T.archivo, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.muted, marginBottom: 6 }}>{children}</div>
);

// ── Faded app shell (behind every backdrop) ─────────────────────────
const FadedAppShell = () => (
  <div style={{ position: 'absolute', inset: 0 }}>
    <div style={{ height: 56, background: '#fff', borderBottom: `1px solid ${T.borderSubtle}`, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 12 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--brand-gradient)' }} />
      <div style={{ width: 120, height: 12, borderRadius: 4, background: T.borderSubtle }} />
    </div>
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} style={{ height: 48, borderRadius: 8, background: '#fff', border: `1px solid ${T.borderSubtle}`, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 14 }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: i % 3 === 0 ? T.green : T.indigo, opacity: 0.5 }} />
          <div style={{ width: 90, height: 10, borderRadius: 4, background: T.borderSubtle }} />
          <div style={{ width: 160, height: 10, borderRadius: 4, background: T.surface }} />
        </div>
      ))}
    </div>
  </div>
);

// ── Notebook backdrop (1366×768 frame proof) ────────────────────────
const NotebookBackdrop = ({ children }) => (
  <div style={{ width: '100%', height: '100%', position: 'relative', background: T.surface, overflow: 'hidden' }}>
    <FadedAppShell />
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
  </div>
);

// ── Notebook drawer backdrop — panel anchored full-height on the right
const NotebookDrawerBackdrop = ({ children }) => (
  <div style={{ width: '100%', height: '100%', position: 'relative', background: T.surface, overflow: 'hidden' }}>
    <FadedAppShell />
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
    <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, display: 'flex' }}>{children}</div>
  </div>
);

Object.assign(window, {
  T, DISCIPLINAS, TURMAS, SERIES_MANHA, SERIES_TARDE,
  Ast, FieldLabel, Check, CheckItem, Select, DateField, TextField, TextArea, Search,
  ScrollThumb, Btn, CloseBtn, SectionHead, TurnoSerieFilter, TurmaGroupExpanded,
  SummaryBar, CountPill, Eyebrow, FadedAppShell, ModalShell, NotebookBackdrop, NotebookDrawerBackdrop,
});
