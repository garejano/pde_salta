// DocumentosTab — Documentos tab for Painel do Aluno
const { useState } = React;

const GRUPOS_DOC = ['Médico', 'Escolar', 'Pessoal', 'Financeiro', 'Jurídico'];
const TIPOS_POR_GRUPO = {
  'Médico':     ['Atestado Médico', 'Laudo', 'Receita', 'Exame'],
  'Escolar':    ['Histórico Escolar', 'Boletim', 'Declaração de Matrícula', 'Certificado'],
  'Pessoal':    ['RG', 'CPF', 'Certidão de Nascimento', 'Comprovante de Residência'],
  'Financeiro': ['Comprovante de Pagamento', 'Boleto', 'Nota Fiscal'],
  'Jurídico':   ['Procuração', 'Termo de Responsabilidade', 'Contrato'],
};

const DOC_ICONS = { 'Médico': 'medication', 'Escolar': 'school', 'Pessoal': 'badge', 'Financeiro': 'receipt_long', 'Jurídico': 'gavel' };

const DOC_RECORDS = [
  { id: 1, grupo: 'Escolar', tipo: 'Histórico Escolar', nomeArquivo: 'historico_escolar_2025.pdf', dataEmissao: '18/12/2025', tamanho: '412 KB' },
  { id: 2, grupo: 'Pessoal', tipo: 'Certidão de Nascimento', nomeArquivo: 'certidao_nascimento.pdf', dataEmissao: '04/02/2024', tamanho: '198 KB' },
  { id: 3, grupo: 'Médico', tipo: 'Atestado Médico', nomeArquivo: 'atestado_10_06.pdf', dataEmissao: '10/06/2026', tamanho: '86 KB' },
];

/* ── Upload modal ── */
const UploadModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({ dataEmissao: '', grupo: '', tipo: '', descricao: '' });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = React.useRef(null);
  const s = (k) => (e) => setForm(f => ({ ...f, [k]: e.target ? e.target.value : e }));

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  const inputBase = {
    height: 40, border: '1px solid #C3C8D1', borderRadius: 8,
    padding: '0 12px', fontFamily: 'var(--font-body-family)', fontSize: 14,
    background: '#fff', outline: 'none', width: '100%',
  };
  const FieldLabel = ({ children, required }) => (
    <label style={{ fontFamily: 'var(--font-body-family)', fontSize: 13, color: '#65686E', fontWeight: 600 }}>
      {children}{required && <span style={{ color: '#E65637' }}> *</span>}
    </label>
  );
  const tiposDisponiveis = form.grupo ? (TIPOS_POR_GRUPO[form.grupo] || []) : [];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,23,31,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '28px 28px 24px',
        width: 560, maxWidth: '92vw', maxHeight: '90vh',
        overflowY: 'auto', boxShadow: 'var(--shadow-center-large)',
      }}>
        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <h3 style={{
            margin: 0, fontFamily: 'var(--font-display-family)', fontWeight: 600,
            fontSize: 18, color: '#0F0F10', lineHeight: '22px',
          }}>Envio de Documento — Maria Albuquerque Santos</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 0, cursor: 'pointer', padding: 4, borderRadius: 6,
            display: 'flex', alignItems: 'center',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#F8F9FB'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}>
            <MS name="close" size={20} color="#65686E" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Row 1: Data de Emissão + Grupo */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <FieldLabel required>Data de Emissão</FieldLabel>
              <input type="date" value={form.dataEmissao} onChange={s('dataEmissao')}
                style={{ ...inputBase, width: 168 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              <FieldLabel required>Grupo de documento</FieldLabel>
              <select value={form.grupo} onChange={s('grupo')}
                style={{ ...inputBase, cursor: 'pointer', color: form.grupo ? '#0F0F10' : '#ADB2BA' }}>
                <option value="">Selecione...</option>
                {GRUPOS_DOC.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Tipo de documento */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <FieldLabel required>Tipo de documento</FieldLabel>
            <select value={form.tipo} onChange={s('tipo')}
              disabled={!form.grupo}
              style={{
                ...inputBase, cursor: form.grupo ? 'pointer' : 'not-allowed',
                background: form.grupo ? '#fff' : '#F8F9FB',
                color: form.tipo ? '#0F0F10' : '#ADB2BA',
              }}>
              <option value=""></option>
              {tiposDisponiveis.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Descrição */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <FieldLabel>Descrição</FieldLabel>
            <textarea value={form.descricao} onChange={s('descricao')} rows={4}
              style={{
                border: '1px solid #C3C8D1', borderRadius: 8, padding: '10px 12px',
                fontFamily: 'var(--font-body-family)', fontSize: 14,
                resize: 'vertical', outline: 'none', background: '#fff',
              }} />
          </div>

          {/* Anexar arquivo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <FieldLabel required>Arquivo</FieldLabel>
            <input
              ref={fileInputRef}
              type="file"
              onChange={e => { if (e.target.files && e.target.files[0]) setFile(e.target.files[0]); }}
              style={{ display: 'none' }}
            />
            {file ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                border: '1px solid #C3C8D1', borderRadius: 8, padding: '10px 12px',
                background: '#F8F9FB',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: '#E3E5FB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <MS name="description" size={18} color="var(--color-primary)" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                  <span style={{
                    fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14, color: '#0F0F10',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{file.name}</span>
                  <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E' }}>
                    {formatSize(file.size)}
                  </span>
                </div>
                <button onClick={() => setFile(null)} style={{
                  background: 'none', border: 0, cursor: 'pointer', padding: 4, borderRadius: 6, flexShrink: 0,
                  display: 'flex', alignItems: 'center',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#EBEDF1'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}>
                  <MS name="close" size={18} color="#65686E" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                  width: '100%', minHeight: 132, borderRadius: 8, padding: '20px 16px',
                  border: `1px dashed ${dragOver ? 'var(--color-primary)' : '#C3C8D1'}`,
                  background: dragOver ? '#F2F4FF' : '#F8F9FB',
                  cursor: 'pointer', transition: 'all 120ms', textAlign: 'center',
                }}>
                <MS name="upload_file" size={28} color={dragOver ? 'var(--color-primary)' : '#ADB2BA'} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10' }}>
                    Arraste um arquivo aqui ou{' '}
                    <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>escolha no computador</span>
                  </span>
                  <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E' }}>
                    PDF, JPG ou PNG · até 10 MB
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => { if (file) { onSave && onSave({ ...form, file }); onClose(); } }}
            style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', height: 44, border: 0, borderRadius: 8,
            background: file ? 'var(--color-primary)' : '#EBEDF1',
            color: file ? '#fff' : '#ADB2BA',
            fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 15,
            cursor: file ? 'pointer' : 'not-allowed', transition: 'background 120ms',
          }}
          disabled={!file}
          onMouseOver={e => { if (file) e.currentTarget.style.background = 'var(--color-primary-dark1)'; }}
          onMouseOut={e => { if (file) e.currentTarget.style.background = 'var(--color-primary)'; }}>
            Enviar documento
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Document row ── */
const DocumentRow = ({ doc, onDelete }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    border: '1px solid #EBEDF1', borderRadius: 8, padding: '12px 14px', marginBottom: 10,
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: 8, background: '#F0F1FE',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <MS name="attach_file" size={20} color="var(--color-primary)" />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: 'var(--font-body-family)', fontWeight: 700, fontSize: 14, color: '#0F0F10' }}>{doc.tipo}</div>
      <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E' }}>
        {doc.grupo} · {doc.nomeArquivo} · Emitido em {doc.dataEmissao}
      </div>
    </div>
    <button style={{ background: 'none', border: 0, cursor: 'pointer', padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center', flexShrink: 0 }}
      onMouseOver={e => e.currentTarget.style.background = '#F8F9FB'}
      onMouseOut={e => e.currentTarget.style.background = 'none'}>
      <MS name="download" size={18} color="#65686E" />
    </button>
    <button onClick={() => onDelete(doc.id)} style={{ background: 'none', border: 0, cursor: 'pointer', padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center', flexShrink: 0 }}
      onMouseOver={e => e.currentTarget.style.background = '#FFF0EE'}
      onMouseOut={e => e.currentTarget.style.background = 'none'}>
      <MS name="delete" size={18} color="#E65637" />
    </button>
  </div>
);

/* ── Main tab ── */
const DocumentosTab = ({ isEmpty = false }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [docs, setDocs] = useState(DOC_RECORDS);
  const [toast, setToast] = useState(false);
  const visibleDocs = isEmpty ? [] : docs;
  const deleteDoc = (id) => setDocs(prev => prev.filter(d => d.id !== id));

  return (
    <div>
      {toast && <Toast title="Documento enviado com sucesso" onClose={() => setToast(false)} />}
      {/* Action button */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            height: 40, padding: '0 20px', border: 0, borderRadius: 8,
            background: 'var(--color-primary)', color: '#fff',
            fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', transition: 'background 120ms',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--color-primary-dark1)'}
          onMouseOut={e => e.currentTarget.style.background = 'var(--color-primary)'}>
          <MS name="attach_file" size={18} color="#fff" />
          Anexar novo documento
        </button>
        {visibleDocs.length > 0 && (
          <span style={{ fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#65686E' }}>
            {visibleDocs.length} {visibleDocs.length === 1 ? 'documento enviado' : 'documentos enviados'}
          </span>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: '#EBEDF1', marginBottom: 24 }} />

      {/* Lista de documentos / estado vazio */}
      {visibleDocs.length > 0 ? (
        <div>{visibleDocs.map(d => <DocumentRow key={d.id} doc={d} onDelete={deleteDoc} />)}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, minHeight: 160, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#F0F1FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MS name="info" size={28} color="var(--color-primary)" />
          </div>
          <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 16, color: '#0F0F10' }}>Nenhum documento enviado</span>
        </div>
      )}

      {/* Modal */}
      {modalOpen && <UploadModal onClose={() => setModalOpen(false)} onSave={(data) => {
        setDocs(prev => [{
          id: Date.now(), grupo: data.grupo || 'Pessoal', tipo: data.tipo || 'Documento',
          nomeArquivo: data.file?.name || 'documento.pdf',
          dataEmissao: data.dataEmissao ? data.dataEmissao.split('-').reverse().join('/') : new Date().toLocaleDateString('pt-BR'),
          tamanho: data.file ? `${Math.max(1, Math.round(data.file.size / 1024))} KB` : '—',
        }, ...prev]);
        setToast(true);
      }} />}
    </div>
  );
};

Object.assign(window, { DocumentosTab });
