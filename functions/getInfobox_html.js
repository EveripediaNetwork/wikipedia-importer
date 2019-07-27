const request = require('request');
const cheerio = require('cheerio');
const getSentences = require('./pagebodyfunctionalities/getSentences');
const getImage = require('./pagebodyfunctionalities/getImage');
const getCategory = require('./pagebodyfunctionalities/getCategory');
const getList = require('./pagebodyfunctionalities/getList');
const wikipedia = 'https://en.wikipedia.org/wiki/';
const Table = {}; // array of {paragraphs: , images: } objects 

const getInfoBox = (page) => { 
	const url = `${wikipedia}${page}`;
	request(url, (error, reponse, html) => {
		const $ = cheerio.load(html, {decodeEntities: false});
		const $content = $('div.mw-parser-output');
		$content.children('.infobox').each((i, el) => { 
			$el = $(el);
			console.log($.html($el));

		})
	})
}

getInfoBox('Nullifier_Party');
module.exports = getInfoBox;

