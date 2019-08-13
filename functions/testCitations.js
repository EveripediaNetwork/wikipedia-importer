const cheerio = require('cheerio');
const rp = require('request-promise'); 
const wikipedia = 'https://en.wikipedia.org/wiki/';
const page = 'Anarchism';

const testCitations = (url) => {
	const destination = `${wikipedia}${page}${url}`;
	rp(destination).then(body => console.log(body));
}

testCitations('#CITEREFDirlik1991');