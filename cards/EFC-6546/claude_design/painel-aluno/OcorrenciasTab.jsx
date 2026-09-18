// OcorrenciasTab — Ocorrências tab for Painel do Aluno
const { useState } = React;

const CHAR_MAX = 4000;

const TIPOS_OCORRENCIA = [
  'Comportamental', 'Acadêmica', 'Administrativa', 'Disciplinar', 'Outros',
];

const OCOR_RECORDS = [
  {
    id: 1, data: '31/03/2026', tipo: 'Disciplinar',
    ocorrencia: 'Ocupar-se, durante as aulas, com atividades estranhas às mesmas',
    registradoPor: 'GILVANDRO DA CONCEICAO DE SOUSA', pontos: 20,
    observacao: 'Prezados, No dia de hoje, 31/03, a aluna foi encaminhada à Coordenação Pedagógica por apresentar comportamento inadequado em sala de aula. Segundo o relato do professor, a aluna, juntamente com um grupo de amigos, atrapalhou a aula ao interagir com outro colega. Segundo o relato da aluna, o professor havia solicitado silêncio para iniciar a explicação e, de acordo com ela, durante a explicação, foi interrompido pelo grupo. Diante do ocorrido, o professor encaminhou a aluna, juntamente com o grupo de amigos, à Coordenação por atrapalharem a aula. Na Coordenação, a aluna foi orientada sobre o comportamento adequado em sala de aula. Solicitamos que os responsáveis reforcem junto a aluna que esse comportamento não está de acordo com as normas e regras do colégio. Atenciosamente, Coordenação Pedagógica CG1.',
    emailEnviado: true,
    emailDestinatarios: [{ label: 'Responsável pedagógico', email: 'rp.mariaalbuquerque@email.com.br' }, { label: 'Responsável financeiro', email: 'rf.mariaalbuquerque@email.com.br' }],
  },
  {
    id: 2, data: '18/02/2026', tipo: 'Comportamental',
    ocorrencia: 'Colaboração espontânea em atividade de acolhimento aos alunos novos',
    registradoPor: 'ANA CAROLINA YATUHARA DA SILVA', pontos: 10,
    observacao: 'A aluna se ofereceu para acompanhar os alunos novos da turma durante a semana de acolhimento, ajudando na integração e explicando as rotinas do colégio.',
    emailEnviado: true,
    emailDestinatarios: [{ label: 'Responsável financeiro', email: 'rf.mariaalbuquerque@email.com.br' }],
  },
  {
    id: 3, data: '18/02/2026', tipo: 'Comportamental',
    ocorrencia: 'Participação ativa e respeitosa em debate de sala de aula',
    registradoPor: 'ANA CAROLINA YATUHARA DA SILVA',
    observacao: 'A aluna contribuiu de forma organizada e respeitosa durante o debate proposto pelo professor, incentivando a participação dos colegas mais quietos. Esta escola não utiliza sistema de pontuação para ocorrências — o registro serve apenas como histórico qualitativo.',
  },
];

const OcorrenciaCard = ({ record, podeExcluir, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ position: 'relative', border: '1px solid #EBEDF1', borderRadius: 8, padding: '16px 44px 14px 16px', marginBottom: 12 }}>
      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 2 }}>
        <button style={{ background: 'none', border: 0, cursor: 'pointer', padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center' }}
          onMouseOver={e => e.currentTarget.style.background = '#F8F9FB'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}>
          <MS name="print" size={18} color="#65686E" />
        </button>
        {/* Exclusão de ocorrência é uma ação restrita — verificar permissão do usuário (RBAC) no backend antes de habilitar. */}
        <button
          disabled={!podeExcluir}
          title={podeExcluir ? undefined : 'Você não tem permissão para excluir ocorrências.'}
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

      <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', marginBottom: 6 }}>
        Data: <span style={{ color: '#0F0F10', fontWeight: 600 }}>{record.data}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', marginBottom: 6 }}>
        Ocorrência: <span style={{ color: '#0F0F10', fontWeight: 600 }}>{record.ocorrencia}</span>
      </div>
      {!expanded && record.pontos != null && (
        <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', marginBottom: 6 }}>
          Pontos: <span style={{ color: '#0F0F10', fontWeight: 700 }}>{record.pontos}</span>
        </div>
      )}

      {expanded && (
        <>
          {record.pontos != null && (
          <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', marginBottom: 6 }}>
            Pontos: <span style={{ color: '#0F0F10', fontWeight: 700 }}>{record.pontos}</span>
          </div>
          )}
          <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', marginBottom: 6 }}>
            Registrado por: <span style={{ color: '#0F0F10', fontWeight: 600 }}>{record.registradoPor}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', lineHeight: '22px', marginBottom: 8 }}>
            <span style={{ color: '#0F0F10', fontWeight: 600 }}>Observação: </span>{record.observacao}
          </div>
        </>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 10 }}>
        <MS name="mail" size={15} color={record.emailEnviado ? 'var(--color-primary)' : '#ADB2BA'} style={{ flexShrink: 0, marginTop: 1 }} />
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
          <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 13, color: '#65686E' }}>Nenhum e-mail foi enviado para esta ocorrência.</span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={() => setExpanded(v => !v)} style={{
          display: 'flex', alignItems: 'center', gap: 4, alignSelf: 'center', width: 'fit-content',
          background: 'transparent', border: 0, borderBottom: '1px solid transparent',
          lineHeight: '16px', cursor: 'pointer', padding: 0, marginTop: 4,
          fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14,
          color: 'var(--color-primary)', transition: 'border-color 160ms',
        }}
        onMouseOver={(e)=>e.currentTarget.style.borderBottomColor='var(--color-primary)'}
        onMouseOut={(e)=>e.currentTarget.style.borderBottomColor='transparent'}>
          {expanded ? 'fechar detalhes' : 'ver detalhes'}
          <MS name={expanded ? 'expand_less' : 'expand_more'} size={16} color="var(--color-primary)" />
        </button>
      </div>
    </div>
  );
};

const OcorrenciasTab = ({ podeExcluir = false, isEmpty = false, onDirtyChange, rfSemEmail = false }) => {
  const [showForm, setShowForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [records, setRecords] = useState(OCOR_RECORDS);
  const [toast, setToast] = useState(false);
  const visibleRecords = isEmpty ? [] : records;
  const [form, setForm] = useState({ data: '', tipo: '', obs: '', enviarRP: false, enviarRF: false });
  const s = (k) => (v) => setForm(f => ({ ...f, [k]: v }));
  const deleteRecord = (id) => setRecords(prev => prev.filter(r => r.id !== id));
  const isDirty = !!(form.data || form.tipo || form.obs.trim() || form.enviarRP || form.enviarRF);
  React.useEffect(() => { onDirtyChange && onDirtyChange(showForm && isDirty); }, [showForm, isDirty]);
  const attemptCloseForm = () => { if (isDirty) setConfirmOpen(true); else setShowForm(false); };
  const confirmDiscard = () => {
    setConfirmOpen(false); setShowForm(false);
    setForm({ data: '', tipo: '', obs: '', enviarRP: false, enviarRF: false });
  };

  const confirmRecord = () => {
    const d = form.data ? form.data.split('-').reverse().join('/') : new Date().toLocaleDateString('pt-BR');
    const destinatarios = [
      form.enviarRP && { label: 'Responsável pedagógico', email: 'rp.mariaalbuquerque@email.com.br' },
      form.enviarRF && { label: 'Responsável financeiro', email: 'rf.mariaalbuquerque@email.com.br' },
    ].filter(Boolean);
    setRecords(prev => [{
      id: Date.now(), data: d,
      tipo: form.tipo || 'Outros',
      ocorrencia: form.obs.slice(0, 120) || '—',
      registradoPor: 'USUÁRIO ATUAL',
      observacao: form.obs,
      emailEnviado: destinatarios.length > 0,
      emailDestinatarios: destinatarios,
    }, ...prev]);
    setForm({ data: '', tipo: '', obs: '', enviarRP: false, enviarRF: false });
    setShowForm(false);
    setToast(true);
  };

  const inputBase = {
    height: 40, border: '1px solid #C3C8D1', borderRadius: 8,
    padding: '0 12px', fontFamily: 'var(--font-body-family)', fontSize: 14,
    background: '#fff', outline: 'none', width: '100%',
  };

  const FieldLabel = ({ children, required }) => (
    <label style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E', fontWeight: 600 }}>
      {children}{required && <span style={{ color: '#E65637' }}> *</span>}
    </label>
  );

  return (
    <div>
      {toast && <Toast title="Ocorrência registrada com sucesso" onClose={() => setToast(false)} />}
      <ConfirmDiscardModal open={confirmOpen} onConfirm={confirmDiscard} onCancel={() => setConfirmOpen(false)} />
      {/* Action button */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
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
          Nova Ocorrência
        </button>
        {visibleRecords.length > 0 && (() => {
          const totalPontos = visibleRecords.reduce((sum, r) => sum + (r.pontos ?? 0), 0);
          const hasPontos = visibleRecords.some(r => r.pontos != null);
          return (
            <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E' }}>
              {visibleRecords.length} {visibleRecords.length === 1 ? 'ocorrência registrada' : 'ocorrências registradas'}
              {hasPontos ? ` · ${totalPontos} pontos` : ''}
            </span>
          );
        })()}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          border: '1px solid #EBEDF1', borderRadius: 8, padding: 20,
          marginBottom: 20, background: '#F8F9FB',
          animation: 'fadeSlideDown 160ms ease-out',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Row 1: Data + Tipo */}
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <FieldLabel required>Data</FieldLabel>
                <input type="date" value={form.data} onChange={e => s('data')(e.target.value)}
                  style={{ ...inputBase, width: 180 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                <FieldLabel required>Tipo de ocorrência</FieldLabel>
                <select value={form.tipo} onChange={e => s('tipo')(e.target.value)}
                  style={{ ...inputBase, color: form.tipo ? '#0F0F10' : '#ADB2BA', cursor: 'pointer' }}>
                  <option value="">Selecione...</option>
                  {TIPOS_OCORRENCIA.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Observação */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <FieldLabel required>Observação</FieldLabel>
              <textarea
                value={form.obs}
                onChange={e => s('obs')(e.target.value.slice(0, CHAR_MAX))}
                rows={6}
                style={{
                  border: '1px solid #C3C8D1', borderRadius: 8, padding: '10px 12px',
                  fontFamily: 'var(--font-body-family)', fontSize: 14, resize: 'vertical',
                  outline: 'none', background: '#fff',
                }} />
              <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E' }}>
                {form.obs.length} de {CHAR_MAX} caracteres
              </span>
            </div>

            {/* Email checkboxes — destinatário(s) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <FieldLabel>Enviar por e-mail para</FieldLabel>
              <div style={{ display: 'flex', gap: 20 }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10',
                }}>
                  <input type="checkbox" checked={form.enviarRP}
                    onChange={e => s('enviarRP')(e.target.checked)}
                    style={{ accentColor: 'var(--color-primary)', width: 15, height: 15, cursor: 'pointer' }} />
                  Responsável pedagógico
                </label>
                <label
                  title={rfSemEmail ? 'Este responsável não possui e-mail cadastrado. Cadastre um e-mail para habilitar o envio.' : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, cursor: rfSemEmail ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-body-family)', fontSize: 14, color: rfSemEmail ? '#ADB2BA' : '#0F0F10',
                  }}>
                  <input type="checkbox" checked={!rfSemEmail && form.enviarRF} disabled={rfSemEmail}
                    onChange={e => s('enviarRF')(e.target.checked)}
                    style={{ accentColor: 'var(--color-primary)', width: 15, height: 15, cursor: rfSemEmail ? 'not-allowed' : 'pointer' }} />
                  Responsável financeiro{rfSemEmail && ' — sem e-mail cadastrado'}
                </label>
              </div>
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

              {(form.enviarRP || form.enviarRF) && form.obs.trim() ? (
                <div style={{ border: '1px solid #EBEDF1', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ background: '#F8F9FB', padding: '14px 18px', borderBottom: '1px solid #EBEDF1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 13, color: '#65686E' }}>
                      Para: <span style={{ color: '#0F0F10', fontWeight: 600 }}>
                        {[form.enviarRP && 'Responsável pedagógico (rp.mariaalbuquerque@email.com.br)', form.enviarRF && 'Responsável financeiro (rf.mariaalbuquerque@email.com.br)'].filter(Boolean).join(' e ')}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 13, color: '#65686E' }}>
                      Assunto: <span style={{ color: '#0F0F10', fontWeight: 600 }}>Nova ocorrência — Maria Albuquerque Santos</span>
                    </div>
                  </div>
                  <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <p style={{ margin: 0, fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#3D3F42', lineHeight: '22px' }}>
                      Olá, informamos que foi registrada uma nova ocorrência{form.tipo ? ` (${form.tipo})` : ''} referente a Maria Albuquerque Santos. Segue o detalhe abaixo:
                    </p>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 13, color: '#0F0F10', marginBottom: 4 }}>Observação</div>
                      <p style={{ margin: 0, fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#3D3F42', lineHeight: '22px', whiteSpace: 'pre-wrap' }}>{form.obs}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8,
                  padding: '28px 16px', border: '1px dashed #C3C8D1', borderRadius: 8, background: '#F8F9FB',
                }}>
                  <MS name="mail" size={26} color="#ADB2BA" />
                  <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', maxWidth: 380 }}>
                    Nenhum e-mail será enviado. Marque ao menos um destinatário (Responsável pedagógico ou Responsável financeiro) e preencha a Observação para visualizar a simulação.
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={confirmRecord}
                style={{
                  height: 40, padding: '0 28px', border: 0, borderRadius: 8,
                  background: 'var(--color-primary)', color: '#fff',
                  fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
                  cursor: 'pointer', transition: 'background 120ms',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--color-primary-dark1)'}
                onMouseOut={e => e.currentTarget.style.background = 'var(--color-primary)'}>
                Confirmar
              </button>
              <button onClick={attemptCloseForm} style={{
                height: 40, padding: '0 20px', border: '1px solid #C3C8D1', borderRadius: 8,
                background: '#fff', color: '#65686E',
                fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Registros existentes */}
      {!showForm && visibleRecords.length > 0 && visibleRecords.map(r => (
        <OcorrenciaCard key={r.id} record={r} podeExcluir={podeExcluir} onDelete={deleteRecord} />
      ))}

      {/* Empty state — positivo */}
      {!showForm && visibleRecords.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 14, minHeight: 260, textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: '#D9F5E4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MS name="check_circle" size={28} color="#0E5E2E" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 16, color: '#0F0F10' }}>
              Nenhuma ocorrência registrada
            </span>
            <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E', maxWidth: 300, display: 'block' }}>
              Ótimo! Este aluno não possui ocorrências registradas no período.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { OcorrenciasTab });
