//input: anchor tag 
//output: string of LINK or INLINE-IMG
const parseAnchorTag = (element, $) => {
	let $element = $(element);
	if ($element.children().length == 0) { //resolve anchor tags that only contains text 
	  return parseLink(element, $);
	}
    else if ($element.attr('class') == 'image') { //inline-image 
    	return parseInlineImage($element.find('img'), $);
    }
    else if ($element.html().includes('<br>')) {  //anchor tag has inner br tag edge case
		let a = ($.html($element)).replace('<br>', '\n');
  		return parseAnchorTag(a, $);
  	}
  	else {
  		return ''
  	}
}

const parseLink = (anchorTagElement, $) => { //LINK
  let $element = $(anchorTagElement);
  let wikiLink = '';
  const linkText = $element.text(); 
  //get slug 
  const hrefAttr = $element.attr('href');
  let index = 6; 
  let slug = ''; 
  while(index < hrefAttr.length) { 
    slug += hrefAttr.charAt(index); 
    index++; 
  }
  wikiLink = '[[LINK|lang_en|' + slug + '|' + linkText + ']]';
  if (wikiLink == undefined || anchorTagElement == undefined) {
  	return ''
  }
  return wikiLink
}

//[[INLINE_IMAGE|${src}|${srcset}|${alt}|h${height}|w${width}]] 
const parseInlineImage = (img, $) => {
	let $img = $(img);
	let src = $img.attr('src');
	let srcset = $img.attr('srcset');
	let alt = $img.attr('alt');
	if (alt == undefined) {
		alt = '';
	}
	let height = $img.attr('height');
	let width = $img.attr('width'); 
	return '[[' + 'INLINE_IMAGE' + '|' + src + '|' + srcset + '|' + alt + '|' + 'h' + height + '|' + 'w' + width + ']]'
}

module.exports = parseAnchorTag;

