---
title: 'QCAFlow: A browser-based tool for fuzzy-set qualitative comparative analysis'
tags:
  - qualitative comparative analysis
  - QCA
  - fuzzy sets
  - Boolean minimization
  - Quine-McCluskey
  - social sciences
  - research methods
  - JavaScript
authors:
  - name: Leonardo Felipe da Silva Rossini
    orcid: 0000-0001-6812-5086
    affiliation: 1
affiliations:
  - name: UNOESC — Universidade do Oeste de Santa Catarina, Brazil
    index: 1
date: 19 July 2026
bibliography: paper.bib
---

# Summary

`QCAFlow` is a browser-based, zero-installation web platform for
fuzzy-set Qualitative Comparative Analysis (fsQCA) [@ragin2008], building on fuzzy set theory [@zadeh1965]. Delivered as a
single self-contained HTML5 file, it requires no server, no programming knowledge,
and no internet connection. The tool implements the complete fsQCA analytical
protocol: direct-method calibration of raw data into fuzzy-set membership scores
[@ragin2008], truth table generation across all $2^N$ Boolean configurations with
raw and PRI consistency, a configurable frequency threshold, sufficiency and
necessity metrics---the latter including the Relevance of Necessity (RoN)
[@schneider2012]---Boolean minimization via the Quine-McCluskey algorithm
[@mccluskey1956; @quine1952], and the three solutions of the Standard Analysis
(complex, parsimonious, and intermediate via directional expectations) with
core/peripheral condition distinction [@fiss2011]. It also derives the solution
for the negation of the outcome ($\sim Y$) to expose causal asymmetry [@schneider2012;
@woodside2013], runs robustness checks over consistency thresholds and calibration
anchors, and produces a Fiss-style configuration chart, typical/deviant case
identification, and XY scatter plot visualization. A dedicated Interpretation tab
generates a structured, publication-oriented academic narrative automatically, and
every export embeds an audit trail of the analytical decisions. The tool supports 3
to 8 conditions and accepts data from CSV, Excel (.xlsx), JSON, and XML sources.
It is written in Portuguese and targets researchers in business administration
and the social sciences in Brazil and other Portuguese-speaking countries.

# Statement of Need

Qualitative Comparative Analysis [@ragin1987; @ragin2000; @ragin2008; @rihoux2009], which models causal relationships in terms of necessary and sufficient conditions [@mackie1965], has grown substantially in the social sciences, evaluation, and business administration [@greckhamer2018; @fiss2011; @woodside2013]. Methodological guidelines [@schneider2010; @pappas2021] have standardized the analytical steps, emphasizing the need for robust calibration, necessity analysis, and reporting standards. Although QCA was historically considered a small-to-medium sample size method, it is now widely understood that case numbers are independent of the choice of method [@thiem2014], expanding QCA's utility to large-N datasets. Yet researchers face a persistent barrier: accessible, free, and ready-to-use software. The reference standalone implementation, *fs/QCA* (currently version 4.1) [@ragin2006; @ragindavey2023], supports Windows and macOS, but it suffers from installation friction (requiring external runtime libraries on some systems) and has not received interface or workflow usability updates in years. The `QCA` package for R [@dusa2019] and the `SetMethods` package [@oana2018setmethods] require programming proficiency. *Tosmana* [@cronqvist2019tosmana] offers a GUI but is limited to crisp-set and multi-value designs with few conditions. None of these tools provide a Portuguese-language interface, integrated instructional content, or export of results in publication-ready formats.

This gap is especially acute in Brazilian graduate programs. The *mestrado
profissional* (professional master's) format encourages methodologically rigorous
technical products alongside traditional dissertations, yet students applying fsQCA
often must navigate English-only, installation-dependent software. `QCAFlow`
addresses this need by delivering the full fsQCA workflow in a single file that can
be opened on any device with a modern browser—no installation, no account, no
internet connection required.

The tool differs from existing implementations in three key respects: (1) it runs
entirely client-side as a self-contained HTML5 application; (2) it provides a
complete Portuguese-language interface with integrated methodological guidance; and
(3) it includes features specifically designed for the research publication workflow,
such as automatic academic narrative generation, an embedded audit trail of
analytical decisions, and multi-format export (PDF, Word, Markdown).

# Implementation

## Architecture

`QCAFlow` is implemented as a single HTML5 file combining CSS3
presentation, a JavaScript ES6+ computational core, and inline SVG for the XY
scatter plot. The SheetJS library [@sheetjs], used for Excel (.xlsx) import, is
embedded directly in the file rather than loaded from a CDN, so all
functionality—including calibration, Boolean minimization, and localStorage
persistence—operates with no network access whatsoever.

## Core Algorithms

**Calibration.** Raw data are transformed into fuzzy-set membership scores in $[0, 1]$ by the direct method [@ragin2008], using three qualitative anchors per variable (full membership $\approx 0.95$, crossover $0.50$, full non-membership $\approx 0.05$) and either a log-odds or a piecewise-linear transition function [@nikou2024]. Anchors can be suggested automatically from the 95th, 50th, and 5th percentiles and then adjusted on substantive grounds. Scores that fall exactly at the $0.50$ crossover are nudged to $0.501$ (and logged) to avoid dropping cases at the point of maximum ambiguity.

**Truth table generation.** For $N$ conditions ($3$--$8$), the tool enumerates all $2^N$ configurations. Cases are assigned to the configuration in which their set-theoretic membership---the minimum over conditions of $x$ (presence) or $1-x$ (absence)---exceeds $0.5$. For each row it computes sufficiency consistency [$\sum \min(M_i, Y_i) / \sum M_i$], PRI consistency, and raw coverage [@ragin2008; @schneider2012]. These fuzzy formulas reduce exactly to the classical crisp counts when data are dichotomous. A configurable frequency threshold routes low-frequency rows to the logical remainders, and the proportion of retained cases is reported. Each row is also screened for fuzzy contradictions [@rubinson2013]: the proportion of cases whose individual consistency falls below the adopted threshold is compared against a configurable proportion cutoff, flagging rows with a substantively mixed membership pattern rather than coding them by raw consistency alone.

**Necessity analysis.** For each condition $C_i$ and its negation $\sim C_i$, necessity consistency [$\sum \min(X_i, Y_i) / \sum Y_i$], necessity coverage, and the Relevance of Necessity (RoN) [@schneider2012] are computed. Conditions meeting the conventional consistency threshold ($\ge 0.90$) are flagged as necessary, and a low RoN warns of potentially trivial necessity.

**Boolean minimization and the Standard Analysis.** The Quine-McCluskey algorithm [@mccluskey1956; @quine1952] is implemented in pure JavaScript, generalized to $N$ conditions, and paired with essential-prime-implicant extraction followed by an exhaustive minimum-cardinality cover search (a Petrick-style search over the remaining non-essential implicants, falling back to a greedy heuristic only when the number of pending implicants is large) so that only observed sufficient rows must be covered by a solution of minimal size. Three solutions are derived [@ragin2008]: the *complex* solution (no logical remainders), the *parsimonious* solution (all simplifying remainders), and the *intermediate* solution, which incorporates only the easy counterfactuals permitted by user-supplied directional expectations. Conditions appearing in both the parsimonious and intermediate solutions are marked as *core* and the remainder as *peripheral*, following [@fiss2011].

However, the choice of solution type for causal inference is subject to intense debate: while classic QCA applications favor the intermediate solution because it incorporates theoretical expectations, inverse-search evaluations demonstrate that conservative (complex) and intermediate solutions are causal-inferentially incorrect, introducing false positives, and that only the *parsimonious* solution type is correct under causal discovery benchmarks [@baumgartner2017]. By presenting all three solutions side-by-side in `QCAFlow`, researchers can explicitly compare them, facilitating transparent model selection. Furthermore, alternative configurational causal modeling techniques, such as Coincidence Analysis (CNA) [@baumgartner2021], suggest avoiding truth table counterfactual reasoning altogether, highlighting the importance of displaying unminimized configurations and raw metrics.

**Causal asymmetry and robustness.** Because set-theoretic explanations are asymmetric [@woodside2013; @schneider2012], the tool separately derives a conservative solution for the negation of the outcome ($\sim Y$) and flags any row coded as sufficient for both $Y$ and $\sim Y$. Robustness checks re-run the analysis across consistency thresholds ($0.70$--$0.90$) and, when calibration has been applied, under $\pm 5\%$ shifts of the crossover anchor, reporting whether the intermediate solution remains stable.

## Testing

A dependency-free Node.js test suite (`tests/core-algorithms.test.js`) exercises the
core computational functions directly---truth table construction, PRI, bidirectional
necessity with RoN, Quine-McCluskey minimization with minimum-cardinality cover
selection, and the intermediate-solution logic---against cases with known expected
outputs, including regression cases for edge conditions such as fuzzy membership
scores that fall exactly on the $0.5$ crossover.

## Data Model and Persistence

The application state is maintained in JavaScript variables (`dados[]`,
`truthTable[]`, `condLabels[]`, `limiar`, `limiarPRI`, `limiarFreq`, `dirExpect[]`,
`calibInfo`) and persisted to the browser's `localStorage` under the key
`qcaflow_historico`. Sessions store the full data, configuration, calibration
anchors, directional expectations, and a result summary. Up to 100 sessions can be
stored per browser origin. Projects can be exported and re-imported as `.qcaflow`
files (structured JSON, including an audit record) or as self-contained HTML files
with data embedded in the initialization block.

## Interface

The interface is organized into ten tabs following the logical research workflow:
*Instruções* (instructions), *Dados* (data), *Calibração* (calibration), *Tabela
Verdade* (truth table), *Análise* (analysis), *Solução* (solution),
*Interpretação* (interpretation), *Dashboard*, *Histórico* (history), and
*Contato* (contact/citation). A variable naming panel sits above the data table,
allowing researchers to assign meaningful labels to conditions and outcomes before
analysis.

# Quality of Life Features

The *Interpretação* tab generates a structured academic narrative in Portuguese that
follows the reporting sequence expected by journals---method and calibration,
necessity (with RoN), truth table and thresholds, the three solutions with
per-configuration consistency and raw/unique coverage, and a closing discussion of
equifinality, causal asymmetry, and robustness. The *Solução* tab renders a
Fiss-style configuration chart ($\bullet$ present, $\otimes$ absent; large = core, small =
peripheral) that is exportable to Word. The *Histórico* tab allows export of the
complete analysis as PDF (via the browser's print dialog with a dedicated print
stylesheet), Word (.doc), or Markdown---each including an audit trail of the
analytical decisions (anchors, thresholds, expectations, and all three solutions)---
facilitating integration with common academic writing workflows. Template files in
CSV, Excel, JSON, and XML are provided to guide data preparation.

# Acknowledgements

The author thanks the Programa de Mestrado em Administração of UNOESC
and the thesis advisor [name] for institutional support during the development of
this tool.

# AI Usage Disclosure

Generative AI (Google Gemini via the Antigravity pair-programming agent, and Anthropic Claude via Sonnet 3.5 / Sonnet 4.6) was used during the development of this project. AI assistance was utilized for:
- Writing test scaffolding and core logic refactoring in the JavaScript codebase (Google Gemini).
- Conducting failure reviews, code corrections, and aligning the technical documentation and academic paper with the JOSS guidelines (Anthropic Claude Sonnet 3.5 / Sonnet 4.6).
The human author reviewed, edited, and validated all AI-assisted outputs and made all core architectural and design decisions.

# References
