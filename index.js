const util = require('util');
const { precompile } = require('@glimmer/compiler');

/**
 * Babel plugin that compiles Glimmer templates inlined in component
 * files. The template must be a string export named `template`:
 * 
 * ```js
 * export let template = `<div>Hello {{world}}</div>`;
 * ```
 */
module.exports = function CompileInlineGlimmerTemplates(babel) {
  const { types: t } = babel;

  return {
    visitor: {
      ExportNamedDeclaration(path) {
        let templateLiteral = findTemplateLiteral(path);

        if (templateLiteral) {
          let templateSource = sourceFromLiteral(templateLiteral);
          let compiled = precompile(templateSource);
          templateLiteral.replaceWith(t.stringLiteral(compiled));
        }
      }
    }
  }

  function findTemplateLiteral(path) {
    if (!t.isVariableDeclaration(path.node.declaration)) { return; }

    let declaration = path
      .get('declaration.declarations')
      .find(d => {
        return d.node.id.name === 'template';
      });

    if (!declaration) {
      return;
    }

    return declaration.get('init');
  }

  function sourceFromLiteral(path) {
    if (t.isTemplateLiteral(path)) {
      return path.node.quasis.map(q => q.value.raw).join('\n');
    } else if (t.isStringLiteral(path)) {
      return path.node.value;
    }

    throw new Error('Could not extract template source from export: ' + util.inspect(path, { depth: 1 }));
  }
}
