const cleanAttributes = require('../getAttributes');
const getTagClass = require('../getTagClass');
const tableContentParsers = require('./tableContentParsers'); 
const cellParser = require('./cellParser'); 


let isContentNested = false; //Boolean flag inspired by Travis's code
                            //Conditionally execute cell-content parser functions   
const getTable = (element, $) => {
    let $table = $(element);
    let table = { //instantiate return object
      type: $table.attr('class'),
      attrs: {}, 
      caption: {},
      thead: {},
      tbody: {},
      tfoot: {}
    };
    let rows = [];
    let cells = [];
    let content = []; //cell content
    //traverse table 
    $table.find('tr').each((i, el) => { //for each row
      cells = []; //reset cells array for new row
      let $row = $(el);
      let row = {
        index: i,
        attrs: cleanAttributes(el.attrs),
        tag_type: 'tr',
        tag_class: 'block', 
        cells: []
      }
      $row.find('td, th').each((i2, el2) => { //for each cell
        content = []; //reset content array for new cell
        let $cell = $(el2);
        let cell = {
          index: i2,
          attrs: cleanAttributes(el2.attrs),
          tag_type: $cell[0].name,
          tag_class: 'block', 
          content: [], //NestedContentItem[]
        }
        let store = ''; //variable used for notNestedContent parser to keep track of text that should be in the same sentence
        let numItemsInCell = $cell.contents().length; 
        $cell.contents().each((i3, el3) => { //each piece of content inside of a cell
          $el3 = $(el3);
          let item = {};
          if ($el3[0].name == 'br') { //quick return br items and reset store (ie new sentence is reached)
            if (!isContentNested && store !== '') { //push built sentence
              content.push({ type: 'text', 
                             content: [{type: 'sentence', index: 0, text: store }]})
              // console.log(store);
            }
            store = '' //reset store at line break
            content.push( { 
              attrs: cleanAttributes(el3.attrs),
              contents: [], 
              tag_class: "void",
              tag_type: 'br',
              type: "tag"
            })
            return //move on to next iteration of loop 
          }

          isContentNested 
            ? item = tableContentParsers.recursiveNestedContent(el3, $(el3).text().trim(), $) 
            : store += tableContentParsers.notNestedContent(el3, $); //clear store for every td and also for every Br tag
        
          if (i3 == (numItemsInCell - 1)) {
            content.push({ type: 'text', 
                             content: [{type: 'sentence', index: 0, text: store }]})
            // console.log(store);
            cell.content = content;
          }
          // if (item !== {} && item !== undefined) {
          //   if (item.content !== undefined) {
          //     if (item.content[0].text !== undefined && item.content[0].text != '') {
          //       console.log(item);
          //       content.push(item); 
          //       cell.content = content;
          //    }
          //   }
          //  }
         }) 
        cells.push(cell); 
        row.cells = cells;
        })
      rows.push(row)
      })
    let tbody = {
      attrs: cleanAttributes(element.attrs),
      rows: rows
    };
    table.tbody = tbody;
    return table;
  }

module.exports = getTable;
