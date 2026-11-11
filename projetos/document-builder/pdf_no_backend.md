repositorio: estrutura-pedagogica


contexto base: document-builder eh um modulo que existe no frontend de estrutura pedagogica,
ele eh responsavel por construir documentos, exibir em tela e gerar pdf apartir dele
no frontend esse processo eh custoso para o pc, em casos em que um usuario possui um notebook a tela trava se tiver mais de 2 paginas.


existe opcoes de geraacao no backend, a ieia eh analisasr como rresolver isso no backend


no front, cada documento eh uma configuracao, tem que ser possivel informar que um documento vai ser gerado no backend (e seguir o fluxo que iremos implementar)
- tbm tem que ser possivel informar se o documento tiver mais de x paginas, ai ele vai ser gerado no backend, se nao, segue gerando no front.


objetivo: implementar no backend de estrutura, uma area separada para geracao do pdf no backend com essas informacoes:

a implementacao no backend deve levar em conta o que ja temos funcioanndo no frontend

- refine esse documento

a configuracao de implessao do documento deve ser passada para o back, se paisagem ou retrato...

Implementar geração de PDF no backend C# utilizando Microsoft Playwright.

Objetivo:

* Receber um HTML enviado pelo frontend Angular.
* Renderizar esse HTML em um Chromium Headless através do Playwright.
* Gerar um PDF A4 com impressão de backgrounds habilitada.
* Retornar o PDF como application/pdf.

Requisitos:

* Criar um serviço PdfService responsável pela geração.
* Criar endpoint POST /api/pdf.
* Receber um DTO contendo a propriedade Html.
* Utilizar page.SetContentAsync(html) para carregar o conteúdo.
* Utilizar page.PdfAsync() para gerar o PDF.
* Configurar:

  * Format = A4
  * PrintBackground = true
* Retornar o arquivo PDF diretamente na resposta HTTP.

Observações:

* Estruturar o código para permitir reutilização futura.
* Se possível, manter uma única instância do Browser aberta e criar apenas novas Pages para cada requisição, evitando abrir/fechar o Chromium a cada geração.
* Adicionar logs de tempo de geração do PDF para análise de performance.
