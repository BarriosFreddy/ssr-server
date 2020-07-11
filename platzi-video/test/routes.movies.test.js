const assert = require('assert');
const proxyrequire = require('proxyrequire');

const { movieMocks, MoviesServiceMock }  = require('../utils/mocks/movies');
const testServer = require('../utils/textServer');
const { it } = require('mocha');

describe('routes - movies', function () {
	const route = proxyrequire('../routes/movies', {
		'../service/movies': MoviesServiceMock
	});

	const request = testServer(route);
	describe('Get movies', function() {
		it('should responsed with status 200', function(done) {
			request.get('/api/movies').expect(200, done);
		})
	})
})