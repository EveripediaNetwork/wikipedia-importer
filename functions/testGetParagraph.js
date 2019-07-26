const request = require('request');
const cheerio = require('cheerio');
const wikipedia = 'https://en.wikipedia.org/wiki/';
const sections = [];

var tokenizer = require('sbd');

var optional_options = {};
var text = "On Jan. 20, former Sen. Barack Obama became the 44th President of the U.S. Millions attended the Inauguration.";
var sentences = tokenizer.sentences(text, optional_options);
var options = {
    "newline_boundaries" : false,
    "html_boundaries"    : false,
    "sanitize"           : false,
    "allowed_tags"       : ['a'],
    "preserve_whitespace" : false,
    "abbreviations"      : null
};

var sanitizeHtml = require('sanitize-html');

var dirty = 'some really tacky HTML';
var clean = sanitizeHtml(dirty);
clean = sanitizeHtml(dirty, {
  allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
  allowedAttributes: {
    'a': [ 'href' ]
  },
  allowedIframeHostnames: ['www.youtube.com']
});



const getPageBody = (page) => { 

	const url = `${wikipedia}${page}`;
	request(url, (error, reponse, html) => {
		const $ = cheerio.load(html);
		$('table tbody tr ul li').remove();
		
		const $body = $('body');
		const $content = $body.find('#content');
		const $bodycontent = $content.find('#bodyContent');
		const $mw = $bodycontent.find('#mw-content-text');
		const $parser = $mw.find('.mw-parser-output');
		const paragraphs = [];
		const images = [];
		let index = 0; //paragraph index
		//Extract Headings 
		//everytime you hit a new h tag create a new Section
		//everytime you hit a new p tag create new paragraph 
		//Extract Paragraphs 
		console.log($parser.html());
	
		// $parser.find('p').each((i, el) => {
			
		// 	// let dirty = sanitizeHtml($(el).html());
		// 	// clean = sanitizeHtml(dirty, {
 	// 	// 		 allowedTags: [ 'a' ],
 	// 	// 		 allowedAttributes: {
  //  // 					 'a': [ 'href']
  // 	// 			},
  // 	// 			allowedIframeHostnames: ['www.youtube.com']
		// 	// });
		// 		let text = $(el).html();
		// 		console.log(text);
		// 		let t = 0;
		// 		let flag = false;
		// 		while (t < text.length) {
		// 			if (text.charAt(t) != " ") {
		// 				flag = !flag;
		// 			}
		// 			t++;
		// 		}
		// 		if (flag) {
		// 			let sentences = tokenizer.sentences($(el).html(), options);
		// 			console.log(sentences);
		// 		}
		
			
			

		// 	$el = $(el);
		// 	if ($el[0].name == 'p') {
				
		// 		console.log($el.prop('tagName'));
		// 		console.log($el.html());
		// 		console.log('--------');
		// 	}
		// })
	})
}

getPageBody('List_of_Presidents_of_the_United_States');