const htmlVoidElements = require('html-void-elements');

const BLOCK_ELEMENTS = [ 
    "address",
    "article",
    "aside",
    "blockquote",
    "canvas",
    "dd",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hgroup",
    "hr",
    "li",
    "main",
    "nav",
    "noscript",
    "ol",
    "output",
    "p",
    "pre",
    "section",
    "table",
    "td",
    "tfoot",
    "th",
    "tr",
    "ul",
    "video"
];

const getTagClass = (tag) => {
  if (BLOCK_ELEMENTS.indexOf(tag) !== -1) {
    return 'block'
  }
  else if (htmlVoidElements.indexOf(tag) !== -1)  {
    return 'void'
  } 
  else {
    return 'inline'
  }
}

module.exports = getTagClass;