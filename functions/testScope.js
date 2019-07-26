const arr = [];
arr.push('text1');
console.log(arr);

const addText = (text) => {
	arr.push(text); //arr = [text1, text2]
	addText2('text3');
	console.log(arr);


}

const addText2 = (text) => {
	arr.push(text);
	return "newText";
}


addText('text2');
console.log(arr);