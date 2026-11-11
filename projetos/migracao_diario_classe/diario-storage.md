# Diário de Classe — Documentos Gerados e Local Storage

> Base de contexto: `./readme.md`  
> A tela já foi implementada. Este documento descreve melhorias sobre ela.

---

## Tela alvo

`diario-de-classe/listar`

---

## Bloco "Documentos Gerados"

Abaixo do filtro, um bloco `class="documentos-gerados"` exibe em grid (máximo 4 colunas) os últimos documentos gerados, conforme o filtro aplicado.

### Visual do bloco

- Fundo com leve destaque e bordas arredondadas.
- Documentos ordenados da esquerda para a direita por data de geração (mais recentes primeiro).
- O grid cresce conforme a quantidade de documentos.

### Estados do bloco

| Estado | Condição | Comportamento |
|---|---|---|
| **Vazio sem filtro** | Filtro não aplicado e nenhum documento no storage | Exibe mensagem orientando o usuário a preencher o filtro e aplicar para gerar o diário |
| **Com documentos** | Filtro não aplicado mas há documentos no storage | Exibe os cards dos documentos disponíveis |
| **Filtro aplicado** | Filtro aplicado e documentos correspondentes no storage | Exibe os cards filtrados |

### Cards de documento

Cada card exibe as informações do filtro que gerou aquele documento.

Rodapé do card:
- **Botão "Remover"** — alinhado à esquerda: remove o card da tela e exclui o documento do storage.
- **Botão "Visualizar"** — alinhado à direita: gera o documento em tela via `document-builder` (fluxo já existente).

Clicar no corpo do card também aciona a visualização.

---

## Local Storage

### Service dedicado

Um service isolado gerencia todo o ciclo de vida dos documentos no storage.

### Regras de armazenamento

- Cada documento fica disponível por **2 horas** após ser gerado.
  - Validar se o mecanismo de expiração deve seguir o mesmo padrão do storage do filtro (que controla por usuário).
- Ao carregar a tela, o service valida documentos existentes no storage e os exibe automaticamente.

### Comportamento ao aplicar o filtro

- Se o filtro aplicado já tiver um documento no storage (dentro do prazo de 2h): **usa os dados do storage**, sem novo request.
- Se não houver documento no storage para o filtro: faz o download dos dados e salva no storage.

### Remoção

- Ao clicar em "Remover" no card, o documento é removido do storage imediatamente.
