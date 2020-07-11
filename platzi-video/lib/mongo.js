const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.DB_USER);
const PASSWORD = encodeURIComponent(config.BD_PASSWORD);
const DB_NAME = encodeURIComponent(config.DB_NAME);

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${DB_NAME}?retryWrites=true&w=majority`

class MongoLib {
	constructor() {
		console.log('MONGO_URI', MONGO_URI);
		
		this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
		this.dbName = DB_NAME
	}

	connect() {
		if (!MongoLib.connection) {
			MongoLib.connection = new Promise((resolve, reject) => {
				this.client.connect(err => {
					if (err) {
						console.error(err);
						reject(err);
					}
					console.log("Connected sucessfully to mongo");
					resolve(this.client.db(this.dbName));
				})
			})
		}
		return MongoLib.connection;
	}

	getAll(collection, query) {
		
		return this.connect().then(db => {
			return db.collection(collection).find(query).toArray();
		})
	}

	get(collection, id) {
		return this.connect().then(db => {
			return db.collection(collection).findOne({ _id: ObjectId(id) });
		})
	}

	create(collection, data) {
		return this.connect().then(db => {
			return db.collection(collection).insertOne(data);
		}).then(result => result.insertedId);
	}

	update(collection, id, data) {
		return this.connect().then(db => {
			return db.collection(collection).updateOne({ _id: ObjectId(id) }, { $set: data });
		}).then(() => id)
	}

	delete(collection, id) {
		return this.connect().then(db => {
			return db.collection(collection).deleteOne({ _id: ObjectId(id) });
		}).then(() => id);
	}
}

module.exports = new MongoLib();