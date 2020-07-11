const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');

const userService = require('../../../services/users.service');
const { config } = require('../../../config');

passport.use(new Strategy({
	secretOrKey: config.AUTH_JWT_SECRET,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async function (tokenPayload, cb) {
	try {
		const user = await userService.getUser(tokenPayload.email);

		if (!user) {
			return cb(boom.unauthorized(), false);
		}

		delete user.password;

		return cb(null, { ...user, scopes: tokenPayload.scopes });
	} catch (error) {
		return cb(error);
	}
}))

