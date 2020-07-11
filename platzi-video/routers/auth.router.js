const router = require('express').Router();
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const apiKeysService = require('../services/apiKeys');

const validationHandler = require('../utils/validationHandler');
const { createUserSchema, createProviderUserSchema } = require('../utils/schemas/users');

const { config } = require('../config');
const usersService = require('../services/users.service');

require('../utils/auth/strategies/basic');

function authRouter(app) {
	app.use('/api/auth', router);

	router.post('/sign-in', async function (req, res, next) {
		const { apiKeyToken } = req.body;

		if (!apiKeyToken) {
			next(boom.unauthorized('apiKeyToken is required'));
		}

		passport.authenticate('basic', function (error, user) {
			try {
				if (error || !user) {
					next(boom.unauthorized());
				}
				req.login(user, { session: false }, async function (error) {
					if (error) {
						next(error);
					}
					console.log('apiKeyToken', apiKeyToken);

					const apikey = await apiKeysService.getApiKey(apiKeyToken);

					if (!apikey) {
						next(boom.unauthorized());
					}

					const { _id: id, name, email } = user;

					console.log('scopes', apikey.scopes);
					const payload = {
						sub: id,
						name,
						email,
						scopes: apikey.scopes
					}

					const token = jwt.sign(payload, config.AUTH_JWT_SECRET, {
						expiresIn: '15m'
					});

					return res.status(200).json({
						token, user: {
							id,
							name,
							email,
						}
					})
				})
			} catch (error) {
				next(error);
			}
		})(req, res, next);
	});

	router.post('/sign-up', validationHandler(createUserSchema), async function (req, res, next) {
		const { body: user } = req;

		try {
			const createdUserId = await usersService.createUser(user);

			res.status(201).json({
				data: createdUserId,
				message: 'User created'
			})
		} catch (error) {
			next(error);
		}
	})

	router.post('sign-provider', validationHandler(createProviderUserSchema),
		async function (req, res, next) {
			const { body } = req;

			const { apiKeyToken, ...user } = body;

			if (!apiKeyToken) {
				next(boom.unauthorized('apiKeyToken is required!'));
			}

			try {
				const queriedUser = await usersService.getOrCreateUser({ user });
				const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

				if (!apiKey) {
					next(boom.unauthorized());
				}
				const { _id: id, name, email } = queriedUser;
				const payload = {
					sub: id,
					name,
					email,
					scopes: apikey.scopes
				}
				const token = jwt.sign(payload, config.AUTH_JWT_SECRET, {
					expiresIn: '15m'
				});
				return res.status(200).json({
					token, user: {
						id, name, email
					}
				})
			} catch (error) {
				next(error)
			}
		})

}

module.exports = authRouter;