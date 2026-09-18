"""
Renderiza um validacao.RelatorioValidacao como markdown — ver
projetos/importador_impulso/cli-development.md, seção 5, para o formato.

Reescrito do zero a cada execução (não é log acumulativo — reflete o
estado atual dos dados no momento em que rodou).
"""

from datetime import datetime


def _grupo_para_linhas(grupo):
    linhas = [f"### {grupo['titulo']} ({len(grupo['itens'])} caso(s))", ""]
    if not grupo["itens"]:
        linhas.append("_Nenhum caso encontrado._")
    else:
        for item in grupo["itens"]:
            texto = item.replace("\n", "\n      ")
            linhas.append(f"- [ ] {texto}")
    linhas.append("")
    return linhas


def _secao(titulo, grupos, mensagem_vazio):
    linhas = [f"## {titulo}", ""]
    grupos_com_itens = [g for g in grupos if g and g["itens"]]
    if not grupos_com_itens:
        linhas.append(mensagem_vazio)
        linhas.append("")
        return linhas
    for grupo in grupos_com_itens:
        linhas.extend(_grupo_para_linhas(grupo))
    return linhas


def renderizar(card, relatorio, comando=None, gerado_em=None):
    gerado_em = gerado_em or datetime.now().strftime("%Y-%m-%d %H:%M")
    linhas = [f"# Pendências de importação — {card}", "", f"Gerado em: {gerado_em}"]
    if comando:
        linhas.append(f"Execução: `{comando}`")
    linhas.append("")
    linhas.extend(_secao("Bloqueantes (resolver antes de continuar)", relatorio.bloqueantes, "_Nenhuma pendência bloqueante — pode seguir para a próxima etapa._"))
    linhas.extend(_secao("Avisos (não bloqueiam, mas confira)", relatorio.avisos, "_Nenhum aviso._"))
    return "\n".join(linhas)


def escrever(caminho, card, relatorio, comando=None):
    conteudo = renderizar(card, relatorio, comando)
    with open(caminho, "w", encoding="utf-8") as f:
        f.write(conteudo)
    return caminho
