//This folder contains functionalities to derive Media Object attributes
//Functions here are taken directly from Travis Moore and Kedar Iyer's code 
//with some minor adjustments to fit my code 
//Thanks  

const VALID_VIDEO_EXTENSIONS = [
    '.mp4',
    '.m4v',
    '.flv',
    '.f4v',
    '.ogv',
    '.ogx',
    '.wmv', 
    '.webm',
    '.3gp',
    '.3g2',
    '.mpg',
    '.mpeg',
    '.mov',
    '.avi'
];

const VALID_AUDIO_EXTENSIONS = ['.mp3', '.ogg', '.wav', '.m4a'];

const mime = require('mime'); 
// mime.getType and mime.getExtension are the functions we will use 

const getMediaAttributes = (url) => {
	//get mime and extension types 
	let theMIME = mime.getType(url);
	let theExtension = mime.getExtension(theMIME);
	let citationcategorytype = 'NONE'; //instantiate categorycitationtype

	// Determine category
    if (getYouTubeIdIfPresent(url)) {
        citationcategorytype = 'YOUTUBE';
    } else if (theMIME == '' || theMIME == null) {
        citationcategorytype = 'NONE';
    } else if (theMIME == 'image/gif') {
        citationcategorytype = 'GIF';
    } else if (theMIME && theMIME.indexOf('image') >= 0) {
        citationcategorytype = 'PICTURE';
    } else if (VALID_VIDEO_EXTENSIONS.includes(theExtension) || VALID_VIDEO_EXTENSIONS.includes("." + theExtension)) {
        citationcategorytype = 'NORMAL_VIDEO';
    } else if (VALID_AUDIO_EXTENSIONS.includes(theExtension) || VALID_VIDEO_EXTENSIONS.includes("." + theExtension)) {
        citationcategorytype = 'AUDIO';
    } else return 'NONE'

    return {
    	mime: theMIME,
    	extension: theExtension,
    	citationcategorytype: citationcategorytype
    }
}

function getYouTubeID(url) {
    if (!/youtu\.?be/.test(url)) return false;

    // Look first for known patterns
    var patterns = [
        /youtu\.be\/([^#\&\?]{11})/, // youtu.be/<id>
        /\?v=([^#\&\?]{11})/, // ?v=<id>
        /\&v=([^#\&\?]{11})/, // &v=<id>
        /embed\/([^#\&\?]{11})/, // embed/<id>
        /\/v\/([^#\&\?]{11})/ // /v/<id>
    ];

    // If any pattern matches, return the ID
    for (let i = 0; i < patterns.length; ++i) {
        if (patterns[i].test(url)) {
            return patterns[i].exec(url)[1];
        }
    }
    return false;
}

// Get the YouTube ID from a URL
const getYouTubeIdIfPresent = (inputURL) => {
    try {
        // Also handle image URLs
        inputURL = inputURL.replace('https://i.ytimg.com/vi/', 'https://youtu.be/').replace('/hqdefault.jpg', '');

        // Get the ID
        let result = getYouTubeID(inputURL);

        // Return the YouTube ID string
        return result ? result : false;
    } catch (e) {
        return false;
    }
}

module.exports = getMediaAttributes;


