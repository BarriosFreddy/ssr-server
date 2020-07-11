const moviesService = require('../services/movies.service');
const router = require('express').Router();

const { movieIdSchema, createMovieSchema, updateMovieSchema } = require('../utils/schemas/movie');
const validationHandler = require('../utils/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');
const cacheControl = require('../utils/cacheResponse');
const MINUTES_IN_SECONDS = require('../utils/time');
const passport = require('passport');

require('../utils/auth/strategies/jwt');

function moviesRouter(app) {
	app.use('/api/movies', router);

	router.get('/',
		passport.authenticate('jwt', { session: false }),
		scopesValidationHandler(['read:movies']),
		async function (req, res, next) {
			try {
				cacheControl(res, MINUTES_IN_SECONDS.FIVE);
				const movies = await moviesService.getAll();
				res.status(200).json({
					data: movies,
					message: 'Movies retrieved'
				})
			} catch (error) {
				next(error)
			}
		});

	router.get('/:id',
		passport.authenticate('jwt', { session: false }),
		scopesValidationHandler(['read:movies']),
		validationHandler({ id: movieIdSchema }, 'params'), async function (req, res) {
			const { id } = req.params;
			try {
				cacheControl(res, MINUTES_IN_SECONDS.SIXTY);
				const movie = await moviesService.get(id);

				res.status(200).json({
					data: movie,
					message: 'Movies listed'
				})
			} catch (error) {
				next(error)
			}
		});

	router.post('/',
		passport.authenticate('jwt', { session: false }),
		scopesValidationHandler(['create:movies']),
		validationHandler(createMovieSchema), async function (req, res, next) {
			const { body } = req;
			try {
				const movie = await moviesService.post(body);
				res.status(201).json({
					data: movie,
					message: 'Movie created'
				})
			} catch (error) {
				next(error)
			}
		});

	router.put('/:id',
		passport.authenticate('jwt', { session: false }),
		scopesValidationHandler(['update:movies']),
		validationHandler({ id: movieIdSchema }, 'params'), validationHandler(updateMovieSchema), async function (req, res, next) {
			const { id } = req.params;
			const { body } = req;
			try {
				const movie = await moviesService.put(id, body);

				res.status(201).json({
					data: movie,
					message: 'Movie updated'
				})
			} catch (error) {
				next(error)
			}
		});

	router.delete('/:id',
		passport.authenticate('jwt', { session: false }),
		scopesValidationHandler(['delete:movies']),
		validationHandler({ id: movieIdSchema }, 'params'), async function (req, res, next) {
			const { id } = req.params;
			try {
				const movie = await moviesService.delete(id);
				res.status(201).json({
					data: movie,
					message: 'Movie deleted'
				})
			} catch (error) {
				next(error)
			}
		});
}

module.exports = moviesRouter;