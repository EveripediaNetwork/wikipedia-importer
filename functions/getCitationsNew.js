const request = require('request');
const cheerio = require('cheerio');
const wikipedia = 'https://en.wikipedia.org/wiki/';
let citations = [];


const initialize = (page) => {
	url = `${wikipedia}${page}`;
	return new Promise((resolve, reject) => {
		request(url, (error, response, html) => {
			if (error) {
				reject(error);
			} else {
				resolve(cheerio.load(html))
			}

		})

	})
}  

const main = (page) => {
	var initializePromise = initialize(page);
	initializePromise.then( ($) => {
		const $refList = $('.reflist').last();
	 	$refList.find('.references .reference-text').each((i, el) => {
	 		const $el = $(el);
	 		const $urlCitation = $el.find('a[rel=nofollow]');
	 		const text = $urlCitation.text();
	 		const link = $urlCitation.attr('href');
	 		if(link != undefined) {
	 				// console.log(description);
	 				// console.log(link);
	 				// console.log('SUCCESS');
	 				// console.log('-----');
	 			let citation = {
	 				description: text,
	 				citation: link
	 			}
	 			// console.log('did push');
	 			citations.push(citation);
				console.log(citation);
				console.log('-----');
	 		}else{
	 				console.log($el.html());
	 				console.log('-----');
	 			}
		})
	 	return citations;
	});
}

// main('List_of_Presidents_of_the_United_States');

module.exports = main;


