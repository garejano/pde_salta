# Guia: Fotos do Carômetro em Homolog/Dev

**Repositório:** estrutura-pedagogica  
**Contexto:** as fotos dos alunos são servidas pelo Picture Service usando um `PseudoToken` de autenticação. Em homolog, o token gerado não tem acesso ao Picture Service de produção onde as fotos estão armazenadas. O workaround é substituir o token de homolog pelo de produção no localStorage.

---

## Como funciona (base técnica)

| Elemento | Detalhe |
|---|---|
| **Chave do localStorage** | `usuarioAutenticado` |
| **Campo do token** | `usuarioAutenticado.ElevaId.PseudoToken` |
| **URL da foto** | `{PICTURESERVICE_URL}/aluno/{hash}.jpg?token={PseudoToken}` |
| **Hash da foto** | `SHA256("Ef2SbuEEKSfY8#" + userId) + ".jpg"` |
| **Quem usa** | `PhotoService` → chamado por `ListaPresencaComponent` e `AvatarComponent` |

O frontend monta a URL da foto usando o `PseudoToken` do usuário logado. Em produção o token é válido; em homolog, não.

---

## Passo a passo para o QA

### Pré-requisitos
- Acesso ao ambiente de **homolog/dev** (onde você vai testar o carômetro)
- Acesso ao ambiente de **produção** (para pegar o token válido)
- Navegador com duas abas separadas

---

### Passo 1 — Autenticar em homolog/dev

1. Na **aba 1**, acesse o ambiente de homolog/dev normalmente
2. Faça login com seu usuário de homolog via Salto ID
3. Navegue até a tela do carômetro (`lancamento-frequencia/lista-presenca`) — as fotos aparecerão quebradas ou não carregarão

---

### Passo 2 — Autenticar em produção (segunda aba)

1. Na **aba 2**, acesse o ambiente de **produção**
2. Faça login com seu usuário de **produção** via Salto ID
3. Permaneça nessa aba após o login

---

### Passo 3 — Extrair o token de produção

1. Na **aba 2** (produção), abra o DevTools: **F12** ou clique com o botão direito > "Inspecionar"
2. Vá para a aba **Console**
3. Cole e execute o script `_scripts/foto_homolog_get_token.js`:

```javascript
(function () {
  const raw = localStorage.getItem('usuarioAutenticado');
  if (!raw) { console.error('Não logado!'); return; }
  const usuario = JSON.parse(raw);
  const token = usuario?.ElevaId?.PseudoToken;
  if (!token) { console.error('PseudoToken não encontrado'); return; }
  console.log('=== PseudoToken de PRODUÇÃO ===');
  console.log(token);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(token).then(() => console.log('Copiado para clipboard!'));
  }
})();
```

4. O token será exibido no console (e copiado para o clipboard automaticamente, se o browser permitir)
5. **Copie o token** — ele é uma string longa (ex: `eyJhbGci...`)

---

### Passo 4 — Substituir o token em homolog

1. Volte para a **aba 1** (homolog/dev)
2. Abra o **Console** (F12)
3. Cole o script abaixo, **substituindo `COLE_O_TOKEN_AQUI`** pelo token copiado:

```javascript
(function (novoToken) {
  const raw = localStorage.getItem('usuarioAutenticado');
  if (!raw) { console.error('Não logado!'); return; }
  const usuario = JSON.parse(raw);
  if (!usuario?.ElevaId) { console.error('Estrutura inválida'); return; }
  usuario.ElevaId.PseudoToken = novoToken;
  localStorage.setItem('usuarioAutenticado', JSON.stringify(usuario));
  console.log('Token substituído! Recarregue a página (F5).');
})('COLE_O_TOKEN_AQUI');
```

4. Execute o script → você verá `Token substituído! Recarregue a página (F5).`

---

### Passo 5 — Recarregar e verificar

1. Pressione **F5** para recarregar a página em homolog
2. Navegue novamente até o carômetro
3. As fotos dos alunos devem aparecer corretamente

---

## Observações importantes

- **Duração do token:** o PseudoToken de produção tem validade limitada (expiração definida em `ElevaId.AccessTokenExpiration`). Se as fotos pararem de carregar após algum tempo, repita o processo.
- **Sessão de homolog:** a substituição do token não afeta a autenticação em homolog — você continua logado com seu usuário de homolog; apenas o token de fotos é trocado.
- **Somente para fotos:** esse processo não dá acesso a dados de produção. O Picture Service usa o token apenas para validar o acesso às imagens.
- **Sem reload automático:** o `PhotoService` lê o token no momento da chamada; um simples F5 é suficiente, sem precisar de logout/login.

---

## Scripts salvos

| Arquivo | Onde rodar | Função |
|---|---|---|
| `_scripts/foto_homolog_get_token.js` | Console da aba de **produção** | Extrai e copia o PseudoToken |
| `_scripts/foto_homolog_set_token.js` | Console da aba de **homolog** | Substitui o token no localStorage |
