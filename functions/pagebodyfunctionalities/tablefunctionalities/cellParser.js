let cleanAttributes = require('../getAttributes');

//global variables  
let nestedContentItems = []; 
let accumulator = '';

const getParsedCellContent = (cell, $) => {
	nestedContentItems = []; //for each cell reset content [] 
	accumulator = ''; //reset for each cell 
	cellParser(cell, $);
	let tempLength = nestedContentItems.length;
	if (tempLength == 0) {	
	nestedContentItems.push({ 
   	  	type: 'text', 
     	content: [{type: 'sentence', index: 0, content: accumulator}] });
	} else {
		if (nestedContentItems[tempLength - 1].type == 'text') {
			if (nestedContentItems[tempLength - 1].content[0].content != accumulator) {
				nestedContentItems.push({ 
			   	  	type: 'text', 
			     	content: [{type: 'sentence', index: 0, content: accumulator}] });
			}
		}
		else {
				if (accumulator != '') {
					nestedContentItems.push({ 
				   	  	type: 'text', 
				     	content: [{type: 'sentence', index: 0, content: accumulator}] });
				}
			}	
		
	}
	for (i = 0; i < nestedContentItems.length; i++) {
		if (nestedContentItems[i].type == 'text') {
			console.log(nestedContentItems[i].content[0].content)
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
	        	content: [{type: 'sentence', index: 0, content: accumulator}] });
      		}
      		//push br tag 
      		nestedContentItems.push({
	        attrs: cleanAttributes(element.attrs),
	        content: [], 
	        tag_class: "void",
	        tag_type: 'br',
	        type: "tag" });

	        accumulator = ''; //reset accumulator
	        return 
		}
		else if ($(el)[0].name == 'a') {
		// manageAnchorTags(el, $);
		// const manageAnchorTags = (el, $) => {
			if ($(el).children().length == 0) { //resolve anchor tags that only cotain text 
		      accumulator += parseAnchorTag(el, $);
		 
		    } else if ($.html(el).includes('<br>')) {  //anchor tag has inner tags  
		        let a = ($.html($(el))).replace('<br>', '\n');
		        accumulator += parseAnchorTag(a, $);
		      
			} //need to account for images 
			return
  		}
  		else { //nested tag is reached 
	  		cellParser(el , $);
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

module.exports = getParsedCellContent; 
