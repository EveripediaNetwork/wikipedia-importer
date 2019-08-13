const getSentences = require('./getSentences');
let listItems = [];
//for each li - paragraphItems[].append(li);
const getList = (element, $) => {
	let $element = $(element); //ul element 
	$element.children().each((i, el) => { //for each ListItem 
		let sentences = getSentences(el, $);
		listItems.push({
			type: 'list_item',
			index: i,
			sentences: sentences,
			tag_type: 'li'
		});
	})
	return listItems;
}

module.exports = getList;

