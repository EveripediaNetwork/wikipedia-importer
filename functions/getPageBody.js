const request = require('request');
const cheerio = require('cheerio');
const getSentences = require('./pagebodyfunctionalities/getSentences');
const getImage = require('./pagebodyfunctionalities/getImage');
const getCategory = require('./pagebodyfunctionalities/getCategory');
const getList = require('./pagebodyfunctionalities/getList');
const wikipedia = 'https://en.wikipedia.org/wiki/';
const sections = []; // array of {paragraphs: , images: } objects 

const getPageBody = (page) => { 
	const url = `${wikipedia}${page}`;
	request(url, (error, reponse, html) => {
		const $ = cheerio.load(html, {decodeEntities: false});
		const $content = $('div.mw-parser-output');
		let section = {}; 
		let paragraph = {};
		let image = {}; 
		let paragraphs = []; 
		let images = [];
		let index = 0; //paragraph index
		// $content.find('p, h1, h2, h3, h4, h5, h6, div, table, ul, dl').each((i, el) => { //concern with this line of code
		$content.children().each((i, el) => { 
			$el = $(el);
			if ($el[0].name == 'p') { //create new paragraph
				// getSentences(el, $);

				// paragraph = { 
				// 	index:,
				// 	items: getParagraph(el, $), 
				// 	tag_type: 'p'; 
				// 	attrs: 
				// }
				// paragraphs.push(paragraph); 
			} 
			// else if($el.prop('tagName').indexOf("H") > -1 && $el.find('.mw-headline').length > 0){ //create new section for any h tag
				//create section object containing current paragraphs and images 
				// section = {
				// 	paragraphs: paragraphs,
				// 	images: images
				// }
				// sections.push(section); //push current section
				//paragraphs = [] //reset paragrapghs array 
				//images = [] //reset images array 
				//section = {} //instantiate new empty section with first paragraph being an h tag
				// create a new paragraph with h tag 
				// paragraph = {
				// 	index:, 
				// 	items: getCategory(el, $); 
				// 	tag_type: $el[0].name, 
				// 	attrs: {}
				// }
				// paragraphs.push(paragraph);
			// }
			// else if ($el.prop('tagName').indexOf("DIV") > -1) {
			// 	getImage(el, $);
			// }
			// // else if($el[0].name == 'table' ) {

			// // }
			else if ($el[0].name == 'ul') {//Lists and ListItems
				//createParagraph: {
					//index: 
					//paragraph items = getList();
					//tag_type: String 
					//attrs: {} 
					//}
				getList(el, $);
			}
	// 		else if($el[0].name == 'dl') { //DescList and DescListItems 
	// 			//create new paragraph 
	// 			//forEach dl create and append item to paragraph items array
	// 		}

	// 	})
		})
	})
}

getPageBody('Nullifier_Party');
module.exports = getPageBody;


//Daimler_AG page not working

// Enrag%C3%A9s|Enrag&#xE9;s (é)

///bugs :
//&apos; represents 's
//&quot (i.e. &quot;without&quot;) represents (i.e. "without"); 