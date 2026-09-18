Parte Diversificada exibe 2 disciplinas a mais:
Ecossistema de Aprendizagem Inovador (EAI)
Redacao

Ambas com '-' onde seria a nota.

Exibe tbm Laboratorio Inteligencia de Vida (LIV) corretamente.

Deveria exibir apenas LIV nesse cenario.


No Confgurador de Avaliacoes em : ped/#Configuradores/Avaliacoes que fica no repositorio portal-atlas
com o filtro:
Rede:CEI
AnoLetivo:2025,
Agrupamento: 6 ano do EFAF
Escopo: Boletim Diversificado

Aparece apenas a disciplina LIV corretamente, o que indica que apenas LIV deveria aparecer na parte diversificada do documento do aluno.

Nome Aluno: Alexandre Caldas Maia de Oliveira
Segmento : Ensino Funcamental
Serie:6 ano
RG: 003934572
Matricula: 19293080



Analise o que foi implmentado no backend
Entender como isso era tratado no repositorio de notas (de onde foi usado para implementar a migracao do backend)

crie um documento de analise apontando os pontos que indiquem o comportamento errado
indique qual deve ser a correcao de codigo e justifique ponto a ponto a motivacao da correcao.

valide a propria correcao indicada e os motivos para entender se tem coerencia


{
  "data": {
    "escopoRegular": {
      "etapas": [
        {
          "colunas": [
            {
              "notaMaxima": 10.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "347b56bc-77c8-4c35-a44e-cfd4abbd9b67",
              "descricao": "P1"
            },
            {
              "notaMaxima": 5.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "79b48c95-bcc9-4612-b25c-8f5daeebee28",
              "descricao": "PM1"
            },
            {
              "notaMaxima": 5.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "ee4e3112-4283-4ba4-8c5d-cbcca1f80e5e",
              "descricao": "AQ1"
            },
            {
              "notaMaxima": 10.0,
              "ehResultado": true,
              "ehSituacao": false,
              "hash": "5110be6e-10f3-40e7-8979-f8ed3c376afd",
              "descricao": "Média"
            }
          ],
          "hash": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
          "descricao": "1º Bimestre"
        },
        {
          "colunas": [
            {
              "notaMaxima": 10.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "9e7255bd-8818-4c22-ab0e-b8f5306c5c0f",
              "descricao": "P2"
            },
            {
              "notaMaxima": 5.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "0a83aafc-f025-42d5-82a3-6b268424d63b",
              "descricao": "PM2"
            },
            {
              "notaMaxima": 5.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "094580ad-bda2-4df9-adde-eb900274d667",
              "descricao": "AQ2"
            },
            {
              "notaMaxima": 10.0,
              "ehResultado": true,
              "ehSituacao": false,
              "hash": "402e4a0b-705c-4406-9315-4ceb1856a25b",
              "descricao": "Média"
            },
            {
              "notaMaxima": 10.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "49435685-8cbb-4fe0-a398-25edf1c507a7",
              "descricao": "PS1"
            },
            {
              "notaMaxima": 0.5,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "4d8609e7-131f-4836-99c7-e19db28dc2e7",
              "descricao": "Bônus 1"
            }
          ],
          "hash": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
          "descricao": "2º Bimestre"
        },
        {
          "colunas": [
            {
              "notaMaxima": 10.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "738dcf25-7bbd-4bf3-bdba-ef96dcd12313",
              "descricao": "P3"
            },
            {
              "notaMaxima": 5.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "d723eb9b-3449-48f5-8b8c-7087a4107688",
              "descricao": "PM3"
            },
            {
              "notaMaxima": 5.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "5c596f56-7b69-470b-9ddc-93cdf96d1990",
              "descricao": "AQ3"
            },
            {
              "notaMaxima": 10.0,
              "ehResultado": true,
              "ehSituacao": false,
              "hash": "94497a9c-46a3-4aff-868f-a441ca52d5a9",
              "descricao": "Média"
            }
          ],
          "hash": "5ff3a421-1684-4ea6-a15e-de3452188480",
          "descricao": "3º Bimestre"
        },
        {
          "colunas": [
            {
              "notaMaxima": 10.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "d4bea96a-657f-4383-8f65-604454c506cc",
              "descricao": "P4"
            },
            {
              "notaMaxima": 5.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "97644260-f3e2-4df9-be88-8a65c8f6932a",
              "descricao": "PM4"
            },
            {
              "notaMaxima": 5.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "e432079e-7586-4e40-9563-5841540abc46",
              "descricao": "AQ4"
            },
            {
              "notaMaxima": 10.0,
              "ehResultado": true,
              "ehSituacao": false,
              "hash": "252da431-aef7-4432-b9d7-81dad700b831",
              "descricao": "Média"
            },
            {
              "notaMaxima": 10.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "7add5da9-5311-4802-ad3a-fba018dc2039",
              "descricao": "PS2"
            },
            {
              "notaMaxima": 0.5,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "1e455f16-c9be-40c9-a161-2fbbc0cde6cc",
              "descricao": "Bônus 2"
            }
          ],
          "hash": "fcfd5909-ba92-4099-8118-cb975562a462",
          "descricao": "4º Bimestre"
        },
        {
          "colunas": [
            {
              "notaMaxima": 10.0,
              "ehResultado": true,
              "ehSituacao": false,
              "hash": "f74b9c32-2553-401b-add0-ef804cc9af81",
              "descricao": "Média"
            },
            {
              "notaMaxima": 10.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "b398d4f1-4f07-439b-b16e-4b45e1bfea91",
              "descricao": "PF"
            },
            {
              "notaMaxima": 10.0,
              "ehResultado": true,
              "ehSituacao": false,
              "hash": "ff7ca795-94bf-430a-b210-b74af8d4cfec",
              "descricao": "Média"
            },
            {
              "notaMaxima": null,
              "ehResultado": false,
              "ehSituacao": true,
              "hash": "dd4907ad-2255-4f96-9c4a-f589c0a168ef",
              "descricao": "Situação"
            }
          ],
          "hash": "c8921147-41bd-4ec6-b8c3-49626ca36691",
          "descricao": "Resultados"
        }
      ],
      "disciplinas": [
        {
          "hashDisciplina": "134fea29-4a71-40bd-ad40-00df9040f07b",
          "hashEtapa": "00000000-0000-0000-0000-000000000000",
          "nomeDisciplina": "Arte",
          "notas": [
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "347b56bc-77c8-4c35-a44e-cfd4abbd9b67",
              "descricao": "7,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "79b48c95-bcc9-4612-b25c-8f5daeebee28",
              "descricao": "3,2"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "ee4e3112-4283-4ba4-8c5d-cbcca1f80e5e",
              "descricao": "3,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "5110be6e-10f3-40e7-8979-f8ed3c376afd",
              "descricao": "6,9"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "9e7255bd-8818-4c22-ab0e-b8f5306c5c0f",
              "descricao": "9,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "0a83aafc-f025-42d5-82a3-6b268424d63b",
              "descricao": "4,1"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "094580ad-bda2-4df9-adde-eb900274d667",
              "descricao": "3,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "402e4a0b-705c-4406-9315-4ceb1856a25b",
              "descricao": "8,1"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "49435685-8cbb-4fe0-a398-25edf1c507a7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "4d8609e7-131f-4836-99c7-e19db28dc2e7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "738dcf25-7bbd-4bf3-bdba-ef96dcd12313",
              "descricao": "10,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "d723eb9b-3449-48f5-8b8c-7087a4107688",
              "descricao": "5,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "5c596f56-7b69-470b-9ddc-93cdf96d1990",
              "descricao": "4,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "94497a9c-46a3-4aff-868f-a441ca52d5a9",
              "descricao": "9,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "d4bea96a-657f-4383-8f65-604454c506cc",
              "descricao": "7,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "97644260-f3e2-4df9-be88-8a65c8f6932a",
              "descricao": "3,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "e432079e-7586-4e40-9563-5841540abc46",
              "descricao": "4,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "252da431-aef7-4432-b9d7-81dad700b831",
              "descricao": "7,3"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "7add5da9-5311-4802-ad3a-fba018dc2039",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "1e455f16-c9be-40c9-a161-2fbbc0cde6cc",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "f74b9c32-2553-401b-add0-ef804cc9af81",
              "descricao": "8,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "b398d4f1-4f07-439b-b16e-4b45e1bfea91",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "ff7ca795-94bf-430a-b210-b74af8d4cfec",
              "descricao": "8,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "dd4907ad-2255-4f96-9c4a-f589c0a168ef",
              "descricao": "Aprovado"
            }
          ]
        },
        {
          "hashDisciplina": "aadba8aa-7957-48a6-af33-8a7a802fdf10",
          "hashEtapa": "00000000-0000-0000-0000-000000000000",
          "nomeDisciplina": "Ciências",
          "notas": [
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "347b56bc-77c8-4c35-a44e-cfd4abbd9b67",
              "descricao": "8,8"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "79b48c95-bcc9-4612-b25c-8f5daeebee28",
              "descricao": "3,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "ee4e3112-4283-4ba4-8c5d-cbcca1f80e5e",
              "descricao": "4,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "5110be6e-10f3-40e7-8979-f8ed3c376afd",
              "descricao": "7,9"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "9e7255bd-8818-4c22-ab0e-b8f5306c5c0f",
              "descricao": "10,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "0a83aafc-f025-42d5-82a3-6b268424d63b",
              "descricao": "5,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "094580ad-bda2-4df9-adde-eb900274d667",
              "descricao": "2,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "402e4a0b-705c-4406-9315-4ceb1856a25b",
              "descricao": "8,8"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "49435685-8cbb-4fe0-a398-25edf1c507a7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "4d8609e7-131f-4836-99c7-e19db28dc2e7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "738dcf25-7bbd-4bf3-bdba-ef96dcd12313",
              "descricao": "9,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "d723eb9b-3449-48f5-8b8c-7087a4107688",
              "descricao": "4,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "5c596f56-7b69-470b-9ddc-93cdf96d1990",
              "descricao": "1,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "94497a9c-46a3-4aff-868f-a441ca52d5a9",
              "descricao": "7,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "d4bea96a-657f-4383-8f65-604454c506cc",
              "descricao": "9,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "97644260-f3e2-4df9-be88-8a65c8f6932a",
              "descricao": "5,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "e432079e-7586-4e40-9563-5841540abc46",
              "descricao": "4,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "252da431-aef7-4432-b9d7-81dad700b831",
              "descricao": "9,3"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "7add5da9-5311-4802-ad3a-fba018dc2039",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "1e455f16-c9be-40c9-a161-2fbbc0cde6cc",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "f74b9c32-2553-401b-add0-ef804cc9af81",
              "descricao": "8,4"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "b398d4f1-4f07-439b-b16e-4b45e1bfea91",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "ff7ca795-94bf-430a-b210-b74af8d4cfec",
              "descricao": "8,4"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "dd4907ad-2255-4f96-9c4a-f589c0a168ef",
              "descricao": "Aprovado"
            }
          ]
        },
        {
          "hashDisciplina": "985ba6ff-4c11-4213-a414-f6cda4c799e4",
          "hashEtapa": "00000000-0000-0000-0000-000000000000",
          "nomeDisciplina": "Educação Física",
          "notas": [
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "347b56bc-77c8-4c35-a44e-cfd4abbd9b67",
              "descricao": "9,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "79b48c95-bcc9-4612-b25c-8f5daeebee28",
              "descricao": "3,2"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "ee4e3112-4283-4ba4-8c5d-cbcca1f80e5e",
              "descricao": "3,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "5110be6e-10f3-40e7-8979-f8ed3c376afd",
              "descricao": "7,6"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "9e7255bd-8818-4c22-ab0e-b8f5306c5c0f",
              "descricao": "10,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "0a83aafc-f025-42d5-82a3-6b268424d63b",
              "descricao": "4,1"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "094580ad-bda2-4df9-adde-eb900274d667",
              "descricao": "2,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "402e4a0b-705c-4406-9315-4ceb1856a25b",
              "descricao": "8,3"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "49435685-8cbb-4fe0-a398-25edf1c507a7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "4d8609e7-131f-4836-99c7-e19db28dc2e7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "738dcf25-7bbd-4bf3-bdba-ef96dcd12313",
              "descricao": "10,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "d723eb9b-3449-48f5-8b8c-7087a4107688",
              "descricao": "5,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "5c596f56-7b69-470b-9ddc-93cdf96d1990",
              "descricao": "4,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "94497a9c-46a3-4aff-868f-a441ca52d5a9",
              "descricao": "9,8"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "d4bea96a-657f-4383-8f65-604454c506cc",
              "descricao": "10,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "97644260-f3e2-4df9-be88-8a65c8f6932a",
              "descricao": "3,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "e432079e-7586-4e40-9563-5841540abc46",
              "descricao": "4,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "252da431-aef7-4432-b9d7-81dad700b831",
              "descricao": "8,8"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "7add5da9-5311-4802-ad3a-fba018dc2039",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "1e455f16-c9be-40c9-a161-2fbbc0cde6cc",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "f74b9c32-2553-401b-add0-ef804cc9af81",
              "descricao": "8,7"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "b398d4f1-4f07-439b-b16e-4b45e1bfea91",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "ff7ca795-94bf-430a-b210-b74af8d4cfec",
              "descricao": "8,7"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "dd4907ad-2255-4f96-9c4a-f589c0a168ef",
              "descricao": "Aprovado"
            }
          ]
        },
        {
          "hashDisciplina": "b87ba36b-c150-4b45-9c93-7d93578f1bce",
          "hashEtapa": "00000000-0000-0000-0000-000000000000",
          "nomeDisciplina": "Geografia",
          "notas": [
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "347b56bc-77c8-4c35-a44e-cfd4abbd9b67",
              "descricao": "9,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "79b48c95-bcc9-4612-b25c-8f5daeebee28",
              "descricao": "2,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "ee4e3112-4283-4ba4-8c5d-cbcca1f80e5e",
              "descricao": "4,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "5110be6e-10f3-40e7-8979-f8ed3c376afd",
              "descricao": "7,8"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "9e7255bd-8818-4c22-ab0e-b8f5306c5c0f",
              "descricao": "10,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "0a83aafc-f025-42d5-82a3-6b268424d63b",
              "descricao": "5,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "094580ad-bda2-4df9-adde-eb900274d667",
              "descricao": "3,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "402e4a0b-705c-4406-9315-4ceb1856a25b",
              "descricao": "9,3"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "49435685-8cbb-4fe0-a398-25edf1c507a7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "4d8609e7-131f-4836-99c7-e19db28dc2e7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "738dcf25-7bbd-4bf3-bdba-ef96dcd12313",
              "descricao": "8,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "d723eb9b-3449-48f5-8b8c-7087a4107688",
              "descricao": "2,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "5c596f56-7b69-470b-9ddc-93cdf96d1990",
              "descricao": "4,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "94497a9c-46a3-4aff-868f-a441ca52d5a9",
              "descricao": "7,3"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "d4bea96a-657f-4383-8f65-604454c506cc",
              "descricao": "7,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "97644260-f3e2-4df9-be88-8a65c8f6932a",
              "descricao": "3,4"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "e432079e-7586-4e40-9563-5841540abc46",
              "descricao": "4,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "252da431-aef7-4432-b9d7-81dad700b831",
              "descricao": "7,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "7add5da9-5311-4802-ad3a-fba018dc2039",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "1e455f16-c9be-40c9-a161-2fbbc0cde6cc",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "f74b9c32-2553-401b-add0-ef804cc9af81",
              "descricao": "8,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "b398d4f1-4f07-439b-b16e-4b45e1bfea91",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "ff7ca795-94bf-430a-b210-b74af8d4cfec",
              "descricao": "8,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "dd4907ad-2255-4f96-9c4a-f589c0a168ef",
              "descricao": "Aprovado"
            }
          ]
        },
        {
          "hashDisciplina": "4f4b1529-f736-45c4-bcac-4aaf34c214fc",
          "hashEtapa": "00000000-0000-0000-0000-000000000000",
          "nomeDisciplina": "História",
          "notas": [
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "347b56bc-77c8-4c35-a44e-cfd4abbd9b67",
              "descricao": "10,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "79b48c95-bcc9-4612-b25c-8f5daeebee28",
              "descricao": "2,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "ee4e3112-4283-4ba4-8c5d-cbcca1f80e5e",
              "descricao": "4,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "5110be6e-10f3-40e7-8979-f8ed3c376afd",
              "descricao": "8,3"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "9e7255bd-8818-4c22-ab0e-b8f5306c5c0f",
              "descricao": "9,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "0a83aafc-f025-42d5-82a3-6b268424d63b",
              "descricao": "5,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "094580ad-bda2-4df9-adde-eb900274d667",
              "descricao": "3,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "402e4a0b-705c-4406-9315-4ceb1856a25b",
              "descricao": "9,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "49435685-8cbb-4fe0-a398-25edf1c507a7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "4d8609e7-131f-4836-99c7-e19db28dc2e7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "738dcf25-7bbd-4bf3-bdba-ef96dcd12313",
              "descricao": "9,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "d723eb9b-3449-48f5-8b8c-7087a4107688",
              "descricao": "2,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "5c596f56-7b69-470b-9ddc-93cdf96d1990",
              "descricao": "4,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "94497a9c-46a3-4aff-868f-a441ca52d5a9",
              "descricao": "7,8"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "d4bea96a-657f-4383-8f65-604454c506cc",
              "descricao": "8,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "97644260-f3e2-4df9-be88-8a65c8f6932a",
              "descricao": "3,4"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "e432079e-7586-4e40-9563-5841540abc46",
              "descricao": "4,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "252da431-aef7-4432-b9d7-81dad700b831",
              "descricao": "8,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "7add5da9-5311-4802-ad3a-fba018dc2039",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "1e455f16-c9be-40c9-a161-2fbbc0cde6cc",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "f74b9c32-2553-401b-add0-ef804cc9af81",
              "descricao": "8,3"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "b398d4f1-4f07-439b-b16e-4b45e1bfea91",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "ff7ca795-94bf-430a-b210-b74af8d4cfec",
              "descricao": "8,3"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "dd4907ad-2255-4f96-9c4a-f589c0a168ef",
              "descricao": "Aprovado"
            }
          ]
        },
        {
          "hashDisciplina": "7592afb7-f252-4ae9-b44f-b7d55efa5633",
          "hashEtapa": "00000000-0000-0000-0000-000000000000",
          "nomeDisciplina": "Inglês",
          "notas": [
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "347b56bc-77c8-4c35-a44e-cfd4abbd9b67",
              "descricao": "8,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "79b48c95-bcc9-4612-b25c-8f5daeebee28",
              "descricao": "4,7"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "ee4e3112-4283-4ba4-8c5d-cbcca1f80e5e",
              "descricao": "5,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "5110be6e-10f3-40e7-8979-f8ed3c376afd",
              "descricao": "8,9"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "9e7255bd-8818-4c22-ab0e-b8f5306c5c0f",
              "descricao": "9,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "0a83aafc-f025-42d5-82a3-6b268424d63b",
              "descricao": "5,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "094580ad-bda2-4df9-adde-eb900274d667",
              "descricao": "3,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "402e4a0b-705c-4406-9315-4ceb1856a25b",
              "descricao": "8,8"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "49435685-8cbb-4fe0-a398-25edf1c507a7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "4d8609e7-131f-4836-99c7-e19db28dc2e7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "738dcf25-7bbd-4bf3-bdba-ef96dcd12313",
              "descricao": "5,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "d723eb9b-3449-48f5-8b8c-7087a4107688",
              "descricao": "5,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "5c596f56-7b69-470b-9ddc-93cdf96d1990",
              "descricao": "5,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "94497a9c-46a3-4aff-868f-a441ca52d5a9",
              "descricao": "7,8"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "d4bea96a-657f-4383-8f65-604454c506cc",
              "descricao": "9,4"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "97644260-f3e2-4df9-be88-8a65c8f6932a",
              "descricao": "3,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "e432079e-7586-4e40-9563-5841540abc46",
              "descricao": "4,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "252da431-aef7-4432-b9d7-81dad700b831",
              "descricao": "8,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "7add5da9-5311-4802-ad3a-fba018dc2039",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "1e455f16-c9be-40c9-a161-2fbbc0cde6cc",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "f74b9c32-2553-401b-add0-ef804cc9af81",
              "descricao": "8,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "b398d4f1-4f07-439b-b16e-4b45e1bfea91",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "ff7ca795-94bf-430a-b210-b74af8d4cfec",
              "descricao": "8,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "dd4907ad-2255-4f96-9c4a-f589c0a168ef",
              "descricao": "Aprovado"
            }
          ]
        },
        {
          "hashDisciplina": "26ecbda8-d9c9-476f-90fa-047fc50150bc",
          "hashEtapa": "00000000-0000-0000-0000-000000000000",
          "nomeDisciplina": "Língua Portuguesa",
          "notas": [
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "347b56bc-77c8-4c35-a44e-cfd4abbd9b67",
              "descricao": "9,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "79b48c95-bcc9-4612-b25c-8f5daeebee28",
              "descricao": "3,2"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "ee4e3112-4283-4ba4-8c5d-cbcca1f80e5e",
              "descricao": "4,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "5110be6e-10f3-40e7-8979-f8ed3c376afd",
              "descricao": "8,1"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "9e7255bd-8818-4c22-ab0e-b8f5306c5c0f",
              "descricao": "8,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "0a83aafc-f025-42d5-82a3-6b268424d63b",
              "descricao": "4,1"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "094580ad-bda2-4df9-adde-eb900274d667",
              "descricao": "3,8"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "402e4a0b-705c-4406-9315-4ceb1856a25b",
              "descricao": "8,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "49435685-8cbb-4fe0-a398-25edf1c507a7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "4d8609e7-131f-4836-99c7-e19db28dc2e7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "738dcf25-7bbd-4bf3-bdba-ef96dcd12313",
              "descricao": "10,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "d723eb9b-3449-48f5-8b8c-7087a4107688",
              "descricao": "5,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "5c596f56-7b69-470b-9ddc-93cdf96d1990",
              "descricao": "4,3"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "94497a9c-46a3-4aff-868f-a441ca52d5a9",
              "descricao": "9,7"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "d4bea96a-657f-4383-8f65-604454c506cc",
              "descricao": "10,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "97644260-f3e2-4df9-be88-8a65c8f6932a",
              "descricao": "3,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "e432079e-7586-4e40-9563-5841540abc46",
              "descricao": "4,6"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "252da431-aef7-4432-b9d7-81dad700b831",
              "descricao": "8,8"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "7add5da9-5311-4802-ad3a-fba018dc2039",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "1e455f16-c9be-40c9-a161-2fbbc0cde6cc",
              "descricao": "0,2"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "f74b9c32-2553-401b-add0-ef804cc9af81",
              "descricao": "8,9"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "b398d4f1-4f07-439b-b16e-4b45e1bfea91",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "ff7ca795-94bf-430a-b210-b74af8d4cfec",
              "descricao": "8,9"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "dd4907ad-2255-4f96-9c4a-f589c0a168ef",
              "descricao": "Aprovado"
            }
          ]
        },
        {
          "hashDisciplina": "69f3ff26-1ac2-4ba8-8b24-bf581359f5f4",
          "hashEtapa": "00000000-0000-0000-0000-000000000000",
          "nomeDisciplina": "Matemática",
          "notas": [
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "347b56bc-77c8-4c35-a44e-cfd4abbd9b67",
              "descricao": "10,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "79b48c95-bcc9-4612-b25c-8f5daeebee28",
              "descricao": "4,7"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "ee4e3112-4283-4ba4-8c5d-cbcca1f80e5e",
              "descricao": "4,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "a6e7e9ab-0a85-4edc-89a2-17b293eea540",
              "hash": "5110be6e-10f3-40e7-8979-f8ed3c376afd",
              "descricao": "9,4"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "9e7255bd-8818-4c22-ab0e-b8f5306c5c0f",
              "descricao": "10,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "0a83aafc-f025-42d5-82a3-6b268424d63b",
              "descricao": "5,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "094580ad-bda2-4df9-adde-eb900274d667",
              "descricao": "4,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "402e4a0b-705c-4406-9315-4ceb1856a25b",
              "descricao": "9,8"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "49435685-8cbb-4fe0-a398-25edf1c507a7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "265cbcf9-c74c-4e66-afbb-5192dc948a91",
              "hash": "4d8609e7-131f-4836-99c7-e19db28dc2e7",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "738dcf25-7bbd-4bf3-bdba-ef96dcd12313",
              "descricao": "10,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "d723eb9b-3449-48f5-8b8c-7087a4107688",
              "descricao": "4,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "5c596f56-7b69-470b-9ddc-93cdf96d1990",
              "descricao": "4,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "5ff3a421-1684-4ea6-a15e-de3452188480",
              "hash": "94497a9c-46a3-4aff-868f-a441ca52d5a9",
              "descricao": "9,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "d4bea96a-657f-4383-8f65-604454c506cc",
              "descricao": "10,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "97644260-f3e2-4df9-be88-8a65c8f6932a",
              "descricao": "5,0"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "e432079e-7586-4e40-9563-5841540abc46",
              "descricao": "4,5"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "252da431-aef7-4432-b9d7-81dad700b831",
              "descricao": "9,8"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "7add5da9-5311-4802-ad3a-fba018dc2039",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "fcfd5909-ba92-4099-8118-cb975562a462",
              "hash": "1e455f16-c9be-40c9-a161-2fbbc0cde6cc",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "f74b9c32-2553-401b-add0-ef804cc9af81",
              "descricao": "9,7"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "b398d4f1-4f07-439b-b16e-4b45e1bfea91",
              "descricao": ""
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "ff7ca795-94bf-430a-b210-b74af8d4cfec",
              "descricao": "9,7"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "c8921147-41bd-4ec6-b8c3-49626ca36691",
              "hash": "dd4907ad-2255-4f96-9c4a-f589c0a168ef",
              "descricao": "Aprovado"
            }
          ]
        }
      ]
    },
    "escopoDiversificado": {
      "etapas": [
        {
          "colunas": [
            {
              "notaMaxima": 0.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "8e57041d-1ae1-4d0f-8fbb-fbda8467cbbb",
              "descricao": "P1"
            }
          ],
          "hash": "9403f20c-7585-4916-80ae-f0823a5a18c6",
          "descricao": "1º Bimestre"
        },
        {
          "colunas": [
            {
              "notaMaxima": 0.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "e176ade8-268d-4bb7-8c8c-914319bbe531",
              "descricao": "P2"
            }
          ],
          "hash": "d4749e7e-dcc8-452d-81bb-eb7b572c717f",
          "descricao": "2º Bimestre"
        },
        {
          "colunas": [
            {
              "notaMaxima": 0.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "d03aab0e-a6f8-4c7e-9b71-e951b220c777",
              "descricao": "P3"
            }
          ],
          "hash": "0f47a48b-cc54-4598-bb46-66175ee64146",
          "descricao": "3º Bimestre"
        },
        {
          "colunas": [
            {
              "notaMaxima": 0.0,
              "ehResultado": false,
              "ehSituacao": false,
              "hash": "62afe1e1-9a92-448c-9536-14581e44eca0",
              "descricao": "P4"
            }
          ],
          "hash": "d6fcf1a2-ef84-4876-991d-0821642b016b",
          "descricao": "4º Bimestre"
        }
      ],
      "disciplinas": [
        {
          "hashDisciplina": "ad29fedd-b511-4382-b15a-6a49b46a0cfe",
          "hashEtapa": "00000000-0000-0000-0000-000000000000",
          "nomeDisciplina": "Laboratório Inteligência de Vida (LIV)",
          "notas": [
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "9403f20c-7585-4916-80ae-f0823a5a18c6",
              "hash": "8e57041d-1ae1-4d0f-8fbb-fbda8467cbbb",
              "descricao": "A"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "d4749e7e-dcc8-452d-81bb-eb7b572c717f",
              "hash": "e176ade8-268d-4bb7-8c8c-914319bbe531",
              "descricao": "A"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "0f47a48b-cc54-4598-bb46-66175ee64146",
              "hash": "d03aab0e-a6f8-4c7e-9b71-e951b220c777",
              "descricao": "A"
            },
            {
              "hashEstruturaAvaliacao": "00000000-0000-0000-0000-000000000000",
              "hashEtapa": "d6fcf1a2-ef84-4876-991d-0821642b016b",
              "hash": "62afe1e1-9a92-448c-9536-14581e44eca0",
              "descricao": "A"
            }
          ]
        }
      ]
    },
    "escopoItinerarioSemestral": {
      "etapas": null,
      "disciplinas": null
    },
    "escopoDependencia": {
      "etapas": null,
      "disciplinas": null
    },
    "legenda": [
      {
        "sigla": "P",
        "descricao": "Prova"
      },
      {
        "sigla": "PM",
        "descricao": "Prova Multidisciplinar"
      },
      {
        "sigla": "AQ",
        "descricao": "Avaliação Qualitativa"
      },
      {
        "sigla": "PS",
        "descricao": "Prova Substitutiva"
      },
      {
        "sigla": "Bônus ",
        "descricao": "Bônus Semestral"
      },
      {
        "sigla": "PF",
        "descricao": "Prova Final"
      }
    ]
  },
  "codeId": 200,
  "message": null,
  "totalSuccess": 0,
  "isSuccess": true,
  "errors": []
}
