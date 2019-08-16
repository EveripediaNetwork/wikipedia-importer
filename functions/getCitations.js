const cheerio = require('cheerio');
const parseText = require('./pagebodyfunctionalities/textParser');
const getTimeStamp = require('./pagebodyfunctionalities/getTimeStamp');

const wikipedia = 'https://en.wikipedia.org/wiki/';
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

const getCitations = (html, url) => { 
	const $ = cheerio.load(html, {decodeEntities: false});
	let citations = []; //instatiate return object - stores all citation objects 
	//store {key, value} pair objects for O(1) access to determine internal citations
	//where key == citationId, and value == url   
	let internalCitations = {};  
	//default push 
	citations.push({
		url: url, //references the specific wikipedia page 
		category: "NONE",
		citation_id: 0,
		description: defaultDescription,
		social_type: null,
	 	attribution: 'rel=nofollow',
	 	timestamp: getTimeStamp(), 
	 	mime: 'None'
	})

	const $content = $('div.mw-parser-output'); //page content
	const $refList = $content.find('.reflist').last().find('ol'); //get the list of references
	
	$refList.children('li').each( (i, el) => { //for each reference
		let $reference = $(el).find('.reference-text'); 
		let $citation = $reference.find('.citation'); //specific citation
		
		if ($citation.length > 0) { //if the citation is immediately present
			let description = parseText($citation, $);
			let cur = { //current citation
				url: $citation.find('a').attr('href'),
				attribution: 'rel=nofollow',
				category: "NONE",
				citation_id: i + 1, //i + 1 because default push is 0
				description: description,
				social_type: null,
				attribution: 'rel=nofollow',
				timestamp: getTimeStamp(),
				mime: 'None'
			}
			let key = i+1;
			internalCitations[key] = cur.url;
			citations.push(cur);
			
		} 
		else { //else traverse biography (primary, secondary, tertiary sources to find citation)
			//and compare citations to identifiers to identify the citation in the biography
			let found = false; 
			$content.find('div .refbegin').each((i3, el3) => { //for each biography (i.e., primary, secondary, tertiary)  
				let a = $reference.find('a').attr('href')
				$(el3).find('cite').each( (i4, el4) => { //for each citation
					if (a == '#' + $(el4).attr('id')) { //citation found in biography
						let description = parseText(el4, $);
						//type of citation = $(el4).attr('class'); (e.g, journal, book etc..)
						let url = '';
						$(el4).find('a').each((i5, el5) => {
							let $el5 = $(el5);
							if ($el5.attr('class') == "external text") {
								url = $el5.attr('href');
							}
						})
						if ( url == undefined ) {
							url == '';
						}
						let cur = {
							url: url, //leave blank for now
							//don't know if you want to store ISBN in url attribute
							attribution: 'rel=nofollow',
							category: "NONE",
							citation_id: i + 1, 
							description: description,
							social_type: null,
							attribution: 'rel=nofollow',
							timestamp: getTimeStamp(),
							mime: 'None'
						}
						citations.push(cur);
						internalCitations[i+1] = cur.url;
						found = !found;
						return
					}
					if (found) { //quick break to stop iterating if citation has been found in biography
						return
					}
				}) 
			}) 
		}
	}) 
	return {
		citations: citations,
		internalCitations: internalCitations //map passed to textParser for instant internal citation lookup
	}; 
}

module.exports = getCitations;

//Note, I've now accounted for all types of citations (e.g., urls, books, journals etc.) 
//you can implement a getCategoryCitationType function for the return citations
//As of now I simply leave CategoryCitationType as "NONE"

