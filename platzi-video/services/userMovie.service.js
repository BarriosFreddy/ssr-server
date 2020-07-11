const MongoLib = require('../lib/mongo');

class UserMovieService {
	constructor() {
		this.collection = 'user-movies';
	}

	async getUserMovies(userId) {
		const query = userId && { userId };
		const userMovies = await MongoLib.getAll(this.collection, query);
		return userMovies || [];
	}

	async createUserMovies(userMovie) {
		const createdUserMovieId = await MongoLib.create(this.collection, userMovie);
		return createdUserMovieId;
	}

	async deleteUserMovie(userMovie) {
		const deletedUserMovieId = await MongoLib.delete(this.collection, userMovie);
		return deletedUserMovieId;
	}
}

module.exports = new UserMovieService();