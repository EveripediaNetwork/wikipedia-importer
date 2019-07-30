const request = require('request');
const cheerio = require('cheerio');
const cleanAttributes = require('./pagebodyfunctionalities/getAttributes');
const htmlVoidElements = require('html-void-elements');
const wikipedia = 'https://en.wikipedia.org/wiki/';
const table = {
  type: 'wikitable' | 'body-table',
  attrs: {}, 
  caption: {},
  thead: {},
  tbody: {},
  tfoot: {}
};
let rows = [];
let cells = [];
let content = []; //cell content


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
    tag_class = 'block';
  }
  else if (htmlVoidElements.indexOf(tag) !== -1)  {
    tag_class = 'void'
  } 
  else {
    tag_class = 'inline'
  }
}



// construct NestedContentItems
function recursiveNestedContent(element, text, $) { //element
  const elementType = element.type;
  const $element = $(element);
  const elementTag = $element[0].name;
  let tag_class = getTagClass(elementTag);
  //determine tag_class

  
  if($element.children().length == 0) { //base case 
    if(elementType == 'text') { //Base case - NestedTextItem
      return {
        type: 'text', 
        content: [{type: 'sentence', index: 0, text: text}] //Sentence[]; Sentence = {index, text, type};
      }
    } else if (elementType == 'tag') { //NestedContentItem
      if (elementTag == 'a') {
        let wikiLink = '';
        const linkText = $element.text(); 
        //get slug 
        const hrefAttr = $element.attr('href');
        let index = 6;
        let slug = ''; 
        while(index < hrefAttr.length) { 
          slug += hrefAttr.charAt(index); 
          index++; 
        }
        wikiLink = '[[LINK|lang_en|' + slug + '|' + linkText + ']]';
        //return NestedTextItem 
        return {
          type: 'text',
          content: [{type: 'sentence', index: 0, text: wikiLink}]
        }
      }
      else if (elementTag == 'br') {//nestedTagItem
        return {
          attrs: cleanAttributes(element.attrs),
          contents: [], 
          tag_class: "void",
          tag_type: 'br',
          type: "tag"
        }
      } else {
        return {
          type: 'text',
          content: [{type: 'sentence', index: 0, text: text}]
        }
        
      }
    }
  }
  else { //element.children.length > 0 //recursive case
    let contentText = text; //ultimately when you get down to base case this will be the text of the NestedTextItem
    let content = []; //Array of NestedContentItems (ie NestedTextItems or NestedTagItems)
     
    let answer = $element.contents().each(function(i5, el5) {
      let nestedContentItem = recursiveNestedContent(el5, $(el5).text(), $);
      content.push(nestedContentItem);
    })

    return {
      type: 'tag',
      tag_type: $(element)[0].name,
      tag_class: tag_class,
      attrs: cleanAttributes(element.attrs),
      content: content
    }
  }
}
 
function doRequest(page) {
	const url = `${wikipedia}${page}`;
 	return new Promise(function (resolve, reject) {
    	request(url, function (error, res, html) {
      	if (!error && res.statusCode == 200) {
      	  resolve(html);
     	 } else {
       	 reject(error);
      }
    });
  });
}

async function main() {
  const html = await doRequest('Nullifier_Party'); 
  
  $ = cheerio.load(html);
  const $content = $('div.mw-parser-output');
  //.wikitable, .body-table
  $content.find('.infobox').each((i, el) => { //for each table 
    let $table = $(el); 
    $table.find('tr').each((i2, el2) => { //for each row
      cells = []; //reset cells array for new row
      let $row = $(el2);
      let row = {
        index: i2,
        attrs: cleanAttributes(el2.attrs),
        tag_type: 'tr',
        tag_class: 'block', //TagClass
        cells: []
      }
      $row.find('td, th').each((i3, el3) => { //for each cell
        content = []; //reset content array for new cell
        let $cell = $(el3);
        let cell = {
          index: i3,
          attrs: cleanAttributes(el3.attrs),
          tag_type: $cell[0].name,
          tag_class: 'block', //TagClass
          content: [], //NestedContentItem[]
        }
        $cell.contents().each((i4, el4) => { //each piece of content inside of a cell
            let item = recursiveNestedContent(el4, $(el4).text(), $);
            content.push(item); 
            cell.content = content;
          }) 
        cells.push(cell); 
        row.cells = cells;
        })
      rows.push(row)
      })

      // setTimeout(() => console.log(cellcontent), 3000);
      // console.log(cellcontent);
      return false;
    })
  }

  main();
