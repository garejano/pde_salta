// Editar dia letivo extra — design canvas assembly
const NB_W = 1366, NB_H = 768;

function App() {
  return (
    <DesignCanvas>
      <DCSection id="fiel" title="1 · Correção fiel"
        subtitle="Mesmo layout do atual. Header e rodapé fixos; só o corpo rola. A modal nunca passa de 700px de altura.">
        <DCArtboard id="v1" label="Coluna única · cabeçalho e rodapé fixos" width={NB_W} height={NB_H}>
          <V1Faithful />
        </DCArtboard>
      </DCSection>

      <DCSection id="duas" title="2 · Duas colunas"
        subtitle="Aproveita a largura do notebook: dados à esquerda, turmas e turnos à direita. Modal mais baixa, resumo embutido.">
        <DCArtboard id="v2" label="Dados | Turmas lado a lado" width={NB_W} height={NB_H}>
          <V2TwoColumn />
        </DCArtboard>
      </DCSection>

      <DCSection id="abas" title="3 · Abas / etapas"
        subtitle="Separa 'Informações' de 'Turmas e turnos'. Cada etapa cabe sem aperto; a lista de turmas ganha a modal inteira.">
        <DCArtboard id="v3a" label="Etapa 1 · Informações" width={NB_W} height={NB_H}>
          <V3aInfo />
        </DCArtboard>
        <DCArtboard id="v3b" label="Etapa 2 · Turmas e turnos" width={NB_W} height={NB_H}>
          <V3bTurmas />
        </DCArtboard>
      </DCSection>

      <DCSection id="accordion" title="4 · Turmas recolhíveis + resumo"
        subtitle="Cada turma vira uma linha recolhível com contagem. A lista fica curta e o resumo confirma a seleção sem rolar.">
        <DCArtboard id="v4" label="Accordion + barra de resumo" width={NB_W} height={NB_H}>
          <V4Accordion />
        </DCArtboard>
      </DCSection>

      <DCSection id="painel" title="5 · Painel lateral (drawer)"
        subtitle="Gaveta full-height à direita, no padrão app-side-panel da Eleva: eyebrow + título grande, corpo rolável em seções, rodapé fixo. Não disputa altura com a tela.">
        <DCArtboard id="v5" label="Painel lateral · estilo app-side-panel" width={NB_W} height={NB_H}>
          <V5SidePanel />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
