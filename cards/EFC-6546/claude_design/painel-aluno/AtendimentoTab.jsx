// AtendimentoTab — Atendimento tab for Painel do Aluno
const { useState } = React;

const ATEND_RECORDS = [
  { id: 1, data: '16/06/2026', tipo: 'Disciplinar',  atendente: 'Debora Lima Medeiros de Albuquerque', solicitante: 'Coordenador/Diretor', atendimentoAo: 'Aluno', motivo: 'Comunicado de Advertência' },
  { id: 2, data: '10/06/2026', tipo: 'Acadêmico',    atendente: 'Ana Carolina Yatuhara da Silva',       solicitante: 'Coordenador/Diretor', atendimentoAo: 'Responsável', motivo: 'Análise de boletim e gráfico de rendimento', destaque: true,
    norteadores: 'Verificar evolução das notas de Matemática e alinhar plano de estudo com a família.',
    resumo: 'Responsável relatou dificuldade de concentração em casa. Combinado acompanhamento quinzenal e reforço de Matemática às terças-feiras.',
    comentario: 'Família receptiva e comprometida com o plano de acompanhamento.',
    proximosPassos: 'Reavaliar em 30 dias e comunicar o professor de Matemática sobre o combinado.',
    emailEnviado: true,
    emailDestinatarios: [{ label: 'Responsável pedagógico', email: 'rp.mariaalbuquerque@email.com.br' }, { label: 'Responsável financeiro', email: 'rf.mariaalbuquerque@email.com.br' }] },
  { id: 3, data: '03/10/2025', tipo: 'Psicossocial', atendente: 'Stephanie Cristina Candida Machado Barbosa',  solicitante: 'Coordenador/Diretor', atendimentoAo: 'Aluno', motivo: 'Orientação Comportamental',
    emailEnviado: true,
    emailDestinatarios: [{ label: 'Responsável pedagógico', email: 'rp.mariaalbuquerque@email.com.br' }] },
  { id: 4, data: '29/09/2025', tipo: 'Acadêmico',    atendente: 'Jullorem Ipsum Dolor S',                      solicitante: 'Coordenador/Diretor', atendimentoAo: 'Aluno', motivo: 'Análise de Utilização do Atlas' },
  { id: 5, data: '14/08/2025', tipo: 'Rotina',       atendente: 'Jullorem Ipsum Dolor S',                      solicitante: 'Coordenador/Diretor', atendimentoAo: 'Aluno', motivo: 'Esclarecimento de Dúvidas' },
];

const PANEL_KEYS = {
  'Norteadores': 'norteadores',
  'Resumo da conversa': 'resumo',
  'Comentários': 'comentario',
  'Próximos passos': 'proximosPassos',
};

const CARD_PANELS = ['Norteadores', 'Resumo da conversa', 'Comentários', 'Próximos passos'];

/* ── Field wrapper ── */
const AtField = ({ label, children, emphasis = false, required = false }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
    {label && (
      <label style={{
        fontFamily: 'var(--font-body-family)',
        fontSize: emphasis ? 15 : 12,
        color: emphasis ? '#0F0F10' : '#65686E',
        fontWeight: emphasis ? 700 : 600,
      }}>
        {label}{required && <span style={{ color: '#E65637' }}> *</span>}
      </label>
    )}
    {children}
  </div>
);

const atInputBase = {
  height: 40, border: '1px solid #C3C8D1', borderRadius: 8, padding: '0 12px',
  fontFamily: 'var(--font-body-family)', fontSize: 14, background: '#fff', width: '100%',
  outline: 'none',
};

const ATENDENTES_LIST = [
  'Adilson Vargas de Matos',
  'Ana Carolina Yatuhara da Silva',
  'Debora Lima Medeiros de Albuquerque',
  'Marcelo Bruno Matias da Silva',
  'Stephanie Cristina Candida Machado Barbosa',
];

const RESPONSAVEIS_LIST = [
  'Alelorem Ipsum Dolor Sit Amet (Responsável Financeiro)',
  'Alelorem Ipsum Dolor Sit Amet (Responsável Pedagógico)',
];

/* ── Generic multi-select (chips) ── */
const MultiSelectField = ({ value, onChange, options: allOptions, placeholder = 'Selecione...', chipColor = 'var(--color-primary)' }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const options = allOptions.filter(a => !value.includes(a));
  const toggle = (name) => onChange(value.includes(name) ? value.filter(v => v !== name) : [...value, name]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div onClick={() => setOpen(o => !o)} style={{
        minHeight: 40, border: '1px solid #C3C8D1', borderRadius: 8, padding: '6px 8px',
        display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', cursor: 'pointer', background: '#fff',
      }}>
        {value.length === 0 && (
          <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#ADB2BA', padding: '0 4px' }}>{placeholder}</span>
        )}
        {value.map(name => (
          <span key={name} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 28, padding: '0 8px 0 10px', borderRadius: 6,
            background: chipColor, color: '#fff',
            fontFamily: 'var(--font-body-family)', fontSize: 13, fontWeight: 600,
          }}>
            {name}
            <button onClick={(e) => { e.stopPropagation(); toggle(name); }} style={{
              background: 'none', border: 0, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', padding: 0,
            }}>
              <MS name="close" size={14} color="#fff" />
            </button>
          </span>
        ))}
      </div>
      {open && options.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 20,
          background: '#fff', border: '1px solid #EBEDF1', borderRadius: 8,
          boxShadow: 'var(--shadow-down-medium)', overflow: 'hidden', maxHeight: 220, overflowY: 'auto',
        }}>
          {options.map(name => (
            <button key={name} onClick={() => toggle(name)} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px',
              border: 0, background: '#fff', cursor: 'pointer',
              fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#F8F9FB'}
            onMouseOut={e => e.currentTarget.style.background = '#fff'}>
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Toggle section (Objetivo / Norteadores) ── */
const ToggleSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: open ? 8 : 0 }}>
        <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 16, color: '#0F0F10' }}>{title}</span>
        <button onClick={() => setOpen(o => !o)} style={{
          background: 'none', border: 0, cursor: 'pointer', padding: 0,
          fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14, color: 'var(--color-primary)',
        }}>
          {open ? 'Ocultar' : 'Exibir'}
        </button>
      </div>
      {open && (
        <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#3D3F42', lineHeight: '22px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

/* ── Norteadores question primitives ── */
const NQLabel = ({ children, note }) => (
  <div style={{ marginBottom: note ? 4 : 10 }}>
    <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#3D3F42', fontWeight: 600 }}>{children}</div>
    {note && <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E', marginTop: 2 }}>{note}</div>}
  </div>
);

const NQRadio = ({ id, options, value, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18, marginTop: 8 }}>
    {options.map(o => (
      <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10' }}>
        <input type="radio" name={id} value={o} checked={value === o} onChange={() => onChange(o)}
          style={{ accentColor: 'var(--color-primary)', cursor: 'pointer', width: 15, height: 15 }} />
        {o}
      </label>
    ))}
  </div>
);

const NQCheck = ({ options, value, onChange }) => {
  const toggle = (o) => onChange(value.includes(o) ? value.filter(x => x !== o) : [...value, o]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18, marginTop: 8 }}>
      {options.map(o => (
        <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10' }}>
          <input type="checkbox" checked={value.includes(o)} onChange={() => toggle(o)}
            style={{ accentColor: 'var(--color-primary)', cursor: 'pointer', width: 14, height: 14 }} />
          {o}
        </label>
      ))}
    </div>
  );
};

const NQInput = ({ value, onChange, placeholder }) => (
  <div style={{ marginBottom: 18, marginTop: 8 }}>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
      height: 40, border: '1px solid #C3C8D1', borderRadius: 8, padding: '0 12px',
      fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10',
      background: '#fff', outline: 'none', width: '100%',
    }} />
  </div>
);

const NQTextarea = ({ value, onChange, placeholder }) => (
  <div style={{ marginBottom: 18, marginTop: 8 }}>
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{
      border: '1px solid #C3C8D1', borderRadius: 8, padding: '10px 12px', width: '100%',
      fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10',
      background: '#fff', outline: 'none', resize: 'vertical',
    }} />
  </div>
);

const NQSelect = ({ value, onChange, options, placeholder = 'Selecione...' }) => (
  <div style={{ marginBottom: 18, marginTop: 8 }}>
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      height: 40, border: '1px solid #C3C8D1', borderRadius: 8, padding: '0 12px',
      fontFamily: 'var(--font-body-family)', fontSize: 14, background: '#fff',
      color: value ? '#0F0F10' : '#ADB2BA', width: '100%', cursor: 'pointer',
    }}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const DISCIPLINAS_LIST = ['Biologia', 'Física', 'Geografia', 'História', 'Língua Portuguesa', 'Língua Inglesa', 'Literatura', 'Matemática', 'Redação', 'Sociologia'];

const NORTEADORES_DEFAULT = {
  menoresNotas: '', maioresNotas: '', antecedencia: '',
  deveresCasa: '', deveresCasaPorque: '',
  estudoAcompanhado: [], aulaParticular: '', aulaParticularDisciplina: '',
  obstaculos: '', reacaoExercicio: '',
  problemasCasa: '', problemasCasaQuais: '',
  planoEstudos: '', planoEstudosPorque: '',
  monitoriaPresencial: '', monitoriaPorque: '',
  muitasFaltasPorque: '', muitosAtrasosPorque: '',
  melhoriaAluno: '', melhoriaEscola: '',
  questaoEmocional: '', observacaoEmocional: '',
};

/* ── Norteadores questionnaire (i – xvi) ── */
const NorteadoresQuestionario = ({ value, onChange }) => {
  const set = (k) => (v) => onChange({ ...value, [k]: v });
  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Tópicos a serem abordados:</div>
      <ul style={{ margin: '0 0 18px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <li>Analisar as faltas e atrasos do aluno no sistema. Se tiver muitas faltas, perguntar o motivo e entender como a escola pode ajudar (dificuldade para acordar cedo, falta de sono, dificuldade de organização nos estudos, etc.).</li>
        <li>Analisar as marcações de comportamento feitas pelos professores, para entender como é a conduta do aluno em sala de aula.</li>
        <li>Analisar os dados de utilização do sistema pelo aluno. Entender se está sendo usado ou não, e orientar sobre o uso.</li>
        <li>Falar da importância do sistema como suporte nos estudos.</li>
      </ul>

      <NQLabel>i. 4 disciplinas com as menores notas: por que acha que foi mal?</NQLabel>
      <NQInput value={value.menoresNotas} onChange={set('menoresNotas')} />

      <NQLabel>ii. 4 disciplinas com maiores notas: o que fez para ir bem?</NQLabel>
      <NQInput value={value.maioresNotas} onChange={set('maioresNotas')} />

      <NQLabel>iii. Estudou com que antecêdencia?</NQLabel>
      <NQRadio id="antecedencia" value={value.antecedencia} onChange={set('antecedencia')}
        options={['Na véspera', 'Uma semana antes', 'Um mês antes', 'Aula dada, aula estudada', 'Não estudou']} />

      <NQLabel>iv. Fez os deveres de casa?</NQLabel>
      <NQRadio id="deveresCasa" value={value.deveresCasa} onChange={set('deveresCasa')} options={['Sim', 'Não']} />
      {value.deveresCasa === 'Não' && (<>
        <NQLabel>Se não, por quê?</NQLabel>
        <NQInput value={value.deveresCasaPorque} onChange={set('deveresCasaPorque')} />
      </>)}

      <NQLabel>v. Estudou sozinho ou acompanhado?</NQLabel>
      <NQCheck value={value.estudoAcompanhado} onChange={set('estudoAcompanhado')}
        options={['Sozinho', 'Família', 'Amigos', 'Internet', 'Professor particular']} />

      <NQLabel>vi. Faz aula particular?</NQLabel>
      <NQRadio id="aulaParticular" value={value.aulaParticular} onChange={set('aulaParticular')} options={['Sim', 'Não']} />
      {value.aulaParticular === 'Sim' && (<>
        <NQLabel>Disciplina(s):</NQLabel>
        <NQSelect value={value.aulaParticularDisciplina} onChange={set('aulaParticularDisciplina')} options={DISCIPLINAS_LIST} />
      </>)}

      <NQLabel note="Ex: quando o aluno não vai bem em determinada prova, qual é a reação seguinte.">vii. Como o aluno, em geral, lida com os obstáculos?</NQLabel>
      <NQRadio id="obstaculos" value={value.obstaculos} onChange={set('obstaculos')}
        options={['Fica triste e desiste com facilidade', 'Fica triste por um período, mas logo dá a volta por cima', 'Entende que faz parte e não se deixa abalar']} />

      <NQLabel>viii. Como o aluno, em geral, reage quando não sabe algum exercício no material?</NQLabel>
      <NQRadio id="reacaoExercicio" value={value.reacaoExercicio} onChange={set('reacaoExercicio')}
        options={['Segue em frente', 'Procura os colegas', 'Procura a monitoria', 'Acessa o sistema', 'Não faz exercícios']} />

      <NQLabel>ix. Está com problemas em casa que estejam atrapalhando a concentração nos estudos?</NQLabel>
      <NQRadio id="problemasCasa" value={value.problemasCasa} onChange={set('problemasCasa')} options={['Sim', 'Não']} />
      {value.problemasCasa === 'Sim' && (<>
        <NQLabel>Se sim, quais?</NQLabel>
        <NQInput value={value.problemasCasaQuais} onChange={set('problemasCasaQuais')} />
      </>)}

      <NQLabel>x. Seguiu algum plano de estudos?</NQLabel>
      <NQRadio id="planoEstudos" value={value.planoEstudos} onChange={set('planoEstudos')} options={['Sim', 'Não']} />
      {value.planoEstudos === 'Não' && (<>
        <NQLabel>Se não, por quê?</NQLabel>
        <NQInput value={value.planoEstudosPorque} onChange={set('planoEstudosPorque')} />
      </>)}

      <NQLabel>xi. Frequenta a monitoria presencial?</NQLabel>
      <NQRadio id="monitoriaPresencial" value={value.monitoriaPresencial} onChange={set('monitoriaPresencial')} options={['Sim', 'Não']} />
      {value.monitoriaPresencial === 'Não' && (<>
        <NQLabel>Se não, por quê?</NQLabel>
        <NQInput value={value.monitoriaPorque} onChange={set('monitoriaPorque')} />
      </>)}

      <NQLabel>xii. Se teve muitas faltas, por quê?</NQLabel>
      <NQInput value={value.muitasFaltasPorque} onChange={set('muitasFaltasPorque')} />

      <NQLabel>xiii. Se teve muitos atrasos, por quê?</NQLabel>
      <NQInput value={value.muitosAtrasosPorque} onChange={set('muitosAtrasosPorque')} />

      <NQLabel>xiv. O que pode fazer para melhorar as notas para o próximo ciclo/simulado?</NQLabel>
      <NQInput value={value.melhoriaAluno} onChange={set('melhoriaAluno')} />

      <NQLabel>xv. O que a <strong>escola</strong> pode fazer para ajudar a melhorar as notas para o próximo ciclo?</NQLabel>
      <NQInput value={value.melhoriaEscola} onChange={set('melhoriaEscola')} />

      <NQLabel>xvi. O aluno aparenta/apresenta alguma questão emocional que tenha desencadeado o problema acadêmico?</NQLabel>
      <NQRadio id="questaoEmocional" value={value.questaoEmocional} onChange={set('questaoEmocional')} options={['Sim', 'Não']} />

      <NQLabel>Observação (sobre questão emocional):</NQLabel>
      <NQTextarea value={value.observacaoEmocional} onChange={set('observacaoEmocional')} />
    </div>
  );
};

/* ── Novo Atendimento form ── */
const NovoAtendForm = ({ onClose, onSave, onDirtyChange, rfSemEmail = false }) => {
  const [form, setForm] = useState({
    data: '', solicitante: 'Aluno', atendimentoAo: 'Aluno', tipo: '', motivo: '', atendentes: [], responsaveisAtendidos: [],
  });
  const [norteadores, setNorteadores] = useState(NORTEADORES_DEFAULT);
  const [resumoConversa, setResumoConversa] = useState('');
  const [proximosPassos, setProximosPassos] = useState('');
  const [enviarRP, setEnviarRP] = useState(false);
  const [enviarRF, setEnviarRF] = useState(false);
  const [comentarios, setComentarios] = useState('');
  const [verificacao, setVerificacao] = useState('');
  const [marcarImportante, setMarcarImportante] = useState(false);
  const s = (k) => (e) => setForm(f => ({ ...f, [k]: e.target ? e.target.value : e }));
  const needsResponsaveis = form.atendimentoAo === 'Profissional Saúde Particular' || form.atendimentoAo === 'Responsável';
  const allFilled = !!(form.data && form.solicitante && form.atendimentoAo && form.tipo && form.motivo && form.atendentes.length > 0 && (!needsResponsaveis || form.responsaveisAtendidos.length > 0));
  const isDirty = !!(form.data || form.tipo || form.motivo || form.atendentes.length > 0 || form.responsaveisAtendidos.length > 0 ||
    resumoConversa.trim() || proximosPassos.trim() || comentarios.trim() || verificacao.trim() || marcarImportante || enviarRP || enviarRF ||
    norteadores !== NORTEADORES_DEFAULT);
  React.useEffect(() => { onDirtyChange && onDirtyChange(isDirty); }, [isDirty]);
  React.useEffect(() => () => { onDirtyChange && onDirtyChange(false); }, []);

  return (
    <div style={{
      border: '1px solid #EBEDF1', borderRadius: 8, padding: 20,
      marginBottom: 20, background: '#F8F9FB',
      animation: 'fadeSlideDown 160ms ease-out',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Row 1 */}
        <div style={{ display: 'flex', gap: 14 }}>
          <AtField label="Data" required>
            <input type="date" value={form.data} onChange={s('data')} style={atInputBase} />
          </AtField>
          <AtField label="Solicitante" required>
            <select value={form.solicitante} onChange={s('solicitante')} style={atInputBase}>
              {['Aluno', 'Coordenador/Diretor', 'Família'].map(o => <option key={o}>{o}</option>)}
            </select>
          </AtField>
        </div>
        {/* Row 2 */}
        <div style={{ display: 'flex', gap: 14 }}>
          <AtField label="Atendimento Ao" required>
            <select value={form.atendimentoAo} onChange={s('atendimentoAo')} style={atInputBase}>
              {['Aluno', 'Profissional Saúde Particular', 'Responsável'].map(o => <option key={o}>{o}</option>)}
            </select>
          </AtField>
          <AtField label="Tipo" required>
            <select value={form.tipo} onChange={s('tipo')} style={{ ...atInputBase, color: form.tipo ? '#0F0F10' : '#ADB2BA' }}>
              <option value="">Selecione...</option>
              {['Acadêmico', 'Psicossocial', 'Rotina', 'Administrativo'].map(o => <option key={o}>{o}</option>)}
            </select>
          </AtField>
        </div>

        {(form.atendimentoAo === 'Profissional Saúde Particular' || form.atendimentoAo === 'Responsável') && (
          <div style={{ display: 'flex', gap: 14 }}>
            <AtField label="Responsável(eis) Atendido(s)" required>
              <MultiSelectField value={form.responsaveisAtendidos} options={RESPONSAVEIS_LIST}
                onChange={(v) => setForm(f => ({ ...f, responsaveisAtendidos: v }))} />
            </AtField>
          </div>
        )}

        {/* Row 3 */}
        <div style={{ display: 'flex', gap: 14 }}>
          <AtField label="Motivo" required>
            <select value={form.motivo} onChange={s('motivo')} style={{ ...atInputBase, color: form.motivo ? '#0F0F10' : '#ADB2BA' }}>
              <option value=""></option>
              {['Análise de boletim', 'Orientação Comportamental', 'Esclarecimento de Dúvidas', 'Outros'].map(o => <option key={o}>{o}</option>)}
            </select>
          </AtField>
          <AtField label="Atendente(s)" required>
            <MultiSelectField value={form.atendentes} options={ATENDENTES_LIST} onChange={(v) => setForm(f => ({ ...f, atendentes: v }))} />
          </AtField>
        </div>

        {allFilled ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 28, borderTop: '1px solid #EBEDF1', marginTop: 8 }}>
            <ToggleSection title="Objetivo">
              Analisar o conjunto de fatores que impactam diretamente no desempenho acadêmico do aluno (boletim, faltas, comportamento e comprometimento) a fim de traçar estratégias de melhoria contínua, sempre no pós ciclo.
            </ToggleSection>
            <ToggleSection title="Norteadores para atendimento">
              <NorteadoresQuestionario value={norteadores} onChange={setNorteadores} />
            </ToggleSection>

            {/* Atendimento — registro final */}
            <div style={{
              border: '1px solid #C3C8D1', borderRadius: 8, padding: 20,
              background: '#fff', display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 16, color: '#0F0F10', marginBottom: 12 }}>
                Atendimento
              </span>

              <AtField label="Resumo da Conversa" emphasis required>
                <textarea value={resumoConversa} onChange={e => setResumoConversa(e.target.value)} rows={3}
                  style={{ ...atInputBase, height: 'auto', padding: '10px 12px', resize: 'vertical' }} />
              </AtField>

              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <AtField label="Próximos Passos" emphasis>
                    <textarea value={proximosPassos} onChange={e => setProximosPassos(e.target.value)} rows={3}
                      placeholder="Caso necessário, elencar ações a serem realizadas pelas partes como consequência do atendimento."
                      style={{ ...atInputBase, height: 'auto', padding: '10px 12px', resize: 'vertical' }} />
                  </AtField>
                </div>
                <div style={{ flex: 1 }}>
                  <AtField label="Verificação" emphasis>
                    <input type="date" value={verificacao} onChange={e => setVerificacao(e.target.value)} style={atInputBase} />
                  </AtField>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10', fontWeight: 600 }}>Enviar por e-mail para</span>
                <div style={{ display: 'flex', gap: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={enviarRP} onChange={e => setEnviarRP(e.target.checked)}
                      style={{ accentColor: 'var(--color-primary)', cursor: 'pointer', width: 15, height: 15 }} />
                    <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10' }}>Responsável pedagógico</span>
                  </label>
                  <label
                    title={rfSemEmail ? 'Este responsável não possui e-mail cadastrado. Cadastre um e-mail para habilitar o envio.' : undefined}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: rfSemEmail ? 'not-allowed' : 'pointer' }}>
                    <input type="checkbox" checked={!rfSemEmail && enviarRF} disabled={rfSemEmail} onChange={e => setEnviarRF(e.target.checked)}
                      style={{ accentColor: 'var(--color-primary)', cursor: rfSemEmail ? 'not-allowed' : 'pointer', width: 15, height: 15 }} />
                    <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: rfSemEmail ? '#ADB2BA' : '#0F0F10' }}>Responsável financeiro{rfSemEmail && ' — sem e-mail cadastrado'}</span>
                  </label>
                </div>
              </div>
              <p style={{
                margin: '2px 0 16px 23px', fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#A13C26', lineHeight: '18px',
              }}>
                As informações digitadas em <strong>Resumo da Conversa</strong> e <strong>Próximos Passos</strong> serão enviadas por e-mail ao responsável caso esta caixa esteja marcada.
              </p>

              <div style={{ height: 1, background: '#EBEDF1', margin: '4px 0 16px' }} />

              <AtField label="Comentários" emphasis>
                <textarea value={comentarios} onChange={e => setComentarios(e.target.value)} rows={3}
                  style={{ ...atInputBase, height: 'auto', padding: '10px 12px', resize: 'vertical' }} />
              </AtField>
              <p style={{
                margin: '2px 0 16px', fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E', lineHeight: '18px',
              }}>
                Informações digitadas neste campo são internas e não serão enviadas por e-mail ao responsável, mesmo que a caixa de envio esteja marcada.
              </p>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={marcarImportante} onChange={e => setMarcarImportante(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)', cursor: 'pointer', width: 15, height: 15 }} />
                <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10' }}>Marcar como Importante</span>
              </label>
            </div>

            {/* Simulação de e-mail */}
            <div style={{
              border: '1px solid #C3C8D1', borderRadius: 8, padding: 20,
              background: '#fff', display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <MS name="mail" size={18} color="#65686E" />
                <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 16, color: '#0F0F10' }}>
                  Simulação de e-mail enviado ao responsável
                </span>
              </div>

              {(enviarRP || enviarRF) && (resumoConversa.trim() || proximosPassos.trim()) ? (
                <div style={{ border: '1px solid #EBEDF1', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ background: '#F8F9FB', padding: '14px 18px', borderBottom: '1px solid #EBEDF1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 13, color: '#65686E' }}>
                      Para: <span style={{ color: '#0F0F10', fontWeight: 600 }}>
                        {[enviarRP && 'Responsável pedagógico (rp.mariaalbuquerque@email.com.br)', enviarRF && 'Responsável financeiro (rf.mariaalbuquerque@email.com.br)'].filter(Boolean).join(' e ')}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 13, color: '#65686E' }}>
                      Assunto: <span style={{ color: '#0F0F10', fontWeight: 600 }}>Registro de atendimento — Maria Albuquerque Santos</span>
                    </div>
                  </div>
                  <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <p style={{ margin: 0, fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#3D3F42', lineHeight: '22px' }}>
                      Olá, informamos que foi registrado um atendimento referente a Maria Albuquerque Santos. Seguem os detalhes abaixo:
                    </p>
                    {resumoConversa.trim() && (
                      <div>
                        <div style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 13, color: '#0F0F10', marginBottom: 4 }}>Resumo da Conversa</div>
                        <p style={{ margin: 0, fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#3D3F42', lineHeight: '22px', whiteSpace: 'pre-wrap' }}>{resumoConversa}</p>
                      </div>
                    )}
                    {proximosPassos.trim() && (
                      <div>
                        <div style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 13, color: '#0F0F10', marginBottom: 4 }}>Próximos Passos</div>
                        <p style={{ margin: 0, fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#3D3F42', lineHeight: '22px', whiteSpace: 'pre-wrap' }}>{proximosPassos}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8,
                  padding: '28px 16px', border: '1px dashed #C3C8D1', borderRadius: 8, background: '#F8F9FB',
                }}>
                  <MS name="mail" size={26} color="#ADB2BA" />
                  <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', maxWidth: 380 }}>
                    Nenhum e-mail será enviado. Marque ao menos um destinatário (Responsável pedagógico ou Responsável financeiro) e preencha o Resumo da Conversa ou os Próximos Passos para visualizar a simulação.
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginTop: 8,
            padding: '16px 18px', borderRadius: 8,
            background: '#F8F9FB', border: '1px dashed #C3C8D1',
          }}>
            <MS name="lock" size={20} color="#ADB2BA" />
            <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E' }}>
              Preencha todos os campos acima para liberar <strong>Objetivo</strong>, <strong>Norteadores para atendimento</strong> e o registro do atendimento.
            </span>
          </div>
        )}
        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
          <button onClick={onClose} style={{
            height: 40, padding: '0 20px', border: '1px solid #C3C8D1', borderRadius: 8,
            fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', background: '#fff', color: '#65686E',
          }}>Cancelar</button>
          <button onClick={() => onSave && onSave({ ...form, resumoConversa, proximosPassos, comentarios, verificacao, enviarRP, enviarRF, marcarImportante, norteadores })} style={{
            height: 40, padding: '0 20px', border: 0, borderRadius: 8,
            fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', background: 'var(--color-primary)', color: '#fff',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--color-primary-dark1)'}
          onMouseOut={e => e.currentTarget.style.background = 'var(--color-primary)'}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Attendance card ── */
const AtendCard = ({ record, podeExcluir, onDelete }) => {
  const [panel, setPanel] = useState('Comentários');
  const destaque = !!record.destaque;
  const bg = destaque ? '#FFF3DF' : '#fff';

  const mlb = { fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E' };
  const mvl = { fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10', fontWeight: 600, lineHeight: '18px' };

  const cols = [
    { l1: 'Data:', v1: record.data,           l2: 'Solicitante:',    v2: record.solicitante   },
    { l1: 'Tipo:', v1: record.tipo,            l2: 'Atendimento ao:', v2: record.atendimentoAo },
    { l1: 'Atendente:', v1: record.atendente, l2: 'Motivo:',         v2: record.motivo        },
  ];

  const panelContent = record[PANEL_KEYS[panel]];

  return (
    <div style={{ position: 'relative', border: '1px solid #EBEDF1', borderRadius: 8, overflow: 'hidden', marginBottom: 12, background: bg }}>
      {destaque && (
        <MS name="star" size={20} color="#FFAC30" style={{ position: 'absolute', top: 12, right: 12 }} />
      )}
      {/* Metadata header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, padding: '12px 16px', background: destaque ? bg : '#F8F9FB' }}>
        {cols.map((c, i) => (
          <div key={i}>
            <div style={mlb}>{c.l1}</div>
            <div style={{ ...mvl, marginBottom: 6 }}>{c.v1}</div>
            <div style={mlb}>{c.l2}</div>
            <div style={mvl}>{c.v2}</div>
          </div>
        ))}
      </div>

      {/* Email status */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 6,
        padding: '8px 16px', borderTop: '1px solid #EBEDF1',
        background: record.emailEnviado ? (destaque ? bg : '#F5F6FF') : '#fff',
      }}>
        <MS name="mail" size={16} color={record.emailEnviado ? 'var(--color-primary)' : '#ADB2BA'} style={{ flexShrink: 0, marginTop: 1 }} />
        {record.emailEnviado ? (
          <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 13, color: '#3D3F42' }}>
            E-mail enviado para: {record.emailDestinatarios.map((d, i) => (
              <span key={i}>
                {i > 0 ? ' e ' : ''}
                <strong style={{ color: '#0F0F10' }}>{d.label}</strong> ({d.email})
              </span>
            ))}
          </span>
        ) : (
          <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 13, color: '#65686E' }}>Nenhum e-mail foi enviado para este atendimento.</span>
        )}
      </div>

      {/* Body: left tabs + right content */}
      <div style={{ display: 'grid', gridTemplateColumns: '176px 1fr', borderTop: '1px solid #EBEDF1' }}>
        <div style={{ borderRight: '1px solid #EBEDF1' }}>
          {CARD_PANELS.map(p => (
            <button key={p} onClick={() => setPanel(p)} style={{
              display: 'block', width: '100%', padding: '10px 14px', textAlign: 'left',
              border: 0, borderBottom: '1px solid #EBEDF1', cursor: 'pointer',
              background: p === panel ? '#F0F1FE' : bg,
              fontFamily: 'var(--font-body-family)', fontSize: 14,
              color: p === panel ? 'var(--color-primary)' : '#0F0F10',
              fontWeight: p === panel ? 700 : 400,
              transition: 'background 120ms',
            }}
            onMouseOver={e => { if (p !== panel) e.currentTarget.style.background = '#F8F9FB'; }}
            onMouseOut={e => { if (p !== panel) e.currentTarget.style.background = bg; }}>
              {p}
            </button>
          ))}
        </div>
        <div style={{ padding: '14px 16px', minHeight: 130 }}>
          <div style={{
            fontFamily: 'var(--font-display-family)', fontWeight: 700,
            fontSize: 14, color: '#0F0F10', marginBottom: 8,
          }}>{panel}</div>
          {panelContent ? (
            <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10', lineHeight: '22px' }}>{panelContent}</div>
          ) : (
            <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#ADB2BA', fontStyle: 'italic' }}>
              {'< Não informado >'}
            </div>
          )}
        </div>
      </div>

      {/* Footer icons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2, padding: '6px 10px', borderTop: '1px solid #EBEDF1' }}>
        <button style={{ background: 'none', border: 0, cursor: 'pointer', padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center' }}
          onMouseOver={e => e.currentTarget.style.background = '#F8F9FB'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}>
          <MS name="print" size={18} color="#65686E" />
        </button>
        {/* Exclusão de atendimento é uma ação restrita — verificar permissão do usuário (RBAC) no backend antes de habilitar. */}
        <button
          disabled={!podeExcluir}
          title={podeExcluir ? undefined : 'Você não tem permissão para excluir atendimentos.'}
          onClick={() => podeExcluir && onDelete && onDelete(record.id)}
          style={{
            background: 'none', border: 0, padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center',
            cursor: podeExcluir ? 'pointer' : 'not-allowed', opacity: podeExcluir ? 1 : 0.4,
          }}
          onMouseOver={e => { if (podeExcluir) e.currentTarget.style.background = '#FFF0EE'; }}
          onMouseOut={e => e.currentTarget.style.background = 'none'}>
          <MS name="delete" size={18} color="#E65637" />
        </button>
      </div>
    </div>
  );
};

/* ── Main tab ── */
const AtendimentoTab = ({ podeExcluir = false, isEmpty = false, onDirtyChange, rfSemEmail = false }) => {
  const [showForm, setShowForm] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [records, setRecords] = useState(ATEND_RECORDS);
  const [toast, setToast] = useState(false);
  const visibleRecords = isEmpty ? [] : records;
  React.useEffect(() => { onDirtyChange && onDirtyChange(showForm && formDirty); }, [showForm, formDirty]);

  const parseYear = (d) => { const parts = (d || '').split('/'); return parts.length === 3 ? parseInt(parts[2], 10) : new Date().getFullYear(); };

  const groups = React.useMemo(() => {
    const map = new Map();
    visibleRecords.forEach(r => {
      const y = parseYear(r.data);
      if (!map.has(y)) map.set(y, []);
      map.get(y).push(r);
    });
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [visibleRecords]);

  const [openYears, setOpenYears] = useState(() => new Set(groups.length ? [groups[0][0]] : []));
  React.useEffect(() => {
    setOpenYears(prev => {
      if (prev.size > 0) return prev;
      return new Set(groups.length ? [groups[0][0]] : []);
    });
  }, [groups.length]);
  const toggleYear = (y) => setOpenYears(prev => {
    const next = new Set(prev);
    if (next.has(y)) next.delete(y); else next.add(y);
    return next;
  });

  const addRecord = (form) => {
    const d = form.data ? form.data.split('-').reverse().join('/') : new Date().toLocaleDateString('pt-BR');
    const destinatarios = [
      form.enviarRP && { label: 'Responsável pedagógico', email: 'rp.mariaalbuquerque@email.com.br' },
      form.enviarRF && { label: 'Responsável financeiro', email: 'rf.mariaalbuquerque@email.com.br' },
    ].filter(Boolean);
    setRecords(prev => [{
      id: Date.now(), data: d,
      tipo: form.tipo || 'Acadêmico',
      atendente: (form.atendentes && form.atendentes.length > 0) ? form.atendentes.join(', ') : '—',
      solicitante: form.solicitante || 'Coordenador/Diretor',
      atendimentoAo: form.atendimentoAo || 'Aluno',
      motivo: form.motivo || '—',
      emailEnviado: destinatarios.length > 0,
      emailDestinatarios: destinatarios,
    }, ...prev]);
    setShowForm(false);
    setFormDirty(false);
    setToast(true);
  };
  const deleteRecord = (id) => setRecords(prev => prev.filter(r => r.id !== id));
  const attemptCloseForm = () => { if (formDirty) setConfirmOpen(true); else setShowForm(false); };
  const confirmDiscard = () => { setConfirmOpen(false); setFormDirty(false); setShowForm(false); };

  return (
    <div>
      {toast && <Toast title="Atendimento salvo com sucesso" onClose={() => setToast(false)} />}
      <ConfirmDiscardModal open={confirmOpen} onConfirm={confirmDiscard} onCancel={() => setConfirmOpen(false)} />
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => showForm ? attemptCloseForm() : setShowForm(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            height: 40, padding: '0 20px', border: 0, borderRadius: 8,
            background: 'var(--color-primary)', color: '#fff',
            fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', transition: 'background 120ms',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--color-primary-dark1)'}
          onMouseOut={e => e.currentTarget.style.background = 'var(--color-primary)'}>
          <MS name="add" size={18} color="#fff" />
          Novo Atendimento
        </button>
        {visibleRecords.length > 0 && (
          <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E' }}>
            {visibleRecords.length} {visibleRecords.length === 1 ? 'atendimento registrado' : 'atendimentos registrados'}
          </span>
        )}
      </div>

      {showForm && <NovoAtendForm onClose={attemptCloseForm} onSave={addRecord} onDirtyChange={setFormDirty} rfSemEmail={rfSemEmail} />}

      {!showForm && visibleRecords.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, minHeight: 280, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#F0F1FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MS name="forum" size={28} color="var(--color-primary)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 16, color: '#0F0F10' }}>Nenhum atendimento registrado</span>
            <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', maxWidth: 280, display: 'block' }}>Registre o primeiro atendimento com o aluno ou família.</span>
          </div>
        </div>
      )}

      {visibleRecords.length > 0 && (
        <>
          {groups.map(([y, recs]) => {
            const open = openYears.has(y);
            return (
              <div key={y} style={{ marginBottom: 16 }}>
                <button onClick={() => toggleYear(y)} style={{
                  display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                  background: 'none', border: 0, cursor: 'pointer', padding: '4px 0', marginBottom: open ? 14 : 0,
                }}>
                  <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 22, color: 'var(--color-primary)' }}>{y}</span>
                  <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 13, color: '#65686E' }}>({recs.length})</span>
                  <MS name={open ? 'expand_less' : 'expand_more'} size={20} color="var(--color-primary)" />
                </button>
                {open && recs.map(r => <AtendCard key={r.id} record={r} podeExcluir={podeExcluir} onDelete={deleteRecord} />)}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

Object.assign(window, { AtendimentoTab });
