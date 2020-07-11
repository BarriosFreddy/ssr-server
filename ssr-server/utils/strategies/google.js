const passport = require("passport");
const { OAuth2Strategy: GoogleStrategy } = require("passport-google-oauth");

const { config } = require("../../config/index");
const { boom } = require("@hapi/boom");
const axios = require("axios");

passport.use(
	new GoogleStrategy(
		{
			clientID: config.GOOGLE_CLIENT_ID,
			clientSecret: config.GOOGLE_CLIENT_SECRET,
			callbackURL: "/auth/google/callback"
		},
		async function (accessToken, refreshToken, { _json: profile }, cb) {
			const { data, status } = await axios({
				url: `${config.apiUrl}/api/auth/sign-provider`,
				method: "post",
				data: {
					name: profile.name,
					email: profile.email,
					password: profile.id,
					apiKeyToken: config.apiKeyToken
				}
			});

			if (!data || status !== 200) {
				return cb(boom.unauthorized(), false);
			}

			return cb(null, data);
		}
	)
);