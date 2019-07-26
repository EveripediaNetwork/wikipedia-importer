const getSentences = require('./getSentences');
const sentences = [];
//for each li - paragraphItems[].append(li);
const getList = (element, $) => {
	let $element = $(element); //ul element 
	$element.children().each((i, el) => { //for each ListItem 
		getSentences(el, $);
		// let $el = $(el); // li element
		// if ($el[0].name == 'a') { //anchor tag, convert to wikilink 
		// 	let wikiLink = '';
	 //        const linkText = $el.text(); 
	 //        //get slug 
	 //        const hrefAttr = $el.attr('href');
	 //        let index = 6;
	 //        let slug = ''; 
	 //        while(index < hrefAttr.length) { 
	 //          slug += hrefAttr.charAt(index); 
	 //          index++; 
	 //        }
	 //        wikiLink = '[[LINK|lang_en|' + slug + '|' + linkText + ']]';
	        
	 //        return {
	 //          type: 'text',
	 //          content: [{type: 'sentence', index: 0, text: wikiLink}]
	 //        }
		// } 
		// else {

		// 	$el.text()

		// }
		// let type = 'li';
		// let index = i;
		// let sentence = '';
		// let tag_type = 'li';
	})
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