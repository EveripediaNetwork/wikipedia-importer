//infobox
//inline
const request = require('request');
const cheerio = require('cheerio');
const getImage = require('./pagebodyfunctionalities/getImage');
const wikipedia = 'https://en.wikipedia.org/wiki/';
// const $mainPhoto = $('.main-photo-wrap img.main-photo'); 

const getMainPhoto = (page) => {
	const url = `${wikipedia}${page}`;
	request(url, (error, reponse, html) => {
		const $ = cheerio.load(html, {decodeEntities: false});
		const $content = $('div.mw-parser-output');
		const $infobox = $content.find('infobox'); 
		if ($infobox.length > 0) { //check info_box for main_photo
			const $img = $infobox.find('img');
			if ($img.length > 0) {
				let img = getImage($img, $);
				return {
					url: img.url,
					citations: img.citations,
					type: 'main_photo'
				}
			}
		}
		let img = $content.find('inline-image');
		else if (if img.length > 0 ) { //use inline-img as main_photo
			let img = getImage($img, $);
			return {
				url: img.url,
				captions: img.captions,
				type: main_photo
			} 
		else { //No main photo was found. 
			//return place_holder:
			return {
				url: 'https://epcdn-vz.azureedge.net/static/images/no-image-slide-big.png',
				captions: null,
				type: main_photo 
			}
		}
	} 



		//Next check inline-image for main_photo


		// const $mainPhoto = $('.main-photo-wrap img.main-photo'); 
		console.log($.html($mainPhoto));
		// let $infobox = $content.find('infobox');
		// if ($infobox.length > 0) {
		// 	$infobox.find('img');
		// } 
	})
}

getMainPhoto('Holland'); 
module.exports = getMainPhoto;

