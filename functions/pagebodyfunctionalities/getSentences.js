//old sentenceParser 
//new sentenceParser is called textParser

const getSentences = (element, $) => {
	let $el = $(element);
	if ($el.html() == null) { //edge case for naiveGetTable
		return
	}
	const chars = $el.html().split(''); //Character array of paragraph

	let start = 0; //Starting index of sentence
	let end = 0; //Ending index of sentence
	let Abrevflag = false; //Abrevflag to keep track of abreviations that might end sentences early
	//Note that sentence can't end inside of a tag 
	flagOne = false;
	flagTwo = false;
	let sentenceIndex = 0;
	sentences = [];
	let i = 0; //integer to keep track of array position
	
	// populate sentences array 
	while (i < chars.length) {
		if (i == (chars.length - 2) && chars[chars.length - 1] !== 
			'.' && chars[chars.length - 1] !== 
			'?' && chars[chars.length - 1] !== 
			'!' ) 
		{ //this if statement if to account for li sentences that don't always end with proper punctuation
			end = i + 1;
			sentences[sentenceIndex] = chars.slice(start, end).join("");
			sentenceIndex++; 
			start = end; 
		}
		let x = chars[i]; //store current character
		//Check to see if we are currently in a tag 
		if (x == '<' || x == '>') {
			flagOne = !flagOne;
		}
		if ( x == '(' || x == ')') {
			flagTwo = !flagTwo;
		}

		if ((x == '.' || x == '?' || x == '!') && !flagOne && !flagTwo) { //period is reached and flag is off (i.e., end of the sentence is reached )
			if (x !== '.') { //? or ! don't have to consider abbrehivations 
				end = i + 1;
				sentences[sentenceIndex] = chars.slice(start, end).join("");
				sentenceIndex++; 
				start = end; 
			}
			else { //make sure its not an abbreheviation 
				let a = (i - 1);
				while(chars[a] !== ' ') {
					// break if the abbreviations starts the sentence (e.g., U.S.) 
					//because you won't find a space
					if (chars[a] == undefined) {
						break;
					}
					if (chars[a] == '>' || chars[a] == '<'){
						Abrevflag = !Abrevflag;
					}
					if (chars[a - 1] == ' ' && !Abrevflag){
						if (chars[a] == chars[a].toLowerCase()){//i.e., not an abbrehviation
							end = i + 1;
							sentences[sentenceIndex] = chars.slice(start, end).join("");
							sentenceIndex++; 
							start = end; 
						}
					}
					a--;
				}
			}
		}
		i++; //increment loop
	}

	//Now format each sentence in ArticleJson
	//Sentences are the same, simply replace anchor tags with [[ LINK|${lang_code}|${slug}|${text} ]]

	const output = sentences.map ((sentence, index) => {
		let text = '';
		let lang = 'lang_en'; //for now 
		let isLinkText = false; 
		let j = 0;
		while (j < sentence.length) {
			let char = sentence.charAt(j);
			//Check for anchor tags to create wiki links 
			if (char == '<') {
				if(sentence.charAt(j + 1) == 'a' && sentence.charAt(j + 9) !== '#') { //anchor tag is reached 
					slug = '';
					let linkText = '';
					let wikiLink = '';
					j += 15;					//a href="/wiki/*slug*"
					while (sentence.charAt(j) !== '"' ) {
						if (j+2 > sentence.length) {
							break;
						}
						slug += sentence.charAt(j);
						j++;
					}
					while(sentence.charAt(j) !== '>') { //increment to position past tag
						if (j+2 > sentence.length) {
							break;
						}
						j++;
					}
					j++;

					while(sentence.charAt(j) !== '<') {
						if (j+2 > sentence.length) {
							break;
						}
						linkText += sentence.charAt(j);
						j++;
					}
					while (sentence.charAt(j) !== '>') {
						if (j+2 > sentence.length) {
							break;
						}
						j++;
					}
					j++;

					wikiLink = '[[LINK|lang_en|' + slug + '|' + linkText + ']]';
					text += wikiLink;
				}
				else {
					while (sentence.charAt(j) !== '>') { //increment to position past tag
						if (j+2 > sentence.length) {
							break;
						}
						j++;
					}
					j++

				}
			} else { //regular text 
				// [2]
				if (sentence.charAt(j) == '[' && sentence.charAt(j+2) == ']') {
					j +=3;
				}
				else if (sentence.charAt(j) == '[' && sentence.charAt(j+3) == ']') {
					j +=4;
				}
				else if (sentence.charAt(j) == '[' && sentence.charAt(j+4) == ']') {
					j +=5;
				}
				else {
					text += char;
					j++;
				}
			}
		}
		return {
			type: 'sentence',
			index: index,
			text: text
		}
	})
	return output;
}

module.exports = getSentences;