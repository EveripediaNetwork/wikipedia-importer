const cheerio = require('cheerio');
const getSentences = require('./pagebodyfunctionalities/getSentences');
const getImage = require('./pagebodyfunctionalities/getImage');
const getCategory = require('./pagebodyfunctionalities/getCategory');
const getList = require('./pagebodyfunctionalities/getList');
const getDescList = require('./pagebodyfunctionalities/getDescList');
const getTable = require('./pagebodyfunctionalities/tablefunctionalities/getTable2');
const getAttributes = require('./pagebodyfunctionalities/getAttributes');
const getCitations = require('./getCitations');
const parseText = require('./pagebodyfunctionalities/textParser');
const sections = []; // array of {paragraphs: Paragraph[] , images: Media[]} objects
let paragraphs = [];
let images = [];

const getPageBody = (html, url) => {
	let citations = getCitations(html, url);
	let internalCitations = citations.internalCitations;
	const $ = cheerio.load(html, {decodeEntities: false});
	const $content = $('div.mw-parser-output');
	let section = {}; 
	let paragraphIndex = 0; //keep track of current paragraph
	$content.children('p, h1, h2, h3, h4, h5, h6, div, table, ul, dl, center').each((i, el) => { 
		let $el = $(el);
		let tag = $el[0].name;
		if (tag == 'p') { //create new paragraph
			let text = parseText(el, $, internalCitations); //returns array of paragraphItems[] of type Sentence
			let sentenceItem = {
				type: 'Sentence',
				index: 0,
				text: text
			}
			paragraphs.push({  
				index: paragraphIndex,
				items: sentenceItem,
				tag_type: 'p',
				attrs: getAttributes(el.attrs)
			})
			paragraphIndex++;
		}
		else if($el.prop('tagName').indexOf("H") > -1 && $el.find('.mw-headline').length > 0){ //create new section when h tag is reached
			//stop iterating through page body once references are reached 
			if ( $el.attr('id') == 'References' ) {
				return false
			}

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
				index: paragraphIndex, 
				items: getCategory(el, $),
				tag_type: $el[0].name, 
				attrs: getAttributes(el.attrs)
			});
			paragraphIndex++;
		}
		else if (tag == 'div') {
			let divClass = $el.attr('class');
			if (divClass !== undefined) {
				if (divClass.includes("thumb")) {
					images.push(getImage(el, $));
				}
			}
		}
		else if (tag == 'table') {
			let tableclass = $el.attr('class');
			if (tableclass === "wikitable" || tableclass === "body-table") {
				let table = getTable(el, $);
				paragraphs.push({
					index: paragraphIndex,
					items: table,
					tag_type: 'table',
					attrs: getAttributes(el.attrs)
				})
				paragraphIndex++;
			}
		}
		else if (tag == 'center' && $el.children('table').length > 0) { 
			let childTable = $el.find('table').first();
			let tableclass = childTable.attr('class').trim();
			if (tableclass === "wikitable" || tableclass === "body-table") {
				let table = getTable(childTable, $);
				paragraphs.push({
					index: paragraphIndex,
					items: table,
					tag_type: 'table',
					attrs: getAttributes(childTable.attrs)
				})
				paragraphIndex++;
			}
		}
		else if ($el[0].name == 'ul') {//Lists and ListItems
			let items = getList(el, $); //return a list item
			paragraphs.push({
				index: paragraphIndex,
				items: items,
				tag_type: 'ul',
				attrs: getAttributes(el.attrs)
			})
			paragraphIndex++;	
		}
		else if($el[0].name == 'dl') { //DescList and DescListItems 
			let items = getDescList(el, $); //return a list item of type DescList
			paragraphs.push({
				index: paragraphIndex,
				items: items,
				tag_type: 'dl',
				attrs: getAttributes(el.attrs)
			})
			paragraphIndex++;
		}
	})
	return {
		sections: sections,
		citations: citations.citations
	};
}

module.exports = getPageBody;

//break code at references