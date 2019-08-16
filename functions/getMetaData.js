const request = require('request');
let encodeUrl = require('encodeurl'); 
const getTimeStamp = require('./pagebodyfunctionalities/getTimeStamp');

const doRequest = (MediaWiki) => {
 	return new Promise(function (resolve, reject) {
    	request(MediaWiki, function (error, res, body) {
      	if (!error && res.statusCode == 200) {
      	  resolve(JSON.parse(body));
     	 } else {
       	 reject(error);
      }
    });
  });
}

let metaData = 
[ 
{
	key: "page_type",
	value: 'Thing'
},
{
	key: "is_removed",
	value: false
},
{
	key: "is_adult_content",
	value: false
},
{
	key: "sub_page_type",
	value: null
},
{
	key:"is_wikipedia_import",
	value: true
},
{
	key:"is_indexed",
	value: false
},
{
	key:"bing_index_override",
	value: true
},
{
	key:"is_locked",
	value: false
}
];

async function getMetaData(page) {
	//Create and append creation_timestamp
	let creationtime = getTimeStamp();
	metaData.push({key: 'creation_timestamp', value: creationtime});
	metaData.push({key:'last_modified', value: null}); //null because it was just created 
	//get and append url_slug
	let titles = '&titles=' + page;
	let MediaWiki = "https://en.wikipedia.org/w/api.php?action=query&prop=info&inprop=url&format=json" + titles;
	let data = await doRequest(MediaWiki);

	let page_lang = Object.values(data.query.pages)[0].pagelanguage;
	//append page_lang;
	metaData.push({key: 'page_lang', value: page_lang});
	//compute and append slug and url_slug_alternate
	let url = Object.values(data.query.pages)[0].fullurl;
	let slug = '';
	//compute slug from url
	let i = 30;
	while (i < url.length) {
		slug += url.charAt(i);
		i++;
	}
	metaData.push({key: 'slug', value: slug});
	metaData.push({key:'url_slug_alternate', value: encodeUrl(slug)});
	return metaData
}

module.exports = getMetaData;
