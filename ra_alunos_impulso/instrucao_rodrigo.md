
As cores de fundo só indicam o bloco que tá sendo importado para poder exportar depois.
Geralmente mandam uma planilha separada por abas, com cada aba sendo uma escola. Junta tudo numa mesma aba, reordenando as colunas para Escola | Turma | Série (em branco) | Aluno.
Aí cola no final dessa planilha.
Preenche a Série com os valores da aba Ids, deduzindo pelo nome da turma (não mandam com padrão, não bate com o que tá no sistema.
RA deixa sequencial, anterior + 1. Mas salva como valor e não fórmula porque se em algum momento reordenar a lista não perde a associação.
As colunas F até L é só copiar a fórmula das linhas anteriores. Os valores vão se preencher se a série for válida e o RA estiver preenchido.
Dá um substituir no nome dos alunos, de ' para '', para não quebrar as strings.
As queries tratam duplicidade, então pode rodar quantas vezes quiser. Sugestão fazer coluna por coluna.
