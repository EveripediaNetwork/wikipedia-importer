const cleanAttributes = require('../getAttributes');
const getTagClass = require('../getTagClass');
const nestedTextItems = require('./nestedTextItems');
// const cellParser = require('./cellParser'); 
const getParsedCellContent = require('./cellParser'); 

let isContentNested = false; //Boolean flag inspired by Travis's code
                            //Conditionally execute cell-content parser functions   
const getTable = (element, $) => {
    let $table = $(element);
    let table = { //instantiate return object
      type: $table.attr('class'),
      attrs: cleanAttributes(element.attrs), 
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
        let $cell = $(el2);
        let content = []; //instantiate cell content 
        isContentNested 
        ? content = nestedContentItems(el2, $)
        : content = getParsedCellContent(el2, $);
        if (content != [] && content != undefined) {
          let cell = {
            index: i2,
            attrs: cleanAttributes(el2.attrs),
            tag_type: $cell[0].name,
            tag_class: 'block', 
            content: content
          }
          cells.push(cell); 
        }
      }) 
      row.cells = cells; 
      rows.push(row)
    })
  let tbody = {
    attrs: cleanAttributes($(element).find('tbody').attrs),
    rows: rows
  }
  table.tbody = tbody;
  return table;
}

module.exports = getTable;