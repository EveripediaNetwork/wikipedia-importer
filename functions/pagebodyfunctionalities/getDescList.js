const cleanAttributes = require('./pagebodyfunctionalities/getAttributes');
const getTagClass = require('./pagebodyfunctionalities/getTagClass');
const getTableFunctions = require('./pagebodyfunctionalities/getTable');

const getDescList = (element, $) => {
	let $desclist = $(element);
	//instantiate DescList 
	const DescList = {
	type: 'dl',
	attrs: cleanAttributes(element),
	items: [] //DescListItem[]
	};
	//Compute DescList.items 
	let items = [];
	$desclist.children('dt, dd').each((i, el) => { //for each DescListItem
		let $item = $(el);
		let DescListItem = {
			index: i,
			tag_type: $item[0].name,
			tag_class: getTagClass($item[0].name),
			attrs: cleanAttributes(el),
			content: []//nestedContentItem 
		}
		let content = [];
		$item.contents().each((i2, el2) => {
			let item = getTableFunctions.recursiveNestedContent(el2, $(el2).text(), $);
            content.push(item); 
            
		})
		DescListItem.content = content;
		items.push(DescListItem);
		DescList.items = items;
	})
	return DescList;
}


module.exports = getDescList; 