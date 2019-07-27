const request = require('request');
//Commonly used variables
const wikiMedia = 'https://en.wikipedia.org/w/api.php?' //Default wikiMedia format

const getWiki = (page) => {
	return {
		page_title: null,
		main_photo: null,
		infobox_html: null,
		page_body: null,
		infoboxes: null,
		citations: null,
		media_gallery: null,
		metadata: null
	}
}
console.log(getWiki(page));

//WikiMedia API (https://www.mediawiki.org/wiki/API:Properties)
//https://en.wikipedia.org/w/api.php?
//action=parse&prop=title&rvprop=content&format=json&titles=Anarchism&rvslots=main
//https://en.wikipedia.org/w/api.php?action=parse&prop=categories&format=json&page=Anarchism
