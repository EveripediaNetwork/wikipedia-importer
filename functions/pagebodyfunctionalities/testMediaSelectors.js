const request = require('request');
const cheerio = require('cheerio');
const getMediaAttributes = require('./mediafunctions.js');
const wikipedia = 'https://en.wikipedia.org/wiki/';



const testMedia = (page) => { 
	const url = `${wikipedia}${page}`;
	request(url, (error, reponse, html) => {
		const $ = cheerio.load(html, {decodeEntities: false});
		$('img').each((i, el) => {
			$el = $(el);
			let url = $el.attr('src');
			if (url.length > 0) {
				let data = getMediaAttributes('https://upload.wikimedia.org/wikipedia/commons/c/c2/UB_downtown.jpg');
				console.log(data.citationcategorytype);
			}
		})
	})
}



