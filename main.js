//important packages 
const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');
//functions 
const getTitle = require('./functions/getTitle');
const getPageBody = require('./functions/getPageBody');
const getInfoBox = require('./functions/getInfobox_html');
const getMetaData = require('./functions/getMetaData');
const getCitations = require('./functions/getCitations');


//commonly used variables 
const wikipedia = 'https://en.wikipedia.org/wiki/';



const newImport = async (page) => { 
	let page_title = await getTitle(page); //getTitle returns a promise -- await that promise 
	const url = `${wikipedia}${page}`;
	let articlejson = rp(url)
	.then(body => {
		return {
			page_title: page_title, 
			// main_photo: 
			// infobox_html:
			page_body: getPageBody(body),
			// infoboxes: 
			// citations: getCitations(body)
		}
	})
	return articlejson; //return promise 
}



const main = async (page) => {
	let articlejson = await newImport(page); //wait for promise to resolve 
	console.log(articlejson);
}


main('List_of_presidents_of_the_United_States');


	// return x = {
	// 	page_title: title,
	// 	main_photo: null,
	// 	infobox_html: null,
	// 	page_body: null,
	// 	infoboxes: null,
	// 	citations: null,
	// 	media_gallery: null,
	// 	metadata: null
	// }