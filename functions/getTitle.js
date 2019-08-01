const request = require('request');
//Commonly used variables
const format = 'format=json';
const wikiMedia = 'https://en.wikipedia.org/w/api.php?' //Default wikiMedia format

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