const getCategory = (element, $) => {	
	let $el = $(element);
	if ($el.find('span').text().includes("See also")) { //break each loop once you reach "See Also section of Wiki Page"
		return false; //need to change this because see also is actually included in wiki pages 
	}
	let category = $el.find('.mw-headline').text();
	console.log('CATEGORY');
	console.log(category);
	console.log('');
}


module.exports = getCategory;
