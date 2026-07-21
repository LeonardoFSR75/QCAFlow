# QCAFlow

**Web-Based fsQCA Analysis Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-5.1-blue.svg)](https://github.com/LeonardoFSR75/QCAFlow)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21465384.svg)](https://doi.org/10.5281/zenodo.21465384)

## Sobre / About

**PT-BR:** QCAFlow é uma ferramenta web de análise qualitativa comparativa por conjuntos fuzzy (fsQCA). Autocontida em um único arquivo HTML5, sem instalação nem servidor — basta abrir no navegador.

**EN:** QCAFlow is a browser-based platform for fuzzy-set Qualitative Comparative Analysis (fsQCA). A single self-contained HTML5 file — no installation, no server, no internet required.

## Funcionalidades / Features

| Módulo | Descrição |
|--------|-----------|
| 📋 Instruções | Guia de uso passo a passo, integrado à interface |
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

## Testes / Tests

```bash
node tests/core-algorithms.test.js
```

Testes automatizados dos algoritmos centrais (calibração, tabela verdade, PRI/RoN, Quine-McCluskey e as três soluções), sem dependências externas. Ver [`tests/README.md`](tests/README.md).

## Como Citar / Citation

> Rossini, L. F. da S. (2026). *QCAFlow: Web-Based fsQCA Analysis Platform* (v5.1) [Software]. UNOESC. MIT License. https://doi.org/10.5281/zenodo.21465384

Ver também `CITATION.cff` ou clique em **"Cite this repository"** no GitHub.

## Estrutura do Repositório

```
qcaflow/                          ← repositório GitHub / Zenodo
├── QCAFlow.html                  # Ferramenta principal (autocontida)
├── LICENSE                       # MIT License
├── CITATION.cff                  # Metadados de citação (máquina)
├── README.md                     # Este arquivo
├── CODE_OF_CONDUCT.md            # Código de Conduta
├── SECURITY.md                   # Política de Segurança
├── ROADMAP.md                    # Roadmap do Projeto
├── paper.md                      # Descrição técnica do software (inglês)
├── paper.bib                     # Referências BibTeX
├── docs/
│   ├── Documentacao_Tecnica.html # Documentação técnica completa em português
│   └── Artigos/                  # PDFs de referência bibliográfica
├── tests/                        # Testes automatizados dos algoritmos centrais
│   ├── core-algorithms.test.js
│   └── README.md
├── data/                         # Bases de dados de exemplo (6 cenários)
└── templates/                    # Modelos de importação (CSV, Excel, JSON, XML)
```

## Licença / License

MIT License © 2026 Leonardo Felipe da Silva Rossini — ver [`LICENSE`](LICENSE).
