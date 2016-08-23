const Hapi = require('hapi')

const server = new Hapi.Server()
server.connection({
  port: 3000
})

let resourceFixture = {

  baseUrl: "http://localhost:3000",

  startWithRoutes: (routes, done) => {
    server.route(routes)

    server.start((err) => {
      if (err) {
        done(err)
      }
      console.log('Server running at:', server.info.uri)
      done()
    })
  },

  stop: (done) => {
    server.stop((err) => {
      if (err) {
        done(err)
      }
      console.log("Server stopped")
      done()
    })
  }
}

module.exports = resourceFixture
