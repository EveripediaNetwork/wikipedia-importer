const request = require('request');
const cheerio = require('cheerio');
const wikipedia = 'https://en.wikipedia.org/wiki/';
const table = {};
const rows = [];
const cells = [];
const cellcontent = [];


// construct NestedContentItems
function recursiveNestedContent(element, text, $) { //element
  const elementType = element.type;
  const $element = $(element);
  const elementTag = $element[0].name;
  
  if($element.children().length == 0) { //base case 
    if(elementType == 'text') { //Base case - NestedTextItem
      return {
        type: 'text', 
        content: [{type: 'sentence', index: 0, text: text}] //Sentence[]; Sentence = {index, text, type};
      }
    } else if (elementType == 'tag') { //NestedContentItem
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
          attrs: {},
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
    //await this
     
    let answer = $element.contents().each(function(i5, el5) {
      let nestedContentItem = recursiveNestedContent(el5, $(el5).text(), $);
      content.push(nestedContentItem);
    })

    return {
      type: 'tag',
      tag_type: $(element)[0].name,
      // tag_class:
      // attrs: {}
      content: content
    }
  }
}
 
function doRequest(page) {
	const url = `${wikipedia}${page}`;
 	return new Promise(function (resolve, reject) {
    	request(url, function (error, res, html) {
      	if (!error && res.statusCode == 200) {
      	  resolve(html);
     	 } else {
       	 reject(error);
      }
    });
  });
}

async function main() {
  const html = await doRequest('List_of_United_States_Presidents'); 
  
  $ = cheerio.load(html);
  const $content = $('div.mw-parser-output');
  $content.find('.wikitable, .body-table').each((i, el) => { //for each table 
    let $table = $(el); 
    $table.find('tr').each((i2, el2) => { //for each row
      let $row = $(el2);
      $row.find('td, th').each((i3, el3) => { //for each cell
        let $cell = $(el3);
        $cell.contents().each((i4, el4) => { //each piece of content inside of a cell
            console.log('----------------');
            let append = recursiveNestedContent(el4, $(el4).text(), $);
            console.log(append);
            console.log('----------------');
            // cellcontent.push(append);
          }) 
        })
      })
      // setTimeout(() => console.log(cellcontent), 3000);
      // console.log(cellcontent);
      return false;
    })
  }

  main();
