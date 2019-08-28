const cleanAttributes = require('../getAttributes');
const parseText = require('../textParser'); 
const getTagClass = require('../getTagClass');
const getImage = require('../getImage');
const parseAnchorTag = require('../parseAnchorTag');
const parseInternalCitation = require('../parseInternalCitation');

//global variables  
let nestedContentItems = []; 
let accumulator = '';

const getParsedCellContent = (cell, $) => {
	nestedContentItems = []; //for each cell reset content [] 
	accumulator = ''; //reset for each cell 
	cellParser(cell, $);
	accumulator = accumulator.trim(); 
	let tempLength = nestedContentItems.length;
	//Since the code pushes nestedContentItems only when br tags are reached
	//The following conditional code will push the remaining code after the br tag is reached 
	//within a cell (as it was not pushed yet since a br tag was never reached)
	if (tempLength == 0) {	
	nestedContentItems.push({ 
   	  	type: 'text', 
     	content: [{type: 'sentence', index: 0, text: accumulator}] });
	} else {
		if (nestedContentItems[tempLength - 1].type == 'text') {
			if (nestedContentItems[tempLength - 1].content[0].content != accumulator) {
				nestedContentItems.push({ 
			   	  	type: 'text', 
			     	content: [{type: 'sentence', index: 0, text: accumulator}] });
			}
		}
		else {
			if (accumulator != '') {
				nestedContentItems.push({ 
			   	  	type: 'text', 
			     	content: [{type: 'sentence', index: 0, text: accumulator}] });
			}
		}	
	}
	return nestedContentItems
}

//traverse through each cell content item and accumulate text
//Create a new sentence at each br tag 
//hit br tag or end of cell and push sentence 
const cellParser = (element, $) => {
	if (element == undefined) {
		return 
	}
	const $element = $(element);

	//do not display html that wikipedia doesn't display
	if ($element.attr('style') == 'display: none;') { 
      return
  	}

	//else element is nested   
	$element.contents().each( (i, el) => {
		if ( el.type == 'text' ) {
			let text = $(el).text();
			if (text !== undefined && text !== '') {
				accumulator += text;
				return
			}
			return
		} 
		else if ($(el)[0].name == 'br') {
			if( accumulator != undefined && accumulator != '' ) {
				//sentence is completed 
				nestedContentItems.push({
	        	type: 'text', 
	        	content: [{type: 'sentence', index: 0, text: accumulator}] });
      		}
      		//push br tag 
      		nestedContentItems.push({
	        attrs: cleanAttributes(el.attrs),
	        content: [], 
	        tag_class: "void",
	        tag_type: 'br',
	        type: "tag" });

	        accumulator = ''; //reset accumulator
	        return 
		}
		else if ($(el)[0].name == 'a') {
			accumulator += parseAnchorTag(el, $);
  		}
  		else if ($(el)[0].name == 'sup') { 
  			accumulator += parseInternalCitation($(el).find('a'), $);
  		}
  		else if ($(el)[0].name == 'ul') { //edge case for infobox_html
  			let listElements = $(el).children('li');
  			let listContent = [];
  			for ( i = 0; i < listElements.length; i++ ) {
  				listContent.push({
  					type: 'tag', 
  					tag_type: 'li',
  					tag_class: getTagClass($(listElements[i])[0].name), 
  					attrs: cleanAttributes(listElements[i].attribs),
  					content: { 
  						type: 'text',
  						content: parseText(listElements[i], $, {})
  					} 
  				}) 
  			} 
  			nestedContentItems.push({ //push UL element 
  				type: 'tag', 
  				tag_type: 'ul', 
  				tag_class: getTagClass($(el)[0].name), 
  				attrs: cleanAttributes(el.attribs), 
  				content: listContent 
  			}) 
  			return 
  		}
  		else { //nested tag is reached 
	  		cellParser(el , $);
  		}
	})
}


module.exports = getParsedCellContent; 
