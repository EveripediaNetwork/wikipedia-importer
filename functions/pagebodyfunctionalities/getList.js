const parseText = require('./textParser');

//input: <ul> element
//output: array of formatted li elements

const getList = (element, $) => {
	let listItems = []; //return obj 
	let $element = $(element); //ul element 
	$element.children().each((i, el) => { //for each ListItem 
		let sentence = parseText(el, $, internalCitations);
		listItems.push({
			type: 'list_item',
			index: i,
			sentences: sentence,
			tag_type: 'li'
		});
	})
	return listItems;
}

module.exports = getList;

