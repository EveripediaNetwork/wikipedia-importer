const request = require('request');
const cheerio = require('cheerio');
const getSentences = require('./pagebodyfunctionalities/getSentences');
const getTimeStamp = require('./pagebodyfunctionalities/getTimeStamp');

const wikipedia = 'https://en.wikipedia.org/wiki/';
let citations = [];
let index = 1; //citation_id
let defaultDescription = [
			{
			index: 0,
			text: "The original version of this page is from Wikipedia, you can edit the page right here on Everipedia.",
			type: "sentence"
			},
			{
			index: 1,
			text: "Text is available under the Creative Commons Attribution-ShareAlike License.",
			type: "sentence"
			},
			{
			index: 2,
			text: "Additional terms may apply.",
			type: "sentence"
			},
			{
			index: 3,
			text: "See everipedia.org/everipedia-termsfor further details.",
			type: "sentence"
			},
			{
			index: 4,
			text: "Images/media credited individually (click the icon for details).",
			type: "sentence"
			}]

const getCitations = (page) => {
	const url = `${wikipedia}${page}`;
	//default push 
	citations.push({
		url: url,
		attribution: 'rel=nofollow',
		category: "NONE",
		description: defaultDescription,
			social_type: null,
		 	attribution: 'rel=nofollow',
		 	timestamp: getTimeStamp(), 
		 	mime: 'None'

	})
	request(url,
	 (error, response, html) => {
	 	if(!error & response.statusCode == 200) {
	 		const $ = cheerio.load(html, {decodeEntities: false});
	 		//Note we want to find the last "class=reflist" tag to get the list of references
	 		const $refList = $('.reflist').last();
	 		let typesOfCitations = [];
	 		$refList.find('.references .reference-text .citation').each((i, el) => {
				const $el = $(el);
				const $urlCitation = $el.find('a[rel=nofollow]');
				const descripton = $urlCitation.text();
				const link = $urlCitation.attr('href');
				if(link != undefined) {
					let citation = {
		 				url: link,
		 				thumb: null,
		 				description: getSentences($urlCitation, $),
		 				category: 'NONE', //getCitationCategoryType(el, $),
		 				citation_id: index,
		 				social_type: null,
		 				attribution: 'rel=nofollow',
		 				timestamp: getTimeStamp(), 
		 				mime: 'None',
		 			}
		 		index++;
		 		citations.push(citation);
	 			}
	 		})
	 	return citations;
		}
	})
}

