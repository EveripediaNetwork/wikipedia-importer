const getImage = require('./pagebodyfunctionalities/getImage');


const getMainPhoto = (html) => {

	//No main photo was found. 
	//return place holder:
	return {
		url: 'https://epcdn-vz.azureedge.net/static/images/no-image-slide-big.png',
		captions: null,
		thumb:'https://epcdn-vz.azureedge.net/static/images/no-image-slide.png',
		type: 'main_photo' 
	}
}


module.exports = getMainPhoto;

