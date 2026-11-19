// B223: görünüm modüllerinde ve app.js'te tanımsız ad kalmasın (taşıma sırasında içe aktarma unutulursa derleme yakalamaz, çalışırken patlar).
// Vite'ın ayrıştırıcısıyla gerçek sözdizimi ağacı: tüm bildirimler (içe aktarma, işlev, değişken, parametre, yakalama) bilinir; başvurular bunlara karşı denetlenir.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseAst } from 'vite';

const GLOBALS = new Set(['window', 'document', 'navigator', 'location', 'history', 'localStorage', 'sessionStorage', 'console', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame', 'cancelAnimationFrame', 'matchMedia', 'getComputedStyle', 'innerWidth', 'innerHeight', 'scrollX', 'scrollY', 'structuredClone', 'queueMicrotask', 'URL', 'Blob', 'File', 'FileReader', 'FontFace', 'Intl', 'Math', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean', 'Date', 'Map', 'Set', 'WeakMap', 'WeakSet', 'Promise', 'RegExp', 'Error', 'TypeError', 'RangeError', 'Symbol', 'Infinity', 'NaN', 'undefined', 'globalThis', 'isNaN', 'isFinite', 'parseInt', 'parseFloat', 'encodeURIComponent', 'decodeURIComponent', 'CSS', 'Event', 'CustomEvent', 'KeyboardEvent', 'PointerEvent', 'MouseEvent', 'IntersectionObserver', 'ResizeObserver', 'MutationObserver', 'HTMLElement', 'Element', 'Node', 'alert', 'confirm', 'prompt', 'print', 'performance', 'crypto', 'TextEncoder', 'TextDecoder', 'atob', 'btoa', 'fetch', 'Response', 'Request', 'Headers', 'AbortController', 'arguments', '__APP_VERSION__', '__SINGLE__', '__LITE__']);

function check(file) {
  const ast = parseAst(fs.readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8'));
  const declared = new Set();
  const refs = new Map();
  const pattern = (p) => {
    if (!p) return;
    if (p.type === 'Identifier') declared.add(p.name);
    else if (p.type === 'ObjectPattern') p.properties.forEach((x) => pattern(x.type === 'RestElement' ? x.argument : x.value));
    else if (p.type === 'ArrayPattern') p.elements.forEach(pattern);
    else if (p.type === 'AssignmentPattern') pattern(p.left);
    else if (p.type === 'RestElement') pattern(p.argument);
  };
  const walk = (node, parent, key) => {
    if (!node || typeof node.type !== 'string') return;
    switch (node.type) {
      case 'ImportSpecifier': case 'ImportDefaultSpecifier': case 'ImportNamespaceSpecifier': declared.add(node.local.name); return;
      case 'FunctionDeclaration': case 'FunctionExpression': case 'ArrowFunctionExpression': if (node.id) declared.add(node.id.name); node.params.forEach(pattern); break;
      case 'VariableDeclarator': pattern(node.id); break;
      case 'CatchClause': pattern(node.param); break;
      case 'ClassDeclaration': if (node.id) declared.add(node.id.name); break;
      case 'MetaProperty': case 'ImportAttribute': return; // import.meta, with { type: 'json' }
      case 'Identifier': {
        const isProp = (parent?.type === 'MemberExpression' && key === 'property' && !parent.computed)
          || (parent?.type === 'Property' && key === 'key' && !parent.computed && !parent.shorthand)
          || (parent?.type === 'MethodDefinition' && key === 'key') || parent?.type === 'LabeledStatement' || parent?.type === 'BreakStatement' || parent?.type === 'ContinueStatement'
          || parent?.type === 'ExportSpecifier';
        if (!isProp) refs.set(node.name, (refs.get(node.name) || 0) + 1);
        return;
      }
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === 'type' || k === 'start' || k === 'end') continue;
      if (Array.isArray(v)) v.forEach((c) => walk(c, node, k)); else if (v && typeof v === 'object') walk(v, node, k);
    }
  };
  walk(ast, null, null);
  return [...refs.keys()].filter((n) => !declared.has(n) && !GLOBALS.has(n));
}

// Tüm uygulama kaynakları (src/*.js + src/views/*.js)
const FILES = [...fs.readdirSync(new URL('../src/', import.meta.url)).filter((f) => f.endsWith('.js')),
  ...fs.readdirSync(new URL('../src/views/', import.meta.url)).filter((f) => f.endsWith('.js')).map((f) => 'views/' + f)];
for (const file of FILES) test(`B223 tanımsız ad yok: ${file}`, () => assert.deepEqual(check(file), []));
