const request = require('request');
const cheerio = require('cheerio');
const wikipedia = 'https://en.wikipedia.org/wiki/';
const table = {};
const rows = [];
const cells = [];
const cellcontent = [];

//Implementation:
//For each <Table class = wikitable | body-table>
//For each <tr> tag create table row 
//For each table row create an array of table cells (th | td elements)
//For each cell create an array of NestedContentItems

async function getTable(page) { 
	const url = `${wikipedia}${page}`;
	request(url, (error, reponse, html) => {
		const $ = cheerio.load(html);
		const $content = $('div.mw-parser-output');
		
		//note: only care about tables with class="wikitable" | class="body-table"
		$content.find('.wikitable, .body-table').each((i, el) => { //for each table 
			let $table = $(el); 
			let tabletype = $table[0].name;
			let tableAttrs = {}; 
			let tableBody = {
				attrs: {},
				rows: []
			}
			$table.find('tr').each((i2, el2) => { //for each row
				// let rowIndex = i2;
				// let rowAttrs = {};
				// let rowTag = 'tr';
				// let rowCells = []; 
				let $row = $(el2);
				$row.find('td, th').each((i3, el3) => { //for each cell
					let $cell = $(el3);
					let cellcontent = [];
					// let cellIndex = i3;
					// let cellAttrs = {};
					// let tag_type = $cell[0].name;
					$cell.contents().each((i4, el4) => { //each piece of content inside of a cell
						let cellContentItem = await recursiveNestedContent(el4, $(el4).text(), $); //return a cellcontentitem in the cell content array 
						//(use await)
						//The text is the text whole text of the specific Content Item within the cell
						cellcontent.push(cellContentItem);
					})
					//right before you go onto the next iteration of the row.each loop
					//append the cell to the cells array;
				})
				//right before you go onto the next iteration of the table.each loop 
				//append the row to rows;
			})
			setTimeout(() => { console.log(cellcontent)}, 3000);
			return false;
			//right before you go onto the next iteration of the table.each loop
			//append the table as a pageItem in a paragraph;
		})
	})
}

// construct NestedContentItems
async function recursiveNestedContent(element, text, $) { //element
	const elementType = element.type;
	const $element = $(element);
	const elementTag = $element[0].name;
	//check type or children.length or both? 
	//check type
	if($element.children.length == 0) { //base case 
		if(elementType == 'text') { //Base case - NestedTextItem
			return {
				type: 'text', 
				content: [{type: 'sentence', index: 0, text: text}]
				//Sentence[]; Sentence = {index, text, type};
			}
		} else if (elementType == 'tag') { //NestedContentItem
			if (elementTag == 'a') {
				let wikiLink = '';
				const linkText = $(element).text(); 
				//get slug 
				const hrefAttr = $(element).attr('href');
				let index = 6;
				let slug = ''; 
				while(index < hrefAttr.length) { 
					slug += hrefAttr.charAt(index); 
					index++; 
				}
				wikiLink = '[[LINK|lang_en|' + slug + '|' + linkText + ']]';
				//return NestedTextItem 
				return {
					type: 'text',
					content: [{type: 'sentence', index: 0, text: wikiLink}]
				}
			}
			else if (elementTag == 'br') {//nestedTagItem
				return {
					attrs: {},
					contents: [], 
					tag_class: "void",
					tag_type: 'br',
					type: "tag"
				}
			} else {
				let output =
				{
					type: 'text',
					content: [{type: 'sentence', index: 0, text: text}]
				}
				return output
			}
		}
	}
	else { //element.children.length > 0 //recursive case
		let contentText = text; //ultimately when you get down to base case this will be the text of the NestedTextItem
		let content = []; //Array of NestedContentItems (ie NestedTextItems or NestedTagItems)
		//await this
		$(element).contents().each((i5, el5) => {
			let nestedContentItem = await recursiveNestedContent(el5, $(el5).text(), $);
			content.push(nestedContentItem);
		})
		return {
			type: 'tag',
			tag_type: $(element)[0].name,
			// tag_class:
			// attrs: {}
			content: content
		}
	}
}
getTable('List_of_United_States_Presidents');

function doRequest(page) {
	const url = `${wikipedia}${page}`;
 	return new Promise(function (resolve, reject) {
    	request(url, function (error, res, html) {
      	if (!error && res.statusCode == 200) {
      	  resolve(html);
     	 } else {
       	 reject(error);
      }
    });
  });
}


async function main() {
  let html = await doRequest(url);
  let $ = cheerio.load(html);
  
}


