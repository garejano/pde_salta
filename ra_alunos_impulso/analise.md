# Análise: Geração de RA para Alunos Impulso (ENEM2)

## Contexto

Escolas públicas gerenciadas pela empresa utilizam nossos sistemas. Alunos dessas escolas que **não** são da nossa rede precisam de um RA cadastrado para poder usar a correção de redação. O processo que o Rodrigo faz manualmente foi documentado e automatizado aqui.

---

## O que foi entendido do processo manual

A partir da planilha modelo (`Importação de Alunos Impulso.xlsx`) e das instruções do Rodrigo, o processo é:

1. **Montar a planilha** com colunas: Escola | Turma | Série | Aluno | RA | IdEscola | IdTurma
2. **Atribuir RA sequencialmente** (anterior + 1), guardando como valor fixo (não fórmula)
3. **Executar 5 INSERTs por aluno, coluna a coluna**, na seguinte ordem:
   - `Pessoa` → cria o registro de pessoa com `temp = RA`
   - `Usuario` → cria o usuário vinculado à Pessoa
   - `PessoaEscola` → vincula Pessoa à Escola com `Matricula = RA`
   - `PessoaEscolaAcesso` → cria credencial de acesso (PerfilAcesso = 1 = aluno)
   - `AlunoEscola` → matrícula na turma (AnoLetivo = 2026, Status = 'Matriculado')
4. Todas as queries são **idempotentes** (usam LEFT JOIN + IS NULL para evitar duplicidade)
5. Substituir `'` por `''` nos nomes antes de executar

---

## Cadeia de tabelas

```
Pessoa (temp = RA)
  └─ Usuario (Pessoa → Pessoa.Id)
       └─ PessoaEscola (Pessoa + Escola + Matricula)
            └─ PessoaEscolaAcesso (PessoaEscola + PerfilAcesso=1 + temp=RA)
                 └─ AlunoEscola (AlunoEscola_key = PessoaEscolaAcesso.Id + Turma + AnoLetivo)
```

**Nota crítica de schema:** `AlunoEscola.AlunoEscola_key` é FK para `PessoaEscolaAcesso.Id`, **não** para `Pessoa.Id`.

---

## Dados da nova planilha (Turmas Impulso ENEM2)

- **Arquivo:** `Turmas Impulso (ENEM2).xlsx`, aba `ALUNOS NOVOS`
- **Total de alunos:** 118
- **Escolas:** 23 escolas diferentes
- **Turmas:** misto de 2ª e 3ª série, Regular e Técnico

---

## RA — sequência utilizada

| Item | Valor |
|------|-------|
| Último RA existente no banco (`Pessoa.temp LIKE '909%'`) | 90929455 |
| Primeiro RA novo | 90929456 |
| Último RA novo | 90929573 |
| Total de RAs gerados | 118 |

---

## Mapeamento escola → turma (IDs do banco)

Os IDs de escola e turma foram validados contra o banco (AnoLetivo=2026).

| Escola | Id Escola | Turma (planilha) | Turma (banco) | Id Turma |
|--------|-----------|-----------------|---------------|----------|
| ADAILE M LEITE | 2366 | 3ºBM | 3ª Série Regular B - M | 297496 |
| ANCHIETA | 2368 | 2ª Série Regular A | 2ª Série Regular A - M | 297549 |
| ANCHIETA | 2368 | 2ª Tec. Integral | 2ª Série Técnico A - I | 297561 ⚠️ |
| ANCHIETA | 2368 | 3ª Série Regular A | 3ª Série Regular A - M | 297550 |
| BRANCA DA MOTA FERNANDES | 2369 | 3ª A | 3ª Série Regular A - M | 297584 |
| BRANCA DO N MIRANDA | 2370 | 3ºA | 3ª Série Regular A - M | 297627 |
| BRANCA DO N MIRANDA | 2370 | 3ºB | 3ª Série Regular B - M | 297628 |
| BRANCA DO N MIRANDA | 2370 | 3ºC | 3ª Série Regular C - M | 297629 |
| BRANCA DO N MIRANDA | 2370 | 3ºD | 3ª Série Regular D - M | 297630 |
| BRASILIO ITIBERE | 2428 | 3ºA | 3ª Série Regular A - I | 303444 |
| DIRCE DE A MAIA | 2373 | 3ºA | 3ª Série Regular A - I | 303900 |
| EDITHE | 2374 | 3ª A / 3ª A  | 3ª Série Regular A - M | 297785 ⚠️ |
| EDITHE | 2374 | 3ª C | 3ª Série Regular C - M | 297787 ⚠️ |
| GASPAR DUTRA | 2376 | 2 A LGG | 2ª Série Regular A - T | 297898 ⚠️ |
| GASPAR DUTRA | 2376 | 2 B ADM | 2ª Série Técnico ADM B - T | 304050 |
| GASPAR DUTRA | 2376 | 2 C AGRO | 2ª Série Técnico AGRO C - T | 304051 |
| GENESIO MORESCHI | 2377 | 3ºD | 3ª Série Regular D - N | 297938 |
| IEDA BAGGIO MAYER | 2378 | 3ª B | 3ª Série Regular B - M | 297969 |
| JARDIM EUROPA | 2379 | 2ºA | 2ª Série Regular A - M | 298000 |
| JARDIM EUROPA | 2379 | 3ºA | 3ª Série Regular A - M | 298001 |
| JARDIM PANORAMA | 2381 | 2A / 2B / 3A / 3B / 3C | Regular A-C M | 298103–298108 |
| JD UNIVERSITARIO | 2429 | 3ºA / 3ºC | Regular A / C - M | 303473 / 303971 |
| JOAO DE F PIOLI | 2382 | 2ª B / 3ª B / 3ª C | Regular B-C - M | 298145 / 298141 / 298142 |
| JOAO PAULO I | 2383 | 3ª A | 3ª Série Regular A - I | 298186 |
| MARIA MONTESSORI | 2385 | 2A / 2B / 3A | Regular A-B M / 3A M | 298248 / 298249 / 298246 |
| OLAVO BILAC | 2388 | 2A / 2B | 2ª Série Regular A-B - I | 298353 / 303967 |
| PROTASIO DE CARVALHO | 2392 | 3B / 3C | 3ª Série Regular B-C - M | 298519 / 298520 |
| RODRIGUES ALVES | 2431 | 3ºA | 3ª Série Regular A - I | 303513 |
| TANCREDO NEVES | 2398 | 2ª Série Regular A - M | 2ª Série Regular A - M | 298770 |
| TANCREDO NEVES | 2398 | 2ª Série Regular C - M | 2ª Série Regular C - M | 298772 |
| TEOTONIO VILELA | 2396 | 2ºA / 2ºD / 3ºB / 3ºC | Regular - M | 298678 / 303910 / 298675 / 298676 |
| UNIDADE POLO | 2397 | 2ª Série Regular | 2ª Série Regular A - I | 303946 ⚠️ |
| UNIDADE POLO | 2397 | 2ª Série Técnico | 2ª Série Técnico A - I | 298741 ⚠️ |
| UNIDADE POLO | 2397 | 3ª Série Regular | 3ª Série Regular A - I | 298721 ⚠️ |
| ZUMBI DOS PALMARES | 2399 | 2ª Série Regular A - M | 2ª Série Regular A - M | 298812 |
| ZUMBI DOS PALMARES | 2399 | 3ª Série Regular A - M | 3ª Série Regular A - M | 298810 |
| ZUMBI DOS PALMARES | 2399 | 3ª Série Regular B - M | 3ª Série Regular B - M | 298811 |

---

## ⚠️ Itens que precisam de verificação antes de executar

| # | Escola | Turma na planilha | Mapeado para | Motivo da dúvida |
|---|--------|------------------|--------------|-----------------|
| 1 | ANCHIETA | 2ª Tec. Integral | 2ª Série Técnico A - I (297561) | "Integral" interpretado como período - I; confirmar se é essa turma |
| 2 | EDITHE | 3ª A / 3ª A  | 3ª Série Regular A - **M** (297785) | EDITHE tem turma - M e - I para a 3ª série; confirmar período |
| 3 | EDITHE | 3ª C | 3ª Série Regular C - **M** (297787) | Mesma dúvida acima |
| 4 | GASPAR DUTRA | 2 A LGG | 2ª Série Regular A - T (297898) | "LGG" não existe no banco; pode ser turma técnica específica |
| 5 | UNIDADE POLO | 2ª Série Regular | 2ª Série Regular **A** - I (303946) | UNIDADE POLO tem Regular A e Regular L; confirmar turma correta |
| 6 | UNIDADE POLO | 2ª Série Técnico | 2ª Série Técnico **A** - I (298741) | Tem turmas A, D, F, J; confirmar qual |
| 7 | UNIDADE POLO | 3ª Série Regular | 3ª Série Regular **A** - I (298721) | Tem turmas A, L, M; confirmar qual |

---

## Script gerado

**Arquivo:** `_scripts/ra_alunos_impulso_enem2.sql`  
**Script gerador:** `_scripts/gerar_ra_impulso_enem2.py`

O script gerador pode ser reexecutado se novos alunos forem adicionados — basta atualizar `RA_START` para o próximo valor disponível e adicionar os mapeamentos necessários.

### Como executar

```powershell
cd c:\projects\pde_salta
python _scripts/gerar_ra_impulso_enem2.py
```

O `.sql` gerado deve ser executado **coluna a coluna** (INSERT tipo por INSERT tipo) conforme instrução do Rodrigo, ou todo de uma vez — as queries são idempotentes.

### Atenção antes de executar em produção

1. Confirmar os 7 itens marcados com ⚠️ acima
2. Este script aponta para o banco **Homologação** (`ElevaPortalHomolog`). Confirmar conexão ao banco correto antes de rodar
3. Substituir apóstrofos em nomes de alunos que contenham `'` — o script já faz `escape_sql()` automaticamente
