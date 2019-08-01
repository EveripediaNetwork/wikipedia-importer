const request = require('request');
const cheerio = require('cheerio');
const getSentences = require('./pagebodyfunctionalities/getSentences');
const getImage = require('./pagebodyfunctionalities/getImage');
const getCategory = require('./pagebodyfunctionalities/getCategory');
const getList = require('./pagebodyfunctionalities/getList');
const getDescList = require('./pagebodyfunctionalities/getDescList');
const getTable = require('./pagebodyfunctionalities/getTable');
const getAttributes = require('./pagebodyfunctionalities/getAttributes');
const wikipedia = 'https://en.wikipedia.org/wiki/';
const sections = []; // array of {paragraphs: Paragraph[] , images: Media[]} objects
let paragraphs = [];
let images = [];


const getPageBody = (page) => { 
	const url = `${wikipedia}${page}`;
	request(url, (error, reponse, html) => {
		const $ = cheerio.load(html, {decodeEntities: false});
		const $content = $('div.mw-parser-output');
		let section = {}; 
		let paragraphIndex = 0; //keep track of current paragraph
		$content.children('p, h1, h2, h3, h4, h5, h6, div, table, ul, dl').each((i, el) => { 
			let $el = $(el);
			let tag = $el[0].name;
			if (tag == 'p') { //create new paragraph
				let items = getSentences(el, $); //returns array of paragraphItems[] of type Sentence
				paragraphs.push({  
					index: paragraphIndex,
					items: items,
					tag_type: 'p',
					attrs: getAttributes(el.attrs)
				})
				paragraphIndex++;
			}
			else if($el.prop('tagName').indexOf("H") > -1 && $el.find('.mw-headline').length > 0){ //create new section when h tag is reached
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
					items: getCategory(el, $); 
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
			else if($el[0].name == 'table') {
				//if wikitable | or bodytable 
				let table = getTable(el, $);
				paragraphs.push({
					index: paragraphIndex,
					items: table,
					tag_type: 'table',
					attrs: getAttributes(el.attrs)
				})
				paragraphIndex++;
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
	})
	return sections;
}


getPageBody('Beretta_92');
module.exports = getPageBody;

//break code at references