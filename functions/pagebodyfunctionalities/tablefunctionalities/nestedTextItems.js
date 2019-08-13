const getTagClass = require('../getTagClass');
const getSentences = require('../getSentences');
const cleanAttributes = require('../getAttributes');
const cheerio = require('cheerio');

//The length of the array is determined by the number of <br> tags encountered 
//within a single piece of cell content (not the whole cell)
//This is used to return sentences in the same vertical ordering as wikipedia

//global variables
let sentenceTextArr = [];
let accumulator = '';
let index = 0; //sentence array index

//module to match current format 
//input: td | th element 
//output: NestedContentItems[] 



//build accumulator until a br tag is reached or a new cell is traversed
//at which point you push the current accumulator text and convert it into
//nestedTextItem format 

const cellParser = (cell, $) => {    //cell could technically be any element* 
  let nestedContentItems = []; //instantiate return object                         
  let $cell = $(cell); 
  let accumulator = '';
  $cell.contents().each( (i, el) => {
    if ($(el)[0].name == 'br') {
      nestedContentItems.push({
        type: 'text', 
        content: [{type: 'sentence', index: 0, content: accumulator}]
      });
      nestedContentItems.push({
          attrs: cleanAttributes(element.attrs),
          contents: [], 
          tag_class: "void",
          tag_type: 'br',
          type: "tag"
      });
    } else {
        accumulator = parseContent(el, $);
    }
  })

  let textArr = parseContent(item, $);  
  if (textArr == []) {
    return //quick break
  }
  // console.log(textArr); 
  for (i = 0; i < textArr.length; i++) {
    contentArray.push({ //NestedTextItem
      type: 'text',
      content: textArr[i]
    })
    // 0 < i < lenght
    //implies the new position 
    //resulted from reaching a br tag
    if (i > 0 && i < textArr.length) { 
      contentArray.push({
        attrs: {},
        contents: [], 
        tag_class: "void",
        tag_type: 'br',
        type: "tag"
      })
    }
  } 
}

const parseContent = (item, $) => {
  const $item = $(item); 
  const type = item.type;
  const tag = $item[0].name;
  //reset the follwing three variables for each item
  accumulator = '';
  sentenceTextArr = []; 
  index = 0;
  if (type == 'tag') {
    buildNestedTagText(item, $); //resolve nested item text
    return sentenceTextArr; 
  } 
  return sentenceTextArr.push($item.text().trim()); //resolve text item
} 

const buildNestedTagText = (item, $) => {
  let $item = $(item);
  const tag = $item[0].name;
  if ($item.attr('style') == 'display: none;') { //do not display html that wikipedia doesn't display
      return
  }

  //if tag == br push and reset accumulator 
  if (tag == 'br') { 
    if (accumulator == '') {
      return //quick return if nothing has been accumulated 
    } 
    sentenceTextArr.push(accumulator); 
    index++;
    accumulator = ''; //reset accumulator
    return
  }

  if (tag == 'a') {  
    if ($item.children().length == 0) { //quick return anchor tags that aren't nested 
      accumulator += parseAnchorTag($item, $);
      return 
    } else {  //anchor tag has inner tags 
        let a = ($.html($item)).replace('<br>', '\n');
        accumulator += parseAnchorTag($(a), $);
        index++;
        return
    } 
  }

  //traverse contents() //these are either text or tag items
  let contents = $item.contents(); 
  let i = 0; 
  while (i < contents.length) {
    if ( contents[i].type == 'text' ) { //I think problem is something to do with children > 0
      let sentenceText = $(contents[i]).text().trim(); //might have to use regex to get rid of tabs and new-lines
      if (sentenceText !== undefined && sentenceText !== '') {
        accumulator += sentenceText; 
      }
    } 
    else { //tag element is reached
       buildNestedTagText(contents[i], $); //nestedTagItem 
    }
    i++;
  }
  sentenceTextArr.push(accumulator);

}

const parseAnchorTag = (anchorTagElement, $) => { //account for img and other anchor tag formats
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


module.exports = parseContent;



