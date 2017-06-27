const assert = require('assert');
const GlimmerInlineTemplatesPlugin = require('..');
const babel = require('babel-core');

const {
  TEMPLATE_STRING_INPUT,
  STRING_LITERAL_INPUT
} = require('./fixtures');

describe('Babel plugin', function() {

  it('rewrites template strings', function() {
    let { template } = compile(TEMPLATE_STRING_INPUT);
    assert.strictEqual(template, '{"id":"B3EZaRNX","block":"{\\"symbols\\":[],\\"statements\\":[[6,\\"div\\"],[7],[0,\\"\\\\n  Hello \\"],[1,[18,\\"world\\"],false],[0,\\"\\\\n\\"],[8]],\\"hasEval\\":false}","meta":{}}');
  });

  it('rewrites string literals', function() {
    let { template } = compile(STRING_LITERAL_INPUT);
    assert.strictEqual(template, '{"id":"B3EZaRNX","block":"{\\"symbols\\":[],\\"statements\\":[[6,\\"div\\"],[7],[0,\\"\\\\n  Hello \\"],[1,[18,\\"world\\"],false],[0,\\"\\\\n\\"],[8]],\\"hasEval\\":false}","meta":{}}');
  });

});

/*
 * Helper that uses Babel to transpile fixture source code with our plugin, as
 * well as transforming modules into CommonJS. We then use the world's smallest
 * CommonJS loader to evaluate the transpiled code and return all of the
 * module's exports.
 */
function compile(source, filename) {
  let { code } = babel.transform(source, {
    filename,
    plugins: [
      GlimmerInlineTemplatesPlugin,
      'transform-es2015-modules-commonjs'
    ]
  });

  return eval(`(function(exports) {${code}; return exports;})({})`);
}
