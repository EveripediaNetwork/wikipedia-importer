const parseAnchorTag = require('./parseAnchorTag');
const parseInternalCitation = require('./parseInternalCitation');
//elegant text Parser (for paragraphs, list items, citations etc.) 
//recurse through tags and append text to accumulator
//If you hit an anchor tag, simply call parseAnchorTag to
//convert it into the desired format
//end result is a sentence of length == 1 containing all the text of an element (e.g., <p> tag)

//Note: if if you wish, you can now simply run one more loop and break the text into sentences
//based on puntuation
//That code can be found in my initial getSentences() code

//However, I see a major benefits in leaving all the text as one sentence
//First, you can parse the entire text of the page body in linear time (i.e., O(n) runtime)
//Second, this code can convert wikis of any language without worrying about syntactical differences

let accumulator = ''; //global textAccumulator
let interalCitations = {};

const accumulateText = (element, $, citations) => {
	if (element.type == 'text') { //quick return if element is text
		return [{
			type: 'sentence',
			index: 0,
			text: $(element).text()
		}]
	}
	accumulator = ''; //reset accumulator for each element
	internalCitations = citations;
	textParser(element, $);
	return [{
		type: 'sentence',
		index: 0,
		text: accumulator.trim()
	}]
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
			if ( tag == 'a') {
				accumulator += parseAnchorTag(el, $);
			}
			else if (tag == 'sup') { //internal citation reached
				accumulator += parseInternalCitation($el.find('a'), $);
			}
			else {
				textParser(el, $);
			}
		}
	})
}


module.exports = accumulateText;
