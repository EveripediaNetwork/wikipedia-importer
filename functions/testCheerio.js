const cheerio = require('cheerio');
const sections = [];

const testCheerio = () => {
	
		const $ = cheerio.load(`
<small>
	<i>
		"("
		<span class="currentage">data</span>
		"73 years old)"
	</i>
</small>
`);

//How should the above html cell data be formated? 
		
		$('span').each((i,el) => {
			console.log($(el).data());

		})

		// console.log($content.text() == '');
		// $content.contents().each((i, el) => {
		// 	$el = $(el);
		// 	console.log('--------');
		// 	console.log($.text($el));
		// 	console.log('--------');

		// })
	
		// console.log($content.children().length)
		// $content.children.each((i, el) => {
		// 	$el = $(el);
		// 	if ($el.children.length > 0) {
		// 		console.log($el.children.length());
		// 	} else {
		// 		console.log(0);
		// 	}


		// })


		// console.log($content[0].name);
		// console.log($content.html());

		// console.log($content.nextAll().length());
		
	

		// data = $.html();

		// console.log(data.split(""));
		// let char = 'a';
		// console.log(char.match(/[a-z]/i));


		// $('.entry-content').find('h3').each((i, el) => {
		// 	let cur = $(el);
		// 	let next = cur.next();
		// 	console.log(next[0].name);

		// })
	// 	const $class = $('.entry-content');

	// $class.find('h4').each((i, el) => {
	// 		console.log($(el).html());
	// });


// 		const data = $.parseHTML(`
// <h4>testing</h4>
// <div class="entry-content">
// <h4>today's date etc etc</h4>
//     <h3>category name 1</h3>
//     <p>
//         <img class="aligncenter" src="img_1.png" alt="" />
//     </p>
//     <div></div>
//     <p>
//         <img class="aligncenter" src="img_2.png" alt="" />
//     </p>
//     <div></div>
//     <h4>today's date etc etc</h4>
//     <h3>category name 2</h3>
//     <p>
//         <img class="aligncenter" src="img_3.png" alt="" />
//     </p>
//     <div></div>
//     <h4>today's date etc etc4</h4>
//     <h3>category name 3</h3>
//     <p>
//         <img class="aligncenter" src="img_4.png" alt="" />
//     </p>
//     <div></div>
// </div>`);
// 		console.log(data);
		// const data = $('h4').toArray();
		// console.log(data.length);
		// let i = 0;
		// while (i < data.length) {
		// 	console.log($(data[i]).html());
		// 	i++;
		// }
	

}

testCheerio();

