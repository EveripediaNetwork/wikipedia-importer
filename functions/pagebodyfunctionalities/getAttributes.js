// Travis Moore and Kedar Iyer's code to clean attributes to fit front-end requirements

const convert = require('react-attr-converter'); //convert attributes to React format 


const cleanAttrs = (attributes) => {
	if (attributes === undefined || attributes === null) { //prevent error for empty inputs
		return {}
	}
	const cleanedAttrs = {};
    const keys = Object.keys(attributes);
    for (const key of keys) {
        if (attributes[key] && attributes[key] != '') {
        	cleanedAttrs[convert(key)] = attributes[key];
        }
    }
    if (cleanedAttrs['style']){
        cleanedAttrs['style'] = parseStyles(cleanedAttrs['style']);
    } 
    return cleanedAttrs;
}

const parseStyles = (styles) => {
    return styles
    .split(';')
    .filter(style => style.split(':')[0] && style.split(':')[1])
    .map(style => [
        style.split(':')[0].trim().replace(/-./g, c => c.substr(1).toUpperCase()),
        style.split(':').slice(1).join(':').trim()
    ])
    .reduce((styleObj, style) => ({
        ...styleObj,
        [style[0]]: style[1],
    }), {});
}

module.exports = cleanAttrs;