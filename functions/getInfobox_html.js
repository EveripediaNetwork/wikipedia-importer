const request = require('request');
const cheerio = require('cheerio');
const getTable = require('./pagebodyfunctionalities/getTable');
const wikipedia = 'https://en.wikipedia.org/wiki/';
const Table = {}; // array of {paragraphs: , images: } objects 

//To find main_photo 
//first look for picture in info box 
//If that doesn't exists, find and inline_img to represent the main_photo


const getInfoBox = (page) => { 
	const url = `${wikipedia}${page}`;
	request(url, (error, reponse, html) => {
		const $ = cheerio.load(html, {decodeEntities: false});
		const $content = $('div.mw-parser-output');
		let $table = $content.find('.infobox'); 
		if ($table.length == 0) { //page does not contain info_box 
			return {};
		}
		return getTable.getTable($table, $); 
	})
}

getInfoBox('Nullifier_Party');
module.exports = getInfoBox;

