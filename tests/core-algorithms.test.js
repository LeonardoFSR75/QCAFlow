// ============================================================
//  QCAFlow — testes automatizados dos algoritmos centrais
// ============================================================
// Escopo: valida diretamente as funções de cálculo fsQCA extraídas do
// arquivo único QCAFlow.html (calibração, tabela verdade, PRI/RoN,
// Quine-McCluskey e as três soluções da Análise-Padrão), sem depender
// de frameworks externos — mantendo a filosofia "zero-dependência" da
// própria ferramenta. Não cobre renderização de interface (DOM/HTML),
// apenas a correção matemática/lógica dos algoritmos.
//
// Execução:  node tests/core-algorithms.test.js
// Pré-requisito: nenhum (usa apenas módulos nativos do Node.js).
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const APP_PATH = path.join(__dirname, '..', 'QCAFlow.html');

function extractAppScript(html) {
  const lines = html.split(/\r?\n/);
  const startIdx = lines.findIndex((l) => l.trim() === '<script>');
  if (startIdx === -1) throw new Error('Não foi possível localizar a tag <script> do app em QCAFlow.html.');
  let endIdx = -1;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (lines[i].trim() === '</script>') { endIdx = i; break; }
  }
  if (endIdx === -1) throw new Error('Não foi possível localizar o fechamento </script> do app em QCAFlow.html.');
  let src = lines.slice(startIdx + 1, endIdx).join('\n');
  // Remove o IIFE de inicialização automática (carrega dados de amostra e
  // renderiza a UI real) — os testes controlam `dados`/`numConds` manualmente.
  // Usa uma âncora textual exclusiva do IIFE real (não usar regex genérica:
  // outras funções do app — ex. exportSelfContained — contêm a substring
  // literal "(function init(){" dentro de strings de template, o que
  // confundiria uma busca/replace ingênua).
  const anchor = '(function init(){\n  dados=SAMPLE.map';
  const idx = src.lastIndexOf(anchor);
  if (idx === -1) throw new Error('Âncora do IIFE de inicialização não encontrada — QCAFlow.html pode ter mudado de estrutura.');
  src = src.slice(0, idx);
  // As variáveis de estado (numConds, dados, truthTable, calibInfo, ...) são
  // declaradas com `let`/`const` no nível superior do script. Dentro de um
  // vm.Context, apenas `var`/funções de nível superior viram propriedades do
  // objeto de contexto — por isso convertemos só as declarações SEM
  // indentação (nível superior) para `var`, preservando o `let`/`const`
  // usado dentro de funções e blocos (que não precisam ser acessados de fora).
  src = src.replace(/^(let|const)\s+/gm, 'var ');
  return src;
}

// DOM mínimo: as funções de cálculo (computeTruthTable, applyCalibration-adjacentes)
// leem alguns inputs de limiar via getElementById(...).value. Um elemento genérico
// com `.value` vazio faz essas leituras caírem nos mesmos defaults do próprio app
// (limiar=0.75, PRI=0.70, freq=1, proporção=0.80), sem exigir um DOM real.
function makeFakeElement() {
  const store = { value: '' };
  return new Proxy(store, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (prop === 'textContent' || prop === 'innerHTML') return '';
      if (prop === 'classList') return { add() {}, remove() {}, contains: () => false };
      if (prop === 'style') return {};
      return () => {};
    },
    set(target, prop, value) { target[prop] = value; return true; },
  });
}

function loadApp() {
  const html = fs.readFileSync(APP_PATH, 'utf8');
  const src = extractAppScript(html);
  const elementCache = {};
  const sandbox = {
    console,
    document: {
      getElementById(id) {
        if (!elementCache[id]) elementCache[id] = makeFakeElement();
        return elementCache[id];
      },
      querySelectorAll: () => [],
      querySelector: () => null,
      createElement: () => makeFakeElement(),
    },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    navigator: { clipboard: { writeText: () => Promise.resolve() } },
    window: {},
    alert: () => {},
    confirm: () => true,
    URL: { createObjectURL: () => '', revokeObjectURL: () => {} },
    Blob: function Blob() {},
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: 'QCAFlow.html (script extraído)' });
  return sandbox;
}

// ---- runner minimalista -------------------------------------------------
const results = [];
function test(name, fn) {
  try {
    fn();
    results.push({ name, ok: true });
  } catch (err) {
    results.push({ name, ok: false, err });
  }
}
function approx(a, b, eps, msg) {
  assert.ok(Math.abs(a - b) < (eps || 1e-6), `${msg || ''} esperado ≈${b}, obtido ${a}`);
}

const app = loadApp();

// ============================================================
// 1. Tabela verdade / consistência / PRI / cobertura — dados crisp
// ============================================================
test('tabela verdade reproduz contagens clássicas com dados crisp (sem contradição)', () => {
  app.numConds = 3;
  app.condLabels = ['A', 'B', 'C'];
  app.manualOverrides = {};
  app.dados = [
    { caso: 'c1', conds: [1, 1, 1], res: 1 },
    { caso: 'c2', conds: [1, 1, 1], res: 1 },
    { caso: 'c3', conds: [1, 0, 1], res: 1 },
    { caso: 'c4', conds: [1, 0, 1], res: 0 },
    { caso: 'c5', conds: [0, 0, 0], res: 0 },
  ];
  app.computeTruthTable();
  const row111 = app.truthTable.find((r) => r.combo === '111');
  const row101 = app.truthTable.find((r) => r.combo === '101');
  const row000 = app.truthTable.find((r) => r.combo === '000');

  assert.strictEqual(row111.nCasos, 2);
  assert.strictEqual(row111.nSuc, 2);
  approx(row111.consist, 1.0, 1e-9, 'consistência de 111');

  assert.strictEqual(row101.nCasos, 2);
  assert.strictEqual(row101.nSuc, 1);
  approx(row101.consist, 0.5, 1e-9, 'consistência de 101 (1 suc. de 2)');

  assert.strictEqual(row000.nCasos, 1);
  approx(row000.consist, 0, 1e-9, 'consistência de 000');
});

// ============================================================
// 2. PRI: deve ser inferior à consistência bruta quando há sobreposição
//    entre Y e ~Y na mesma configuração fuzzy (Schneider & Wagemann, 2012)
// ============================================================
test('PRI cai abaixo da consistência bruta quando há simultaneidade parcial com ~Y', () => {
  app.numConds = 3;
  app.condLabels = ['A', 'B', 'C'];
  app.manualOverrides = {};
  app.dados = [
    { caso: 'c1', conds: [1, 1, 1], res: 1 },
    { caso: 'c2', conds: [1, 1, 1], res: 0.9 },
    { caso: 'c3', conds: [1, 1, 1], res: 0.6 },
    { caso: 'c4', conds: [1, 1, 1], res: 0.55 },
  ];
  app.computeTruthTable();
  const row = app.truthTable.find((r) => r.combo === '111');
  assert.ok(row.pri < row.consist, `PRI (${row.pri}) deveria ser < consistência bruta (${row.consist})`);
});

// ============================================================
// 3. Necessidade + RoN: condição presente em 100% dos casos com Y=1
//    deve ser diagnosticada como necessária; RoN detecta trivialidade.
// ============================================================
test('necessityAnalysis identifica condição necessária e sinaliza RoN baixo quando quase constante', () => {
  app.numConds = 2;
  app.condLabels = ['SempreAlta', 'Variavel'];
  app.dados = [
    { caso: 'c1', conds: [1, 1], res: 1 },
    { caso: 'c2', conds: [1, 0], res: 1 },
    { caso: 'c3', conds: [1, 1], res: 0 },
    { caso: 'c4', conds: [1, 0], res: 0 },
  ];
  const items = app.necessityAnalysis(false);
  const sempreAlta = items.find((it) => it.label === 'SempreAlta');
  approx(sempreAlta.consistNec, 1.0, 1e-9, 'consistência de necessidade de SempreAlta');
  assert.strictEqual(sempreAlta.isNec, true);
  assert.strictEqual(sempreAlta.trivial, true, 'RoN deveria marcar necessidade trivial (condição quase constante)');
});

// ============================================================
// 4. Quine-McCluskey + seleção de cobertura: exemplo clássico de
//    minimização (3 variáveis) com resultado mínimo conhecido.
// ============================================================
test('quineMinimize + selectCover minimizam para os implicantes primos essenciais esperados', () => {
  app.numConds = 3;
  app.condLabels = ['X', 'Y', 'Z'];
  app.manualOverrides = {};
  // Suficientes em 011, 101, 110, 111 → minimização clássica: X·Y + X·Z + Y·Z
  // (cada par de implicantes essenciais cobre exatamente as 4 linhas).
  const sufRows = ['011', '101', '110', '111'].map((combo) => ({
    combo,
    bits: combo.split('').map(Number),
  }));
  const pis = app.quineMinimize(sufRows);
  const chosen = app.selectCover(pis, sufRows);
  // Cobertura deve ser mínima e cobrir todas as 4 linhas.
  sufRows.forEach((row) => {
    const covered = chosen.some((pi) => app.piCovers(pi, row.bits));
    assert.ok(covered, `linha ${row.combo} não coberta pela solução`);
  });
  assert.ok(chosen.length <= 3, `esperada cobertura de até 3 termos, obtidos ${chosen.length}`);
});

// ============================================================
// 5. Regressão — solução intermediária (bug corrigido: easyRems não
//    deve exigir adjacência com uma linha suficiente observada, apenas
//    compatibilidade bit a bit com a expectativa direcional declarada).
// ============================================================
test('solução intermediária inclui contrafactual fácil sem exigir adjacência com linha suficiente', () => {
  app.numConds = 3;
  app.condLabels = ['Educacao', 'Renda', 'Democracia'];
  app.manualOverrides = {};
  app.dirExpect = ['1', '', ''];
  app.dados = [
    { caso: 'c1', conds: [1, 1, 1], res: 1 },
    { caso: 'c2', conds: [1, 1, 1], res: 1 },
    { caso: 'c3', conds: [1, 1, 1], res: 1 },
    { caso: 'c4', conds: [0, 0, 0], res: 0 },
    { caso: 'c5', conds: [0, 0, 0], res: 0 },
  ];
  app.computeTruthTable();
  const sol = app.computeSolutions();
  // Remainder 101 (Educacao=1, Renda=0, Democracia=1) é compatível com a
  // única expectativa declarada (Educacao=1) e deveria ser tratado como
  // contrafactual fácil, mesmo sem nenhuma linha suficiente com bits(1,·,1)
  // observada fora da própria 111.
  const easyCombos = sol.easyRems.map((r) => r.combo);
  assert.ok(easyCombos.includes('101'), `esperava 101 entre os contrafactuais fáceis, obtido: ${easyCombos.join(', ')}`);
  assert.ok(easyCombos.includes('100'), `esperava 100 entre os contrafactuais fáceis, obtido: ${easyCombos.join(', ')}`);
  // 001 e 011 têm Educacao=0, incompatível com a expectativa "1" — não devem entrar.
  assert.ok(!easyCombos.includes('001'), '001 não deveria ser contrafactual fácil (Educacao=0 contraria a expectativa)');
  assert.ok(!easyCombos.includes('011'), '011 não deveria ser contrafactual fácil (Educacao=0 contraria a expectativa)');
});

// ============================================================
// 6. Regressão — pertencimento fuzzy exatamente em 0,5 não deve ficar
//    "invisível" na tabela verdade (bug corrigido via condVal()).
// ============================================================
test('caso com pertencimento fuzzy exatamente 0,5 é contabilizado em alguma linha da tabela verdade', () => {
  app.numConds = 1;
  app.condLabels = ['Cond'];
  app.manualOverrides = {};
  app.dados = [
    { caso: 'c1', conds: [0.5], res: 1 },
    { caso: 'c2', conds: [1], res: 1 },
  ];
  app.computeTruthTable();
  const totalCasos = app.truthTable.reduce((s, r) => s + r.nCasos, 0);
  assert.strictEqual(totalCasos, 2, `esperava os 2 casos contabilizados em alguma linha, obtido ${totalCasos}`);
});

// ============================================================
// 7. Calibração direta: âncoras devem mapear aproximadamente para
//    0,95 / 0,50 / 0,05 (log-odds) e exatamente para os limites (linear).
// ============================================================
test('calibValue mapeia as âncoras corretamente nos dois métodos de transição', () => {
  const full = 100, cross = 50, non = 0;

  app.calibInfo.type = 'logistic';
  approx(app.calibValue(cross, full, cross, non), 0.5, 1e-9, 'cruzamento log-odds');
  approx(app.calibValue(full, full, cross, non), 0.95, 0.03, 'pleno pertencimento log-odds');
  approx(app.calibValue(non, full, cross, non), 0.05, 0.03, 'pleno não-pertencimento log-odds');

  app.calibInfo.type = 'linear';
  approx(app.calibValue(cross, full, cross, non), 0.5, 1e-9, 'cruzamento linear');
  approx(app.calibValue(full, full, cross, non), 1.0, 1e-9, 'pleno pertencimento linear');
  approx(app.calibValue(non, full, cross, non), 0.0, 1e-9, 'pleno não-pertencimento linear');
});

test('percentile reproduz percentis conhecidos', () => {
  const vals = [10, 20, 30, 40, 50];
  approx(app.percentile(vals, 0.5), 30, 1e-9, 'mediana');
  approx(app.percentile(vals, 0), 10, 1e-9, 'percentil 0');
  approx(app.percentile(vals, 1), 50, 1e-9, 'percentil 100');
});

// ============================================================
// Relatório
// ============================================================
let failed = 0;
for (const r of results) {
  if (r.ok) {
    console.log(`✅ ${r.name}`);
  } else {
    failed++;
    console.log(`❌ ${r.name}`);
    console.log(`   ${r.err.message}`);
  }
}
console.log(`\n${results.length - failed}/${results.length} testes passaram.`);
if (failed > 0) process.exit(1);
