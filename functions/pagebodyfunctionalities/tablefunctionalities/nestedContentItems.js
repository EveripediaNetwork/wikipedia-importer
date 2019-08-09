

function nestedContentItems(element, text, $) { 
  const elementType = element.type;
  const $element = $(element); //can remove second parameter with this
  const elementTag = $element[0].name;
  //determine tag_class
  let tag_class = getTagClass(elementTag);
  
  if($element.children().length == 0) { //base case 
    if(elementType == 'text') { //NestedTextItem
      return {
        type: 'text', 
        content: [{type: 'sentence', index: 0, text: text}] //Sentence[]; Sentence = {index, text, type};
      }
    } else if (elementType == 'tag') { 
      if (elementTag == 'a') {
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
        //return NestedTextItem 
        return {
          type: 'text',
          content: [{type: 'sentence', index: 0, text: wikiLink}]
        }
      }
      else if (elementTag == 'br') {//nestedTagItem
        return {
          attrs: cleanAttributes(element.attrs),
          contents: [], 
          tag_class: "void",
          tag_type: 'br',
          type: "tag"
        }
      } else {
        return {
          type: 'text',
          content: [{type: 'sentence', index: 0, text: text}]
        }
      }
    }
  }
  else { //element.children.length > 0 //recursive case
    let contentText = text; //ultimately when you get down to base case this will be the text of the NestedTextItem
    let content = []; //Array of NestedContentItems (ie NestedTextItems or NestedTagItems)
    let answer = $element.contents().each(function(i5, el5) {
      let nestedContentItem = recursiveNestedContent(el5, $(el5).text(), $);
      content.push(nestedContentItem);
    })
    return {
      type: 'tag',
      tag_type: $(element)[0].name,
      tag_class: tag_class,
      attrs: cleanAttributes(element.attrs),
      content: content
    }
  }
}

module.exports = nestedContentItems;