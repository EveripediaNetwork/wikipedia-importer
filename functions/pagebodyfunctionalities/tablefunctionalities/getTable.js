const cleanAttributes = require('../getAttributes');
const getTagClass = require('../getTagClass');
const getParsedCellContent = require('./cellParser'); 

const getTable = (element, $) => {
    let $table = $(element);
    let table = { //instantiate return object
      type: $table.attr('class'),
      attrs: cleanAttributes($table[0].attribs), 
      caption: {rows: [], attrs: {}}, 
      thead: {rows: [], attrs: {}},
      tbody: {},
      tfoot: {rows: [], attrs: {}}
    };
    let rows = [];
    let cells = [];
    let content = []; //cell content
    //traverse table 
    $table.find('tr').each((i, el) => { //for each row
      cells = []; //reset cells array for each new row
      let $row = $(el);
      let row = {
        index: i,
        attrs: cleanAttributes(el.attribs),
        tag_type: 'tr',
        tag_class: 'block', 
        cells: []
      }
      $row.find('td, th').each((i2, el2) => { //for each cell
        let $cell = $(el2);
        let content = getParsedCellContent(el2, $);
        if (content != [] && content != undefined) {
          let cell = {
            index: i2,
            attrs: cleanAttributes(el2.attribs),
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
    attrs: cleanAttributes($table.find('tbody')[0].attribs),
    rows: rows
  }
  table.tbody = tbody;
  return [table];
}

module.exports = getTable;