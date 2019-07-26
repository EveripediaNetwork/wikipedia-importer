const getImage = (element, $) => {
	let $el = $(element);
	let divClass = $el.attr('class');
	if (divClass !== undefined) {
		if (divClass.includes('thumb')) { //image within in pagebody 
			let url = 'https:' + $el.find('img').attr('src'); //create image url 
			//clean image url from predefined attributes such as size 
			let urlClean = '';
			//clean jpgs 
			if (url != undefined && url.includes('.jpg')) {
				let x = 0;
				while(x < url.length) {
					if (url.charAt(x) == '.' && url.charAt(x+1) == 'j' && url.charAt(x + 2) == 'p' 
						&& url.charAt( x + 3) == 'g') {
						urlClean += '.jpg';
						break;
					}

					if (url.includes('thumb')) { //want to remove 'thumb from url';
						if (url.charAt(x) == 't' & url.charAt(x+1) == 'h' & url.charAt(x+2) == 'u' 
							& url.charAt(x + 3) == 'm' & url.charAt(x + 4) == 'b') {
								x += 5;
						} else {
							urlClean += url.charAt(x);
						}
					}
					else {
						urlClean += url.charAt(x);
					}
					x++;
				}
				console.log('IMAGEURL');
				console.log(urlClean);
				console.log('');

			}
		}
	}
}

module.exports = getImage;








