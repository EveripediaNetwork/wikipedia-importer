const request = require('request');
const cheerio = require('cheerio');
const wikipedia = 'https://en.wikipedia.org/wiki/';
let citations = [];


const getCitations = (page) => {
	const url = `${wikipedia}${page}`;
	request(url,
	 (error, response, html) => {
	 	if(!error & response.statusCode == 200) {
	 		const $ = cheerio.load(html);
	 		//Note we want to find the last "class=reflist" tag to get the list of references
	 		const $refList = $('.reflist').last();
	 		$refList.find('.references .reference-text').each((i, el) => {
	 			const $el = $(el);
	 			const $urlCitation = $el.find('a[rel=nofollow]');
	 			const text = $urlCitation.text();
	 			const link = $urlCitation.attr('href');
	 			if(link != undefined) {
	 				// console.log(description);
	 				// console.log(link);
	 				// console.log('SUCCESS');
	 				// console.log('-----');
	 				let citation = {
	 					description: text,
	 					citation: link
	 				}
	 				// console.log('did push');
	 				citations.push(citation);
	 				console.log(citation);
	 				console.log('-----');
	 			}
	 			else{
	 				console.log($el.html());
	 				console.log('-----');
	 			}
	 		})
	 			// return citations;
	 	} else {
	 		console.log('invalid request');
	 	}
	})
	
}
getCitations('Mongolia');



// //Works with setTimeOut --> need to get it to work with promises/async await
// // getCitations('List_of_Presidents_of_the_United_States');
// // setTimeout(() => console.log(citations), 3000);
// getCitations('List_of_Presidents_of_the_United_States');
// setTimeout(() => console.log(citations), 3000);

// // const promise = new Promise((resolve, reject) => {
// // 	getCitations('List_of_Presidents_of_the_United_States');
// // });



// // promise
// // .then((res) => console.log(citations));
// console.log(promise);

// .then(data => {
// 	console.log(data);
// })
// .then(data => setTimeout(() => console.log(citations), 1000))



//Diff pages to test
//List_of_Presidents_of_the_United_States

//Types of Citations
//Url -> <cite class="citation web"> <a>
//books -> <a href ="#CIT" > Craig 2005 </a> ", p.& nbsp; 14" (e.x. from Anarchism)
//Citation Journals -> <cite class = "citation journal">