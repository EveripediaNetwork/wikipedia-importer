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
let interalCitations = {};

const accumulateText = (outerHTML, $, citations) => {
	accumulator = ''; //reset accumulator for each element
	internalCitations = citations;
	textParser(outerHTML, $);
	// let sentences = sentenceParser(accumulator);
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
	if (internalCitations[cleanText] == '') {
		return ''
	}
	return ' ' + '[[CITE|' + cleanText + '|' + internalCitations[cleanText] + ']]' + ' ';
}

//logic to parse accumulator into seperate Sentences
const sentenceParser = (text) => {
	let sentences = [];
	let sentenceAccumulator = ''; //instantiate empty sentence accumulator
	let index = 0; //keep track of current sentence
	//flags to ensure that you do not end sentences inside of brackets 
	let flag1 = false; //flag = !flag when charAt(i) == [[ || ]] 
	let flag2 = false; //flag = !flag when charAt(i) == ( || )
	
	for (i = 0; i < text.length; i++) {
		let char = text.charAt(i); //current character 
		sentenceAccumulator += char;

		if ( (text.charAt(i) == '[' && text.charAt(i+1) == '[') || 
				(text.charAt(i) == ']' && text.charAt(i+1) == ']') ) 
		{
			flag1 = !flag1;
		}

		if ( char == '(' || char == ')' ) 
		{
			flag2 = !flag2;
		}

		if (i == text.length - 1) { //push sentence when end of text is reached
			sentences.push({
					type: 'sentence',
					index: index,
					text: sentenceAccumulator
			})
			return sentences; //return sentences array
		}

		if ( char == '.' && !flag1 && !flag2) {
			if (!isAbbreviation(sentenceAccumulator)) {
				sentences.push({
					type: 'sentence',
					index: index,
					text: sentenceAccumulator
				})
				sentenceAccumulator = ''; //reset sentenceAccumulator
				index++;
			}
		}

		if ( (char == '?' || char == '!') && !flag1 && !flag2 ) {
				sentences.push({
					type: 'sentence',
					index: index,
					text: sentenceAccumulator
				})
				sentenceAccumulator = ''; //reset sentenceAccumulator
				index++;
		} 
	}
}

const isAbbreviation = (sentenceAccumulator) => {
	//decrement index until a white space is reached
	//if character after white space is a capital letter then return false
	//implement same boolean flag logic 
	//(i.e., don't consider white spaces inside of brackets)
	let s = sentenceAccumulator;
	flag1 = false; 
	flag2 = false;
	for (i = (s.length - 1); i >= 0; i--) {
		if ( (s.charAt(i) == '[' && s.charAt(i - 1) == '[') || 
			(s.charAt(i) == ']' && s.charAt(i - 1) == ']') ) 
		{
			flag1 = !flag1;
		}

		if ( s == '(' || s == ')' ) 
		{
			flag2 = !flag2;
		}

		if (s.charAt(i) == ' ' && !flag1 && !flag2) {
			let char = s.charAt(i+1)
			if (char == char.toLowerCase()) { //character is lower case 
				return false // the period is not an abbreviation
			}
			return true //this is an abbreviation 
		}
	}
	return true //safety return if no white space is reached
} 

module.exports = accumulateText;
