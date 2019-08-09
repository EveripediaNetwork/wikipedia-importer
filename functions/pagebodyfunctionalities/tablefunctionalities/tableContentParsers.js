const cleanAttributes = require('../getAttributes');
const getTagClass = require('../getTagClass');
const getSentences = require('../getSentences');

//input - cheerio object representing td | th cell element 
//output - NestedTextItem {type: 'text', content: Sentence[]}

const notNestedContent = (cellContentItem, $) => {
  const $cellContentItem = $(cellContentItem); 
  const type = cellContentItem.type;
  const tag = $cellContentItem[0].name;
  if (tag == 'br') { //quickly resolve edge case  
    return { 
      attrs: cleanAttributes(cellContentItem.attrs),
      contents: [], 
      tag_class: "void",
      tag_type: 'br',
      type: "tag"
    }
  }
  let elementText = ''; //instantiate elementText
  accumulator = ''; //reset accumulator for each item
  (type == 'tag') 
  ?  elementText = buildNestedTagText( cellContentItem, $, '') 
  :  elementText = $cellContentItem.text().trim();
  // let sentence = {type: 'sentence', index: 0, text: elementText}
  // return { type: 'text', content: [sentence]} //nested text item
  // return elementText //return an array of sentenceTexts and br nestedTextItems

  return elementText
} 




const buildNestedTagText = (cellContentElement, $, accumulator) => {
  let store = accumulator;
  let $element = $(cellContentElement);
  if ($element.attr('style') !== undefined) { //do not display html that wikipedia doesn't display
    if ($element.attr('style') == 'display: none;') {
      return ''
    }
  }

  //if tag == br create a new sentence
  if ($element[0].name == 'br') {
    return '\n'
  }
  //quick return anchor tags that don't have nested tags 
  if ($element[0].name == 'a' && $element.children().length == 0) {
    return parseAnchorTag(cellContentElement, $);
  }
  //now build store which represents the text of the whole nested tag item as a single sentence in correct format
  let contents = $element.contents(); 
  let i = 0; 
  while (i < contents.length) {
    if ( contents[i].type == 'text' ) { //I think problem is something to do with children > 0
        let sentenceText = $(contents[i]).text().trim(); //might have to use regex to get rid of tabs and new-lines
        if (sentenceText !== undefined && store !== undefined) {
          store += sentenceText; 
        }
      } 
      else { //tag element is reached
          store += buildNestedTagText(contents[i], $, ''); //nestedTagItem 
    }
    i++;
  }
  return store
}



const parseAnchorTag = (anchorTagElement, $) => {
  let $element = $(anchorTagElement);
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
  return wikiLink
}

// construct NestedContentItems
function recursiveNestedContent(element, text, $) { 
  const elementType = element.type;
  const $element = $(element); //can remove second parameter with this
  const elementTag = $element[0].name;
  //determine tag_class
  let tag_class = getTagClass(elementTag);
  
  if($element.children().length == 0) { //base case 
    if(elementType == 'text') { //NestedTextItem
      return {
        type: 'text', 
        content: [{type: 'sentence', index: 0, text: text}] //Sentence[]; Sentence = {index, text, type};
      }
    } else if (elementType == 'tag') { 
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

module.exports = {
  recursiveNestedContent: recursiveNestedContent,
  notNestedContent: notNestedContent
}