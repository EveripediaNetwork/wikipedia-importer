const request = require('request');
const rp = require('request-promise');

//Commonly used variables
const format = 'format=json';
const wikiMedia = 'https://en.wikipedia.org/w/api.php?' //Default wikiMedia format

const getTitle = async (page) => {
	const format = 'format=json';
	const wikiMedia = 'https://en.wikipedia.org/w/api.php?' //Default wikiMedia format
	const action = 'action=parse';
	const prop = 'prop=displaytitle';
	var page = 'page=' + page;
	const url = wikiMedia + action + '&' + prop + '&' + format + '&' + page;
	let title = rp(url)
					.then(body => JSON.parse(body).parse.displaytitle);
	return title;
}



getTitle('Anarchism');

module.exports = getTitle;

