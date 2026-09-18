// Editar dia letivo extra — four non-breaking layout variations.
// All built on ModalShell (pinned header + footer, scrolling body) so the
// dialog can never exceed the viewport — proven inside a 1366×768 notebook.

const StdFooter = () => (
  <React.Fragment>
    <Btn kind="ghost">Cancelar</Btn>
    <Btn kind="danger">Remover</Btn>
    <Btn kind="fill">Confirmar</Btn>
  </React.Fragment>
);

// "Turmas" header row: label + search + selecionar todos
const TurmasHeaderRow = ({ searchWidth = 240 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
    <span style={{ fontFamily: T.archivo, fontWeight: 700, fontSize: 15, color: T.ink }}>Turmas</span>
    <Search width={searchWidth} />
    <CheckItem label="Selecionar todos" />
  </div>
);

// Bordered, internally-scrolling turma list (keeps its own scroll, per spec)
const TurmasScrollBox = ({ height }) => (
  <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, height, overflow: 'auto', position: 'relative', padding: '0 16px' }}>
    {TURMAS.map((t, i) => (
      <TurmaGroupExpanded key={t.nome} turma={t} divider={i < TURMAS.length - 1} />
    ))}
    <ScrollThumb top={10} height={Math.round(height * 0.34)} right={5} />
  </div>
);

// Shared metadata fields (Escola / Data / Título / Descrição)
const MetaFields = ({ dateInline = true }) => (
  <React.Fragment>
    <div style={{ display: 'grid', gridTemplateColumns: dateInline ? '1fr 1fr' : '1fr', gap: 16 }}>
      <div>
        <FieldLabel required>Escola</FieldLabel>
        <Select value="Kobrasol" />
      </div>
      <div>
        <FieldLabel required>Data</FieldLabel>
        <DateField value="16/02/2026" />
      </div>
    </div>
    <div>
      <FieldLabel required>Título</FieldLabel>
      <TextField value="Carnaval" />
    </div>
    <div>
      <FieldLabel required>Descrição</FieldLabel>
      <TextArea value="Carnaval" rows={3} />
    </div>
  </React.Fragment>
);

// ════════════════════════════════════════════════════════════════════
// V1 — Correção fiel: mesmo layout, header/rodapé fixos, corpo rolável
// ════════════════════════════════════════════════════════════════════
const V1Faithful = () => (
  <NotebookBackdrop>
    <ModalShell title="Editar dia letivo extra" width={760} height={700} footer={<StdFooter />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <MetaFields />
        <TurnoSerieFilter />
        <div>
          <TurmasHeaderRow searchWidth={240} />
          <TurmasScrollBox height={210} />
        </div>
      </div>
    </ModalShell>
  </NotebookBackdrop>
);

// ════════════════════════════════════════════════════════════════════
// V2 — Duas colunas: dados à esquerda, turmas/turnos à direita
// ════════════════════════════════════════════════════════════════════
const V2TwoColumn = () => (
  <NotebookBackdrop>
    <ModalShell title="Editar dia letivo extra" width={1120} height={660}
      footer={<StdFooter />} bodyStyle={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        {/* left — informações */}
        <div style={{ width: 452, flexShrink: 0, borderRight: `1px solid ${T.borderSubtle}`, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <MetaFields dateInline={false} />
          <TurnoSerieFilter />
        </div>
        {/* right — turmas */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: 24, gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: T.archivo, fontWeight: 700, fontSize: 15, color: T.ink }}>Turmas</span>
            <Search width={260} />
            <CheckItem label="Selecionar todos" />
          </div>
          <div style={{ flex: 1, minHeight: 0, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'auto', position: 'relative', padding: '0 16px' }}>
            {TURMAS.map((t, i) => <TurmaGroupExpanded key={t.nome} turma={t} divider={i < TURMAS.length - 1} />)}
            <ScrollThumb top={10} height={150} right={5} />
          </div>
          <SummaryBar />
        </div>
      </div>
    </ModalShell>
  </NotebookBackdrop>
);

// ════════════════════════════════════════════════════════════════════
// V3 — Abas / etapas
// ════════════════════════════════════════════════════════════════════
const Tabs = ({ active }) => {
  const tab = (n, label, on) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px 12px', cursor: 'default',
      borderBottom: `2px solid ${on ? T.indigo : 'transparent'}`,
    }}>
      <span style={{
        width: 20, height: 20, borderRadius: 999, background: on ? T.indigo : T.borderSubtle,
        color: on ? '#fff' : T.muted, fontFamily: T.archivo, fontWeight: 700, fontSize: 12,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>{n}</span>
      <span style={{ fontFamily: T.archivo, fontWeight: 700, fontSize: 15, color: on ? T.indigo : T.muted }}>{label}</span>
    </div>
  );
  return (
    <div style={{ flexShrink: 0, display: 'flex', gap: 28, padding: '14px 24px 0', borderBottom: `1px solid ${T.borderSubtle}` }}>
      {tab('1', 'Informações', active === 1)}
      {tab('2', 'Turmas e turnos', active === 2)}
    </div>
  );
};

const V3aInfo = () => (
  <NotebookBackdrop>
    <ModalShell title="Editar dia letivo extra" width={840} height={660}
      tabs={<Tabs active={1} />}
      footer={
        <React.Fragment>
          <div style={{ marginRight: 'auto' }}><Btn kind="danger">Remover</Btn></div>
          <Btn kind="ghost">Cancelar</Btn>
          <Btn kind="fill">Próximo: turmas</Btn>
        </React.Fragment>
      }>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <MetaFields />
        <TurnoSerieFilter />
      </div>
    </ModalShell>
  </NotebookBackdrop>
);

const V3bTurmas = () => (
  <NotebookBackdrop>
    <ModalShell title="Editar dia letivo extra" width={840} height={660}
      tabs={<Tabs active={2} />}
      aboveFooter={<SummaryBar />}
      footer={
        <React.Fragment>
          <div style={{ marginRight: 'auto' }}><Btn kind="danger">Remover</Btn></div>
          <Btn kind="ghost">Voltar</Btn>
          <Btn kind="fill">Confirmar</Btn>
        </React.Fragment>
      }
      bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Search width={300} />
        <CheckItem label="Selecionar todos" />
      </div>
      <div style={{ flex: 1, minHeight: 0, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'auto', position: 'relative', padding: '0 16px' }}>
        {TURMAS.map((t, i) => <TurmaGroupExpanded key={t.nome} turma={t} divider={i < TURMAS.length - 1} />)}
        <ScrollThumb top={10} height={170} right={5} />
      </div>
    </ModalShell>
  </NotebookBackdrop>
);

// ════════════════════════════════════════════════════════════════════
// V4 — Turmas recolhíveis (accordion) + resumo
// ════════════════════════════════════════════════════════════════════
const Chevron = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 160ms' }}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const AccordionRow = ({ turma, open, divider }) => (
  <div style={{ borderBottom: divider ? `1px solid ${T.borderSubtle}` : 'none' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 4px' }}>
      <Chevron open={open} />
      <Check size={16} />
      <span style={{ fontFamily: T.nunito, fontWeight: 700, fontSize: 14, color: T.ink }}>{turma.nome} · {turma.turno}</span>
      <div style={{ flex: 1 }} />
      <CountPill>14 disciplinas</CountPill>
    </div>
    {open && (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 18px', padding: '2px 4px 16px 44px' }}>
        {DISCIPLINAS.map(d => <CheckItem key={d} label={d} />)}
      </div>
    )}
  </div>
);

const V4Accordion = () => (
  <NotebookBackdrop>
    <ModalShell title="Editar dia letivo extra" width={800} height={660}
      aboveFooter={<SummaryBar />} footer={<StdFooter />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <MetaFields />
        <TurnoSerieFilter />
        <div>
          <TurmasHeaderRow searchWidth={220} />
          <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, padding: '0 16px' }}>
            {TURMAS.map((t, i) => (
              <AccordionRow key={t.nome} turma={t} open={i === 0} divider={i < TURMAS.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </ModalShell>
  </NotebookBackdrop>
);

Object.assign(window, { V1Faithful, V2TwoColumn, V3aInfo, V3bTurmas, V4Accordion });
