const request = require('request');
//Commonly used variables
const format = 'format=json';
const wikiMedia = 'https://en.wikipedia.org/w/api.php?' //Default wikiMedia format


//WikiMedia API (https://www.mediawiki.org/wiki/API:Properties)
//https://en.wikipedia.org/w/api.php?
//action=parse&prop=title&rvprop=content&format=json&titles=Anarchism&rvslots=main

// export var getTitle = (page) => {
// 	const action = 'action=parse';
// 	const prop = 'prop=displaytitle';
// 	fetch(wikiMedia + action + '&' + prop + '&' + format + '&' + page)
// 	.then( wikiText => wikiText.json())
// 	.then(data => console.log(data.parse.displaytitle))
// };


const getTitle = (page) => {
	const format = 'format=json';
	const wikiMedia = 'https://en.wikipedia.org/w/api.php?' //Default wikiMedia format
	const action = 'action=parse';
	const prop = 'prop=displaytitle';
	var page = 'page=' + page;
	const url = wikiMedia + action + '&' + prop + '&' + format + '&' + page;
	const title = null;
	request(url, 
		(error, response, body) => {
			console.log(JSON.parse(body).parse.displaytitle);
			// this.title = JSON.parse(body.parse.displaytitle);
	})
	// return title;
}

getTitle('Anarchism');