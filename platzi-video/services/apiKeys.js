const mongoLib = require("../lib/mongo");

class ApiKeysService {
	constructor() {
		this.collection = 'api-keys';
	}

	async getApiKey(token) {
		const [apiKey] = await mongoLib.getAll(this.collection, { token });
		return apiKey;
	}
}

module.exports = new ApiKeysService();