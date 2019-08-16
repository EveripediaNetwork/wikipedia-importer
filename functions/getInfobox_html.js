const cheerio = require('cheerio');
const getTable = require('./pagebodyfunctionalities/tablefunctionalities/getTable');
const wikipedia = 'https://en.wikipedia.org/wiki/';
const Table = {}; // array of {paragraphs: , images: } objects 

const getInfoBox = (html) => { 
	const $ = cheerio.load(html, {decodeEntities: false});
	const $content = $('div.mw-parser-output');
	const $table = $content.find('.infobox');
	if ($table.length > 0) {
		return getTable($table, $);
	}
	return null
}

module.exports = getInfoBox;

