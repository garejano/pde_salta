// Editar dia letivo extra — V5: painel lateral (drawer)
// Segue o padrão do componente app-side-panel da Eleva: eyebrow + título
// grande, corpo rolável com seções divididas por linhas finas, rodapé fixo.
// Gaveta full-height ancorada à direita — nunca quebra na vertical.

const PANEL_W = 600;

// Divider hairline used between panel sections
const PanelDivider = () => (
  <div style={{ height: 1, background: T.borderSubtle, margin: '4px 0' }} />
);

// A labelled field block (form control under an Archivo-bold label)
const PanelField = ({ label, required, children }) => (
  <div>
    <FieldLabel required={required}>{label}</FieldLabel>
    {children}
  </div>
);

const V5SidePanel = () => (
  <NotebookDrawerBackdrop>
    <div style={{
      width: PANEL_W, height: '100%', background: '#fff',
      boxShadow: 'var(--shadow-center-xlarge)', display: 'flex', flexDirection: 'column',
    }}>
      {/* header (fixed) */}
      <div style={{ flexShrink: 0, padding: '28px 32px 20px', borderBottom: `1px solid ${T.borderSubtle}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <Eyebrow>Calendário letivo</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: T.archivo, fontWeight: 600, fontSize: 28, lineHeight: '34px', color: T.ink }}>Editar dia letivo extra</h2>
        </div>
        <div style={{ marginTop: 2 }}><CloseBtn /></div>
      </div>

      {/* body (scrolls) */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '24px 32px', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <PanelField label="Escola" required><Select value="Kobrasol" /></PanelField>
          <PanelField label="Data" required><DateField value="16/02/2026" /></PanelField>
          <PanelField label="Título" required><TextField value="Carnaval" /></PanelField>
          <PanelField label="Descrição" required><TextArea value="Carnaval" rows={3} /></PanelField>

          <PanelDivider />
          <TurnoSerieFilter />

          <PanelDivider />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: T.archivo, fontWeight: 700, fontSize: 15, color: T.ink }}>Turmas</span>
              <CheckItem label="Selecionar todos" />
            </div>
            <div style={{ marginBottom: 12 }}><Search width="100%" /></div>
            <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, height: 240, overflow: 'auto', position: 'relative', padding: '0 16px' }}>
              {TURMAS.map((t, i) => <TurmaGroupExpanded key={t.nome} turma={t} divider={i < TURMAS.length - 1} />)}
              <ScrollThumb top={10} height={90} right={5} />
            </div>
          </div>
        </div>
        {/* panel scroll thumb */}
        <ScrollThumb top={8} height={150} right={6} />
      </div>

      {/* footer (fixed) */}
      <div style={{ flexShrink: 0, padding: '16px 32px', borderTop: `1px solid ${T.borderSubtle}`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Btn kind="danger">Remover</Btn>
        <div style={{ flex: 1 }} />
        <Btn kind="outline">Cancelar</Btn>
        <Btn kind="fill">Salvar</Btn>
      </div>
    </div>
  </NotebookDrawerBackdrop>
);

Object.assign(window, { V5SidePanel });
