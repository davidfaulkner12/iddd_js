const should = require("chai").should()
const rest = require("restling")

const resourceFixture = require("./ResourceFixture")
const helloRoutes = require("../../resource/HelloRoutes")

const baseUrl = resourceFixture.baseUrl + "/hello"

describe("HelloResource", function() {

  before(function(done) {
    resourceFixture.startWithRoutes(helloRoutes, done)
  })

  after(function(done) {
    resourceFixture.stop(done)
  })

  it("Returns 'Hello world' on a GET to /hello", function(done) {
		rest.get(baseUrl)
		.then(response => {
				response.data.should.equal("Hello, world!")
		}).then(done, err => done(err))
	})

  it("Returns 'Hello, bob' at /hello/bob", function(done) {
    rest.get(baseUrl + "/bob")
    .then(response => {
      response.data.should.equal("Hello, bob!")
    }).then(done, err => done(err))
  })
})
