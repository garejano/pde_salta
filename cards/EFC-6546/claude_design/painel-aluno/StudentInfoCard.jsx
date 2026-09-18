// Left column — student info card
const PRESENCA_ROWS = [
  { periodo: 'Jan\u2013Mar', atrasos: 3, faltas: 8,  saidas: 2, justificadas: 0, presenca: 85 },
  { periodo: 'Abr\u2013Jun', atrasos: 0, faltas: 14, saidas: 1, justificadas: 2, presenca: 81 },
  { periodo: 'Jul\u2013Set', atrasos: 0, faltas: 12, saidas: 3, justificadas: 1, presenca: 84 },
  { periodo: 'Out\u2013Dez', atrasos: 1, faltas: 5,  saidas: 1, justificadas: 0, presenca: 93 },
];

const PRESENCA_DETAILS = {
  'Jan\u2013Mar': [
    { data: '03/02', dia: 'ter', tipo: 'falta' },
    { data: '05/02', dia: 'qui', tipo: 'falta' },
    { data: '06/02', dia: 'sex', tipo: 'atraso' },
    { data: '12/02', dia: 'ter', tipo: 'falta' },
    { data: '18/02', dia: 'ter', tipo: 'atraso' },
    { data: '24/02', dia: 'seg', tipo: 'falta' },
    { data: '26/02', dia: 'qua', tipo: 'falta' },
    { data: '04/03', dia: 'ter', tipo: 'falta' },
    { data: '10/03', dia: 'seg', tipo: 'atraso' },
    { data: '17/03', dia: 'seg', tipo: 'falta' },
    { data: '25/03', dia: 'ter', tipo: 'falta' },
    { data: '15/02', dia: 'sex', tipo: 'saida' },
    { data: '08/03', dia: 'qui', tipo: 'saida' },
  ],
  'Abr\u2013Jun': [
    { data: '07/04', dia: 'seg', tipo: 'falta' },
    { data: '09/04', dia: 'qua', tipo: 'falta' },
    { data: '14/04', dia: 'seg', tipo: 'falta' },
    { data: '23/04', dia: 'qua', tipo: 'falta', justificada: true },
    { data: '28/04', dia: 'seg', tipo: 'falta' },
    { data: '05/05', dia: 'seg', tipo: 'falta' },
    { data: '12/05', dia: 'seg', tipo: 'falta' },
    { data: '19/05', dia: 'seg', tipo: 'falta' },
    { data: '26/05', dia: 'seg', tipo: 'falta', justificada: true },
    { data: '02/06', dia: 'seg', tipo: 'falta' },
    { data: '09/06', dia: 'seg', tipo: 'falta' },
    { data: '16/06', dia: 'seg', tipo: 'falta' },
    { data: '23/06', dia: 'seg', tipo: 'falta' },
    { data: '30/06', dia: 'seg', tipo: 'falta' },
    { data: '10/05', dia: 'sex', tipo: 'saida' },
  ],
  'Jul\u2013Set': [
    { data: '07/07', dia: 'seg', tipo: 'falta' },
    { data: '14/07', dia: 'seg', tipo: 'falta' },
    { data: '21/07', dia: 'seg', tipo: 'falta', justificada: true },
    { data: '28/07', dia: 'seg', tipo: 'falta' },
    { data: '04/08', dia: 'seg', tipo: 'falta' },
    { data: '11/08', dia: 'seg', tipo: 'falta' },
    { data: '18/08', dia: 'seg', tipo: 'falta' },
    { data: '25/08', dia: 'seg', tipo: 'falta' },
    { data: '01/09', dia: 'seg', tipo: 'falta' },
    { data: '08/09', dia: 'seg', tipo: 'falta' },
    { data: '15/09', dia: 'seg', tipo: 'falta' },
    { data: '22/09', dia: 'seg', tipo: 'falta' },
    { data: '15/07', dia: 'ter', tipo: 'saida' },
    { data: '20/08', dia: 'qua', tipo: 'saida' },
    { data: '10/09', dia: 'ter', tipo: 'saida' },
  ],
  'Out\u2013Dez': [
    { data: '06/10', dia: 'seg', tipo: 'falta' },
    { data: '13/10', dia: 'seg', tipo: 'falta' },
    { data: '20/10', dia: 'seg', tipo: 'falta' },
    { data: '27/10', dia: 'seg', tipo: 'atraso' },
    { data: '03/11', dia: 'seg', tipo: 'falta' },
    { data: '15/10', dia: 'qua', tipo: 'saida' },
  ],
};

const presencaBadge = (p) => {
  if (p >= 90) return { bg: '#D9F5E4', fg: '#0E5E2E' };
  if (p >= 83) return { bg: '#FFF3DF', fg: '#B37822' };
  return { bg: '#FBE3DC', fg: '#A13C26' };
};

const faltaColor = (n) => {
  if (n > 10) return { color: '#A13C26', fontWeight: 700 };
  if (n >= 6)  return { color: '#B37822', fontWeight: 600 };
  return { color: '#0F0F10', fontWeight: 400 };
};

const PRESENCA_DETAILS_TEMPO = {
  'Jan–Mar': [
    { data: '03/02', dia: 'ter', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '03/02', dia: 'ter', tempo: '3º tempo', disciplina: 'Física', tipo: 'ausente' },
    { data: '05/02', dia: 'qui', tempo: '1º tempo', disciplina: 'Língua Portuguesa', tipo: 'atrasado' },
    { data: '12/02', dia: 'ter', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '18/02', dia: 'ter', tempo: '1º tempo', disciplina: 'História', tipo: 'atrasado' },
    { data: '24/02', dia: 'seg', tempo: '4º tempo', disciplina: 'Biologia', tipo: 'ausente' },
    { data: '26/02', dia: 'qua', tempo: '3º tempo', disciplina: 'Química', tipo: 'ausente' },
    { data: '04/03', dia: 'ter', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '10/03', dia: 'seg', tempo: '1º tempo', disciplina: 'Geografia', tipo: 'atrasado' },
    { data: '17/03', dia: 'seg', tempo: '2º tempo', disciplina: 'Redação', tipo: 'ausente' },
    { data: '25/03', dia: 'ter', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '15/02', dia: 'sex', tempo: '4º tempo', disciplina: 'Ed. Física', tipo: 'saida_antecipada' },
    { data: '08/03', dia: 'qui', tempo: '3º tempo', disciplina: 'Matemática', tipo: 'saida_antecipada' },
  ],
  'Abr–Jun': [
    { data: '07/04', dia: 'seg', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '09/04', dia: 'qua', tempo: '3º tempo', disciplina: 'Biologia', tipo: 'ausente' },
    { data: '14/04', dia: 'seg', tempo: '1º tempo', disciplina: 'História', tipo: 'ausente' },
    { data: '23/04', dia: 'qua', tempo: '2º tempo', disciplina: 'Português', tipo: 'ausente' },
    { data: '28/04', dia: 'seg', tempo: '4º tempo', disciplina: 'Física', tipo: 'ausente' },
    { data: '05/05', dia: 'seg', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '12/05', dia: 'seg', tempo: '3º tempo', disciplina: 'Química', tipo: 'ausente' },
    { data: '19/05', dia: 'seg', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '26/05', dia: 'seg', tempo: '1º tempo', disciplina: 'Português', tipo: 'ausente' },
    { data: '02/06', dia: 'seg', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '09/06', dia: 'seg', tempo: '3º tempo', disciplina: 'Sociologia', tipo: 'ausente' },
    { data: '16/06', dia: 'seg', tempo: '1º tempo', disciplina: 'História', tipo: 'ausente' },
    { data: '23/06', dia: 'seg', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '30/06', dia: 'seg', tempo: '4º tempo', disciplina: 'Ed. Física', tipo: 'ausente' },
    { data: '10/05', dia: 'sex', tempo: '4º tempo', disciplina: 'Sociologia', tipo: 'saida_antecipada' },
  ],
  'Jul–Set': [
    { data: '07/07', dia: 'seg', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '14/07', dia: 'seg', tempo: '1º tempo', disciplina: 'Português', tipo: 'ausente' },
    { data: '21/07', dia: 'seg', tempo: '3º tempo', disciplina: 'Biologia', tipo: 'ausente' },
    { data: '28/07', dia: 'seg', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '04/08', dia: 'seg', tempo: '1º tempo', disciplina: 'História', tipo: 'ausente' },
    { data: '11/08', dia: 'seg', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '18/08', dia: 'seg', tempo: '4º tempo', disciplina: 'Física', tipo: 'ausente' },
    { data: '25/08', dia: 'seg', tempo: '3º tempo', disciplina: 'Química', tipo: 'ausente' },
    { data: '01/09', dia: 'seg', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '08/09', dia: 'seg', tempo: '1º tempo', disciplina: 'Português', tipo: 'ausente' },
    { data: '15/09', dia: 'seg', tempo: '3º tempo', disciplina: 'Sociologia', tipo: 'ausente' },
    { data: '22/09', dia: 'seg', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '15/07', dia: 'ter', tempo: '3º tempo', disciplina: 'Física', tipo: 'saida_antecipada' },
    { data: '20/08', dia: 'qua', tempo: '4º tempo', disciplina: 'Química', tipo: 'saida_antecipada' },
    { data: '10/09', dia: 'ter', tempo: '3º tempo', disciplina: 'Biologia', tipo: 'saida_antecipada' },
  ],
  'Out–Dez': [
    { data: '06/10', dia: 'seg', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '13/10', dia: 'seg', tempo: '1º tempo', disciplina: 'Português', tipo: 'ausente' },
    { data: '20/10', dia: 'seg', tempo: '3º tempo', disciplina: 'Biologia', tipo: 'ausente' },
    { data: '27/10', dia: 'seg', tempo: '1º tempo', disciplina: 'História', tipo: 'atrasado' },
    { data: '03/11', dia: 'seg', tempo: '2º tempo', disciplina: 'Matemática', tipo: 'ausente' },
    { data: '15/10', dia: 'qua', tempo: '4º tempo', disciplina: 'Ed. Física', tipo: 'saida_antecipada' },
  ],
};


const COMPORTAMENTO_ROWS = [
  { periodo: 'Jan–Mar', positivos: 3, negativos: 0, observacoes: 0 },
  { periodo: 'Abr–Jun', positivos: 4, negativos: 1, observacoes: 1 },
  { periodo: 'Jul–Set', positivos: 0, negativos: 0, observacoes: 0 },
  { periodo: 'Out–Dez', positivos: 0, negativos: 0, observacoes: 0 },
];

const COMPORTAMENTO_DETAILS = {
  'Jan–Mar': [
    { data: '18/03', disciplina: 'Geografia 1', registros: [
      { tipo: 'positivo', label: 'Proatividade' },
      { tipo: 'positivo', label: 'Tarefa feita' },
    ]},
    { data: '17/03', disciplina: 'Inglês 1', registros: [
      { tipo: 'positivo', label: 'Tarefa feita' },
    ]},
    { data: '05/02', disciplina: 'Matemática', registros: [
      { tipo: 'positivo', label: 'Respeito' },
    ]},
  ],
  'Abr–Jun': [
    { data: '03/06', disciplina: 'Física 2', registros: [
      { tipo: 'positivo', label: 'Respeito' },
    ]},
    { data: '14/04', disciplina: 'Inglês 1', registros: [
      { tipo: 'negativo', label: 'Não fez tarefa' },
    ], comentario: 'Não fez a revisão para a prova.' },
    { data: '28/04', disciplina: 'História', registros: [
      { tipo: 'observacao', label: 'Observação' },
    ], comentario: 'Aluno ficou quieto durante toda a aula.' },
    { data: '12/05', disciplina: 'Matemática', registros: [
      { tipo: 'positivo', label: 'Proatividade' },
    ]},
  ],
  'Jul–Set': [],
  'Out–Dez': [],
};

const BADGE_STYLE = {
  positivo:  { bg: '#D9F5E4', fg: '#0E5E2E', border: '#A8DBBA' },
  negativo:  { bg: '#FBE3DC', fg: '#A13C26', border: '#F5BBAF' },
  observacao:{ bg: '#EDE3FF', fg: '#6B21A8', border: '#C9A8F5' },
};

const RegistroBadge = ({ tipo, label }) => {
  const s = BADGE_STYLE[tipo] || BADGE_STYLE.observacao;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 10px', borderRadius: 999,
      background: s.bg, color: s.fg,
      border: `1px solid ${s.border}`,
      fontFamily: 'var(--font-body-family)', fontWeight: 600, fontSize: 12,
      whiteSpace: 'nowrap',
    }}>{label}</span>
  );
};

const ComportamentoTable = () => {
  const [expanded, setExpanded] = React.useState(null);
  const toggle = (p) => setExpanded(e => e === p ? null : p);

  const totalPos = COMPORTAMENTO_ROWS.reduce((s, r) => s + r.positivos, 0);
  const totalNeg = COMPORTAMENTO_ROWS.reduce((s, r) => s + r.negativos, 0);
  const totalObs = COMPORTAMENTO_ROWS.reduce((s, r) => s + r.observacoes, 0);

  const ColIcon = ({ name, color }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <MS name={name} size={15} color={color} />
    </div>
  );

  return (
    <div>
      {/* Totals header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 44px 44px 44px',
        padding: '8px 10px', borderBottom: '1px solid #EBEDF1',
        background: '#fff',
      }}>
        <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, fontWeight: 600, color: 'var(--color-tertiary-dark1)', textTransform: 'uppercase', letterSpacing: '0.04em', alignSelf: 'center' }}>Período</span>
        {[
          { icon: 'thumb_up',   color: '#0E5E2E', val: totalPos },
          { icon: 'thumb_down', color: '#A13C26', val: totalNeg },
          { icon: 'chat_bubble',color: '#6B21A8', val: totalObs },
        ].map((c, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <MS name={c.icon} size={14} color={c.color} />
            <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, color: c.color }}>{c.val}</span>
          </div>
        ))}
      </div>

      {/* Rows */}
      {COMPORTAMENTO_ROWS.map((r) => {
        const isOpen = expanded === r.periodo;
        const records = COMPORTAMENTO_DETAILS[r.periodo] || [];
        const isEmpty = r.positivos === 0 && r.negativos === 0 && r.observacoes === 0;
        return (
          <React.Fragment key={r.periodo}>
            <div
              onClick={() => !isEmpty && toggle(r.periodo)}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 44px 44px 44px',
                padding: '10px 10px',
                borderTop: '1px solid #F2F2F2',
                background: isOpen ? '#EEF0FF' : 'transparent',
                cursor: isEmpty ? 'default' : 'pointer',
                transition: 'background 120ms',
              }}
              onMouseOver={(e) => { if (!isOpen && !isEmpty) e.currentTarget.style.background = '#F8F9FB'; }}
              onMouseOut={(e) => { if (!isOpen && !isEmpty) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {!isEmpty && <MS name={isOpen ? 'expand_less' : 'expand_more'} size={14} color="#65686E" />}
                {isEmpty && <span style={{ width: 14 }} />}
                <span style={{ fontFamily: 'var(--font-body-family)', fontWeight: isOpen ? 700 : 500, fontSize: 14, color: '#0F0F10' }}>{r.periodo}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, color: r.positivos > 0 ? '#0E5E2E' : '#ADB2BA', textAlign: 'center' }}>{r.positivos}</span>
              <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, color: r.negativos > 0 ? '#A13C26' : '#ADB2BA', textAlign: 'center' }}>{r.negativos}</span>
              <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, color: r.observacoes > 0 ? '#6B21A8' : '#ADB2BA', textAlign: 'center' }}>{r.observacoes}</span>
            </div>

            {isOpen && (
              <div style={{ background: '#EEF0FF', padding: '0 10px 12px' }}>
                {/* Records box */}
                <div style={{ border: '0.5px solid #C3C8D1', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                  {/* Header */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '48px 1fr 1fr',
                    padding: '6px 10px', background: '#F2F4FF',
                    borderBottom: '0.5px solid #C3C8D1', gap: 8,
                  }}>
                    {['Data', 'Disciplina', 'Registros'].map((h, i) => (
                      <span key={h} style={{
                        fontFamily: 'var(--font-body-family)', fontSize: 10, fontWeight: 600,
                        color: 'var(--color-tertiary-dark1)',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>{h}</span>
                    ))}
                  </div>
                  {/* Scrollable body */}
                  <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                    {records.map((rec, idx) => (
                      <div key={idx} style={{
                        display: 'grid', gridTemplateColumns: '48px 1fr 1fr',
                        padding: '9px 10px', gap: 8,
                        borderTop: idx > 0 ? '1px solid #F2F2F2' : 'none',
                        alignItems: 'flex-start',
                      }}>
                        <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#0F0F10', fontWeight: 500, paddingTop: 2 }}>{rec.data}</span>
                        <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#3D3F42', paddingTop: 2 }}>{rec.disciplina}</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {rec.registros.map((reg, ri) => <RegistroBadge key={ri} tipo={reg.tipo} label={reg.label} />)}
                          </div>
                          {rec.comentario && (
                            <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E', lineHeight: '16px' }}>{rec.comentario}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const PresenceDetails = ({ viewMode, isEmpty = false, temComportamento = true }) => {
  const [expanded, setExpanded] = React.useState(null);
  const [activeSection, setActiveSection] = React.useState('frequencia');
  const toggle = (p) => setExpanded(e => e === p ? null : p);
  const section = temComportamento ? activeSection : 'frequencia';

  return (
    <div style={{
      background: '#F8F9FB', border: '1px solid #EBEDF1',
      borderRadius: 10, overflow: 'hidden',
      animation: 'fadeSlideDown 200ms cubic-bezier(0.16,1,0.3,1)',
    }}>
      {/* Segment control */}
      {temComportamento && (
      <div style={{
        display: 'flex', gap: 4, padding: '10px 12px',
        borderBottom: '1px solid #EBEDF1', background: '#fff',
      }}>
        {[
          { id: 'frequencia', label: 'Frequência' },
          { id: 'comportamento', label: 'Comportamento' },
        ].map(tab => {
          const active = activeSection === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveSection(tab.id)} style={{
              flex: 1, height: 32, border: 0, borderRadius: 6, cursor: 'pointer',
              fontFamily: 'var(--font-display-family)', fontWeight: active ? 700 : 500, fontSize: 14,
              background: active ? 'var(--color-primary)' : 'transparent',
              color: active ? '#fff' : '#65686E',
              transition: 'all 160ms',
            }}
            onMouseOver={(e) => { if (!active) e.currentTarget.style.background = '#F2F4FF'; }}
            onMouseOut={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
              {tab.label}
            </button>
          );
        })}
      </div>
      )}

      {section === 'frequencia' ? (
        isEmpty ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, minHeight: 220, textAlign: 'center', padding: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: '#F8F9FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MS name="event_busy" size={28} color="#ADB2BA" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 16, color: '#0F0F10' }}>Nenhum registro de frequência</span>
              <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', maxWidth: 260, display: 'block' }}>Os registros de presença deste período ainda não foram lançados.</span>
            </div>
          </div>
        ) : (
          <>
            {/* Header summary */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '4px 12px',
              padding: '10px 14px', borderBottom: '1px solid #EBEDF1',
              background: '#fff',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E' }}>Presença:</span>
              <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 800, fontSize: 18, color: '#28975A' }}>90%</span>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                onMouseEnter={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  const tip = e.currentTarget.querySelector('.info-tip-bubble');
                  if (tip) {
                    tip.style.position = 'fixed';
                    tip.style.top = (r.top - 6) + 'px';
                    tip.style.left = (r.left + r.width / 2) + 'px';
                    tip.style.transform = 'translate(-50%, -100%)';
                    tip.style.opacity = '1';
                    tip.style.zIndex = '9999';
                  }
                }}
                onMouseLeave={(e) => {
                  const tip = e.currentTarget.querySelector('.info-tip-bubble');
                  if (tip) tip.style.opacity = '0';
                }}
              >
                <MS name="info" size={15} color="#ADB2BA" style={{ cursor: 'default', display: 'block' }} />
                <div style={{
                  background: '#1A1E60', color: '#fff',
                  fontFamily: 'var(--font-body-family)', fontSize: 12, lineHeight: '18px',
                  padding: '5px 10px', borderRadius: 6, whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                  pointerEvents: 'none',
                  opacity: 0, transition: 'opacity 140ms',
                }} className="info-tip-bubble">
                  Percentual sobre o previsto: 98%
                </div>
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E' }}>
              {viewMode === 'Por tempo de aula' ? '4 atrasos · 39 tempos ausentes · 7 saídas' : '4 atrasos · 39 faltas · 7 saídas'}
            </span>
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #EBEDF1' }}>
                {(viewMode === 'Por tempo de aula'
                  ? ['Período', 'Ausências', 'Atrasos', 'Saídas']
                  : ['Período', 'Faltas', 'Atrasos', 'Saídas']
                ).map((h, i) => (
                  <th key={h} style={{
                    padding: '8px 10px',
                    fontFamily: 'var(--font-body-family)', fontSize: 12, fontWeight: 600,
                    color: 'var(--color-tertiary-dark1)',
                    textAlign: i === 0 ? 'left' : 'right',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRESENCA_ROWS.map((r, i) => {
                const isOpen = expanded === r.periodo;
                const records = PRESENCA_DETAILS[r.periodo] || [];
                const isLast = i === PRESENCA_ROWS.length - 1;
                return (
                  <React.Fragment key={r.periodo}>
                    {/* Main row */}
                    <tr
                      onClick={() => toggle(r.periodo)}
                      style={{
                        borderBottom: isOpen ? 'none' : (!isLast ? '1px solid #F2F2F2' : 'none'),
                        background: isOpen ? '#EEF0FF' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 120ms',
                      }}
                      onMouseOver={(e) => { if (!isOpen) e.currentTarget.style.background = '#F2F2F2'; }}
                      onMouseOut={(e) => { if (!isOpen) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{
                        padding: '9px 10px',
                        fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10',
                        fontWeight: 500,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MS name={isOpen ? 'expand_less' : 'expand_more'} size={14} color="#65686E" />
                          {r.periodo}
                        </div>
                      </td>
                      <td style={{
                        padding: '9px 10px', textAlign: 'right',
                        fontFamily: 'var(--font-body-family)', fontSize: 14,
                        ...faltaColor(r.faltas),
                      }}>{r.faltas}</td>
                      <td style={{
                        padding: '9px 10px', textAlign: 'right',
                        fontFamily: 'var(--font-body-family)', fontSize: 14,
                        color: r.atrasos > 0 ? '#B37822' : '#65686E',
                        fontWeight: r.atrasos > 0 ? 700 : 400,
                      }}>{r.atrasos}</td>
                      <td style={{
                        padding: '9px 10px', textAlign: 'right',
                        fontFamily: 'var(--font-body-family)', fontSize: 14,
                        color: (r.saidas ?? 0) > 0 ? '#E65637' : '#65686E',
                        fontWeight: (r.saidas ?? 0) > 0 ? 700 : 400,
                      }}>{r.saidas ?? 0}</td>
                    </tr>

                    {/* Expanded content */}
                    {isOpen && (
                      <tr style={{ background: '#EEF0FF' }}>
                        <td colSpan={4} style={{ padding: '0 10px 12px' }}>
                          {viewMode === 'Por tempo de aula' ? (
                            <div style={{ border: '0.5px solid #C3C8D1', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                              <div style={{
                                display: 'grid', gridTemplateColumns: '48px 36px 1fr auto',
                                padding: '6px 10px', gap: 8,
                                background: '#F2F4FF', borderBottom: '0.5px solid #C3C8D1',
                              }}>
                                {['Data', 'Dia', 'Tempo · Disciplina', 'Status'].map((h, i) => (
                                  <span key={h} style={{
                                    fontFamily: 'var(--font-body-family)', fontSize: 10, fontWeight: 600,
                                    color: 'var(--color-tertiary-dark1)',
                                    textTransform: 'uppercase', letterSpacing: '0.06em',
                                    textAlign: i === 3 ? 'right' : 'left',
                                  }}>{h}</span>
                                ))}
                              </div>
                              <div style={{ maxHeight: 170, overflowY: 'auto' }}>
                                {(PRESENCA_DETAILS_TEMPO[r.periodo] || []).map((rec, idx) => (
                                  <div key={idx} style={{
                                    display: 'grid', gridTemplateColumns: '48px 36px 1fr auto',
                                    padding: '8px 10px', gap: 8,
                                    borderTop: idx > 0 ? '1px solid #F2F2F2' : 'none',
                                    alignItems: 'center',
                                  }}>
                                    <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#0F0F10', fontWeight: 500 }}>{rec.data}</span>
                                    <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E' }}>{rec.dia}</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      <span style={{ fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 12, color: '#0F0F10' }}>{rec.tempo}</span>
                                      <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E' }}>{rec.disciplina}</span>
                                    </div>
                                    <span style={{
                                      fontFamily: 'var(--font-body-family)', fontSize: 12, fontWeight: 600,
                                      color: rec.tipo === 'ausente' ? '#A13C26' : rec.tipo === 'atrasado' ? '#B37822' : '#E65637',
                                      textAlign: 'right', whiteSpace: 'nowrap',
                                    }}>
                                      {rec.tipo === 'ausente' ? 'Ausente' : rec.tipo === 'atrasado' ? 'Atrasado' : 'Saída antecipada'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div style={{ border: '0.5px solid #C3C8D1', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                              <div style={{
                                display: 'grid', gridTemplateColumns: '56px 40px 1fr',
                                padding: '6px 10px', background: '#F2F4FF',
                                borderBottom: '0.5px solid #C3C8D1',
                              }}>
                                {['Data', 'Dia', 'Status'].map((h, i) => (
                                  <span key={h} style={{
                                    fontFamily: 'var(--font-body-family)', fontSize: 10, fontWeight: 600,
                                    color: 'var(--color-tertiary-dark1)',
                                    textTransform: 'uppercase', letterSpacing: '0.06em',
                                    textAlign: i === 2 ? 'right' : 'left',
                                  }}>{h}</span>
                                ))}
                              </div>
                              <div style={{ maxHeight: 170, overflowY: 'auto' }}>
                                {records.map((rec, idx) => (
                                  <div key={idx} style={{
                                    display: 'grid', gridTemplateColumns: '56px 40px 1fr',
                                    padding: '7px 10px',
                                    borderTop: idx > 0 ? '1px solid #F2F2F2' : 'none',
                                    alignItems: 'center',
                                  }}>
                                    <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#0F0F10', fontWeight: 500 }}>{rec.data}</span>
                                    <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E' }}>{rec.dia}</span>
                                    <span style={{
                                      fontFamily: 'var(--font-body-family)', fontSize: 12,
                                      color: rec.tipo === 'falta' ? '#A13C26' : rec.tipo === 'atraso' ? '#B37822' : '#E65637',
                                      fontWeight: 600, textAlign: 'right',
                                    }}>
                                      {rec.tipo === 'falta' ? (rec.justificada ? 'Falta · justif.' : 'Falta · não justif.') : rec.tipo === 'atraso' ? 'Atraso' : 'Saída antecipada'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          </>
        )
      ) : (
        <ComportamentoTable />
      )}
    </div>
  );
};

const YEAR_OPTIONS = [
  { y: 2025, escolas: ['Colégio Salta Unidade Centro', 'Colégio Salta Unidade Sul'] },
  { y: 2024, escolas: ['Colégio Salta Unidade Centro'] },
];

const StudentInfoCard = ({ student, subTab, setSubTab, year, onYearChange, viewMode, frequenciaVazia = false, temComportamento = true, filiacaoUnica = false, fichaMedicaVazia = false }) => {
  const [yearOpen, setYearOpen] = React.useState(false);
  const [nomeSocial, setNomeSocial] = React.useState('');
  const [detalhesOpen, setDetalhesOpen] = React.useState(false);
  const yearRef = React.useRef(null);
  const cardRef = React.useRef(null);

  React.useEffect(() => {
    const close = (e) => { if (!yearRef.current?.contains(e.target)) setYearOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const toggleDetalhes = () => setDetalhesOpen(o => !o);

  return (
    <div ref={cardRef} style={{
      background: '#fff', borderRadius: 12, border: '1px solid #EBEDF1',
      padding: 20, display: 'flex', flexDirection: 'column', gap: 18,
    }}>
      {/* Year dropdown */}
      <div ref={yearRef} style={{ position: 'relative' }}>
        <button onClick={() => setYearOpen(o => !o)} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          height: 36, padding: '0 12px 0 14px',
          background: '#fff', border: '1px solid #C3C8D1', borderRadius: 8,
          cursor: 'pointer', width: '100%',
          fontFamily: 'var(--font-body-family)', fontWeight: 600, fontSize: 14, color: '#0F0F10',
        }}>
          <MS name="calendar_today" size={16} color="#65686E" style={{ flexShrink: 0 }} />
          <span style={{ color: '#65686E', fontWeight: 400, flexShrink: 0 }}>Ano Letivo:</span>
          <span style={{ fontWeight: 700, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{year} - {student?.turma || '9º ano Forte A – M'}</span>
          <div style={{ flex: 1 }} />
          <MS name={yearOpen ? 'expand_less' : 'expand_more'} size={18} color="#65686E" style={{ flexShrink: 0 }} />
        </button>
        {yearOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            background: '#fff', border: '1px solid #EBEDF1', borderRadius: 8,
            boxShadow: 'var(--shadow-down-medium)', zIndex: 20, overflow: 'hidden',
          }}>
            {YEAR_OPTIONS.map(({ y, escolas }) => (
              <button key={y} onClick={() => { onYearChange(y); setYearOpen(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', height: 40, padding: '0 14px',
                background: y === year ? 'var(--color-primary-light3)' : '#fff',
                border: 0, cursor: 'pointer',
                fontFamily: 'var(--font-body-family)', fontSize: 14,
                color: y === year ? 'var(--color-primary)' : '#0F0F10',
                fontWeight: y === year ? 700 : 500, textAlign: 'left',
              }}
              onMouseOver={(e)=>{ if(y!==year) e.currentTarget.style.background='#F8F9FB'; }}
              onMouseOut={(e)=>{ if(y!==year) e.currentTarget.style.background='#fff'; }}>
                {y === year && <MS name="check" size={16} color="var(--color-primary)" />}
                <span style={{
                  marginLeft: y === year ? 0 : 24, minWidth: 0, flex: 1,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{y} - {student?.turma || '9º ano Forte A – M'}</span>
                {escolas.length > 1 && (
                  <span title={escolas.join(' · ')} style={{ display: 'inline-flex', flexShrink: 0 }}>
                    <MS name="info" size={16} color={y === year ? 'var(--color-primary)' : '#ADB2BA'} />
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Avatar + name */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 999, flexShrink: 0,
          background: student?.avatarColor || '#FFE0C4',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          overflow: 'hidden', position: 'relative',
          border: '2px solid #fff', boxShadow: '0 0 0 1px #EBEDF1',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 999, background: '#F9D4B8',
            position: 'absolute', bottom: -4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ position: 'absolute', top: 14, left: 14, width: 8, height: 10, borderRadius: 999, background: '#0F0F10' }} />
            <div style={{ position: 'absolute', top: 14, right: 14, width: 8, height: 10, borderRadius: 999, background: '#0F0F10' }} />
            <div style={{ position: 'absolute', bottom: 12, width: 14, height: 6, borderRadius: '0 0 10px 10px', background: '#9D0364' }} />
          </div>
          <div style={{ position: 'absolute', top: 8, width: 60, height: 22, borderRadius: '30px 30px 14px 14px', background: '#fff', border: '2px solid #0F0F10' }} />
          <div style={{ position: 'absolute', top: 4, left: 28, width: 14, height: 14, borderRadius: 999, background: '#fff', border: '2px solid #0F0F10' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 18, color: 'var(--color-neutral-dark3)', lineHeight: '22px', letterSpacing: '-0.01em' }}>
              {nomeSocial || student?.nome || 'Maria Albuquerque Santos'}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 12, color: 'var(--color-primary)', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1 }}>NEE</span>
          </div>
          {(student?.conselho || student?.dependencia) && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              {student?.conselho && (
                <span style={{
                  height: 20, padding: '0 8px', display: 'inline-flex', alignItems: 'center',
                  borderRadius: 999, border: '1px solid #E65637',
                  fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 12,
                  color: '#E65637', background: '#FFF3EE', whiteSpace: 'nowrap',
                }}>Aprovado pelo conselho</span>
              )}
              {student?.dependencia && (
                <span style={{
                  height: 20, padding: '0 8px', display: 'inline-flex', alignItems: 'center',
                  borderRadius: 999, border: '1px solid #A13C26',
                  fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 12,
                  color: '#A13C26', background: '#FBE3DC', whiteSpace: 'nowrap',
                }}>Dependência</span>
              )}
            </div>
          )}
          <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, lineHeight: '20px', color: 'var(--color-neutral-dark1)', marginTop: 6 }}>Mat. {student?.mat || '2024-789456'}</div>
          <div style={{ fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14, color: '#0F0F10', marginTop: 6 }}>
            {student?.turma || '9º ano Forte A – M'}
          </div>
          <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, lineHeight: '20px', color: 'var(--color-neutral-dark2)', marginTop: 4 }}>Colégio Campo Mourão - Alfa</div>
        </div>
      </div>

      {/* 3 KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[
          { n: `${student?.freq ?? 90}%`, label: 'Presença', bg: '#ECEDFF', border: '#242CC2', fg: '#242CC2' },
          { n: 8, label: 'Faltas', bg: '#FBE3DC', border: '#F5BBAF', fg: '#A13C26' },
          { n: 3, label: 'Atrasos', bg: '#FFF3DF', border: '#FFDEAC', fg: '#B37822' },
        ].map((k) => (
          <div key={k.label} style={{
            background: k.bg, border: `1px solid ${k.border}`, borderRadius: 10,
            padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-display-family)', fontWeight: 800, fontSize: 28, color: k.fg, lineHeight: 1 }}>{k.n}</div>
            <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, lineHeight: '20px', color: k.fg, marginTop: 4, fontWeight: 700 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Comportamento counters — algumas escolas não rastreiam comportamento */}
      {temComportamento && (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        background: '#F8F9FB', border: '1px solid #EBEDF1', borderRadius: 10,
        padding: '10px 16px',
      }}>
        {[
          { icon: 'thumb_up',    count: student?.pos ?? 7,  color: '#0E5E2E', bg: '#D9F5E4', label: 'Positivos' },
          { icon: 'thumb_down',  count: student?.neg ?? 1,  color: '#A13C26', bg: '#FBE3DC', label: 'Negativos' },
          { icon: 'chat_bubble', count: student?.obs ?? 1,  color: '#6B21A8', bg: '#EDE3FF', label: 'Observações' },
        ].map((c) => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: c.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <MS name={c.icon} size={15} color={c.color} />
            </div>
            <span style={{
              fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 16,
              color: c.color, lineHeight: 1,
            }}>{c.count}</span>
          </div>
        ))}
      </div>
      )}

      {/* Ver detalhes toggle */}
      <button onClick={toggleDetalhes} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
        alignSelf: 'center', width: 'fit-content',
        background: 'transparent', border: 0, borderBottom: '1px solid transparent',
        lineHeight: '16px', cursor: 'pointer', padding: 0,
        fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14,
        color: 'var(--color-primary)',
        transition: 'border-color 160ms',
      }}
      onMouseOver={(e)=>e.currentTarget.style.borderBottomColor='var(--color-primary)'}
      onMouseOut={(e)=>e.currentTarget.style.borderBottomColor='transparent'}>
        {detalhesOpen ? 'Ocultar detalhes' : 'Ver detalhes'}
        <MS name={detalhesOpen ? 'expand_less' : 'expand_more'} size={16} color="var(--color-primary)" />
      </button>

      {/* Presence details (inline) */}
      {detalhesOpen && <PresenceDetails viewMode={viewMode} isEmpty={frequenciaVazia} temComportamento={temComportamento} />}

      {/* Sub-tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #EBEDF1', margin: '0 -20px', padding: '0 20px' }}>
        {['Perfil', 'Ficha Médica'].map(t => {
          const active = subTab === t;
          return (
            <button key={t} onClick={() => setSubTab(t)} style={{
              flex: 1, padding: '10px 0', background: 'transparent', border: 0,
              borderBottom: `2px solid ${active ? 'var(--color-primary)' : 'transparent'}`,
              cursor: 'pointer', marginBottom: -1,
              fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, lineHeight: '14px',
              color: active ? 'var(--color-primary)' : 'var(--color-neutral-dark1)',
              transition: 'color 160ms, border-color 160ms',
            }}>{t}</button>
          );
        })}
      </div>

      {/* Panel content */}
      {subTab === 'Perfil' ? <PerfilContent nomeSocial={nomeSocial} setNomeSocial={setNomeSocial} nomeNasc={student?.nome || 'Maria Albuquerque Santos'} filiacaoUnica={filiacaoUnica} /> : <FichaMedicaContent vazia={fichaMedicaVazia} />}
    </div>
  );
};

const Field = ({ label, value }) => (
  <div>
    <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, lineHeight: '20px', color: 'var(--color-neutral-dark1)' }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14, lineHeight: '24px', color: 'var(--color-neutral-dark3)', marginTop: 2 }}>{value}</div>
  </div>
);

const CopyableEmail = ({ label, value, labelStyle, valueStyle }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div>
      <div style={labelStyle || { fontFamily: 'var(--font-body-family)', fontSize: 12, lineHeight: '20px', color: 'var(--color-neutral-dark1)' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
        <span style={valueStyle || { fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14, lineHeight: '24px', color: 'var(--color-neutral-dark3)', wordBreak: 'break-all' }}>
          {value}
        </span>
        <button
          onClick={handleCopy}
          title={copied ? 'Copiado!' : 'Copiar e-mail'}
          style={{
            background: 'none', border: 0, padding: 2, borderRadius: 4,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', flexShrink: 0,
          }}
          onMouseOver={e => e.currentTarget.style.background = '#EBEDF1'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}>
          <MS name={copied ? 'check' : 'content_copy'} size={15} color={copied ? '#0E5E2E' : '#65686E'} />
        </button>
      </div>
    </div>
  );
};

const ResponsavelCard = ({ role, tint, outline }) => {
  const { isMobile } = useBreakpoint();
  return (
  <div style={{
    background: tint, border: outline ? '1px solid #E3E5E8' : '1px solid #EBEDF1', borderRadius: 10,
    padding: isMobile ? 12 : 16, display: 'flex', flexDirection: 'column', gap: 8,
  }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, lineHeight: '20px', color: 'var(--color-neutral-dark1)' }}>{role}:</div>
      <div style={{ fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14, lineHeight: '24px', color: 'var(--color-neutral-dark3)' }}>Alelorem Ipsum Dolor Sit Amet</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, lineHeight: '20px', color: 'var(--color-neutral-dark1)' }}>Celular:</div>
        <div style={{ fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14, lineHeight: '20px', color: 'var(--color-neutral-dark3)' }}>(21) 00000-0000</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, lineHeight: '20px', color: 'var(--color-neutral-dark1)' }}>Fixo:</div>
        <div style={{ fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14, lineHeight: '20px', color: 'var(--color-neutral-dark3)' }}>(21) 00000-0000</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <CopyableEmail label="Email:" value="ale12345@email.com"
          labelStyle={{ fontFamily: 'var(--font-body-family)', fontSize: 12, lineHeight: '20px', color: 'var(--color-neutral-dark1)' }}
          valueStyle={{ fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14, lineHeight: '20px', color: 'var(--color-neutral-dark3)', wordBreak: 'break-all' }} />
      </div>
    </div>
  </div>
  );
};

const EditableField = ({ label, value: initialValue }) => {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);
  const [draft, setDraft] = React.useState(initialValue);
  const save = () => { setValue(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };
  if (editing) {
    return (
      <div>
        <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, lineHeight: '20px', color: 'var(--color-neutral-dark1)' }}>{label}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
          <input value={draft} onChange={e => setDraft(e.target.value)} autoFocus style={{
            flex: 1, height: 36, padding: '0 12px',
            border: '1px solid var(--color-primary)', borderRadius: 8,
            fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14,
            color: 'var(--color-neutral-dark3)', outline: 'none', background: '#fff',
          }} />
          <button onClick={save} style={{
            height: 36, padding: '0 12px', borderRadius: 8, border: 0,
            background: 'var(--color-primary)', color: '#fff',
            fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', flexShrink: 0,
          }}>Salvar</button>
          <button onClick={cancel} style={{
            height: 36, padding: '0 10px', borderRadius: 8,
            border: '1px solid #C3C8D1', background: '#fff',
            fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', color: '#65686E', flexShrink: 0,
          }}>✕</button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, lineHeight: '20px', color: 'var(--color-neutral-dark1)' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
        <div style={{ fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14, lineHeight: '24px', color: 'var(--color-neutral-dark3)' }}>{value}</div>
        <button onClick={() => { setDraft(value); setEditing(true); }} style={{
          background: 'none', border: 0, cursor: 'pointer', padding: 2,
          display: 'flex', alignItems: 'center', borderRadius: 4,
          transition: 'background 120ms',
        }}
        onMouseOver={(e)=>e.currentTarget.style.background='#F2F2F2'}
        onMouseOut={(e)=>e.currentTarget.style.background='none'}>
          <MS name="edit" size={14} color="#ADB2BA" />
        </button>
      </div>
    </div>
  );
};

const NomeSocialField = ({ nomeSocial, setNomeSocial, nomeNasc }) => {
  const [mode, setMode] = React.useState('view'); // 'view' | 'editing' | 'actions'
  const [draft, setDraft] = React.useState('');

  const hasSocial = !!nomeSocial;

  const labelSt = {
    fontFamily: 'var(--font-body-family)', fontSize: 12,
    lineHeight: '20px', color: 'var(--color-neutral-dark1)',
  };
  const valueSt = {
    fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14,
    lineHeight: '24px', color: 'var(--color-neutral-dark3)',
  };
  const iconBtnSt = {
    background: 'none', border: 0, cursor: 'pointer', padding: 2,
    display: 'flex', alignItems: 'center', borderRadius: 4,
    transition: 'background 120ms', flexShrink: 0,
  };

  const save = () => {
    if (draft.trim()) setNomeSocial(draft.trim());
    setMode('view');
  };

  const excluir = () => {
    setNomeSocial('');
    setMode('view');
  };

  // ── View sem nome social ──
  if (mode === 'view' && !hasSocial) {
    return (
      <div>
        <div style={labelSt}>Nome social:</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <div style={{ ...valueSt, color: '#ADB2BA', fontWeight: 400 }}>N/A</div>
          <button
            onClick={() => { setDraft(''); setMode('editing'); }}
            style={iconBtnSt}
            onMouseOver={(e) => e.currentTarget.style.background = '#F2F2F2'}
            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
          >
            <MS name="edit" size={14} color="#ADB2BA" />
          </button>
        </div>
      </div>
    );
  }

  // ── View com nome social ──
  if (mode === 'view' && hasSocial) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div>
          <div style={labelSt}>Nome social:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <div style={valueSt}>{nomeSocial}</div>
            <button
              onClick={() => setMode('actions')}
              style={iconBtnSt}
              onMouseOver={(e) => e.currentTarget.style.background = '#F2F2F2'}
              onMouseOut={(e) => e.currentTarget.style.background = 'none'}
            >
              <MS name="edit" size={14} color="#ADB2BA" />
            </button>
          </div>
        </div>
        <div>
          <div style={labelSt}>Nome nasc.:</div>
          <div style={valueSt}>{nomeNasc}</div>
        </div>
      </div>
    );
  }

  // ── Editando ──
  if (mode === 'editing') {
    return (
      <div>
        <div style={labelSt}>Nome social:</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            placeholder="Digite o nome social"
            onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setMode('view'); }}
            style={{
              flex: 1, height: 36, padding: '0 12px',
              border: '1px solid var(--color-primary)', borderRadius: 8,
              fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14,
              color: 'var(--color-neutral-dark3)', outline: 'none', background: '#fff',
            }}
          />
          <button onClick={save} style={{
            height: 36, padding: '0 12px', borderRadius: 8, border: 0,
            background: 'var(--color-primary)', color: '#fff',
            fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', flexShrink: 0, transition: 'background 140ms',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-primary-dark1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'var(--color-primary)'}>
            Salvar
          </button>
          <button onClick={() => setMode('view')} style={{
            height: 36, padding: '0 10px', borderRadius: 8,
            border: '1px solid #C3C8D1', background: '#fff',
            fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', color: '#65686E', flexShrink: 0,
          }}>✕</button>
        </div>
      </div>
    );
  }

  // ── Ações (editar / excluir / cancelar) ──
  if (mode === 'actions') {
    return (
      <div>
        <div style={labelSt}>Nome social:</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
          {/* Read-only display, mesma aparência do input */}
          <div style={{
            flex: 1, height: 36, padding: '0 12px',
            border: '1px solid #C3C8D1', borderRadius: 8,
            display: 'flex', alignItems: 'center',
            fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14,
            color: 'var(--color-neutral-dark3)', background: '#F8F9FB',
            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          }}>
            {nomeSocial}
          </div>
          {/* Editar */}
          <button
            onClick={() => { setDraft(nomeSocial); setMode('editing'); }}
            style={{
              height: 36, padding: '0 14px', borderRadius: 8, border: 0,
              background: 'var(--color-primary)', color: '#fff',
              fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', flexShrink: 0, transition: 'background 140ms',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-primary-dark1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'var(--color-primary)'}
          >Editar</button>
          {/* Excluir */}
          <button
            onClick={excluir}
            style={{
              height: 36, padding: '0 14px', borderRadius: 8,
              border: '1px solid var(--color-error)', background: '#fff',
              color: 'var(--color-error)',
              fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', flexShrink: 0, transition: 'background 140ms',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#FFF0EC'}
            onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
          >Excluir</button>
          {/* Cancelar */}
          <button
            onClick={() => setMode('view')}
            style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              border: '1px solid #C3C8D1', background: '#fff', color: '#65686E',
              fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 16,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 140ms',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#F8F9FB'}
            onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
          >✕</button>
        </div>
      </div>
    );
  }

  return null;
};

const PerfilContent = ({ nomeSocial, setNomeSocial, nomeNasc, filiacaoUnica }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <NomeSocialField nomeSocial={nomeSocial} setNomeSocial={setNomeSocial} nomeNasc={nomeNasc} />
    <Field label="Data de nascimento - Idade:" value="10/04/2011 - 15 anos" />
    <CopyableEmail label="E-mail:" value="Mariasantos@email.com" />
    <Field label="Tipo de saída:" value="Responsáveis" />
    {filiacaoUnica ? (
      <ResponsavelCard role="Responsável Financeiro e Pedagógico" tint="#ECEDFF" />
    ) : (
      <React.Fragment>
        <ResponsavelCard role="Responsável Financeiro" tint="#ECEDFF" />
        <ResponsavelCard role="Responsável Pedagógico" tint="#F5EDFF" />
      </React.Fragment>
    )}

    <ResponsavelCard role="Filiação" tint="#fff" outline />
    <ResponsavelCard role="Filiação" tint="#fff" outline />
  </div>
);

const FichaMedicaModal = ({ open, onClose, vazia = false }) => {
  const [tipoSanguineo, setTipoSanguineo] = React.useState(vazia ? '' : 'O+');
  const [necessidades, setNecessidades] = React.useState(vazia ? '' : 'Não');
  const [alergiasAlimentos, setAlergiasAlimentos] = React.useState(vazia ? '' : 'Não');
  const [alergiaMedicamentos, setAlergiaMedicamentos] = React.useState(vazia ? '' : 'Não');
  const [doencasResp, setDoencasResp] = React.useState(vazia ? '' : 'Não');
  const [nomeContato, setNomeContato] = React.useState(vazia ? '' : 'Priscila');
  const [telefoneContato, setTelefoneContato] = React.useState(vazia ? '' : '(85) 99952-1429');
  const [observacoes, setObservacoes] = React.useState('');

  if (!open) return null;

  const tiposS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const SecHeader = ({ icon, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <MS name={icon} size={20} color="var(--color-primary)" />
      <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 20, color: '#0F0F10', letterSpacing: '-0.01em' }}>{label}</span>
    </div>
  );

  const SubHeader = ({ icon, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
      <MS name={icon} size={15} color="#65686E" />
      <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 13, color: '#65686E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
    </div>
  );

  const YesNo = ({ label, value, onChange }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', lineHeight: '20px' }}>{label}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {['Não', 'Sim'].map(opt => (
          <button key={opt} onClick={() => onChange(opt)} style={{
            padding: '8px 20px', borderRadius: 8,
            background: value === opt ? 'var(--color-primary)' : '#EBEDF1',
            color: value === opt ? '#fff' : '#65686E',
            border: 0, cursor: 'pointer',
            fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
            transition: 'background 140ms, color 140ms',
          }}>{opt}</button>
        ))}
      </div>
    </div>
  );

  const InputField = ({ label, value, onChange }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E' }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} style={{
        height: 40, padding: '0 12px',
        border: '1px solid #C3C8D1', borderRadius: 8,
        fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10',
        outline: 'none', background: '#fff',
        transition: 'border-color 140ms',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
      onBlur={e => e.target.style.borderColor = '#C3C8D1'} />
    </div>
  );

  return ReactDOM.createPortal(
    <React.Fragment>
      {/* Scrim */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(15,15,16,0.28)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 240ms var(--ease-out)', zIndex: 200,
      }} />
      {/* Drawer */}
      <aside style={{
        position: 'fixed', top: 0, right: 0, height: '100vh', width: 'min(480px, 100vw)',
        background: '#fff', borderLeft: '1px solid #EBEDF1',
        boxShadow: '-8px 0 24px rgba(0,23,31,0.08)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 320ms var(--ease-out)',
        zIndex: 201, display: 'flex', flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', padding: '20px 24px',
          borderBottom: '1px solid #EBEDF1', flexShrink: 0,
        }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 12, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ficha Médica</span>
            <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 20, color: '#0F0F10', letterSpacing: '-0.01em' }}>Maria Albuquerque Santos</span>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 999, border: 0,
            background: '#F8F9FB', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 140ms', flexShrink: 0,
          }}
          onMouseOver={e => e.currentTarget.style.background = '#EBEDF1'}
          onMouseOut={e => e.currentTarget.style.background = '#F8F9FB'}>
            <MS name="close" size={20} color="#65686E" />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Histórico Médico */}
          <div>
            <SecHeader icon="medical_information" label="Histórico Médico" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Tipo Sanguíneo */}
              <div>
                <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', marginBottom: 10 }}>Tipo Sanguíneo</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {tiposS.map(t => (
                    <button key={t} onClick={() => setTipoSanguineo(t)} style={{
                      padding: '8px 14px', borderRadius: 8,
                      background: tipoSanguineo === t ? 'var(--color-primary)' : '#EBEDF1',
                      color: tipoSanguineo === t ? '#fff' : '#65686E',
                      border: 0, cursor: 'pointer',
                      fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
                      transition: 'background 140ms, color 140ms',
                    }}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Yes/No grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <YesNo label="Seu filho possui necessidades especiais?" value={necessidades} onChange={setNecessidades} />
                <YesNo label="Seu filho possui alergias à alimentos?" value={alergiasAlimentos} onChange={setAlergiasAlimentos} />
                <YesNo label="Seu filho possui alergias à medicamentos?" value={alergiaMedicamentos} onChange={setAlergiaMedicamentos} />
                <YesNo label="Seu filho possui doenças respiratórias?" value={doencasResp} onChange={setDoencasResp} />
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: '#EBEDF1' }} />

          {/* Outras Informações */}
          <div>
            <SecHeader icon="info" label="Outras Informações" />

            {/* Contato de Emergência */}
            <div style={{ marginBottom: 20 }}>
              <SubHeader icon="smartphone" label="Contato de Emergência" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <InputField label="Nome do Contato" value={nomeContato} onChange={setNomeContato} />
                <InputField label="Telefone para contato" value={telefoneContato} onChange={setTelefoneContato} />
              </div>
            </div>

            {/* Observações */}
            <div>
              <SubHeader icon="description" label="Observações" />
              <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} rows={4}
                placeholder="Adicione observações médicas..."
                style={{
                  width: '100%', padding: '10px 12px',
                  border: '1px solid #C3C8D1', borderRadius: 8,
                  fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10',
                  outline: 'none', resize: 'vertical', background: '#fff',
                  transition: 'border-color 140ms',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = '#C3C8D1'} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid #EBEDF1',
          display: 'flex', justifyContent: 'flex-end', gap: 8, flexShrink: 0,
          background: '#F8F9FB',
        }}>
          <button onClick={onClose} style={{
            height: 40, padding: '0 20px', borderRadius: 8,
            border: '1px solid #C3C8D1', background: '#fff',
            fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', color: '#65686E', transition: 'background 140ms',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#F2F2F2'}
          onMouseOut={e => e.currentTarget.style.background = '#fff'}>Cancelar</button>
          <button onClick={onClose} style={{
            height: 40, padding: '0 20px', borderRadius: 8, border: 0,
            background: 'var(--color-primary)', color: '#fff',
            fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', transition: 'background 140ms',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--color-primary-dark1)'}
          onMouseOut={e => e.currentTarget.style.background = 'var(--color-primary)'}>Salvar</button>
        </div>
      </aside>
    </React.Fragment>,
    document.body
  );
};

const FichaMedicaContent = ({ vazia = false }) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  if (vazia) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12, padding: '32px 16px' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 999, background: '#F8F9FB',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MS name="medical_information" size={28} color="#ADB2BA" />
        </div>
        <div style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 16, color: '#3D3F42' }}>Ficha médica não informada</div>
        <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', lineHeight: 1.4, maxWidth: 280 }}>
          Nenhuma informação de saúde foi cadastrada para este aluno ainda.
        </div>
        <button onClick={() => setModalOpen(true)} style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          height: 40, padding: '0 20px', borderRadius: 8, border: 0, marginTop: 8,
          background: 'var(--color-primary)', color: '#fff',
          fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
          cursor: 'pointer', transition: 'background 140ms',
        }}
        onMouseOver={e => e.currentTarget.style.background = 'var(--color-primary-dark1)'}
        onMouseOut={e => e.currentTarget.style.background = 'var(--color-primary)'}>
          <MS name="add" size={16} color="#fff" />
          Preencher ficha médica
        </button>
        <FichaMedicaModal open={modalOpen} onClose={() => setModalOpen(false)} vazia />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Field label="Tipo sanguíneo:" value="O+" />
      <Field label="Necessidades especiais:" value="Não" />
      <Field label="Alergias a alimentos:" value="Não" />
      <Field label="Alergia a medicamentos:" value="Não" />
      <Field label="Doenças respiratórias:" value="Não" />
      <Field label="Contato de emergência:" value="Priscila · (85) 99952-1429" />
      <Field label="Observações:" value="Aluna saudável, sem restrições para atividades físicas." />
      <div style={{
        background: '#FFF3DF', border: '1px solid #FFDEAC', borderRadius: 10, padding: 12,
        display: 'flex', gap: 10,
      }}>
        <MS name="info" size={18} color="#B37822" />
        <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#B37822', lineHeight: 1.4 }}>
          Ficha médica atualizada em 15/02/2026 por <strong>Ana Paula (Coordenadora)</strong>.
        </div>
      </div>
      <button onClick={() => setModalOpen(true)} style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        height: 40, borderRadius: 8, border: 0,
        background: 'var(--color-primary)', color: '#fff',
        fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
        cursor: 'pointer', transition: 'background 140ms',
      }}
      onMouseOver={e => e.currentTarget.style.background = 'var(--color-primary-dark1)'}
      onMouseOut={e => e.currentTarget.style.background = 'var(--color-primary)'}>
        <MS name="edit" size={16} color="#fff" />
        Editar ficha médica
      </button>
      <FichaMedicaModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

Object.assign(window, { StudentInfoCard });
