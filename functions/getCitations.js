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
			citations.push({
				url: $citation.find('a').attr('href'),
				attribution: 'rel=nofollow',
				category: "NONE",
				citation_id: i + 1, //i + 1 because default push is 0
				description: description,
				social_type: null,
				attribution: 'rel=nofollow',
				timestamp: getTimeStamp(),
				mime: 'None'
			})
		} 
		else { //else traverse biography (primary, secondary, tertiary sources to find citation)
			let citationStore = []; 
			//store citation identifiers that is present in the inital reflist 
			$reference.find('a').each( (i2, el2) => { 
				citationStore.push($(el2).attr('href')); //the href attr is the identifier 
			})

			if (citationStore.length == 0) {
				return //quick return if no citations exist
			}

			//traverse biography and compare citations to identifiers to identify the citation
			//in the biography
			$content.find('div .refbegin').each((i3, el3) => { //for each biography (i.e., primary, secondary, tertiary)  
				//once citations have been resolve (i.e., citationStore.length == 0)
				//quick return so that you do not waste time iterating 
				//through the rest of the biography 
				if (citationStore.length == 0) { 
					return 
				}
				$(el3).find('cite').each( (i4, el4) => { //for each citation
					if (citationStore.length == 0) { //again, quick return store is empty
						return 
					}
					for (i = 0; i < citationStore.length; i++) {
						if (citationStore[i] == '#' + $(el4).attr('id')) { //citation found in biography
							let description = parseText(el4, $);
							citations.push({
								url: '', //leave blank for now
								//don't know if you want to store ISBN in url attribute
								attribution: 'rel=nofollow',
								category: "NONE",
								citation_id: i + 1, 
								description: description,
								social_type: null,
								attribution: 'rel=nofollow',
								timestamp: getTimeStamp(),
								mime: 'None'
							})
						citationStore.splice(i, 1); //remove citation from citation store as it has 
						//been resolved 
						}
					}
				}) 
			}) 
		}
	}) 
	return citations; 
}

module.exports = getCitations;

//Note, I've now accounted for all types of citations (e.g., urls, books, journals etc.) 
//you can implement a getCategoryCitationType function for the return citations
//As of now I simply leave CategoryCitationType as "NONE"

