// Editar dia letivo extra — Duas colunas (protótipo interativo)
const { useState, useMemo, useRef } = React;

const C = {
  indigo: '#242CC2', indigoDark: '#191F88', indigoPress: '#0E137A',
  green: '#28975A', greenDark: '#007722',
  ink: '#0F0F10', ink2: '#3D3F42', muted: '#65686E',
  border: '#C3C8D1', borderSub: '#EBEDF1', surface: '#F8F9FB',
  error: '#E65637', indigoLight: '#ECEDFF',
  archivo: "'Archivo','Inter',system-ui,sans-serif",
  nunito: "'Nunito','Inter',system-ui,sans-serif",
};

const DISCIPLINAS = ['Arte 1','Ciências 1','Dia Lab 1','Educação Física 1','Geografia 1',
  'História 1','Inglês 1','Literatura 1','LIV 1','Matemática 1','Português 1','Prova 1','Redação 1','Zoom 1'];
const TURMAS = [
  { id: 't1', nome: '6º ano A', turno: 'T' }, { id: 't2', nome: '7º ano A', turno: 'M' },
  { id: 't3', nome: '8º ano A', turno: 'M' }, { id: 't4', nome: '9º ano A', turno: 'M' },
  { id: 't5', nome: '1ª série A', turno: 'M' }, { id: 't6', nome: '2ª série A', turno: 'M' },
  { id: 't7', nome: '3ª série A', turno: 'M' }, { id: 't8', nome: '3ª série B', turno: 'M' },
];
const SERIES = {
  'Manhã': ['7º Ano Regular','8º Ano Regular','9º Ano Regular','1ª Série Regular','2ª Série Regular','3ª Série Regular'],
  'Tarde': ['6º Ano Regular'],
};

// ── Checkbox (interactive, green, indeterminate) ────────────────────
function Check({ state = 'on', size = 18, onClick }) {
  const filled = state !== 'off';
  return (
    <span onClick={onClick} style={{
      width: size, height: size, borderRadius: 4, flexShrink: 0, cursor: 'pointer',
      border: filled ? 'none' : `1.5px solid ${C.border}`,
      background: filled ? C.green : '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 120ms, border-color 120ms',
    }}>
      {state === 'on' && (
        <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 16 16" fill="none">
          <path d="M3.3 8.4l3 3 6.2-6.6" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {state === 'partial' && <span style={{ width: size * 0.48, height: 2.2, background: '#fff', borderRadius: 2 }} />}
    </span>
  );
}

function CheckRow({ label, state, onToggle, strong, size = 18 }) {
  return (
    <label onClick={onToggle} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, cursor: 'pointer', userSelect: 'none' }}>
      <Check state={state} size={size} />
      <span style={{ fontFamily: C.nunito, fontWeight: strong ? 700 : 400, fontSize: 14, color: C.ink, whiteSpace: 'nowrap' }}>{label}</span>
    </label>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label style={{ fontFamily: C.archivo, fontWeight: 700, fontSize: 13, color: C.ink, display: 'block', marginBottom: 8 }}>
      {children}{required && <span style={{ color: C.error, marginLeft: 3 }}>*</span>}
    </label>
  );
}

// ── Form controls ───────────────────────────────────────────────────
function Field({ children, focus, onFocus, onBlur, style }) {
  return (
    <div style={{
      height: 40, borderRadius: 8, background: '#fff', padding: '0 14px',
      border: `1px solid ${focus ? C.indigo : C.border}`,
      boxShadow: focus ? '0 0 0 3px rgba(36,44,194,0.24)' : 'none',
      display: 'flex', alignItems: 'center', transition: 'border-color 160ms, box-shadow 160ms', ...style,
    }}>{children}</div>
  );
}

function SelectEscola({ value, onChange, allowEmpty }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <Field focus={f} style={{ background: C.surface, padding: 0 }}>
        <select value={value} onChange={e => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)}
          style={{ appearance: 'none', WebkitAppearance: 'none', border: 0, outline: 0, background: 'transparent',
            width: '100%', height: '100%', padding: '0 38px 0 14px', fontFamily: C.nunito, fontSize: 15, color: value ? C.ink : C.muted, cursor: 'pointer' }}>
          {allowEmpty && <option value="">Selecione uma escola</option>}
          <option>Kobrasol</option><option>Centro</option><option>Beira-Mar</option><option>Estreito</option>
        </select>
      </Field>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', right: 12, top: 11, pointerEvents: 'none' }}>
        <path d="M7 10l5 5 5-5" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
}

function DateInput({ value, onChange }) {
  const [f, setF] = useState(false);
  return (
    <Field focus={f}>
      <input type="date" value={value} onChange={e => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ border: 0, outline: 0, background: 'transparent', width: '100%', fontFamily: C.nunito, fontSize: 15, color: C.ink }} />
    </Field>
  );
}

function TextInput({ value, onChange, placeholder }) {
  const [f, setF] = useState(false);
  return (
    <Field focus={f}>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ border: 0, outline: 0, background: 'transparent', width: '100%', fontFamily: C.nunito, fontSize: 15, color: C.ink }} />
    </Field>
  );
}

function TextAreaInput({ value, onChange, rows = 2 }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ borderRadius: 8, background: '#fff', padding: '9px 14px',
      border: `1px solid ${f ? C.indigo : C.border}`, boxShadow: f ? '0 0 0 3px rgba(36,44,194,0.24)' : 'none', transition: 'border-color 160ms, box-shadow 160ms' }}>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ border: 0, outline: 0, background: 'transparent', width: '100%', resize: 'none', fontFamily: C.nunito, fontSize: 15, color: C.ink, lineHeight: '22px', display: 'block' }} />
    </div>
  );
}

function SearchInput({ value, onChange }) {
  const [f, setF] = useState(false);
  return (
    <Field focus={f} style={{ flex: 1, minWidth: 180 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder="Buscar turma ou disciplina" onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ border: 0, outline: 0, background: 'transparent', width: '100%', marginLeft: 8, fontFamily: C.nunito, fontSize: 14, color: C.ink }} />
      {value && <span onClick={() => onChange('')} style={{ cursor: 'pointer', display: 'flex' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></span>}
    </Field>
  );
}

function Button({ kind = 'fill', children, onClick, disabled }) {
  const [h, setH] = useState(false);
  const palette = {
    ghost: { bg: h ? C.borderSub : 'transparent', col: C.indigo },
    danger: { bg: h ? '#FBE9E4' : 'transparent', col: C.error },
    fill: { bg: h ? C.indigoDark : C.indigo, col: '#fff' },
  }[kind];
  const sty = disabled ? { bg: '#EBEDF1', col: '#ADB2BA' } : palette;
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ fontFamily: C.archivo, fontWeight: 700, fontSize: 15, height: 44,
        padding: kind === 'fill' ? '0 24px' : '0 16px', borderRadius: 8, border: '1px solid transparent',
        background: sty.bg, color: sty.col, cursor: disabled ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', transition: 'background 140ms' }}>
      {children}
    </button>
  );
}

// ════════════════════════════════════════════════════════════════════
function Modal({ mode }) {
  const isCreate = mode === 'create';
  const [escola, setEscola] = useState(isCreate ? '' : 'Kobrasol');
  const [data, setData] = useState(isCreate ? '' : '2026-02-16');
  const [titulo, setTitulo] = useState(isCreate ? '' : 'Carnaval');
  const [descricao, setDescricao] = useState(isCreate ? '' : 'Carnaval');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(false);
  const unlocked = !isCreate || escola !== '';

  // série selection — Set of "Turno::Série"
  const allSerieKeys = useMemo(() => Object.entries(SERIES).flatMap(([t, arr]) => arr.map(s => `${t}::${s}`)), []);
  const [series, setSeries] = useState(() => isCreate ? new Set() : new Set(allSerieKeys));

  // discipline selection — Set of "turmaId::disciplina"
  const allDiscKeys = useMemo(() => TURMAS.flatMap(t => DISCIPLINAS.map(d => `${t.id}::${d}`)), []);
  const [disc, setDisc] = useState(() => isCreate ? new Set() : new Set(allDiscKeys));

  // ── série helpers ──
  const turnoState = (turno) => {
    const ks = SERIES[turno].map(s => `${turno}::${s}`);
    const on = ks.filter(k => series.has(k)).length;
    return on === 0 ? 'off' : on === ks.length ? 'on' : 'partial';
  };
  const toggleTurno = (turno) => setSeries(prev => {
    const ks = SERIES[turno].map(s => `${turno}::${s}`);
    const all = ks.every(k => prev.has(k));
    const n = new Set(prev); ks.forEach(k => all ? n.delete(k) : n.add(k)); return n;
  });
  const toggleSerie = (turno, s) => setSeries(prev => {
    const k = `${turno}::${s}`; const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n;
  });

  // ── discipline helpers ──
  const turmaState = (tid) => {
    const ks = DISCIPLINAS.map(d => `${tid}::${d}`);
    const on = ks.filter(k => disc.has(k)).length;
    return on === 0 ? 'off' : on === ks.length ? 'on' : 'partial';
  };
  const toggleTurma = (tid) => setDisc(prev => {
    const ks = DISCIPLINAS.map(d => `${tid}::${d}`);
    const all = ks.every(k => prev.has(k));
    const n = new Set(prev); ks.forEach(k => all ? n.delete(k) : n.add(k)); return n;
  });
  const toggleDisc = (tid, d) => setDisc(prev => {
    const k = `${tid}::${d}`; const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n;
  });
  const allOn = disc.size === allDiscKeys.length;
  const allState = disc.size === 0 ? 'off' : allOn ? 'on' : 'partial';
  const toggleAll = () => setDisc(allOn ? new Set() : new Set(allDiscKeys));

  // ── search filter ──
  const q = search.trim().toLowerCase();
  const filtered = useMemo(() => TURMAS.map(t => {
    if (!q) return { t, discs: DISCIPLINAS };
    const nameHit = `${t.nome} ${t.turno}`.toLowerCase().includes(q);
    if (nameHit) return { t, discs: DISCIPLINAS };
    const ds = DISCIPLINAS.filter(d => d.toLowerCase().includes(q));
    return ds.length ? { t, discs: ds } : null;
  }).filter(Boolean), [q]);

  // ── summary ──
  const disciplinasSel = disc.size;
  const turmasSel = TURMAS.filter(t => DISCIPLINAS.some(d => disc.has(`${t.id}::${d}`))).length;
  const turnosSel = Object.keys(SERIES).filter(turno => SERIES[turno].some(s => series.has(`${turno}::${s}`))).length;

  const labelStyle = { fontFamily: C.archivo, fontWeight: 700, fontSize: 15, color: C.ink };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 24px 24px' }}>
      <div style={{ width: 1060, maxWidth: '100%', height: 'min(680px, calc(100vh - 88px))', background: '#fff', borderRadius: 16,
        boxShadow: '0 0 32px 0 rgba(0,23,31,0.18)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* header */}
        <div style={{ flexShrink: 0, padding: '18px 24px', borderBottom: `1px solid ${C.borderSub}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontFamily: C.archivo, fontWeight: 700, fontSize: 20, color: C.ink, whiteSpace: 'nowrap' }}>{isCreate ? 'Criar dia letivo extra' : 'Editar dia letivo extra'}</h3>
          <span style={{ cursor: 'pointer', display: 'flex' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.indigo} strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></span>
        </div>

        {/* body — two columns */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          {/* LEFT (narrower) */}
          <div style={{ width: 392, flexShrink: 0, borderRight: `1px solid ${C.borderSub}`, overflow: 'hidden', padding: 24, display: 'flex', flexDirection: 'column' }}>
            {/* fixed fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: 0 }}><FieldLabel required>Escola</FieldLabel><SelectEscola value={escola} onChange={setEscola} allowEmpty={isCreate} /></div>
                <div style={{ width: 150, flexShrink: 0 }}><FieldLabel required>Data</FieldLabel><DateInput value={data} onChange={setData} /></div>
              </div>
              <div><FieldLabel required>Título</FieldLabel><TextInput value={titulo} onChange={setTitulo} placeholder="Ex.: Carnaval" /></div>
              <div><FieldLabel required>Descrição</FieldLabel><TextAreaInput value={descricao} onChange={setDescricao} rows={2} /></div>
              <div style={{ height: 1, background: C.borderSub, margin: '2px 0' }} />
              <div style={labelStyle}>Filtrar por turno e série</div>
            </div>
            {/* filter — own scroll */}
            {unlocked ? (
              <div className="turmas-scroll" style={{ flex: 1, minHeight: 0, overflowX: 'hidden', overflowY: 'auto', marginTop: 14, paddingRight: 4 }}>
                {Object.keys(SERIES).map((turno, i) => (
                  <div key={turno} style={{ marginTop: i ? 16 : 0 }}>
                    <CheckRow label={turno} strong state={turnoState(turno)} onToggle={() => toggleTurno(turno)} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 16px', paddingLeft: 27, marginTop: 12 }}>
                      {SERIES[turno].map(s => (
                        <CheckRow key={s} label={s} state={series.has(`${turno}::${s}`) ? 'on' : 'off'} onToggle={() => toggleSerie(turno, s)} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: 14, flexShrink: 0 }}>
                <InfoPanel text="Selecione uma escola para liberar o filtro por turno e série." />
              </div>
            )}
          </div>

          {/* RIGHT — turmas */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: 24, gap: 14 }}>
            {unlocked ? (
              <React.Fragment>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <span style={labelStyle}>Turmas</span>
                  <SearchInput value={search} onChange={setSearch} />
                  <CheckRow label="Selecionar todos" state={allState} onToggle={toggleAll} />
                </div>
                <div style={{ flex: 1, minHeight: 0, border: `1px solid ${C.border}`, borderRadius: 8, overflowX: 'hidden', overflowY: 'auto', padding: '0 16px' }} className="turmas-scroll">
                  {filtered.length === 0 && (
                    <div style={{ padding: '40px 0', textAlign: 'center', fontFamily: C.nunito, fontSize: 14, color: C.muted }}>Nenhuma turma ou disciplina encontrada.</div>
                  )}
                  {filtered.map(({ t, discs }, idx) => (
                    <div key={t.id} style={{ padding: '14px 0', borderBottom: idx < filtered.length - 1 ? `1px solid ${C.borderSub}` : 'none' }}>
                      <CheckRow label={`${t.nome} - ${t.turno}`} strong state={turmaState(t.id)} onToggle={() => toggleTurma(t.id)} />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 16px', paddingLeft: 27, marginTop: 12 }}>
                        {discs.map(d => (
                          <CheckRow key={d} label={d} state={disc.has(`${t.id}::${d}`) ? 'on' : 'off'} onToggle={() => toggleDisc(t.id, d)} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: C.indigoLight, borderRadius: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
                  <span style={{ fontFamily: C.nunito, fontSize: 14, color: C.ink2 }}>
                    <b style={{ color: C.ink }}>{turmasSel}</b> turmas · <b style={{ color: C.ink }}>{disciplinasSel}</b> disciplinas · <b style={{ color: C.ink }}>{turnosSel}</b> turnos selecionados
                  </span>
                </div>
              </React.Fragment>
            ) : (
              <InfoPanel big title="Selecione uma escola" text="As turmas e disciplinas desta escola aparecem aqui depois que você escolhe a escola no campo ao lado." />
            )}
          </div>
        </div>

        {/* footer */}
        <div style={{ flexShrink: 0, padding: '12px 20px', borderTop: `1px solid ${C.borderSub}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
          <Button kind="ghost">Cancelar</Button>
          {!isCreate && <Button kind="danger">Remover</Button>}
          <Button kind="fill" disabled={!unlocked} onClick={() => { setToast(true); setTimeout(() => setToast(false), 3200); }}>{isCreate ? 'Criar' : 'Confirmar'}</Button>
        </div>
      </div>

      {/* toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, width: 340, background: '#fff', borderRadius: 8, boxShadow: '0 4px 12px -2px rgba(0,23,31,.18)', overflow: 'hidden', animation: 'slideup 240ms ease-out', zIndex: 1500 }}>
          <div style={{ display: 'flex', gap: 10, padding: '18px 16px 14px', alignItems: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
            <span style={{ flex: 1, fontFamily: C.nunito, fontSize: 15, color: C.ink }}>{isCreate ? 'Dia letivo extra criado com sucesso.' : 'Dia letivo extra salvo com sucesso.'}</span>
          </div>
          <div style={{ height: 6, background: C.borderSub }}><div className="toast-bar" style={{ height: '100%', background: C.indigo }} /></div>
        </div>
      )}
    </div>
  );
}

// ── Locked-area info / empty state ──────────────────────────────────
function InfoPanel({ text, title, big }) {
  const Lock = (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.indigo} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" /><path d="M8 10.5V7a4 4 0 018 0v3.5" />
    </svg>
  );
  if (big) {
    return (
      <div style={{ flex: 1, minHeight: 0, border: `1.5px dashed ${C.border}`, borderRadius: 12, background: C.surface,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 32, gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.indigoLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Lock(28)}</div>
        <div style={{ fontFamily: C.archivo, fontWeight: 700, fontSize: 18, color: C.ink }}>{title}</div>
        <div style={{ fontFamily: C.nunito, fontSize: 14, color: C.muted, maxWidth: 340, lineHeight: 1.5 }}>{text}</div>
      </div>
    );
  }
  return (
    <div style={{ border: `1.5px dashed ${C.border}`, borderRadius: 8, background: C.surface, display: 'flex', gap: 12, alignItems: 'center', padding: 16 }}>
      <div style={{ flexShrink: 0, display: 'flex' }}>{Lock(22)}</div>
      <div style={{ fontFamily: C.nunito, fontSize: 14, color: C.ink2, lineHeight: 1.45 }}>{text}</div>
    </div>
  );
}

// ── Prototype mode switch (Edição / Criação) ────────────────────────
function ModeSwitch({ mode, setMode }) {
  const opt = (val, label) => {
    const on = mode === val;
    return (
      <button onClick={() => setMode(val)} style={{
        fontFamily: C.archivo, fontWeight: 700, fontSize: 13, padding: '7px 16px', borderRadius: 7, border: 0, cursor: 'pointer',
        background: on ? '#fff' : 'transparent', color: on ? C.indigo : 'rgba(255,255,255,0.85)',
        boxShadow: on ? '0 1px 3px rgba(0,23,31,0.2)' : 'none', transition: 'all 140ms',
      }}>{label}</button>
    );
  };
  return (
    <div style={{ position: 'fixed', top: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 2000,
      display: 'flex', alignItems: 'center', gap: 8, padding: '5px 6px 5px 14px', borderRadius: 999, background: 'rgba(15,15,16,0.55)', backdropFilter: 'blur(2px)' }}>
      <span style={{ fontFamily: C.archivo, fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginRight: 2 }}>Protótipo</span>
      <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 9, padding: 3 }}>
        {opt('edit', 'Edição')}
        {opt('create', 'Criação')}
      </div>
    </div>
  );
}

function App() {
  const [mode, setMode] = useState('edit');
  return (
    <React.Fragment>
      <ModeSwitch mode={mode} setMode={setMode} />
      <Modal key={mode} mode={mode} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
