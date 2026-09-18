/**
 * foto_homolog_set_token.js
 *
 * ONDE RODAR: console do navegador logado em HOMOLOG/DEV
 * OBJETIVO:   Substituir o PseudoToken de homolog pelo de produção,
 *             fazendo as fotos do carômetro carregarem corretamente.
 *
 * Instruções:
 *   1. Execute foto_homolog_get_token.js na aba de produção e copie o token
 *   2. Nesta aba (homolog/dev), abra o DevTools (F12) > Console
 *   3. Substitua COLE_O_TOKEN_AQUI pelo token copiado
 *   4. Execute o script
 *   5. Recarregue a página (F5)
 */

const PSEUDO_TOKEN_PROD = 'COLE_O_TOKEN_AQUI';  // <-- substituir

(function (novoToken) {
  if (novoToken === 'COLE_O_TOKEN_AQUI' || !novoToken) {
    console.error('[foto-homolog] Substitua COLE_O_TOKEN_AQUI pelo token de produção antes de executar.');
    return;
  }

  const raw = localStorage.getItem('usuarioAutenticado');
  if (!raw) {
    console.error('[foto-homolog] Chave "usuarioAutenticado" não encontrada. Você está logado?');
    return;
  }

  const usuario = JSON.parse(raw);

  if (!usuario?.ElevaId) {
    console.error('[foto-homolog] Estrutura ElevaId não encontrada.');
    return;
  }

  const tokenAntigo = usuario.ElevaId.PseudoToken;
  usuario.ElevaId.PseudoToken = novoToken;
  localStorage.setItem('usuarioAutenticado', JSON.stringify(usuario));

  console.log('[foto-homolog] Token substituído com sucesso!');
  console.log('  Antes :', tokenAntigo);
  console.log('  Depois:', novoToken);
  console.log('Recarregue a página (F5) para as fotos carregarem.');

})(PSEUDO_TOKEN_PROD);
