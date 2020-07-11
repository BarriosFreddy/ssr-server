const MongoLib = require('../lib/mongo');
const bcrypt = require('bcrypt');

class UserService {
	constructor() {
		this.collection = 'users';
	}

	async getUser(email) {
		const [user] = await MongoLib.getAll(this.collection, { email });
		return user;
	}

	/**
	 * 
	 * @param {*} user 
	 */
	async createUser(user) {
		const { name, email, password } = user;
		const hashedPassword = await bcrypt.hash(password, 10);
		const createdUserId = await MongoLib.create(this.collection, { name, email, password: hashedPassword });
		return createdUserId;
	}

	async getOrCreateUser({ user }) {
		const userRetreived = await this.getUser(user.email);

		if (userRetreived) {
			return userRetreived;
		}

		await this.createUser(user);
		return await this.getUser(user.email);
	}
}

module.exports = new UserService();