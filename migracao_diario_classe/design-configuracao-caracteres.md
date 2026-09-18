# Tela de Configuração de Caracteres — Diário de Classe

## O que a tela faz

Permite que o usuário configure quais caracteres são usados para representar cada tipo de frequência no Diário de Classe de uma rede de ensino. Cada rede pode ter seus próprios caracteres. A configuração é salva no banco e depois refletida nos documentos gerados (chamadas, relatórios).

---

## Fluxo de uso

1. **Usuário abre a aba "Configuração"** (dentro de Diário de Classe, ao lado de "Diário de Classe")
2. **Seleciona uma rede** no dropdown — a tela carrega a configuração salva para essa rede
3. **Edita os caracteres** desejados (máx. 1 caractere por campo)
4. **Visualiza o preview em tempo real** — a tabela à direita atualiza instantaneamente conforme digita
5. **Clica em "Salvar configuração"** — o botão muda para "Salvo!" por 2,5s depois volta ao normal

Se a rede ainda **não tiver configuração salva**, um aviso amarelo aparece e os campos mostram os valores padrão (P, F, -, T, N). O usuário pode salvar para criar a configuração.

---

## Campos editáveis (5 caracteres de frequência)

| Campo | Padrão | Significado |
|---|---|---|
| Presença | `P` | Aluno presente |
| Falta | `F` | Aluno ausente |
| Pendência | `-` | Frequência ainda não lançada |
| Transferência | `T` | Aluno transferido |
| NEE | `N` | Necessidades Educacionais Especiais |

Cada campo aceita **exatamente 1 caractere** (`maxlength="1"`).

---

## Comportamentos importantes

- **Dropdown de rede** aparece com as redes às quais o usuário tem acesso (não exige seleção de ano letivo)
- **Card de caracteres** fica desabilitado (`pointer-events: none`) enquanto nenhuma rede está selecionada — mostra ícone "tune" e mensagem orientativa
- **Preview reativo**: a tabela de exemplo atualiza em tempo real sem nenhum clique — mostra 6 alunos fictícios com 5 datas de aulas, cobrindo todos os 5 tipos de caráter
- **Colunas de caráter** na tabela ficam em azul (`#242cc2`) e negrito para destacar visualmente
- **Estado de erro**: se o save falhar, aparece um banner vermelho abaixo dos campos
- **Estado de loading**: spinner enquanto carrega a lista de redes e enquanto carrega a configuração da rede selecionada

---

## Layout atual

```
┌──────────────────────────────────────────────────────────────────┐
│  [card: select de rede]                                          │
│                                                                  │
│  [card: formulário de caracteres]     [tabela preview sticky]    │
│    ├ info banner (se sem config)        Nº  Nome     MM/DD ...   │
│    ├ Presença     [P]                   1   Ana      P  F  P...  │
│    ├ Falta        [F]                   2   Bruno    P  P  N...  │
│    ├ Pendência    [-]                   3   Camila   F  P  T...  │
│    ├ Transferência [T]                  4   Diego    P  P  -...  │
│    ├ NEE          [N]                   5   Eduarda  P  P  P...  │
│    └ [Salvar configuração]              6   Felipe   F  P  F...  │
│                                       * Dados fictícios          │
└──────────────────────────────────────────────────────────────────┘
```

**Grid:** 2 colunas — `360px` (form) + `1fr` (preview), gap `32px`, max-width `1100px`.  
**Preview** fica sticky ao rolar.

---

## Paleta e tipografia (sistema de design atual)

| Token | Valor |
|---|---|
| primary | `#242cc2` |
| primary-light | `#ecedff` |
| neutral-dark3 | `#0f0f10` |
| neutral-dark1 | `#65686e` |
| neutral-l1 | `#c3c8d1` |
| neutral-l2 | `#ebedf1` |
| neutral-l3 | `#f8f9fb` |
| Font título/label | Archivo (uppercase, 11px, letter-spacing 0.1em) |
| Font body/inputs | Nunito, 14px |
| Font char inputs | Archivo Bold, 16px, centralized |

---

## O que está funcionando bem (manter na redesign)

- Preview reativo — feedback instantâneo é o ponto forte da tela
- Input de char centralizado com fundo azul-claro e texto azul
- Tabela preview com zebra striping e chars em destaque
- Botão de salvar com feedback visual "Salvo!" verde após sucesso
- Card desabilitado com mensagem orientativa antes de selecionar rede

## O que pode melhorar (sugestões para o designer)

- Os 5 campos de input ficam empilhados verticalmente com muito espaço — poderia ser mais compacto ou visualmente mais interessante (ex: exibir como "badge" editável)
- A relação visual entre cada campo do form e a coluna correspondente na tabela preview não é imediata — algum tipo de destaque ou "linking" ao focar no input poderia ajudar
- O card de configuração e o card de rede são dois cards separados — pode virar um único painel mais fluido
- O aviso "sem configuração" (banner amarelo) é texto puro — poderia ter tratamento visual mais sofisticado
- A tabela preview é funcional mas genérica — poderia ter mais cara de "prévia do documento real"
