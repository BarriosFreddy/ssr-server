const config = require('../config');

function cacheControl(res, seconds) {
	if (!config.dev) {
		res.set('Cache-Control', `public, max-age=${seconds}`);
	}
}

module.exports = cacheControl;