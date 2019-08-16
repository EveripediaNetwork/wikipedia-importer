const getCategory = (element, $) => {	
	let $el = $(element);
	let text = $el.find('.mw-headline').text();
	return {
		type: 'sentence',
		index: 0,
		text: text
	}
}

module.exports = getCategory;
