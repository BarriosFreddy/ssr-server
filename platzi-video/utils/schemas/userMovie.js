const joi = require('@hapi/joi');
const { movieIdSchema } = require('./movie');
const { userIdSchema } = require('./users');

const userMovieIdSchema = joi.string().regex(/[\da-fA-F]{24}$/);

const createUserMovieSchema = {
	userId: userIdSchema,
	movieId: movieIdSchema
}

module.exports = {
	userMovieIdSchema,
	createUserMovieSchema
}