parseInternalCitation = (el, $) => {
	if (internalCitations == undefined) {
		return ''
	}
	let $el = $(el);
	let text = $el.text();
	let href = $el.attr('href');
	//clean text e.g., [133] -> 133 
	let cleanText = '';
	let i = 0;
	while (i < text.length) {
		if (text[i] !== '[' && text[i] !== ']' ) {
			cleanText += text.charAt(i);
		}
		i++;
	}
	if (internalCitations[cleanText] == '') {  
		return '' //if citation was not properly captured in getCitations() do not return the given internal citation
	}
	return ' ' + '[[CITE|' + cleanText + '|' + internalCitations[cleanText] + ']]' + ' ';
}


module.exports = parseInternalCitation;