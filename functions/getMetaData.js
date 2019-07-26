const request = require('request');

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
	key: "page_type",
	value: 'Thing'
},
{
	key: "page_type",
	value: 'Thing'
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
},
{
	key: "page_lang",
	value: "en"
}
];

async function getMetaData(page) {
	//Create and append creation_timestamp

	let d = new Date();
	let month = d.getUTCMonth();
	let day = d.getUTCDate();
	let year = d.getUTCFullYear();
	let hour = d.getUTCHours();
	let minutes = d.getUTCMinutes();
	let seconds = d.getUTCSeconds();
	let term = 'AM';
	if (hour >= 12) {
		term = 'PM';
	}
	let creationtime = month + '/' + day + '/' + year + ' ' + hour + ':' + minutes + ':' + seconds + ' ' + term + ' ' + 'UTC';
	metaData.push({key: 'creation_timestamp', value: creationtime});

	//get and append last_modified ??
	metaData.push({key:'last_modified', value: null}); //null because it was just created 

	//get and append url_slug
	let titles = '&titles=' + page;
	let MediaWiki = "https://en.wikipedia.org/w/api.php?action=query&prop=info&inprop=url&format=json" + titles;
	let data = await doRequest(MediaWiki);
	let url = Object.values(data.query.pages)[0].fullurl;
	let slug = '';
	//compute slug from url
	let i = 30;
	while (i < url.length) {
		slug += url.charAt(i);
		i++;
	}
	metaData.push({key: 'slug', value: slug});


	//url_slug_alternate?
}

getMetaData('Anarchism');



// export type DiffType = 'add' | 'delete' | 'none';

// Valid Metadata keys
    //page_lang?: string;
    //page_type?: string; //default to Thing with a capital T
    //is_removed?: boolean;
    //is_adult_content?: boolean;
    //creation_timestamp?: Date;
    //last_modified?: Date;
    //url_slug?: string;
    //url_slug_alternate?: string;
    //sub_page_type?: string;
    //is_wikipedia_import?: boolean;
    //is_indexed?: boolean;
    //bing_index_override?: boolean;
    //is_locked?: boolean;
    //ipfs_hash: string;
// Valid Metadata keys for diffs only:
    //old_hash: string;
    //new_hash: string;
    //proposal_id: number;
    //diff_changes: number; # Number of entities changed by the diff
    //diff_percent: number; # Percentage of document changed by diff
