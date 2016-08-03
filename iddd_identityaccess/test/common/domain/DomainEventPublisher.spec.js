let chai = require("chai")
let should = chai.should()

let DomainEventPublisher = require("../../../common/domain/DomainEventPublisher.js")

describe("DomainEventPublisher", function() {

  beforeEach(function() {
    DomainEventPublisher.reset()
  })

  it("Has an instance property that returns itself", function() {
    DomainEventPublisher.should.equal(DomainEventPublisher.instance())
  })

  it("Should allow for subscription", function() {
    DomainEventPublisher.subscribe("alpaca", evt => {
      // Nothing
    })
  })

  // Now we get to the tests in the thing
  it("Should publish events when publish is called", function(done) {
    DomainEventPublisher.instance().subscribe("TestableDomainEvent",
        aDomainEvent => {
            aDomainEvent.id.should.equal(100)
            "test".should.equal(aDomainEvent.name)
            done()
        }
    )

    DomainEventPublisher.instance().publish("TestableDomainEvent", {id: 100, name: "test"})
  })

// New tests for functionality not present in the IDDD samples
it("Should publish everything in a collection", function(done) {
    let count = 0

    DomainEventPublisher.subscribe("TestableDomainEvent",
      aDomainEvent => {
        if (count == 1) {
          aDomainEvent.id.should.equal(200)
          done()
        } else if (count == 0) {
          aDomainEvent.id.should.equal(100)
          count++
        } else {
          done(new Error("We should never get here"))
        }
      })

    DomainEventPublisher.publishAll([
      ["TestableDomainEvent", {id: 100, name: "event 1"}],
      ["TestableDomainEvent", {id: 200, name: "event 2"}]
    ])
  })

})
