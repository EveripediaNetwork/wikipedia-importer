
//notNestedContent returns an array of sentences 
//in get table code create a new Sentence object and append it to cellContent array. for i > 0 and i < length - 1 append br tag

//logic: 
//SentenceTextArr stores all sentences in a given nestedTagItem
//The accumulator is used to aggregate the characters that represent a sentence as a nested tag is traversed
//When a br tag is reached, push the accumulator into the SentenceTextArr and reset the accumulator

let sentenceTextArr = [];
let accumulator = ''

const buildNestedTagText = (cellContentElement, $) => {
  let $element = $(cellContentElement);
  let index = 0; //sentenceArr index
  if ($element.attr('style') !== undefined) { //do not display html that wikipedia doesn't display
    if ($element.attr('style') == 'display: none;') {
      return
    }
  }
  //if tag == br create a new sentence
  if ($element[0].name == 'br') { //deal with nested br tags and assigning new sentences
    sentenceTextArr.push(accumulator); 
    index++ 
    accumulator = ' '; //reset accumulator
    return 
  }
  //quick return anchor tags that don't have nested tags 
  if ($element[0].name == 'a' && $element.children().length == 0) {
    sentenceTextArr.push(parseAnchorTag(cellContentElement, $));
    index++;
    return
  }

  let contents = $element.contents(); 
  let i = 0; 
  while (i < contents.length) {
    if ( contents[i].type == 'text' ) { //I think problem is something to do with children > 0
      let sentenceText = $(contents[i]).text().trim(); //might have to use regex to get rid of tabs and new-lines
      if (sentenceText !== undefined && store !== undefined) {
        accumulator += sentenceText; 
      }
    } 
    else { //tag element is reached
       buildNestedTagText(contents[i], $); //nestedTagItem 
    }
    i++;
  }
  return sentenceTextArr.push(accumulator)
}