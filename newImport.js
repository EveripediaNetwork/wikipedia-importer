const request = require('request');
//functions
const getTitle = require('./functions/getTitle');



const getWiki = async (page) => {
	let title = await getTitle(page);
	console.log(title);
	


	// getTitle(page).then(result => 		
	// 	let output = {
	// 	page_title: result,
	// 	main_photo: null,
	// 	infobox_html: null,
	// 	page_body: null,
	// 	infoboxes: null,
	// 	citations: null,
	// 	media_gallery: null,
	// 	metadata: null
	// 	})
	// 	return output)




		
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
}
const testImport = (page) => {
	getWiki(page)
	.then (wiki => console.log(wiki));
}

getWiki('Anarchism');
//WikiMedia API (https://www.mediawiki.org/wiki/API:Properties)
//https://en.wikipedia.org/w/api.php?
//action=parse&prop=title&rvprop=content&format=json&titles=Anarchism&rvslots=main
//https://en.wikipedia.org/w/api.php?action=parse&prop=categories&format=json&page=Anarchism
// const wikiMedia = 'https://en.wikipedia.org/w/api.php?' //Default wikiMedia format

// if no infobox and no inline_image (main_photo is set to first section image)
// main_photo = images.reverse().pop
// main_photo.type = 'main_photo';
