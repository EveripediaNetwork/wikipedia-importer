const request = require('request');
const cheerio = require('cheerio');
const getSentences = require('./pagebodyfunctionalities/getSentences');
const getImage = require('./pagebodyfunctionalities/getImage');
const getCategory = require('./pagebodyfunctionalities/getCategory');
const getList = require('./pagebodyfunctionalities/getList');
const getDescList = require('./pagebodyfunctionalities/getDescList');
const getTable = require('./pagebodyfunctionalities/getTable');
const wikipedia = 'https://en.wikipedia.org/wiki/';
const sections = []; // array of {paragraphs: Paragraph[] , images: Media[]} objects


const getPageBody = (page) => { 
	const url = `${wikipedia}${page}`;
	request(url, (error, reponse, html) => {
		const $ = cheerio.load(html, {decodeEntities: false});
		const $content = $('div.mw-parser-output');
		let section = {}; 
		let paragraphIndex = 0; //keep track of current 
		let paragraphs = []; 
		let images = [];
		let index = 0; //paragraph index
		$content.children('p, h1, h2, h3, h4, h5, h6, div, table, ul, dl').each((i, el) => { 
			$el = $(el);
			if ($el[0].name == 'p') { //create new paragraph
				let items = getSentences(el, $); //returns array of paragraphItems[] of type Sentence
				paragraphs.push({
					index: paragraphIndex,
					items: items,
					tag_type: 'p',
					attrs: {}
				})
				paragraphItems++;
			}
			else if($el.prop('tagName').indexOf("H") > -1 && $el.find('.mw-headline').length > 0){ //create new section for any h tag
				sections.push({ //push current section
					paragraphs: paragraphs,
					images: images
				})
				paragraphs = []; //reset paragrapghs array 
				paragraphIndex = 0; //reset paragraphIndex
				images = [] //reset images array 
				section = {} //instantiate new empty section with first paragraph being an h tag
				// create a new paragraph with h tag 
				paragraphs.push({
					index:, 
					items: getCategory(el, $); 
					tag_type: $el[0].name, 
					attrs: {}
				});
			}
			// else if ($el.prop('tagName').indexOf("DIV") > -1) {
			// 	getImage(el, $);
			// }
			// // else if($el[0].name == 'table' ) {
			// // }
			else if ($el[0].name == 'ul') {//Lists and ListItems
				let items = getList(el, $);
				paragraphs.push({
					index: paragraphIndex,
					items: items,
					tag_type: 'ul',
					attrs: {}
				})
				paragraphIndex++;	
			}
			else if($el[0].name == 'dl') { //DescList and DescListItems 
				let items = getDescList(el, $);
				paragraphs.push({
					index: paragraphIndex,
					items: items,
					tag_type: 'dl',
					attrs: {}
				})
			}
		})
		})
	})
	return sections;
}

getPageBody('Nullifier_Party');
module.exports = getPageBody;

//break code at references