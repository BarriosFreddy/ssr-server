const userMovieService = require('../services/userMovie.service');
const { userMovieIdSchema, createUserMovieSchema } = require('../utils/schemas/userMovie');
const { userIdSchema } = require('../utils/schemas/users');
const validationHandler = require('../utils/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler'); 
const passport = require('passport');

const router = require('express').Router();

require('../utils/auth/strategies/jwt');

function userMovieRouter(app) {
	app.use('/api/user-movies', router);

	router.get('/',
		passport.authenticate('jwt', { session: false }),
		scopesValidationHandler(['read:user-movies']),
		validationHandler({ userId: userIdSchema }, 'query'), async function (req, res, next) {
			const { userId } = req.query;

			try {
				const userMovies = await userMovieService.getUserMovies(userId);
				res.status(200).json({
					data: userMovies,
					message: 'user list'
				})
			} catch (error) {
				next(error);
			}
		})

	router.post('/', 
	passport.authenticate('jwt', { session: false }),
	scopesValidationHandler(['create:user-movies']),
	validationHandler(createUserMovieSchema), async function (req, res, next) {
		const { body: userMovie } = req;

		try {
			const createdUserMovieId = await userMovieService.createUserMovies(userMovie);
			console.log('createdUserMovieId', createdUserMovieId);
			
			res.status(201).json({
				data: createdUserMovieId,
				message: 'user movie created'
			})
		} catch (error) {
			next(error);
		}
	})

	router.delete('/:userMovieId', 
	passport.authenticate('jwt', { session: false }),
	scopesValidationHandler(['delete:user-movies']),
	validationHandler({ userMovieId: userMovieIdSchema }, 'params'),
		async function (req, res, next) {
			const { userMovieId } = req.params;
			try {
				const deletedUserMovieId = await userMovieService.deleteUserMovie(userMovieId);
				res.status(200).json({
					data: deletedUserMovieId,
					message: 'user deleted'
				})
			} catch (error) {
				next(error);
			}
		})
}

module.exports = userMovieRouter
