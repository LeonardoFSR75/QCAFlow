# QCAFlow

**Web-Based fsQCA Analysis Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-5.0-blue.svg)](https://github.com/[username]/qcaflow)
[![JOSS](https://joss.theoj.org/papers/XXXXX/status.svg)](https://doi.org/10.XXXXX/joss.XXXXX)
[![DOI](https://zenodo.org/badge/DOI/10.XXXXX.svg)](https://doi.org/10.XXXXX/zenodo.XXXXXXX)

## Sobre / About

**PT-BR:** QCAFlow é uma ferramenta web de análise qualitativa comparativa por conjuntos fuzzy (fsQCA). Autocontida em um único arquivo HTML5, sem instalação nem servidor — basta abrir no navegador.

**EN:** QCAFlow is a browser-based platform for fuzzy-set Qualitative Comparative Analysis (fsQCA). A single self-contained HTML5 file — no installation, no server, no internet required.

## Funcionalidades / Features

| Módulo | Descrição |
|--------|-----------|
| 📊 Dados | Importação CSV, Excel (.xlsx), JSON, XML; edição inline |
| 🎯 Calibração | Método direto (Ragin, 2008): 3 âncoras, transição logística ou **linear por partes** (Nikou et al., 2024), sugestão por percentis, tratamento de 0,5 |
| 🔢 Tabela Verdade | 2ᴺ combinações (3–8 condições) · consistência bruta e PRI · **detecção automática de contradições fuzzy** (Rubinson, 2013) com limiar de proporção · **override manual de resultado** · listagem de casos |
| 📈 Análise | **Necessidade bidirecional (Y e ~Y) lado a lado** com consistência, cobertura e **RoN** ( Schneider & Wagemann, 2012) · suficiência |
| 🧮 Solução | Quine-McCluskey (exclui contradições) · soluções **complexa, parcimoniosa e intermediária** (expectativas direcionais) · core × periféricas (Fiss, 2011) · **quadro ●/⊗** · testes de robustez · equifinalidade |
| 📝 Interpretação | Narrativa acadêmica no padrão de relato de periódico (calibração → necessidade → tabela verdade → soluções → assimetria) |
| 📉 Dashboard | KPIs visuais da análise |
| 📚 Histórico | localStorage — análises persistidas no navegador |
| 👤 Contato | Informações do desenvolvedor e citação |

## Uso / Usage

Abra `QCAFlow.html` em qualquer navegador moderno (Chrome, Firefox, Edge, Safari).  
Não requer instalação, servidor **nem conexão à internet** — 100% offline, inclusive a importação de Excel.

## Importação / Import Formats

| Formato | Extensão | Observação |
|---------|----------|------------|
| CSV | `.csv` | Separador: vírgula, ponto-e-vírgula ou tab |
| Excel | `.xlsx` | SheetJS embutido — funciona offline |
| JSON | `.json` | Array de `{caso, conds[], res}` |
| XML | `.xml` | Elemento `<casos>` com filhos `<caso>` |

## Exportação / Export Formats

PDF · Word (.doc) · Markdown · Projeto (.qcaflow) · HTML autocontido — todos com **registro de auditoria** da análise (âncoras, limiares, expectativas e as três soluções)

## Dependências / Dependencies

- [SheetJS](https://sheetjs.com/) v0.18.5 (MIT) — **embutido no HTML**, sem CDN; usado apenas para importar Excel

## Como Citar / Citation

> Rossini, L. F. da S. (2026). *QCAFlow: Web-Based fsQCA Analysis Platform* (v5.0) [Software]. UNOESC. MIT License. https://doi.org/10.XXXXX/zenodo.XXXXXXX

Ver também `CITATION.cff` ou clique em **"Cite this repository"** no GitHub.

## Estrutura do Repositório

```
qcaflow/                          ← repositório GitHub / Zenodo
├── QCAFlow.html                  # Ferramenta principal (autocontida)
├── LICENSE                       # MIT License
├── CITATION.cff                  # Metadados de citação (máquina)
├── README.md                     # Este arquivo
├── publicacao/                   # Publicação acadêmica
│   ├── paper.md                  #   Artigo JOSS (inglês) — subdir declarado na submissão
│   ├── paper.bib                 #   Referências BibTeX
│   └── Publicacao_Academica.html #   Produto Técnico — Mestrado Profissional (português)
├── docs/
│   └── Documentacao_Tecnica.html # Documentação técnica completa
├── data/                         # Bases de dados de exemplo (6 cenários)
└── templates/                    # Modelos de importação (CSV, Excel, JSON, XML)
```

> **Nota:** O registro de software no INPI (`INPI_Registro.html`) é mantido fora deste repositório por conter dados pessoais (CPF) e informações privadas do processo administrativo.

## Roteiro JOSS / JOSS Submission Roadmap

1. Criar repositório GitHub público: `github.com/[username]/qcaflow`
2. Fazer upload de todos os arquivos
3. Criar release com tag `v5.0.0`
4. Conectar Zenodo → gera DOI automaticamente
5. Preencher DOIs em `CITATION.cff`, `README.md`, `publicacao/paper.md`, `QCAFlow.html`
6. Submeter em https://joss.theoj.org/papers/new — informar subdiretório `publicacao/` para `paper.md`

## Registro INPI

Programa de Computador nº **BR XXXXXXXXXXXXXXX** — INPI (Instituto Nacional da Propriedade Industrial), Lei 9.609/1998.  
Documento de registro mantido em repositório privado local (fora do GitHub/Zenodo).

## Licença / License

MIT License © 2026 Leonardo Felipe da Silva Rossini — ver [`LICENSE`](LICENSE).
