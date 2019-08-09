// Naive getTable in a sense that it does not build nested content recursively. 
// No tag nesting

const getSentences = require('./getSentences');
const cleanAttributes = require('./getAttributes');
const getTagClass = require('./getTagClass');

//challenge: parseSentences through html 
//going to have to check for undefined return values as well 
//example challenge 
// <td>
// 	<b> 
// 		<big>
// 			<a href=''> Donald Trump </a>
// 		</big>
// 	</b>
// 	<br>
// 	"Born 1946"
// 	<br>
// 	<small> 
// 		<i> 
// 			"("
// 			<span>
// 			"73 years old"
// 		</i>
// 	</small>
// 	<sup>
// 		<a>131</a> 
// 	</sup>
// 	<sup>
// 		<a>130</a> 
// 	</sup>
// </td>

//if element of type tag => getSentences(); 
//if type text return type: 'text', content: element.text().trim();
//Recurse down until no children; 
//if parent >= 'td' //nested tagItem (only for children with length 0);
//what about tagNestedContent Item? 

//No Nesting 

const getNestedContentItems = (element, $) => { 

let store = ''; //variable used to keep track of sentences through 
				//various forms of html strings
let built = false; //boolean flag to keep track of whether or not 
				//all within a given td child tag is concatonated


const getNestedContentItems = (element, $) => {
	let nestedContentItem = {}; //instantiate return object
	 //keep track of loose text contents
	$(element)[0].name == "br" ?
		nestedContentItem = {
	   	 attrs: cleanAttributes(element.attrs),
         contents: [], 
         tag_class: "void",
         tag_type: 'br',
         type: "tag"
        }
	: element.type == "tag" ? 
		nestedContentItem = { //change return format for this condition
			type: 'tag',
			content: getSentences(element, $) 
		}
	: (element.type == 'text')  // keep track of dangling characters 
		store.concat($(element).text);
		$(elements).sibilings().length > 0 ? // sibilings exist, continue to build store
			built = false; 
			:
			built = true; 
	nestedContentItem = {
		type: "text",
		content:  
	}
	return nestedContentItem;
}
  


const getTableNaive = (element, $) => {
    let $table = $(element);
    let table = { //instantiate return object
      type: $table.attr('class'), //change code to 
      attrs: {}, 
      caption: {},
      thead: {},
      tbody: {},
      tfoot: {}
    };
    let rows = [];
    let cells = [];
    let content = []; //cell content
    //traverse table 
    $table.find('tr').each((i2, el2) => { //for each row
      cells = []; //reset cells array for new row
      let $row = $(el2);
      let row = {
        index: i2,
        attrs: cleanAttributes(el2.attrs),
        tag_type: 'tr',
        tag_class: 'block', 
        cells: []
      }
      $row.find('td, th').each((i3, el3) => { //for each cell
        content = []; //reset content array for new cell
        let $cell = $(el3);
        let cell = {
          index: i3,
          attrs: cleanAttributes(el3.attrs),
          tag_type: $cell[0].name,
          tag_class: 'block', 
          content: [], //NestedContentItem[]
        }
        let cellText = $cell.text(); //simply .text() rather than recursive traversal 
        let parsedItems = getSentences($cell, $);
        console.log(cellText);
        console.log(' ');
        console.log(parsedItems);


        cells.push(cell); 
        row.cells = cells;
      })
      rows.push(row)
    })

    let tbody = {
      attrs: cleanAttributes(element.attrs),
      rows: rows
    };
  table.tbody = tbody;
  return table;
  }

module.exports = getTableNaive;

//Nested Text Item 

// NestedTextItem {
// 	type: 'text',
// 	content: sentences
// }

// NestedTagItem {
// 	type: 'tag',
// 	tag_type: 'string',
// 	tag_class: TagClass,
// 	attrs: {},
// 	Content: NestedContentItem[] 
// }

