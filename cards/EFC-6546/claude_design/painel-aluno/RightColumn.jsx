// Right column — Resumo Inteligente + tabs + pedagogico chart
const SUBJECTS = [
  { name: 'Biologia', aluno: 72, turma: 71 },
  { name: 'Os matemáticos e o mundo dos problemas', aluno: 68, turma: 70 },
  { name: 'Ecologia aplicada e impactos ambientais', aluno: 65, turma: 69 },
  { name: 'Educação física', aluno: 92, turma: 78 },
  { name: 'Física', aluno: 58, turma: 66 },
  { name: 'Fontes de energia e suas aplicações', aluno: 63, turma: 68 },
  { name: 'Geografia', aluno: 60, turma: 72 },
  { name: 'História', aluno: 78, turma: 73 },
  { name: 'Língua Portuguesa', aluno: 85, turma: 74 },
  { name: 'Língua Inglesa', aluno: 76, turma: 72 },
  { name: 'Literatura', aluno: 74, turma: 71 },
  { name: 'Matemática', aluno: 45, turma: 70 },
  { name: 'Redação', aluno: 82, turma: 73 },
  { name: 'Relações moleculares e o mundo de trabalho', aluno: 70, turma: 69 },
  { name: 'Sociedade e o mundo', aluno: 67, turma: 71 },
  { name: 'Sociologia', aluno: 73, turma: 72 },
];

// -------- Highlight parser: text with [[kind|content]] tokens --------
const HL_COLORS = {
  positive: { bg: '#D9F5E4', fg: '#0E5E2E', border: '#28975A' },
  warning:  { bg: '#FFE8C4', fg: '#7D5419', border: '#FFAC30' },
  info:     { bg: '#E3E5FB', fg: '#191F88', border: '#242CC2' },
};

const Highlight = ({ kind, children }) => {
  const c = HL_COLORS[kind];
  return (
    <span style={{
      background: c.bg, color: c.fg,
      padding: '1px 6px', borderRadius: 4,
      boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone',
    }}>{children}</span>
  );
};

const RESUMO_PARTS = [
  { t: 'Maria apresenta ' },
  { hl: 'warning', t: 'oscilações de desempenho entre avaliações' },
  { t: '. Em Física, por exemplo, obteve nota acima da média na P2, mas abaixo na P1. Os principais pontos de atenção estão relacionados ao ' },
  { hl: 'warning', t: 'rendimento em disciplinas de exatas e ciências humanas' },
  { t: '. A ' },
  { hl: 'positive', t: 'frequência é alta, com presença superior a 90%' },
  { t: ' nos meses analisados. Nos últimos 30 dias, há registro de ' },
  { hl: 'info', t: 'ocorrência disciplinar envolvendo comportamento inadequado em sala de aula' },
  { t: '. O último atendimento registrado abordou análise de boletim, elaboração de relatório pedagógico e plano de estudos personalizado.' },
];

const RESUMO_HEIGHT = 248;

const ResumoInteligente = ({ onChipClick, onPerguntarMais, status = 'ok' }) => {
  if (status === 'loading') {
    return (
      <div style={{
        background: '#F7F8FF', border: '1px solid #C3C8D1',
        borderLeft: '4px solid var(--color-primary)',
        borderRadius: 10, padding: '24px 20px 24px 22px',
        display: 'flex', flexDirection: 'column', gap: 12,
        minHeight: RESUMO_HEIGHT, justifyContent: 'center', boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MS name="auto_awesome" size={20} color="var(--color-primary)" />
          <h3 style={{
            margin: 0, fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 18, lineHeight: '22px',
            color: 'var(--color-primary)', letterSpacing: '-0.01em',
          }}>Resumo Inteligente</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{
              height: 14, borderRadius: 4, background: '#E3E5FB',
              width: i === 3 ? '60%' : '100%',
              animation: 'resumoPulse 1.3s ease-in-out infinite',
              animationDelay: `${i * 0.12}s`,
            }} />
          ))}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-body-family)', fontSize: 13, color: '#65686E',
        }}>
          <MS name="hourglass_top" size={14} color="#65686E" />
          Gerando resumo com IA… isso pode levar alguns segundos.
        </div>
        <style>{`@keyframes resumoPulse { 0%,100%{opacity:.5} 50%{opacity:1} }`}</style>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{
        background: '#FDF3F0', border: '1px solid #F5C2B0',
        borderLeft: '4px solid #E65637',
        borderRadius: 10, padding: '24px 20px 24px 22px',
        display: 'flex', flexDirection: 'column', gap: 10,
        minHeight: RESUMO_HEIGHT, justifyContent: 'center', boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MS name="error" size={20} color="#E65637" />
          <h3 style={{
            margin: 0, fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 18, lineHeight: '22px',
            color: '#A13C26', letterSpacing: '-0.01em',
          }}>Resumo Inteligente</h3>
        </div>
        <p style={{
          margin: 0, fontFamily: 'var(--font-body-family)', fontSize: 14, lineHeight: '22px',
          color: 'var(--color-neutral-dark3)',
        }}>Não foi possível gerar o resumo deste aluno agora. Isso pode acontecer por instabilidade no serviço de IA ou tempo de resposta excedido.</p>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
          height: 36, padding: '0 16px',
          background: '#fff', border: '1px solid #E65637', borderRadius: 999,
          cursor: 'pointer', color: '#E65637',
          fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
          transition: 'all 160ms',
        }}
        onMouseOver={(e)=>{ e.currentTarget.style.background='#FBE3DC'; }}
        onMouseOut={(e)=>{ e.currentTarget.style.background='#fff'; }}>
          <MS name="refresh" size={16} color="#E65637" />
          Tentar novamente
        </button>
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div style={{
        background: '#F8F9FB', border: '1px dashed #C3C8D1',
        borderRadius: 10, padding: '24px 20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8,
        minHeight: RESUMO_HEIGHT, justifyContent: 'center', boxSizing: 'border-box',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: '#EBEDF1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MS name="auto_awesome" size={22} color="#ADB2BA" />
        </div>
        <h3 style={{
          margin: 0, fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 16,
          color: 'var(--color-neutral-dark3)',
        }}>Resumo Inteligente indisponível</h3>
        <p style={{
          margin: 0, fontFamily: 'var(--font-body-family)', fontSize: 14, lineHeight: '20px',
          color: '#65686E', maxWidth: 420,
        }}>Ainda não há dados suficientes sobre este aluno (notas, frequência ou ocorrências) para gerar um resumo.</p>
      </div>
    );
  }

  return (
    <div style={{
      background: '#F7F8FF', border: '1px solid #C3C8D1',
      borderLeft: '4px solid var(--color-primary)',
      borderRadius: 10, padding: '24px 20px 24px 22px',
      minHeight: RESUMO_HEIGHT, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MS name="auto_awesome" size={20} color="var(--color-primary)" />
          <h3 style={{
            margin: 0, fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 18, lineHeight: '22px',
            color: 'var(--color-primary)', letterSpacing: '-0.01em',
          }}>Resumo Inteligente</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <MS name="schedule" size={14} color="#65686E" />
          <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E' }}>Dados com até 1 dia de defasagem</span>
        </div>
      </div>
      <p style={{
        margin: '10px 0 0', fontFamily: 'var(--font-body-family)', fontSize: 14, lineHeight: '24px',
        color: 'var(--color-neutral-dark3)', textWrap: 'pretty',
      }}>
        {RESUMO_PARTS.map((p, i) =>
          p.hl ? <Highlight key={i} kind={p.hl}>{p.t}</Highlight> : <React.Fragment key={i}>{p.t}</React.Fragment>
        )}
      </p>

      {/* Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
        {[
          { label: 'O que falar em atendimento?', q: 'O que devo falar no próximo atendimento com a família da Maria?' },
          { label: 'Detalhar notas', q: 'Detalhe as notas da Maria por disciplina.' },
          { label: 'Resumo das ocorrências', q: 'Faça um resumo das 2 ocorrências disciplinares da Maria.' },
        ].map(c => (
          <button key={c.label} onClick={() => onChipClick(c.q)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 32, padding: '0 12px',
            background: '#fff', border: '1px solid #C3C8D1', borderRadius: 999,
            cursor: 'pointer',
            fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, lineHeight: '14px', color: 'var(--color-neutral-dark3)',
            transition: 'all 160ms',
          }}
          onMouseOver={(e)=>{ e.currentTarget.style.borderColor='var(--color-primary)'; e.currentTarget.style.color='var(--color-primary)'; }}
          onMouseOut={(e)=>{ e.currentTarget.style.borderColor='#C3C8D1'; e.currentTarget.style.color='var(--color-neutral-dark3)'; }}>
            {c.label}
            <MS name="north_east" size={14} color="currentColor" />
          </button>
        ))}
        <button onClick={onPerguntarMais} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 32, padding: '0 12px',
          background: '#1A1E60', color: '#fff',
          border: '1px solid #1A1E60', borderRadius: 999,
          cursor: 'pointer',
          fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, lineHeight: '14px',
          transition: 'all 160ms',
        }}
        onMouseOver={(e)=>{ e.currentTarget.style.background='var(--color-primary)'; e.currentTarget.style.borderColor='var(--color-primary)'; }}
        onMouseOut={(e)=>{ e.currentTarget.style.background='#1A1E60'; e.currentTarget.style.borderColor='#1A1E60'; }}>
          Perguntar mais...
          <MS name="chat_bubble" size={14} color="#fff" />
        </button>
      </div>
    </div>
  );
};

// -------- Tabs row --------
const TABS = [
  { id: 'Pedagógico' },
  { id: 'Atendimento', badge: 5 },
  { id: 'Anamnese' },
  { id: 'Ocorrências', badge: 2 },
  { id: 'Documentos', badge: 3 },
];

const TabsRow = ({ active, onChange }) => {
  const { isCompact } = useBreakpoint();
  return (
    <div style={{
      display: 'flex', gap: isCompact ? 0 : 8,
      borderBottom: '1px solid #EBEDF1',
      padding: '0 4px',
      overflowX: isCompact ? 'auto' : 'visible',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
    }}>
      {TABS.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 16px', background: 'transparent', border: 0,
            borderBottom: `3px solid ${isActive ? 'var(--color-primary)' : 'transparent'}`,
            cursor: 'pointer', marginBottom: -1, flexShrink: 0,
            fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 16, lineHeight: '16px',
            color: isActive ? 'var(--color-primary)' : '#65686E',
            transition: 'color 160ms',
            whiteSpace: 'nowrap',
          }}
          onMouseOver={(e)=>{ if(!isActive) e.currentTarget.style.color='#0F0F10'; }}
          onMouseOut={(e)=>{ if(!isActive) e.currentTarget.style.color='#65686E'; }}>
            {t.id}
            {t.badge != null && (
              <span style={{
                minWidth: 22, height: 22, padding: '0 6px', borderRadius: 999,
                background: isActive ? 'var(--color-primary)' : '#EBEDF1',
                color: isActive ? '#fff' : '#65686E',
                fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 12,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{t.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// Ciclo fechado view: only shown after the cycle is finalized — the last few
// subjects can still be pending finalization. Boletim releases notes as they
// come in during the term, so it tends to have every subject filled in,
// with values that can differ from the eventual closed-cycle average.
const SUBJECTS_CICLO = SUBJECTS.map((s, i) => {
  if (i >= SUBJECTS.length - 4) return { ...s, aluno: null, turma: null }; // ciclo ainda não fechado p/ essas disciplinas
  return s;
});
const SUBJECTS_BOLETIM = SUBJECTS.map((s, i) => {
  const delta = ((i % 5) - 2) * 4; // notas liberadas podem diferir da média final do ciclo
  return { ...s, aluno: Math.max(0, Math.min(100, s.aluno + delta)) };
});

const CICLO_VIEWS = [
  { id: 'fechado', label: 'Ciclo fechado', caption: 'Notas exibidas após o fechamento do ciclo avaliativo.' },
  { id: 'boletim', label: 'Boletim', caption: 'Notas exibidas conforme liberação no boletim.' },
];

const CicloSegmentedControl = ({ value, onChange }) => (
  <div style={{
    display: 'inline-flex', gap: 2, padding: 2,
    background: '#F8F9FB', border: '1px solid #C3C8D1', borderRadius: 8,
    flexShrink: 0,
  }}>
    {CICLO_VIEWS.map(v => {
      const active = value === v.id;
      return (
        <button key={v.id} onClick={() => onChange(v.id)} style={{
          height: 32, padding: '0 14px', border: 0, borderRadius: 6, cursor: 'pointer',
          fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, lineHeight: '14px',
          background: active ? 'var(--color-primary)' : 'transparent',
          color: active ? '#fff' : '#65686E',
          transition: 'all 160ms',
          whiteSpace: 'nowrap',
        }}
        onMouseOver={(e) => { if (!active) e.currentTarget.style.background = '#EBEDF1'; }}
        onMouseOut={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
          {v.label}
        </button>
      );
    })}
  </div>
);

// -------- Etapa dropdown (Ano letivo / trimestres) --------
const ETAPA_OPTIONS = [
  { id: 'ano', label: 'Ano letivo' },
  { id: '1', label: '1º trimestre' },
  { id: '2', label: '2º trimestre' },
  { id: '3', label: '3º trimestre', disabled: true, disabledReason: 'Esse trimestre ainda não encerrou.' },
];

const EtapaDropdown = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const current = ETAPA_OPTIONS.find(o => o.id === value) || ETAPA_OPTIONS[0];
  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        height: 36, padding: '0 12px', border: '1px solid #C3C8D1', borderRadius: 8,
        background: '#fff', cursor: 'pointer',
        fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, color: '#0F0F10',
        whiteSpace: 'nowrap',
      }}>
        {current.label}
        <MS name={open ? 'expand_less' : 'expand_more'} size={18} color="#65686E" />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, minWidth: 200, zIndex: 20,
          background: '#fff', border: '1px solid #EBEDF1', borderRadius: 8,
          boxShadow: 'var(--shadow-down-medium)', overflow: 'hidden',
        }}>
          {ETAPA_OPTIONS.map(o => (
            <button
              key={o.id}
              disabled={o.disabled}
              title={o.disabled ? o.disabledReason : undefined}
              onClick={() => { if (!o.disabled) { onChange(o.id); setOpen(false); } }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%', height: 40, padding: '0 14px',
                background: o.id === value ? 'var(--color-primary-light3)' : '#fff', border: 0,
                cursor: o.disabled ? 'not-allowed' : 'pointer', textAlign: 'left',
                fontFamily: 'var(--font-body-family)', fontSize: 14,
                color: o.disabled ? '#ADB2BA' : (o.id === value ? 'var(--color-primary)' : '#0F0F10'),
                fontWeight: o.id === value ? 700 : 400,
              }}
              onMouseOver={(e) => { if (!o.disabled && o.id !== value) e.currentTarget.style.background = '#F8F9FB'; }}
              onMouseOut={(e) => { if (!o.disabled && o.id !== value) e.currentTarget.style.background = '#fff'; }}>
              {o.id === value ? <MS name="check" size={16} color="var(--color-primary)" /> : <span style={{ width: 16 }} />}
              {o.label}
              {o.disabled && <MS name="schedule" size={14} color="#ADB2BA" style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// -------- Boletim modal (placeholder) --------
const BoletimModal = ({ onClose }) => (
  <div
    style={{
      position: 'fixed', inset: 0, background: 'rgba(0,23,31,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div style={{
      background: '#fff', borderRadius: 12, padding: '24px 24px 28px',
      width: 640, maxWidth: '92vw', maxHeight: '90vh',
      overflowY: 'auto', boxShadow: 'var(--shadow-center-large)',
      display: 'flex', flexDirection: 'column', gap: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{
          margin: 0, fontFamily: 'var(--font-display-family)', fontWeight: 600,
          fontSize: 18, color: '#0F0F10', lineHeight: '22px',
        }}>Boletim — Maria Albuquerque Santos</h3>
        <button onClick={onClose} style={{
          background: 'none', border: 0, cursor: 'pointer', padding: 4, borderRadius: 6,
          display: 'flex', alignItems: 'center',
        }}
        onMouseOver={e => e.currentTarget.style.background = '#F8F9FB'}
        onMouseOut={e => e.currentTarget.style.background = 'none'}>
          <MS name="close" size={20} color="#65686E" />
        </button>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
        minHeight: 320, borderRadius: 10, background: '#F2F2F2', border: '1px solid #EBEDF1',
        textAlign: 'center', padding: 24,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, background: '#E3E4E7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MS name="description" size={32} color="#9DA0A6" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 16, color: '#3D3F42' }}>Boletim do aluno</span>
          <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', maxWidth: 380 }}>
            Aqui seria exibido o boletim completo do aluno, com notas por disciplina, faltas e observações do período selecionado.
          </span>
        </div>
      </div>
    </div>
  </div>
);

// -------- Pedagógico chart --------
const PedagogicoTab = ({ isEmpty = false }) => {
  const [cicloView, setCicloView] = React.useState('fechado');
  const [etapa, setEtapa] = React.useState('1');
  const [boletimOpen, setBoletimOpen] = React.useState(false);
  if (isEmpty) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, minHeight: 280, textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: '#F8F9FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MS name="pending_actions" size={28} color="#ADB2BA" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 16, color: '#0F0F10' }}>Notas ainda não disponíveis</span>
        <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', maxWidth: 320, display: 'block' }}>As notas deste período serão exibidas quando o lançamento for concluído.</span>
      </div>
    </div>
  );
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Line, Area, ComposedChart, ResponsiveContainer } = Recharts;
  const activeView = CICLO_VIEWS.find(v => v.id === cicloView);
  const chartData = cicloView === 'boletim' ? SUBJECTS_BOLETIM : SUBJECTS_CICLO;
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap', marginBottom: 4,
      }}>
        <div>
          <h2 style={{
            margin: 0, fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 24, lineHeight: '32px',
            color: 'var(--color-neutral-dark3)', letterSpacing: '-0.01em',
          }}>Situação do aluno</h2>
          <p style={{
            margin: '4px 0 0', fontFamily: 'var(--font-body-family)', fontSize: 14, lineHeight: '20px',
            color: '#65686E',
          }}>{activeView.caption}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <EtapaDropdown value={etapa} onChange={setEtapa} />
          <CicloSegmentedControl value={cicloView} onChange={setCicloView} />
        </div>
      </div>

      <div style={{ height: 344, width: '100%', marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 16, left: -8, bottom: 64 }}>
            <defs>
              <linearGradient id="turmaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFAC30" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#FFAC30" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEDF1" />
            <XAxis
              dataKey="name"
              angle={-42}
              textAnchor="end"
              interval={0}
              height={64}
              tick={{ fontFamily: 'var(--font-body-family)', fontSize: 12, fill: '#65686E' }}
              tickLine={false}
              axisLine={{ stroke: '#C3C8D1' }}
              tickFormatter={(v) => v.length > 28 ? v.slice(0, 26) + '…' : v}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fontFamily: 'var(--font-body-family)', fontSize: 12, fill: '#65686E' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                fontFamily: 'var(--font-body-family)', fontSize: 14, border: '1px solid #C3C8D1',
                borderRadius: 8, boxShadow: 'var(--shadow-down-medium)',
              }}
              labelStyle={{ fontWeight: 700, color: '#0F0F10' }}
            />
            <ReferenceLine y={60} stroke="#E65637" strokeDasharray="6 4" strokeWidth={2} />
            <Bar dataKey="aluno" radius={[4, 4, 0, 0]} maxBarSize={32} name="Nota do aluno">
              {chartData.map((entry, index) => (
                <Recharts.Cell key={`cell-${index}`} fill={entry.aluno == null ? '#EBEDF1' : entry.aluno < 60 ? '#E65637' : '#28975A'} />
              ))}
            </Bar>
            <Area type="monotone" dataKey="turma" stroke="#FFAC30" strokeWidth={2}
                  fill="url(#turmaGradient)"
                  dot={{ fill: '#FFAC30', stroke: '#E65637', strokeWidth: 1.5, r: 4 }}
                  name="Média da turma" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend + button */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 24, gap: 20, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          <LegendItem color="#28975A" label="Nota do aluno (aprovado)" shape="bar" />
          <LegendItem color="#E65637" label="Nota do aluno (abaixo da base)" shape="bar" />
          <LegendItem color="#FFAC30" label="Média da turma" shape="line" />
          <LegendItem color="#E65637" label="Base para aprovação" shape="dash" />
        </div>
        <button onClick={() => { setCicloView('boletim'); setBoletimOpen(true); }} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          height: 40, padding: '0 20px',
          background: 'var(--color-primary)', color: '#fff',
          border: 0, borderRadius: 8, cursor: 'pointer',
          fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 16, lineHeight: '16px',
          transition: 'background 160ms',
        }}
        onMouseOver={(e)=>e.currentTarget.style.background='var(--color-primary-dark1)'}
        onMouseOut={(e)=>e.currentTarget.style.background='var(--color-primary)'}>
          Exibir Boletim
          <MS name="arrow_forward" size={18} color="#fff" />
        </button>
      </div>

      {boletimOpen && <BoletimModal onClose={() => setBoletimOpen(false)} />}
    </div>
  );
};

const LegendItem = ({ color, label, shape }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
    {shape === 'bar' && <span style={{ width: 14, height: 14, borderRadius: 3, background: color }} />}
    {shape === 'line' && (
      <svg width="22" height="10"><line x1="0" y1="5" x2="22" y2="5" stroke={color} strokeWidth="2.5" />
        <circle cx="11" cy="5" r="3" fill="#FFAC30" stroke={color} strokeWidth="1.5" />
      </svg>
    )}
    {shape === 'dash' && (
      <svg width="22" height="10"><line x1="0" y1="5" x2="22" y2="5" stroke={color} strokeWidth="2.5" strokeDasharray="4 3" /></svg>
    )}
    <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, lineHeight: '20px', color: 'var(--color-neutral-dark2)' }}>{label}</span>
  </div>
);

// -------- Placeholder for other tabs --------
const TabPlaceholder = ({ name }) => (
  <div style={{
    minHeight: 380, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    color: '#65686E',
  }}>
    <div style={{
      width: 64, height: 64, borderRadius: 16, background: '#F8F9FB',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <MS name="folder_open" size={32} color="#ADB2BA" />
    </div>
    <div style={{ fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 16, color: '#0F0F10' }}>
      Conteúdo de {name}
    </div>
    <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E' }}>
      Esta aba faz parte do protótipo de referência.
    </div>
  </div>
);

Object.assign(window, { ResumoInteligente, TabsRow, PedagogicoTab, TabPlaceholder });
