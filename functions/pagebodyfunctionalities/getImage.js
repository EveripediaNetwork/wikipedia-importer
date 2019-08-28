const request = require('request');
const cheerio = require('cheerio');
const getSentences = require('./getSentences'); //need to patch getSentences for this code 
const getMediaAttributes = require('./mediafunctions.js');
const getTimeStamp = require('./getTimeStamp');
const wikipedia = 'https://en.wikipedia.org/wiki/';    
// important global variable
let url = '';

const cleanURL = (string) => {
	//need to add https: 
	//need to remove text after last '/' character 
	//need to remove '/thumb'
	let url = 'https:' + string; //create image url 
	url = url.replace('thumb/', '');
	let i = (url.length - 1); 
	while(url.charAt(i) !== '/') {
		if (i == 0) {
			return string; // safety if cleaning fucntion dosent work 
		}
		i--;
	}
	url = url.substring(0, i);
	return url; 
}

const getImage = (element, $) => { 
	let $el = $(element);
	let $thumbinner = $el.find('.thumbinner');
	let $img = $thumbinner.find('img'); 
	let src = $img.attr('src');
	let $thumbcaption = $el.find('.thumbcaption');
	if ($thumbinner.length > 0 && $thumbcaption.length > 0) { 
		url = cleanURL(src);
		if (!url.includes('.jpg') && !url.includes('.png')) { //prevent edge case
			url = 'https:' + src;
		}
		let attributes = getMediaAttributes(url);
		return {
			type: 'section_image',
			url: url,
			caption: getSentences($thumbcaption, $),
			mime: attributes.mime,
			category: attributes.citationcategorytype,
			timestamp: getTimeStamp(),
		}
	}
		src = $el.attr('src');
		url = cleanURL(src);
		if (!url.includes('.jpg') && !url.includes('.png')) { //prevent edge case
			url = 'https:' + src;
		}
		return url;
}


module.exports = getImage;