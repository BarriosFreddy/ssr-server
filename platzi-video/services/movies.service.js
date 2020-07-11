const MongoLib = require("../lib/mongo");

class MoviesService {

	constructor() {
		this.collection = 'movies';
	}

	async getAll(tags) {
		let movies = [];
		try {
			const query = tags ? { tags: { $in: tags } } : {};
			movies = await MongoLib.getAll(this.collection, query);
			return movies;
		} catch (error) {
			console.log(error);
			return movies;
		}
	}

	async get(id) {
		const movie = await MongoLib.get(this.collection, id);
		return movie || {};
	}

	async post(movie) {
		const movieCreated = await MongoLib.create(this.collection, movie);
		return movieCreated;
	}

	async put(id, movie) {
		const movieUpdatedId = await MongoLib.update(this.collection, id, movie);
		return movieUpdatedId;
	}

	async delete(id) {
		const movieDeletedId = await MongoLib.delete(this.collection, id);
		return movieDeletedId;
	}

}

module.exports = new MoviesService();