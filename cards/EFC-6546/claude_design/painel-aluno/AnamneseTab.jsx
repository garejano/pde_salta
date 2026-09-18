// AnamneseTab — Anamnese tab for Painel do Aluno
const { useState } = React;

/* ── Shared primitives ── */
const QLabel = ({ children, note }) => (
  <div style={{ marginBottom: note ? 4 : 10 }}>
    <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: 'var(--color-neutral-dark3)', marginBottom: note ? 2 : 0, fontWeight: 500 }}>
      {children}
    </div>
    {note && (
      <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E' }}>{note}</div>
    )}
  </div>
);

const QRadio = ({ id, options, value, onChange }) => (
  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 18, marginTop: 8 }}>
    {options.map(o => (
      <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10' }}>
        <input type="radio" name={id} value={o} checked={value === o} onChange={() => onChange(o)}
          style={{ accentColor: 'var(--color-primary)', cursor: 'pointer', width: 15, height: 15 }} />
        {o}
      </label>
    ))}
  </div>
);

const QCheck = ({ options, value, onChange }) => {
  const toggle = (o) => onChange(value.includes(o) ? value.filter(x => x !== o) : [...value, o]);
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18, marginTop: 8 }}>
      {options.map(o => (
        <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10' }}>
          <input type="checkbox" checked={value.includes(o)} onChange={() => toggle(o)}
            style={{ accentColor: 'var(--color-primary)', cursor: 'pointer', width: 14, height: 14 }} />
          {o}
        </label>
      ))}
    </div>
  );
};

const QSelect = ({ value, onChange, options, placeholder = 'Selecione...', disabled = false }) => (
  <div style={{ marginBottom: 18, marginTop: 8 }}>
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled} style={{
      height: 36, border: '1px solid #C3C8D1', borderRadius: 8, padding: '0 12px',
      fontFamily: 'var(--font-body-family)', fontSize: 14,
      background: disabled ? '#F2F2F2' : '#fff',
      color: disabled ? '#65686E' : (value ? '#0F0F10' : '#ADB2BA'),
      width: 220, cursor: disabled ? 'not-allowed' : 'pointer',
    }}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const QInput = ({ value, onChange, placeholder }) => (
  <div style={{ marginBottom: 18, marginTop: 8 }}>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
      height: 36, border: '1px solid #C3C8D1', borderRadius: 8, padding: '0 12px',
      fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10',
      background: '#fff', outline: 'none', width: '100%',
    }} />
  </div>
);

const QSep = () => <div style={{ height: 1, background: '#EBEDF1', margin: '4px 0 16px' }} />;

/* ── Accordion section ── */
const AnamSection = ({ icon, title, index, total, defaultOpen, children }) => {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div style={{ border: '1px solid #EBEDF1', borderRadius: 8, marginBottom: 12, overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '14px 18px', background: '#fff', border: 0, cursor: 'pointer', textAlign: 'left',
        transition: 'background 120ms',
      }}
      onMouseOver={e => e.currentTarget.style.background = '#F8F9FB'}
      onMouseOut={e => e.currentTarget.style.background = '#fff'}>
        <MS name={icon} size={22} color="#65686E" />
        <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 16, color: '#0F0F10', flex: 1 }}>
          {title}
        </span>
        <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 13, color: '#65686E', marginRight: 6 }}>
          {index} de {total}
        </span>
        <MS name={open ? 'expand_less' : 'expand_more'} size={20} color="#65686E" />
      </button>
      {open && (
        <div style={{ borderTop: '1px solid #EBEDF1', padding: '22px 20px 8px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

/* ── Relação options (shared across 3 questions) ── */
const RELACAO_OPTS = ['Muito próxima', 'Próxima', 'Distante', 'Muito distante', 'Falecido(a)', 'Não se aplica'];
const RELACAO_OPTS_IRMAOS = ['Muito próxima', 'Próxima', 'Distante', 'Muito distante', 'Não se aplica'];
const DISCIPLINAS = ['Biologia', 'Educação Física', 'Física', 'Geografia', 'História', 'Língua Inglesa', 'Língua Portuguesa', 'Literatura', 'Matemática', 'Redação', 'Sociologia'];
const IRMAOS_REDE_EXEMPLO = {
  '1 irmão(ã)': ['Lucas Albuquerque Santos — 6º ano B'],
  '2 irmãos(ãs)': ['Lucas Albuquerque Santos — 6º ano B', 'Sofia Albuquerque Santos — 1º ano EM A'],
  '3 ou mais': ['Lucas Albuquerque Santos — 6º ano B', 'Sofia Albuquerque Santos — 1º ano EM A', 'Davi Albuquerque Santos — 3º ano B'],
};

const ANAM_FILLED_STATE = {
  /* Família */
  moracom: ['Mãe', 'Pai'], moracomOutros: '', irmaoRede: '1 irmão(ã)', outrosIrmaos: [{ nome: '', sexo: '', nascimento: '' }],
  relacaoMae: 'Muito próxima', relacaoPai: 'Próxima', relacaoIrmaos: 'Próxima',
  paisCasados: 'Sim', paisJuntos: 'Sim', tempoFamilia: 'Todos os dias, em algum momento do dia (almoço/jantar/estudo)',
  /* Hobbies */
  atividadeFisica: 'Sim', extracurriculares: '2 (duas) ou mais', extracurricularesQuais: 'Natação, Inglês', tempoLivre: ['Leitura', 'Esportes', 'Familia'],
  /* Áreas */
  escolaAnterior: 'Colégio Santa Rita', dificuldadeEscola: 'Não', dificuldadeEscolaQual: '',
  disciplinaFacil: 'Língua Portuguesa', disciplinaDificil: 'Matemática',
  carreiraInteresse: 'Sim', carreiraInteresseQual: 'Medicina', estudoSozAcomp: 'Acompanhado', estudoAcompQuem: ['Mãe'], aulaParticular: 'Não', aulaParticularDisciplinas: '', gostaEscola: 'Sim', gostaEscolaPorque: '', creche: 'Sim',
  /* Comportamento */
  sono: ['Tranquilo, dorme a noite inteira'], alimentacao: 'Come de tudo', amigos: 'Sim, muitos', comportamento: ['Alegre', 'Extrovertido', 'Responsável'],
  situacaoTraumatica: 'Não', medo: 'Não', medoQual: '', roiUnhas: 'Não', reacaoFrustracao: ['Fica triste por um período, mas logo dá a volta por cima'],
  sonho: 'Sim', sonhoQual: 'Ser médica', especialista: 'Não', deficiencia: ['Nenhuma'], deficienciaEspecifique: '',
};

const ANAM_EMPTY_STATE = {
  /* Família */
  moracom: [], moracomOutros: '', irmaoRede: '', outrosIrmaos: [{ nome: '', sexo: '', nascimento: '' }],
  relacaoMae: '', relacaoPai: '', relacaoIrmaos: '',
  paisCasados: '', paisJuntos: '', tempoFamilia: '',
  /* Hobbies */
  atividadeFisica: '', extracurriculares: '', extracurricularesQuais: '', tempoLivre: [],
  /* Áreas */
  escolaAnterior: '', dificuldadeEscola: '', dificuldadeEscolaQual: '',
  disciplinaFacil: '', disciplinaDificil: '',
  carreiraInteresse: '', carreiraInteresseQual: '', estudoSozAcomp: '', estudoAcompQuem: [], aulaParticular: '', aulaParticularDisciplinas: '', gostaEscola: '', gostaEscolaPorque: '', creche: '',
  /* Comportamento */
  sono: [], alimentacao: '', amigos: '', comportamento: [],
  situacaoTraumatica: '', medo: '', medoQual: '', roiUnhas: '', reacaoFrustracao: [],
  sonho: '', sonhoQual: '', especialista: '', deficiencia: [], deficienciaEspecifique: '',
};

const ANAM_YEARS = [
  { year: 2026, pct: 100 },
  { year: 2025, pct: 50 },
  { year: 2024, pct: 100 },
  { year: 2023, pct: 100 },
];

/* ── Main tab ── */
const AnamneseTab = ({ isEmpty = false }) => {
  const [f, setF] = useState(isEmpty ? ANAM_EMPTY_STATE : ANAM_FILLED_STATE);
  const [anamYear, setAnamYear] = useState(ANAM_YEARS[0].year);
  const [toast, setToast] = useState(false);
  React.useEffect(() => { setF(isEmpty ? ANAM_EMPTY_STATE : ANAM_FILLED_STATE); }, [isEmpty]);
  const s = (k) => (v) => setF(prev => ({ ...prev, [k]: v }));
  const updateIrmao = (idx, field, value) => setF(prev => ({
    ...prev,
    outrosIrmaos: prev.outrosIrmaos.map((it, i) => i === idx ? { ...it, [field]: value } : it),
  }));
  const addIrmao = () => setF(prev => ({
    ...prev,
    outrosIrmaos: [...prev.outrosIrmaos, { nome: '', sexo: '', nascimento: '' }],
  }));
  const removeIrmao = (idx) => setF(prev => ({
    ...prev,
    outrosIrmaos: prev.outrosIrmaos.filter((_, i) => i !== idx),
  }));

  return (
    <div>
      {toast && <Toast title="Anamnese salva com sucesso" onClose={() => setToast(false)} />}
      {/* Year select + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, gap: 12, flexWrap: 'wrap' }}>
        {isEmpty ? (
          <div style={{
            fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E',
            fontStyle: 'italic',
          }}>Anamnese não respondida</div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0E5E2E',
          }}>
            <MS name="check_circle" size={16} color="#0E5E2E" />
            Anamnese respondida em 12/03/2026
          </div>
        )}
        <select value={anamYear} onChange={e => setAnamYear(Number(e.target.value))} style={{
          height: 36, border: '1px solid #C3C8D1', borderRadius: 8, padding: '0 12px',
          fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14, color: '#0F0F10',
          background: '#fff', cursor: 'pointer', flexShrink: 0,
        }}>
          {ANAM_YEARS.map(y => (
            <option key={y.year} value={y.year}>{y.year} — {y.pct}%</option>
          ))}
        </select>
      </div>

      {/* ── Família ── */}
      <AnamSection icon="group" title="Família" index={1} total={4} defaultOpen>
        <QLabel note="(é possível selecionar múltiplas opções)">O aluno mora com quem?</QLabel>
        <QCheck options={['Pai', 'Mãe', 'Avós', 'Tios', 'Outros']} value={f.moracom} onChange={s('moracom')} />
        {f.moracom.includes('Outros') && (
          <div style={{ marginTop: -10, marginBottom: 18 }}>
            <QInput value={f.moracomOutros} onChange={s('moracomOutros')} placeholder="Especifique com quem mais o aluno mora" />
          </div>
        )}

        <QSep />
        <QLabel>Irmão(ã) na Rede:</QLabel>
        <QSelect value={f.irmaoRede} onChange={s('irmaoRede')} options={['Não', '1 irmão(ã)', '2 irmãos(ãs)', '3 ou mais']} disabled />
        {f.irmaoRede && f.irmaoRede !== 'Não' && (
          <div style={{ marginTop: -10, marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E', fontWeight: 600 }}>Irmão(s) identificado(s) automaticamente na Rede:</div>
            {IRMAOS_REDE_EXEMPLO[f.irmaoRede].map((nome, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8, height: 36, padding: '0 12px',
                border: '1px solid #EBEDF1', borderRadius: 8, background: '#F8F9FB', width: 'fit-content', minWidth: 220,
              }}>
                <MS name="person" size={16} color="#65686E" />
                <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10' }}>{nome}</span>
              </div>
            ))}
          </div>
        )}

        <QSep />
        {/* Outro irmão rows — dinâmico */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
          {f.outrosIrmaos.map((irmao, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 120 }}>
                <label style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E', fontWeight: 600 }}>Outro(a) Irmão(ã):</label>
                <input value={irmao.nome} onChange={e => updateIrmao(idx, 'nome', e.target.value)}
                  style={{ height: 36, border: '1px solid #C3C8D1', borderRadius: 8, padding: '0 12px', fontFamily: 'var(--font-body-family)', fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E', fontWeight: 600 }}>Sexo:</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {['Masculino', 'Feminino'].map(o => (
                    <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: 'var(--font-body-family)', fontSize: 14 }}>
                      <input type="radio" name={`outroIrmaoSexo-${idx}`} value={o} checked={irmao.sexo === o} onChange={() => updateIrmao(idx, 'sexo', o)}
                        style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
                      {o}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E', fontWeight: 600 }}>Nascimento:</label>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="date" value={irmao.nascimento} onChange={e => updateIrmao(idx, 'nascimento', e.target.value)}
                    style={{ height: 36, border: '1px solid #C3C8D1', borderRadius: 8, padding: '0 10px', fontFamily: 'var(--font-body-family)', fontSize: 14, outline: 'none' }} />
                  {idx === f.outrosIrmaos.length - 1 ? (
                    <button onClick={addIrmao} style={{
                      width: 36, height: 36, border: 0, borderRadius: 8, background: 'var(--color-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
                    }}>
                      <MS name="add" size={18} color="#fff" />
                    </button>
                  ) : (
                    <button onClick={() => removeIrmao(idx)} style={{
                      width: 36, height: 36, border: '1px solid #C3C8D1', borderRadius: 8, background: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
                    }}>
                      <MS name="close" size={18} color="#65686E" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <QSep />
        <QLabel>Como é a relação com a mãe/responsável?</QLabel>
        <QRadio id="relacaoMae" options={RELACAO_OPTS} value={f.relacaoMae} onChange={s('relacaoMae')} />

        <QSep />
        <QLabel>Como é a relação com o pai/responsável?</QLabel>
        <QRadio id="relacaoPai" options={RELACAO_OPTS} value={f.relacaoPai} onChange={s('relacaoPai')} />

        <QSep />
        <QLabel>Como é a relação com o(s) irmão(s)?</QLabel>
        <QRadio id="relacaoIrmaos" options={RELACAO_OPTS_IRMAOS} value={f.relacaoIrmaos} onChange={s('relacaoIrmaos')} />

        <QSep />
        <QLabel>Os pais são casados?</QLabel>
        <QRadio id="paisCasados" options={['Não', 'Sim']} value={f.paisCasados} onChange={s('paisCasados')} />

        <QSep />
        <QLabel>Os pais vivem juntos?</QLabel>
        <QRadio id="paisJuntos" options={['Não', 'Sim']} value={f.paisJuntos} onChange={s('paisJuntos')} />

        <QSep />
        <QLabel>Qual o tempo disponível do aluno com a família?</QLabel>
        <QRadio id="tempoFamilia"
          options={['Todos os dias, em algum momento do dia (almoço/jantar/estudo)', 'Somente finais de semana', 'Apenas 1 dia do final de semana']}
          value={f.tempoFamilia} onChange={s('tempoFamilia')} />
      </AnamSection>

      {/* ── Hobbies ── */}
      <AnamSection icon="directions_run" title="Hobbies" index={2} total={4}>
        <QLabel>Pratica atividade física?</QLabel>
        <QRadio id="atividadeFisica" options={['Não', 'Sim']} value={f.atividadeFisica} onChange={s('atividadeFisica')} />

        <QSep />
        <QLabel>Faz quantas atividades extracurriculares (curso de línguas, dança, esporte, etc)?</QLabel>
        <QRadio id="extracurriculares" options={['Nenhuma', '1 (uma)', '2 (duas) ou mais']} value={f.extracurriculares} onChange={s('extracurriculares')} />
        {(f.extracurriculares === '1 (uma)' || f.extracurriculares === '2 (duas) ou mais') && (
          <>
            <QLabel>Quais (especifique)?</QLabel>
            <QInput value={f.extracurricularesQuais} onChange={s('extracurricularesQuais')} placeholder="" />
          </>
        )}

        <QSep />
        <QLabel>O que gosta de fazer no tempo livre?</QLabel>
        <QCheck
          options={['Passeios', 'Leitura', 'Celular', 'Brincadeiras', 'Familia', 'Estudos', 'TV', 'Esportes', 'Jogos eletrônicos']}
          value={f.tempoLivre} onChange={s('tempoLivre')} />
      </AnamSection>

      {/* ── Áreas de Interesse ── */}
      <AnamSection icon="school" title="Áreas de Interesse e Rotinas de Estudo" index={3} total={4}>
        <QLabel>Veio de qual escola?</QLabel>
        <QInput value={f.escolaAnterior} onChange={s('escolaAnterior')} placeholder="" />

        <QSep />
        <QLabel>Apresentou dificuldades em escolas anteriores?</QLabel>
        <QRadio id="dificuldadeEscola" options={['Não', 'Sim']} value={f.dificuldadeEscola} onChange={s('dificuldadeEscola')} />
        {f.dificuldadeEscola === 'Sim' && (
          <>
            <QLabel>Se sim, qual a dificuldade?</QLabel>
            <QInput value={f.dificuldadeEscolaQual} onChange={s('dificuldadeEscolaQual')} placeholder="" />
          </>
        )}

        <QSep />
        <QLabel>Quais disciplinas de maior facilidade?</QLabel>
        <QSelect value={f.disciplinaFacil} onChange={s('disciplinaFacil')} options={DISCIPLINAS} />

        <QSep />
        <QLabel>Quais disciplinas de menor facilidade?</QLabel>
        <QSelect value={f.disciplinaDificil} onChange={s('disciplinaDificil')} options={DISCIPLINAS} />

        <QSep />
        <QLabel>Demonstra sinais de interesse em alguma carreira específica?</QLabel>
        <QRadio id="carreiraInteresse" options={['Não', 'Sim']} value={f.carreiraInteresse} onChange={s('carreiraInteresse')} />
        {f.carreiraInteresse === 'Sim' && (
          <>
            <QLabel>Se sim, qual?</QLabel>
            <QInput value={f.carreiraInteresseQual} onChange={s('carreiraInteresseQual')} placeholder="" />
          </>
        )}

        <QSep />
        <QLabel>Estuda sozinho ou acompanhado?</QLabel>
        <QRadio id="estudoSozAcomp" options={['Sozinho', 'Acompanhado']} value={f.estudoSozAcomp} onChange={s('estudoSozAcomp')} />
        {f.estudoSozAcomp === 'Acompanhado' && (
          <>
            <QLabel>Se acompanhado, com quem?</QLabel>
            <QCheck options={['Mãe', 'Pai', 'Amigos', 'Irmão(ã)', 'Professor Particular', 'Avô/Avó', 'Tio(a)']} value={f.estudoAcompQuem} onChange={s('estudoAcompQuem')} />
          </>
        )}

        <QSep />
        <QLabel>Já fez ou faz aula particular?</QLabel>
        <QRadio id="aulaParticular" options={['Não', 'Sim']} value={f.aulaParticular} onChange={s('aulaParticular')} />
        {f.aulaParticular === 'Sim' && (
          <>
            <QLabel>Se sim, de quais disciplinas?</QLabel>
            <QSelect value={f.aulaParticularDisciplinas} onChange={s('aulaParticularDisciplinas')} options={DISCIPLINAS} />
          </>
        )}

        <QSep />
        <QLabel>Gosta de ir para a escola?</QLabel>
        <QRadio id="gostaEscola" options={['Não', 'Sim']} value={f.gostaEscola} onChange={s('gostaEscola')} />
        {f.gostaEscola === 'Não' && (
          <>
            <QLabel>Se não, por quê?</QLabel>
            <QInput value={f.gostaEscolaPorque} onChange={s('gostaEscolaPorque')} placeholder="" />
          </>
        )}

        <QSep />
        <QLabel>Frequentou creche?</QLabel>
        <QRadio id="creche" options={['Não', 'Sim']} value={f.creche} onChange={s('creche')} />
      </AnamSection>

      {/* ── Comportamento ── */}
      <AnamSection icon="psychology" title="Comportamento" index={4} total={4}>
        <QLabel>Como é o sono?</QLabel>
        <QCheck
          options={['Tranquilo, dorme a noite inteira', 'Tem insônia', 'Dorme tarde, por isso tem dificuldade ao acordar', 'Costuma tirar uma soneca à tarde']}
          value={f.sono} onChange={s('sono')} />

        <QSep />
        <QLabel>Como é a alimentação?</QLabel>
        <QRadio id="alimentacao" options={['Come de tudo', 'Come com limitações']} value={f.alimentacao} onChange={s('alimentacao')} />

        <QSep />
        <QLabel>Tem amigos?</QLabel>
        <QRadio id="amigos" options={['Sim, muitos', 'Sim, alguns', 'Não muitos', 'Nenhum']} value={f.amigos} onChange={s('amigos')} />

        <QSep />
        <QLabel note="(marque todas as opções que achar pertinentes)">Como é o comportamento habitual do aluno?</QLabel>
        <QCheck
          options={['Alegre', 'Engraçado', 'Introvertido', 'Extrovertido', 'Impulsivo', 'Independente', 'Controlador', 'Responsável', 'Agressivo', 'Demonstra Liderança', 'Cooperativo']}
          value={f.comportamento} onChange={s('comportamento')} />

        <QSep />
        <QLabel>Passou por perdas ou mudanças significativas/situações traumáticas?</QLabel>
        <QRadio id="situacaoTraumatica" options={['Não', 'Sim']} value={f.situacaoTraumatica} onChange={s('situacaoTraumatica')} />

        <QSep />
        <QLabel>Tem algum medo?</QLabel>
        <QRadio id="medo" options={['Não', 'Sim']} value={f.medo} onChange={s('medo')} />
        {f.medo === 'Sim' && (
          <>
            <QLabel>Se sim, qual(is)?</QLabel>
            <QInput value={f.medoQual} onChange={s('medoQual')} placeholder="" />
          </>
        )}

        <QSep />
        <QLabel>Roi unhas?</QLabel>
        <QRadio id="roiUnhas" options={['Não', 'Sim']} value={f.roiUnhas} onChange={s('roiUnhas')} />

        <QSep />
        <QLabel>Como reage com as frustrações?</QLabel>
        <QCheck
          options={['Fica triste e desiste com facilidade', 'Fica triste por um período, mas logo dá a volta por cima', 'Entende que faz parte e não se deixa abalar']}
          value={f.reacaoFrustracao} onChange={s('reacaoFrustracao')} />

        <QSep />
        <QLabel>Tem um sonho?</QLabel>
        <QRadio id="sonho" options={['Não', 'Sim']} value={f.sonho} onChange={s('sonho')} />
        {f.sonho === 'Sim' && (
          <>
            <QLabel>Se sim, qual(is)?</QLabel>
            <QInput value={f.sonhoQual} onChange={s('sonhoQual')} placeholder="" />
          </>
        )}

        <QSep />
        <QLabel>É acompanhado por algum especialista?</QLabel>
        <QRadio id="especialista" options={['Não', 'Sim']} value={f.especialista} onChange={s('especialista')} />

        <QSep />
        <QLabel>Possui algum tipo de deficiência, ou mesmo uma leve dificuldade?</QLabel>
        <QCheck options={['Visual', 'Auditiva', 'Outra', 'Nenhuma']} value={f.deficiencia} onChange={s('deficiencia')} />
        {f.deficiencia.includes('Outra') && (
          <>
            <QLabel>Especifique:</QLabel>
            <QInput value={f.deficienciaEspecifique} onChange={s('deficienciaEspecifique')} placeholder="" />
          </>
        )}
      </AnamSection>

      {/* Salvar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, paddingBottom: 8 }}>
        <button onClick={() => setToast(true)} style={{
          height: 44, padding: '0 28px', border: 0, borderRadius: 8,
          background: 'var(--color-primary)', color: '#fff',
          fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 16,
          cursor: 'pointer', transition: 'background 120ms',
        }}
        onMouseOver={e => e.currentTarget.style.background = 'var(--color-primary-dark1)'}
        onMouseOut={e => e.currentTarget.style.background = 'var(--color-primary)'}>
          Salvar Anamnese
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { AnamneseTab });
