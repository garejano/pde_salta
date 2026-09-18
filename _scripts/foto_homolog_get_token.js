/**
 * foto_homolog_get_token.js
 *
 * ONDE RODAR: console do navegador logado em PRODUÇÃO (Salto ID prod)
 * OBJETIVO:   Extrair o PseudoToken de produção para usar em homolog
 *
 * Instruções:
 *   1. Abra uma aba e autentique em produção normalmente
 *   2. Abra o DevTools (F12) > Console
 *   3. Cole e execute este script
 *   4. Copie o token exibido
 */
(function () {
  const raw = localStorage.getItem('usuarioAutenticado');
  if (!raw) {
    console.error('[foto-homolog] Chave "usuarioAutenticado" não encontrada. Você está logado?');
    return;
  }

  const usuario = JSON.parse(raw);

  if (!usuario?.ElevaId?.PseudoToken) {
    console.error('[foto-homolog] PseudoToken não encontrado na estrutura do usuário.');
    console.log('Estrutura encontrada:', usuario);
    return;
  }

  const token = usuario.ElevaId.PseudoToken;
  console.log('=== PseudoToken de PRODUÇÃO ===');
  console.log(token);
  console.log('================================');
  console.log('Copie o token acima e execute foto_homolog_set_token.js na aba de HOMOLOG.');

  // Facilitar cópia: coloca no clipboard se possível
  if (navigator.clipboard) {
    navigator.clipboard.writeText(token)
      .then(() => console.log('Token copiado automaticamente para o clipboard!'))
      .catch(() => console.log('Não foi possível copiar automaticamente. Copie manualmente.'));
  }
})();
