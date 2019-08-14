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
//variable to build request endpoint 
const wikipedia = 'https://en.wikipedia.org/wiki/';

const newImport = async (page) => { 
	let page_title = await getTitle(page); //getTitle returns a promise -- await that promise 
	const url = `${wikipedia}${page}`;
	let articlejson = rp(url)
	.then(body => {
		//note that page_body and citations are computed together to account for internal citations 
		const pagebody = getPageBody(body, url); //page body and citations 
		return {
			page_title: page_title, 
			// main_photo: 
			infobox_html: getInfoBox(body),
			page_body: pagebody.sections,
			infoboxes: [],
			citations: pagebody.citations,
			media_gallery: []
			// amp_info: 
		}
	})
	return articlejson; //return promise 
}

const main = async (page) => {
	let articlejson = await newImport(page); //wait for promise to resolve 
	console.log(articlejson);
}

main('Anarchism');

//	if(!error & response.statusCode == 200) {

