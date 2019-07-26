const request = require('request');
import { getTitle } from './functions/getTitle';
const fetch = require('node-fetch');
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

//good article on promises: https://medium.com/dev-bits/writing-neat-asynchronous-node-js-code-with-promises-32ed3a4fd098

//WikiMedia API (https://www.mediawiki.org/wiki/API:Properties)
//https://en.wikipedia.org/w/api.php?
//action=parse&prop=title&rvprop=content&format=json&titles=Anarchism&rvslots=main
//https://en.wikipedia.org/w/api.php?action=parse&prop=categories&format=json&page=Anarchism
