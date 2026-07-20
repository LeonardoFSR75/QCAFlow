# Testes — QCAFlow

Conjunto mínimo de testes automatizados dos algoritmos centrais do fsQCA
implementados em `QCAFlow.html`: calibração, tabela verdade, PRI/RoN,
Quine-McCluskey e as três soluções da Análise-Padrão (complexa, parcimoniosa,
intermediária).

## Como rodar

Requer apenas Node.js (nenhuma dependência externa, mantendo a filosofia
"zero-dependência" da própria ferramenta):

```bash
node tests/core-algorithms.test.js
```

## Como funciona

O script extrai o conteúdo do `<script>` principal de `QCAFlow.html` (sem a
biblioteca SheetJS embutida) e o executa em um contexto `vm` do Node.js com um
`document` mínimo (o suficiente para as funções de cálculo, que leem alguns
limiares de inputs HTML). O IIFE de inicialização automática da interface é
removido — os testes controlam `dados`, `numConds`, `condLabels` etc.
diretamente e chamam as funções de cálculo (`computeTruthTable`,
`computeSolutions`, `necessityAnalysis`, `calibValue`, ...).

## Escopo

Cobre a correção matemática/lógica dos algoritmos, incluindo casos de
regressão para os bugs corrigidos na revisão de 2026-07-20 (cálculo da
solução intermediária, pertencimento fuzzy exatamente em 0,5, cobertura
mínima na minimização booleana). **Não cobre** renderização de interface
(HTML/DOM), importação/exportação de arquivos, nem persistência em
`localStorage` — esses fluxos dependem de um navegador real e devem ser
verificados manualmente (ver `QCAFlow.html` aberto em um navegador).
