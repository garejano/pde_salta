contexto_base: ./readme.md
repositorio: estrutura-pedagogica

---

# Melhoria: Aba de Configuração de Caracteres — Diário de Classe

## Objetivo

Separar a responsabilidade de **configurar caracteres por rede** (persistido no banco) da responsabilidade do painel de personalização do documento (que opera apenas no documento aberto).

Hoje o `app-doc-diario-config-panel` / `DocumentConfigPanelComponent` faz as duas coisas. O comportamento deve ser dividido:

| Onde | Responsabilidade |
|------|-----------------|
| `DocumentConfigPanelComponent` (painel lateral do documento) | Alterar caracteres **ao vivo**, apenas para o documento atual aberto |
| `/diario-de-classe/configurar` (nova rota) | Editar e salvar configuração de caracteres **por rede** no banco |

---

## 1. Alteração no `DocumentConfigPanelComponent`

- Manter a funcionalidade de alterar caracteres ao vivo (sem salvar no banco).
- **Remover** o botão/ação de salvar no banco.
- **Adicionar** mensagem informativa abaixo dos campos:

  > *"As alterações feitas aqui valem apenas para este documento. Para alterar a configuração definitiva da rede, acesse a aba **Configuração**."*

---

## 2. Nova tela — `/diario-de-classe/configurar`

### Navegação

- Acessada via **tab-navigator** junto à rota `/diario-de-classe/listar`.
- Abas: `Listar` | `Configuração`

### Layout

```
┌──────────────────────────────────────────────────────────────┐
│  [Tab: Listar]  [Tab: Configuração ←]                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Selecionar rede: [ dropdown de redes ▾ ]                    │
│                                                              │
│  ┌─ Configuração de Caracteres ─────────────────────────┐   │
│  │  (desabilitado até rede ser selecionada)              │   │
│  │                                                       │   │
│  │  Presença:       [ P ]                                │   │
│  │  Falta:          [ F ]                                │   │
│  │  Pendência:      [ ? ]                                │   │
│  │  NEE:            [ N ]                                │   │
│  │  Transferência:  [ T ]                                │   │
│  │                                                       │   │
│  │  [ Salvar ]                                           │   │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ Preview ─────────────────────────────────────────────┐  │
│  │  Nº │ Nome do Aluno       │ 01/01 │ 02/01 │ ... │ F  │  │
│  │   1 │ Ana Carolina ...    │  P    │  F    │ ... │ 1  │  │
│  │   2 │ Bruno Henrique ...  │  F    │  P    │ ... │ 1  │  │
│  │   3 │ Camila Rodrigues ... │  N    │  P    │ ... │ 0  │  │
│  │   4 │ Diego Alves ...     │  T    │  P    │ ... │ 0  │  │
│  │   5 │ Eduarda Santos ...  │  P    │  ?    │ ... │ 0  │  │
│  │   6 │ Felipe Mendes ...   │  P    │  P    │ ... │ 0  │  │
│  │                                                       │  │
│  │  * Dados fictícios. Não representam alunos reais.     │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Comportamento do select de rede

- Exibe apenas as redes às quais o usuário tem acesso.
- Ao selecionar uma rede:
  - Se já existe configuração salva → carrega os caracteres atuais.
  - Se não existe → campos exibem os valores padrão (`P`, `F`, `?`, `N`, `T`).
- Enquanto nenhuma rede estiver selecionada:
  - O bloco de configuração fica desabilitado (campos `disabled`).
  - Exibir mensagem: *"Selecione uma rede para editar a configuração de caracteres."*

### Preview (tabela à direita)

- Tabela estática, sem interação.
- **6 linhas** com nomes fictícios simples em ordem alfabética.
- **5 colunas de dia** com datas fixas (ex.: `28/01`, `29/01`, `30/01`, `31/01`, `03/02`).
- Cada coluna de dia exibe um dos caracteres configuráveis, distribuídos de forma a cobrir todos os 5 caracteres possíveis (presença, falta, pendência, NEE, transferência) ao longo das linhas e colunas.
- Ao editar qualquer campo de caractere no bloco de configuração, **o preview atualiza em tempo real** refletindo o novo caractere na tabela.
- Rodapé da tabela: `* Dados fictícios. Não representam alunos reais.`

### Endpoint de save

Usar o endpoint já previsto na migração:

```
POST api/diariodeclasse/configuracao/save
```

Payload: `DiarioDeClasseConfiguracaoSaveRequest` (os 5 caracteres + `RedeId`).

### Permissão de acesso

Restrita a usuários com `Funcionalidade.DiarioDeClasse_Configuracao` (mesma permissão já mapeada no doc-ped).

---

## Referências

| O quê | Onde |
|-------|------|
| Config panel atual | `documentacao-pedagogica/frontend-diario-classe/.../configuracao/` |
| `DocumentConfigPanelComponent` destino | `estrutura-pedagogica/frontend/.../diario-de-classe/` |
| Endpoint de configuração | `readme.md` → seção Backend — Endpoints |
| Tabela de exemplo (visual) | `./modelo_table.png` |




NOVAS_TAREFAS:

crie um template de modelo para a tela de configuracoes
./clade_design_configuracoes/Configuração Diário de Classe.html

o modelo acima serve como viual e funcionalidade
funcionalidaes includas pelo claude design:
ao passar o mouse em um campo de caracter, na tabela exemplo ou na legenda, os campos iguais sao realcadas

planeje a implementacao desse template
