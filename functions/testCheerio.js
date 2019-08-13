const cheerio = require('cheerio');
const sections = [];
const getSentences = require('./pagebodyfunctionalities/getSentences');
const tableContentParsers = require('./pagebodyfunctionalities/tablefunctionalities/tableContentParsers');

const testCheerio = () => {
	const $ = cheerio.load(`
	<td>
		<b> 
			<big>
				<a href=''> Donald Trump </a>
			</big>
		</b>
		<br>
		"Born 1946"
		<br>
		<small> 
			<i> 
				"("
				<span></span>
				"73 years old"
			</i>
		</small>
		<sup>
			<a>131</a> 
		</sup>
		<sup>
			<a>130</a> 
		</sup>
	</td>`, {decodedEntities: false});

	let $body = $('body big a');
	// console.log($.html($body.empty().append('hi')));


	// $(body).contents().each( (i, el) => {
	// 	let item = tableContentParsers.notNestedContent( el, $ );
	// 	console.log(item);
	// })
}


testCheerio();

