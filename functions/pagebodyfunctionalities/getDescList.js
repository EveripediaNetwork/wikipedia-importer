const cleanAttributes = require('./getAttributes');
const getTagClass = require('./getTagClass');
const getParsedCellContent = require('./tablefunctionalities/cellParser');

//input: <dl> element
//output: array of formatted dt && dd elements 

const getDescList = (element, $) => {
	let $desclist = $(element); 
	let items = []; //instantiate return array
	$desclist.children('dt, dd').each((i, el) => { //for each DescListItem
		let $item = $(el); 
		let DescListItem = {
			index: i,
			tag_type: $item[0].name,
			tag_class: getTagClass($item[0].name),
			attrs: cleanAttributes(el.attrs),
			content: [] //nestedContentItem 
		}
		//Compute DescListItem.content
		let content = getParsedCellContent(el, $);
		DescListItem.content = content;
		items.push(DescListItem);
	})
	return items;
}


module.exports = getDescList; 