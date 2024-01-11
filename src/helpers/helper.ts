const util = require('util');

export const prettyPrintResponse = (res) => {
	console.log(util.inspect(res.data, { colors: true, depth: 4 }));
};