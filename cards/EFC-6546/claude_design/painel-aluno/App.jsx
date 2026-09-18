// Main App composition
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "viewMode": "Por dia",
  "frequenciaVazia": false,
  "pedagogicoVazio": false,
  "podeExcluir": false,
  "atendimentoVazio": false,
  "ocorrenciasVazio": false,
  "anamneseVazia": false,
  "documentosVazio": false,
  "temComportamento": true,
  "resumoStatus": "ok",
  "filiacaoUnica": false,
  "rfSemEmail": false,
  "fichaMedicaVazia": false
}/*EDITMODE-END*/;

const App = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [year, setYear] = React.useState(2025);
  const [subTab, setSubTab] = React.useState('Perfil');
  const [tab, setTab] = React.useState('Pedagógico');
  const [chatOpen, setChatOpen] = React.useState(false);
  const [pendingQuestion, setPendingQuestion] = React.useState(null);
  const [dirtyTab, setDirtyTab] = React.useState(null);
  const [confirmTabOpen, setConfirmTabOpen] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState(null);
  const { isCompact, isMobile } = useBreakpoint();

  const guardedAction = (fn) => {
    if (dirtyTab && dirtyTab === tab) {
      setPendingAction(() => fn);
      setConfirmTabOpen(true);
    } else {
      fn();
    }
  };
  const attemptSetTab = (newTab) => guardedAction(() => setTab(newTab));
  const attemptBack = () => guardedAction(() => {
    if (window.__navToLista) window.__navToLista();
    else window.location.href = '../lista-alunos/index.html';
  });
  const attemptPrev = () => guardedAction(() => {});
  const attemptNext = () => guardedAction(() => {});
  const confirmTabDiscard = () => {
    setConfirmTabOpen(false);
    setDirtyTab(null);
    if (pendingAction) pendingAction();
    setPendingAction(null);
  };

  const askFromChip = (q) => {
    setPendingQuestion(q);
    setChatOpen(true);
  };
  const openEmpty = () => {
    setPendingQuestion(null);
    setChatOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB' }}>
      <TweaksPanel>
        <TweakSection label="Frequência" />
        <TweakRadio
          label="Visualização"
          value={t.viewMode}
          options={['Por dia', 'Por tempo de aula']}
          onChange={(v) => setTweak('viewMode', v)}
        />
        <TweakSection label="Estados vazios" />
        <TweakToggle
          label="Frequência vazia"
          value={t.frequenciaVazia}
          onChange={(v) => setTweak('frequenciaVazia', v)}
        />
        <TweakToggle
          label="Pedagógico vazio"
          value={t.pedagogicoVazio}
          onChange={(v) => setTweak('pedagogicoVazio', v)}
        />
        <TweakToggle
          label="Atendimento vazio"
          value={t.atendimentoVazio}
          onChange={(v) => setTweak('atendimentoVazio', v)}
        />
        <TweakToggle
          label="Ocorrências vazio"
          value={t.ocorrenciasVazio}
          onChange={(v) => setTweak('ocorrenciasVazio', v)}
        />
        <TweakToggle
          label="Anamnese não respondida"
          value={t.anamneseVazia}
          onChange={(v) => setTweak('anamneseVazia', v)}
        />
        <TweakToggle
          label="Documentos vazio"
          value={t.documentosVazio}
          onChange={(v) => setTweak('documentosVazio', v)}
        />
        <TweakToggle
          label="Ficha médica não informada"
          value={t.fichaMedicaVazia}
          onChange={(v) => setTweak('fichaMedicaVazia', v)}
        />
        <TweakSection label="Regras por escola" />
        <TweakToggle
          label="Escola registra comportamento"
          value={t.temComportamento}
          onChange={(v) => setTweak('temComportamento', v)}
        />
        <TweakSection label="Permissões" />
        <TweakToggle
          label="Pode excluir atendimentos/ocorrências"
          value={t.podeExcluir}
          onChange={(v) => setTweak('podeExcluir', v)}
        />
        <TweakSection label="Resumo Inteligente" />
        <TweakRadio
          label="Estado"
          value={t.resumoStatus}
          options={['ok', 'loading', 'error', 'empty']}
          onChange={(v) => setTweak('resumoStatus', v)}
        />
        <TweakSection label="Filiação" />
        <TweakToggle
          label="Responsável único (financeiro e pedagógico)"
          value={t.filiacaoUnica}
          onChange={(v) => setTweak('filiacaoUnica', v)}
        />
        <TweakToggle
          label="Responsável financeiro sem e-mail cadastrado"
          value={t.rfSemEmail}
          onChange={(v) => setTweak('rfSemEmail', v)}
        />
      </TweaksPanel>

      <ConfirmDiscardModal open={confirmTabOpen} onConfirm={confirmTabDiscard} onCancel={() => { setConfirmTabOpen(false); setPendingAction(null); }} />
      <TopNav />
      <PageHeader onBack={attemptBack} onPrev={attemptPrev} onNext={attemptNext} />

      <div style={{
        maxWidth: 1400, margin: '0 auto',
        padding: isMobile ? '0 16px 48px' : isCompact ? '0 24px 48px' : '0 32px 48px',
        display: 'grid',
        gridTemplateColumns: isCompact ? '1fr' : '360px 1fr',
        gap: isCompact ? 16 : 24,
        alignItems: 'flex-start',
      }}>
        {/* Left */}
        <StudentInfoCard subTab={subTab} setSubTab={setSubTab} year={year} onYearChange={setYear} viewMode={t.viewMode} frequenciaVazia={t.frequenciaVazia} temComportamento={t.temComportamento} filiacaoUnica={t.filiacaoUnica} fichaMedicaVazia={t.fichaMedicaVazia} />

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ResumoInteligente onChipClick={askFromChip} onPerguntarMais={openEmpty} status={t.resumoStatus} />

          <div style={{
            background: '#fff', borderRadius: 12, border: '1px solid #EBEDF1',
            overflow: 'hidden',
          }}>
            <TabsRow active={tab} onChange={attemptSetTab} />
            <div style={{ padding: 24 }}>
              {tab === 'Pedagógico'  && <PedagogicoTab isEmpty={t.pedagogicoVazio} />}
              {tab === 'Atendimento' && <AtendimentoTab podeExcluir={t.podeExcluir} isEmpty={t.atendimentoVazio} rfSemEmail={t.rfSemEmail} onDirtyChange={(d) => setDirtyTab(d ? 'Atendimento' : (dirtyTab === 'Atendimento' ? null : dirtyTab))} />}
              {tab === 'Anamnese'    && <AnamneseTab isEmpty={t.anamneseVazia} />}
              {tab === 'Ocorrências' && <OcorrenciasTab podeExcluir={t.podeExcluir} isEmpty={t.ocorrenciasVazio} rfSemEmail={t.rfSemEmail} onDirtyChange={(d) => setDirtyTab(d ? 'Ocorrências' : (dirtyTab === 'Ocorrências' ? null : dirtyTab))} />}
              {tab === 'Documentos'  && <DocumentosTab isEmpty={t.documentosVazio} />}
            </div>
          </div>
        </div>
      </div>

      <ChatFab onClick={() => setChatOpen(true)} hidden={chatOpen} />
      <ChatDrawer
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        pendingQuestion={pendingQuestion}
        onQuestionConsumed={() => setPendingQuestion(null)}
      />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
