// ListaApp — extracted from lista-alunos/index.html for use in Portal do Aluno
const { useState, useMemo, useEffect, useRef } = React;

/* ── Icon helper (self-contained fallback) ── */
const MS_L = ({ name, size = 22, color, style: s = {} }) => (
  <span className="material-symbols-outlined"
    style={{ fontSize: size, color, lineHeight: 1, userSelect: 'none', ...s }}>{name}</span>
);

/* ── Breakpoint ── */
const useBreakpointL = () => {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return { isMobile: w < 640, isTablet: w < 1100, width: w };
};

/* ── PcdIcon ── */
const PcdIconL = () => (
  <span style={{
    fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 12,
    lineHeight: 1, color: 'var(--color-primary)', letterSpacing: '0.04em',
    flexShrink: 0, textTransform: 'uppercase',
  }}>NEE</span>
);

/* ── Data ── */
const LISTA_STUDENTS = [
  { id: 1,  nome: 'Ana Beatriz Costa',        mat: '2024-789001', turma: '9º ano Forte A – M', status: 'NOVO',   anamnese: 100, freq: 98,  pos: 12, neg: 0, obs: 1, atend: 2,  avatarColor: '#E3E5FB' },
  { id: 2,  nome: 'Bruno Henrique Lima',       mat: '2024-789002', turma: '9º ano Forte A – M', status: 'ANTIGO', anamnese: 100, freq: 87,  pos:  5, neg: 2, obs: 1, atend: 1,  avatarColor: '#D9F5E4' },
  { id: 3,  nome: 'Carlos Eduardo Souza',      mat: '2024-789003', turma: '9º ano Forte A – M', status: 'ANTIGO', anamnese: 75,  freq: 72,  pos:  3, neg: 5, obs: 2, atend: 4,  avatarColor: '#FBE3DC', pcd: true, dependencia: true },
  { id: 4,  nome: 'Diana Rodrigues Silva',     mat: '2024-789004', turma: '9º ano Forte A – M', status: 'NOVO',   anamnese: 100, freq: 100, pos:  0, neg: 0, obs: 0, atend: 0,  avatarColor: '#FFF3DF' },
  { id: 5,  nome: 'Eduardo Martins Alves',     mat: '2024-789005', turma: '9º ano Forte A – M', status: 'ANTIGO', anamnese: 100, freq: 91,  pos:  6, neg: 1, obs: 3, atend: 2,  avatarColor: '#E3E5FB' },
  { id: 6,  nome: 'Fernanda Lima Pereira',     mat: '2024-789006', turma: '9º ano Forte A – M', status: 'ANTIGO', anamnese: 50,  freq: 79,  pos:  4, neg: 3, obs: 1, atend: 3,  avatarColor: '#EDE3FF', conselho: true },
  { id: 7,  nome: 'Gabriel Santos Costa',      mat: '2024-789007', turma: '9º ano Forte A – M', status: 'NOVO',   anamnese: 100, freq: 95,  pos:  9, neg: 0, obs: 2, atend: 1,  avatarColor: '#D9F5E4' },
  { id: 8,  nome: 'Helena Oliveira Nunes',     mat: '2024-789008', turma: '9º ano Forte A – M', status: 'ANTIGO', anamnese: 100, freq: 83,  pos:  7, neg: 2, obs: 0, atend: 2,  avatarColor: '#FFE0C4', pcd: true },
  { id: 9,  nome: 'Igor Ferreira Andrade',     mat: '2024-789009', turma: '9º ano Forte A – M', status: 'ANTIGO', anamnese: 25,  freq: 65,  pos:  2, neg: 7, obs: 3, atend: 5,  avatarColor: '#FBE3DC', dependencia: true, conselho: true },
  { id: 10, nome: 'Julia Mendes Carvalho',     mat: '2024-789010', turma: '9º ano Forte A – M', status: 'NOVO',   anamnese: 100, freq: 97,  pos: 10, neg: 0, obs: 1, atend: 0,  avatarColor: '#EDE3FF' },
  { id: 11, nome: 'Lucas Pereira Gomes',       mat: '2024-789011', turma: '9º ano Forte A – M', status: 'ANTIGO', anamnese: 100, freq: 88,  pos:  6, neg: 1, obs: 2, atend: 1,  avatarColor: '#FFF3DF' },
  { id: 12, nome: 'Maria Albuquerque Santos',  mat: '2024-789456', turma: '9º ano Forte A – M', status: 'ANTIGO', anamnese: 100, freq: 90,  pos:  7, neg: 1, obs: 1, atend: 3,  avatarColor: '#E3E5FB', conselho: true },
  { id: 13, nome: 'Enzo Ribeiro Martins',      mat: '2024-789013', turma: '9º ano Forte A – M', status: 'NOVO',   anamnese: 0,   freq: null, pos:  0, neg: 0, obs: 0, atend: 0,  avatarColor: '#FFF3DF' },
];

const LISTA_FILTER_META = [
  { id: 'anoLetivo', label: 'Ano letivo',  required: true,  options: ['2023','2024','2025','2026'] },
  { id: 'rede',      label: 'Rede',        required: true,  options: ['Elite','Forte','Militar'] },
  { id: 'escola',    label: 'Escola',      required: true,  options: ['Bangu','Copacabana','Tijuca','Botafogo'] },
  { id: 'serie',     label: 'Série',       required: false, options: ['6º ano','7º ano','8º ano','9º ano'] },
  { id: 'turma',     label: 'Turma',       required: false, options: ['Turma A','Turma B','Turma C'] },
];

/* ── Avatar ── */
const ListaAvatar = ({ student, size = 68 }) => (
  <div style={{
    width: size, height: size, borderRadius: 999, flexShrink: 0,
    background: student.avatarColor, border: '2px solid #fff', boxShadow: '0 0 0 1px #EBEDF1',
    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  }}>
    <svg width={size * 0.75} height={size * 0.75} viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="26" r="14" fill="#F9D4B8"/>
      <ellipse cx="23" cy="24" rx="2.5" ry="3" fill="#0F0F10"/>
      <ellipse cx="33" cy="24" rx="2.5" ry="3" fill="#0F0F10"/>
      <circle cx="24" cy="23" r="1" fill="#fff"/>
      <circle cx="34" cy="23" r="1" fill="#fff"/>
      <path d="M22 31 Q28 36 34 31" stroke="#9D0364" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <rect x="14" y="14" width="28" height="5" rx="2.5" fill="#fff" stroke="#0F0F10" strokeWidth="1.5"/>
      <rect x="19" y="4" width="18" height="13" rx="3" fill="#fff" stroke="#0F0F10" strokeWidth="1.5"/>
      <circle cx="28" cy="5" r="2" fill="#0F0F10"/>
      <path d="M14 17 Q14 28 16 30" stroke="#3D1800" strokeWidth="3" strokeLinecap="round"/>
      <path d="M42 17 Q42 28 40 30" stroke="#3D1800" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="14" cy="27" rx="3" ry="4" fill="#F9D4B8"/>
      <ellipse cx="42" cy="27" rx="3" ry="4" fill="#F9D4B8"/>
    </svg>
  </div>
);

/* ── Student Card ── */
const ListaStudentCard = ({ student }) => {
  const semFrequencia = student.freq == null;
  const freqBg    = semFrequencia ? 'transparent' : student.freq >= 90 ? 'rgba(176,239,205,0.4)' : student.freq >= 80 ? 'rgba(255,222,172,0.4)' : 'rgba(245,187,175,0.4)';
  const freqColor = semFrequencia ? '#65686E' : student.freq >= 90 ? '#0E5E2E' : student.freq >= 80 ? '#B37822' : '#A13C26';
  const semOcorrencias = student.pos === 0 && student.neg === 0 && student.obs === 0;
  return (
    <div className="student-card">
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <ListaAvatar student={student} size={100} />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 18, lineHeight: '22px', color: '#0F0F10' }}>{student.nome}</span>
                {student.pcd && <PcdIconL />}
              </div>
              {student.status === 'NOVO' && (
                <span style={{
                  flexShrink: 0, height: 20, padding: '0 8px', marginTop: 1,
                  display: 'inline-flex', alignItems: 'center', borderRadius: 16,
                  background: '#28975A',
                  border: '1px solid #28975A',
                  color: '#fff',
                  fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 12,
                }}>NOVO</span>
              )}
            </div>
            <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E' }}>Mat. {student.mat} · {student.turma}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ height: 20, padding: '0 8px', display: 'inline-flex', alignItems: 'center', borderRadius: 16, border: '1px solid #28975A', fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 12, color: '#28975A' }}>Matriculado</span>
              {student.anamnese === 0 ? (
                <span style={{ height: 20, padding: '0 8px', display: 'inline-flex', alignItems: 'center', gap: 4, borderRadius: 16, border: '1px dashed #FFAC30', fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 12, color: '#B37822' }}>
                  <MS_L name="hourglass_empty" size={12} color="#B37822" />Anamnese pendente
                </span>
              ) : (
                <span style={{ height: 20, padding: '0 8px', display: 'inline-flex', alignItems: 'center', borderRadius: 16, border: '1px solid #774BB0', fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 12, color: '#774BB0' }}>Anamnese: {student.anamnese}%</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #C3C8D1', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingBottom: 4 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px', borderRadius: 8, background: freqBg, border: semFrequencia ? '1px dashed #C3C8D1' : 'none', fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14, color: freqColor }}>
              {semFrequencia ? 'Sem frequência registrada' : `Frequência: ${student.freq}%`}
            </div>
            {semOcorrencias ? (
              <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 13, fontStyle: 'italic', color: '#ADB2BA' }}>Nenhuma ocorrência registrada</div>
            ) : (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E' }}>
              <MS_L name="thumb_up" size={14} color="#0E5E2E" /> <span style={{ marginRight: 2 }}>{student.pos}</span>
              <span style={{ color: '#C3C8D1' }}>|</span>
              <MS_L name="thumb_down" size={14} color="#A13C26" /> <span style={{ marginRight: 2 }}>{student.neg}</span>
              <span style={{ color: '#C3C8D1' }}>|</span>
              <MS_L name="chat_bubble" size={14} color="#6B21A8" /> <span>{student.obs}</span>
            </div>
            )}

          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginLeft: -8 }}>
              <button className="action-btn" onClick={() => window.__navToPainel && window.__navToPainel(student, 'Pedagógico')}><MS_L name="description" size={16} color="var(--color-primary)" /> Boletim</button>
              <button className="action-btn" onClick={() => window.__navToPainel && window.__navToPainel(student, 'Ocorrências')}><MS_L name="warning" size={16} color="var(--color-primary)" />{`Ocorrência (${student.pos + student.neg}pts)`}</button>
              <button className="action-btn" onClick={() => window.__navToPainel && window.__navToPainel(student, 'Atendimento')}><MS_L name="forum" size={16} color="var(--color-primary)" />{`Atendimento (${student.atend})`}</button>
            </div>
            {/* Arrow — uses portal nav if available, else href */}
            <a
              href="../painel-aluno/index.html"
              onClick={e => { if (window.__navToPainel) { e.preventDefault(); window.__navToPainel(student); } }}
              style={{ width: 36, height: 36, borderRadius: 24, flexShrink: 0, background: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background 160ms' }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--color-primary-dark1)'}
              onMouseOut={e => e.currentTarget.style.background = 'var(--color-primary)'}>
              <MS_L name="arrow_forward" size={24} color="#fff" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Filter Panel ── */
const ListaFilterPanel = ({ open, onClose, filters, onApply }) => {
  const [local, setLocal] = useState({ ...filters });
  useEffect(() => { if (open) setLocal({ ...filters }); }, [open]);
  const set = (k, v) => setLocal(f => ({ ...f, [k]: v }));
  const clear = () => setLocal({ anoLetivo: '', rede: '', escola: '', serie: '', turma: '' });
  const apply = () => { onApply(local); onClose(); };
  const requiredFilled = local.anoLetivo && local.rede && local.escola;
  if (!open) return null;
  return (
    <div style={{ width: '100%', borderRadius: 8, filter: 'drop-shadow(0px 0px 8px rgba(0,23,31,0.2))', marginBottom: 8, animation: 'fadeSlideDown 200ms cubic-bezier(0.16,1,0.3,1)' }}>
      <div style={{ background: '#fff', borderRadius: '8px 8px 0 0', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ flex: 1, fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 24, color: '#0F0F10' }}>Escolha seus filtros</span>
          <button onClick={onClose} style={{ width: 40, height: 40, borderRadius: 24, border: 0, background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseOver={e => e.currentTarget.style.background = '#F8F9FB'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <MS_L name="close" size={24} color="var(--color-primary)" />
          </button>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {LISTA_FILTER_META.map(m => (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 160 }}>
              <label style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, color: '#0F0F10', display: 'flex', gap: 4 }}>
                {m.label}{m.required && <span style={{ color: 'var(--color-error)' }}>*</span>}
              </label>
              <div style={{ position: 'relative' }}>
                <select value={local[m.id]} onChange={e => set(m.id, e.target.value)} style={{ width: '100%', height: 40, padding: '8px 36px 8px 16px', borderRadius: 8, border: `1px solid ${local[m.id] ? 'var(--color-primary)' : '#ADB2BA'}`, fontFamily: 'var(--font-body-family)', fontSize: 16, color: local[m.id] ? '#0F0F10' : '#65686E', background: '#fff', cursor: 'pointer', appearance: 'none', outline: 'none' }}>
                  <option value="">{m.label}</option>
                  {m.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <MS_L name="expand_more" size={24} color="var(--color-primary)" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: '#F8F9FB', borderRadius: '0 0 8px 8px', padding: 24, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button onClick={clear} style={{ height: 40, padding: '8px 16px', borderRadius: 8, background: 'transparent', border: '1px solid #9D0364', fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 16, color: '#9D0364', cursor: 'pointer' }}>Limpar</button>
        <button onClick={apply} disabled={!requiredFilled} style={{ height: 40, padding: '8px 16px', borderRadius: 8, border: 0, background: requiredFilled ? '#9D0364' : '#ADB2BA', fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 16, color: '#fff', cursor: requiredFilled ? 'pointer' : 'not-allowed' }}>Filtrar</button>
      </div>
    </div>
  );
};

/* ── Top Nav (lista version) ── */
const ListaTopNav = ({ isMobile }) => (
  <header style={{ height: 64, background: '#fff', borderBottom: '1px solid #EBEDF1', display: 'flex', alignItems: 'center', padding: isMobile ? '0 16px' : '0 24px', gap: isMobile ? 10 : 20, position: 'sticky', top: 0, zIndex: 30 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#30B7BE 0%,#39D881 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 17L10 3L16 17" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.5 12H13.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 800, fontSize: 18, color: '#0F0F10', letterSpacing: '-0.01em' }}>atlas</span>
        {!isMobile && <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 500, fontSize: 9, color: '#65686E', letterSpacing: '0.14em', marginTop: 2 }}>GESTÃO ESCOLAR</span>}
      </div>
    </div>
    <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 36, padding: '0 12px', background: 'transparent', border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 16, color: '#0F0F10' }}
      onMouseOver={e => e.currentTarget.style.background = '#F2F2F2'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
      <MS_L name="menu" size={22} color="#0F0F10" />{!isMobile && 'Menu'}
    </button>
    <div style={{ flex: 1 }} />
    {!isMobile && <button style={{ width: 40, height: 40, borderRadius: 999, background: 'transparent', border: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><MS_L name="apps" size={22} color="#3D3F42" /></button>}
    <div style={{ position: 'relative' }}>
      <button style={{ width: 40, height: 40, borderRadius: 999, background: 'transparent', border: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><MS_L name="notifications" size={22} color="#3D3F42" /></button>
      <span style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderRadius: 999, background: '#E65637', border: '2px solid #fff' }} />
    </div>
    <div style={{ width: 40, height: 40, borderRadius: 999, flexShrink: 0, background: 'linear-gradient(135deg,#FFDEAC,#FFAC30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, color: '#0F0F10', cursor: 'pointer', border: '2px solid #fff', boxShadow: '0 0 0 1px #EBEDF1' }}>CM</div>
  </header>
);

/* ── Sort Dropdown ── */
const ListaSortDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const opts = [{ id:'alfabetica',label:'Ordem alfabética'},{ id:'freq-desc',label:'Maior frequência'},{ id:'freq-asc',label:'Menor frequência'},{ id:'neg-desc',label:'Mais ocorrências'},{ id:'atend-asc',label:'Menos atendimentos'},{ id:'atend-desc',label:'Mais atendimentos'}];
  useEffect(() => { const h = e => { if (!ref.current?.contains(e.target)) setOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);
  const current = opts.find(o => o.id === value) || opts[0];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="dropdown-btn" onClick={() => setOpen(o => !o)}>{current.label}<MS_L name={open?'expand_less':'expand_more'} size={18} color="#65686E" /></button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, width: 210, zIndex: 20, background: '#fff', border: '1px solid #EBEDF1', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,23,31,0.10)', overflow: 'hidden' }}>
          {opts.map(o => (
            <button key={o.id} onClick={() => { onChange(o.id); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height: 40, padding: '0 14px', background: o.id === value ? 'var(--color-primary-light3)' : '#fff', border: 0, cursor: 'pointer', fontFamily: 'var(--font-body-family)', fontSize: 14, color: o.id === value ? 'var(--color-primary)' : '#0F0F10', fontWeight: o.id === value ? 700 : 400, textAlign: 'left' }}>
              {o.id === value ? <MS_L name="check" size={16} color="var(--color-primary)" /> : <span style={{ width: 16 }} />}{o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Indicadores Dropdown ── */
const ListaIndicadoresDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const opts = [{ id:'atend-asc',label:'Alunos com menos atendimentos'},{ id:'atend-desc',label:'Alunos com mais atendimentos'}];
  useEffect(() => { const h = e => { if (!ref.current?.contains(e.target)) setOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);
  const current = opts.find(o => o.id === value);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="dropdown-btn" onClick={() => setOpen(o => !o)}>{current ? current.label : 'Atendimentos'}<MS_L name={open?'expand_less':'expand_more'} size={18} color="#65686E" /></button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, width: 300, zIndex: 20, background: '#fff', border: '1px solid #EBEDF1', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,23,31,0.10)', overflow: 'hidden' }}>
          {value && <button onClick={() => { onChange(''); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height: 40, padding: '0 14px', background: '#fff', border: 0, borderBottom: '1px solid #EBEDF1', cursor: 'pointer', fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#ADB2BA', textAlign: 'left' }}><MS_L name="close" size={16} color="#ADB2BA" />Limpar filtro</button>}
          {opts.map(o => (
            <button key={o.id} onClick={() => { onChange(o.id); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height: 40, padding: '0 14px', background: o.id === value ? 'var(--color-primary-light3)' : '#fff', border: 0, cursor: 'pointer', fontFamily: 'var(--font-body-family)', fontSize: 14, color: o.id === value ? 'var(--color-primary)' : '#0F0F10', fontWeight: o.id === value ? 700 : 400, textAlign: 'left' }}>
              {o.id === value ? <MS_L name="check" size={16} color="var(--color-primary)" /> : <span style={{ width: 16 }} />}{o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main ListaApp ── */
const ListaApp = () => {
  const { isMobile, isTablet } = useBreakpointL();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ anoLetivo: '2025', rede: 'Elite', escola: 'Bangu', serie: '', turma: '' });
  const [search, setSearch] = useState('');
  const [ordem, setOrdem] = useState('alfabetica');

  const activeChips = useMemo(() => {
    const iconMap = { anoLetivo:'calendar_today', rede:'school', escola:'location_on', serie:'class', turma:'group' };
    return Object.entries(filters).filter(([,v]) => v).map(([k,v]) => ({ key:k, value:v, icon:iconMap[k] }));
  }, [filters]);

  const students = useMemo(() => {
    let list = LISTA_STUDENTS.filter(s => !search || s.nome.toLowerCase().includes(search.toLowerCase()) || s.mat.includes(search));
    if (ordem === 'alfabetica')   list = [...list].sort((a,b) => a.nome.localeCompare(b.nome,'pt'));
    else if (ordem === 'freq-desc')  list = [...list].sort((a,b) => (b.freq ?? -1) - (a.freq ?? -1));
    else if (ordem === 'freq-asc')   list = [...list].sort((a,b) => (a.freq ?? 101) - (b.freq ?? 101));
    else if (ordem === 'neg-desc')   list = [...list].sort((a,b) => b.neg - a.neg);
    else if (ordem === 'atend-asc')  list = [...list].sort((a,b) => a.atend - b.atend);
    else if (ordem === 'atend-desc') list = [...list].sort((a,b) => b.atend - a.atend);
    return list;
  }, [search, ordem]);

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB' }}>
      <ListaTopNav isMobile={isMobile} />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: `24px ${isMobile?'16px':isTablet?'24px':'32px'} 0` }}>
        <h1 style={{ margin: '0 0 20px', fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: isMobile?22:32, color: '#0F0F10', letterSpacing: '-0.01em', lineHeight: 1.2 }}>Painel do Aluno</h1>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
          <button onClick={() => setFilterOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 40, padding: '0 16px', background: 'var(--color-secondary)', border: 0, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0 }}>
            <MS_L name="filter_alt" size={24} color="#fff" />
            {!isMobile && <span style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>Filtro</span>}
            {activeChips.length > 0 && <span style={{ width: 24, height: 24, borderRadius: 152, background: '#fff', color: '#9D0364', fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{activeChips.length}</span>}
          </button>

          {activeChips.map(chip => (
            <div key={chip.key} className="filter-chip"><MS_L name={chip.icon} size={16} color="#9D0364" /><span>{chip.value}</span></div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '8px 16px', background: '#fff', border: '1px solid #ADB2BA', borderRadius: 8, width: isMobile ? '100%' : 280 }}>
            <MS_L name="person_search" size={18} color="#ADB2BA" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou RA" style={{ border: 0, outline: 0, flex: 1, minWidth: 0, fontFamily: 'var(--font-body-family)', fontSize: 16, color: '#0F0F10', background: 'transparent' }} />
            {search && <button onClick={() => setSearch('')} style={{ border: 0, background: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><MS_L name="close" size={16} color="#ADB2BA" /></button>}
          </div>
        </div>

        {filterOpen && <ListaFilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} onApply={f => setFilters(f)} />}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
          <span style={{ flex: 1, fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E' }}>
            <b style={{ color: '#0F0F10', fontWeight: 700, fontFamily: 'var(--font-display-family)' }}>{students.length}</b> alunos
          </span>
          <ListaSortDropdown value={ordem} onChange={setOrdem} />
        </div>

        {students.length > 0 ? (
          <div className="student-grid">{students.map(s => <ListaStudentCard key={s.id} student={s} />)}</div>
        ) : (
          <div style={{ minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center', padding: '0 24px' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: '#F8F9FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MS_L name="filter_alt_off" size={28} color="#ADB2BA" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 16, color: '#0F0F10' }}>Nenhum aluno encontrado</span>
              <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', maxWidth: 300, display: 'block', margin: '0 auto' }}>Verifique os filtros aplicados ou tente um nome diferente.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { ListaApp });
