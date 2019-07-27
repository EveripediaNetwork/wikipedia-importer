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
// 	// 			//create new paragraph 
// 	// 			//forEach li create and append list item to paragraph items array

// 	  type: string; // list_item
//     index: number;
//     sentences: Sentence[];
//     tag_type: string; // li
//     diff?: DiffType;
// }

// export interface Sentence {
//     type: string; // sentence
//     index: number;
//     text: string; // contains inline WikiLink markup + some light markdown for formatting
//     diff?: DiffType;
// }