// const cleanAttributes = require('./getAttributes');
// const getTagClass = require('./getTagClass');
// const getTableFunctions = require('./tablefunctionalities/getTable');

// const getDescList = (element, $) => {
// 	let $desclist = $(element);
// 	//instantiate DescList 
// 	const DescList = {
// 	type: 'dl',
// 	attrs: cleanAttributes(element.attrs),
// 	items: [] //DescListItem[]
// 	};
// 	//Compute DescList.items 
// 	let items = []; 
// 	$desclist.children('dt, dd').each((i, el) => { //for each DescListItem
// 		let $item = $(el); 
// 		let DescListItem = {
// 			index: i,
// 			tag_type: $item[0].name,
// 			tag_class: getTagClass($item[0].name),
// 			attrs: cleanAttributes(el.attrs),
// 			content: [] //nestedContentItem 
// 		}
// 		//Compute DescListItem.content
// 		let content = [];
// 		$item.contents().each((i2, el2) => { //for each piece of content
// 			let item = getTableFunctions.recursiveNestedContent(el2, $(el2).text(), $);
//             content.push(item); 
            
// 		})
// 		DescListItem.content = content;
// 		items.push(DescListItem);
	
// 	})
// 	DescList.items = items;
// 	return DescList;
// }


// module.exports = getDescList; 