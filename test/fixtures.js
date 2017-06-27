module.exports.TEMPLATE_STRING_INPUT = `
export default class MyComponent {
  didInsertElement() {
    /* Should ignore other identifiers named template */
    let template = 'foo';
  }
}

export let template = \`<div>
  Hello {{world}}
</div>\`
`;

module.exports.STRING_LITERAL_INPUT = `
export default class MyComponent {
  didInsertElement() {
    /* Should ignore other identifiers named template */
    let template = 'foo';
  }
}

export let template = "<div>\\n\\
  Hello {{world}}\\n\\
</div>";
`;
