//elegant text Parser (for paragraphs, list items, citations etc.) 
//recurse through tags and append text to accumulator
//If you hit an anchor tag, simply call parseAnchorTag to
//convert it into the desired format
//end result is a sentence of length == 1 containing all the text of an element (e.g., <p> tag)

//Note: if if you wish, you can now simply run one more loop and break the text into sentences
//based on puntuation
//That code can be found in my initial getSentences() code

//However, I see a major benefits in leaving all the text as one sentence
//First, you can parse the entire text of the page body in one iteration (i.e., O(n) runtime)
//Second, this code can convert wikis of any language without worrying about syntactical differences

let accumulator = ''; //global textAccumulator

const accumulateText = (outerHTML, $) => {
	accumulator = ''; //reset accumulator for each element
	textParser(outerHTML, $);
	return {
		type: 'sentence',
		index: 0,
		text: accumulator
	}
}

//parse all but table contentItems (my code for that is in ./tablefunctionalities folder)
const textParser = (element, $) => {
	let $element = $(element); 
	$element.contents().each((i, el) => {
		let $el = $(el); 
		if (el.type == 'text') {
			let text = $el.text();
			if (text != '' && text != undefined) {
				accumulator += text; 
				return
			}
			return
		}
		else { // element is a tag
			let tag = $el[0].name;
			if ( tag == 'a' && $(el).find('img').length == 0) { //edge case
				accumulator += parseAnchorTag(el, $);
			}
			else if (tag == 'sup') {
				accumulator += ' '; //add space before internal citation for preference
				accumulator += parseInternalCitation($el.find('a'), $);
			}
			else {
				textParser (el, $);
			}
		}
	})
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
  if (wikiLink == undefined || anchorTagElement == undefined) {
  	return ''
  }
  return wikiLink
}

parseInternalCitation = (el, $) => {
	let $el = $(el);
	let text = $el.text();
	let href = $el.attr('href');
	//clean text e.g., [133] -> 133 
	let cleanText = '';
	let i = 0;
	while (i < text.length) {
		if (text[i] !== '[' && text[i] !== ']' ) {
			cleanText += text.charAt(i);
		}
		i++;
	}
	return '[[CITE|' + cleanText + '|' + href + ']]';
}

module.exports = accumulateText;
//need to account for img tags inside of anchor tag edge case for both this and table 



