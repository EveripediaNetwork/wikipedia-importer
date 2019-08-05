const getCategory = (element, $) => {	
	let $el = $(element);
	if ($el.find('span').text().includes("See also")) { //break each loop once you reach "See Also section of Wiki Page"
		return false; //need to change this because see also is actually included in wiki pages 
	}
	let text = $el.find('.mw-headline').text();
	return {
		type: 'sentence',
		index: 0,
		text: text
	}
}

module.exports = getCategory;
