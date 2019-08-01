// return timestamp in UTC format 

const getTimeStamp = () => { 
	let d = new Date();
	let month = d.getUTCMonth();
	let day = d.getUTCDate();
	let year = d.getUTCFullYear();
	let hour = d.getUTCHours();
	let minutes = d.getUTCMinutes();
	let seconds = d.getUTCSeconds();
	let term = 'AM';
	if (hour >= 12) {
		term = 'PM';
	}
	return (month + '/' + day + '/' + year + ' ' + hour + ':' + minutes + ':' + seconds + ' ' + term + ' ' + 'UTC');
}

module.exports = getTimeStamp;