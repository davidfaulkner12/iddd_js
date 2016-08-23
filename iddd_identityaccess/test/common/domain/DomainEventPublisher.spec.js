/* eslint-env node, mocha */
/* eslint no-new: "off" */
/* eslint no-unused-expressions: "off" */

const chai = require("chai")
chai.should()

const DomainEventPublisher =
  require("../../../common/domain/DomainEventPublisher")

describe("DomainEventPublisher", function() {
  beforeEach(function() {
    DomainEventPublisher.reset()
  })

  afterEach(function() {
    DomainEventPublisher.reset()
  })

  it("Has an instance property that returns itself", function() {
    DomainEventPublisher.should.equal(DomainEventPublisher.instance())
  })

  it("Should allow for subscription", function() {
    DomainEventPublisher.subscribe("alpaca", (evt) => {
      // Nothing
    })
  })

  // Now we get to the tests in the thing
  it("Should publish events when publish is called", function(done) {
    DomainEventPublisher.instance().subscribe("TestableDomainEvent",
      (aDomainEvent) => {
        aDomainEvent.id.should.equal(100)
        "test".should.equal(aDomainEvent.name)
        done()
      }
    )

    DomainEventPublisher.instance().publish("TestableDomainEvent", {
      id: 100,
      name: "test"
    })
  })

  // New tests for functionality not present in the IDDD samples
  it("Should publish everything in a collection", function(done) {
    let count = 0

    DomainEventPublisher.subscribe("TestableDomainEvent",
      (aDomainEvent) => {
        if (count === 1) {
          aDomainEvent.id.should.equal(200)
          done()
        } else if (count === 0) {
          aDomainEvent.id.should.equal(100)
          count++
        } else {
          done(new Error("We should never get here"))
        }
      })

    DomainEventPublisher.publishAll([
      ["TestableDomainEvent", {
        id: 100,
        name: "event 1"
      }],
      ["TestableDomainEvent", {
        id: 200,
        name: "event 2"
      }]
    ])
  })

  it("Should have multiple listeners", function(done) {
    let p1 = new Promise(
      (resolve, reject) => {
        DomainEventPublisher.subscribe("TestableDomainEvent",
          (aDomainEvent) => {
            resolve()
          })
      }
    )

    let p2 = new Promise(
      (resolve, reject) => {
        DomainEventPublisher.subscribe("TestableDomainEvent2",
          (aDomainEvent) => {
            resolve()
          })
      }
    )

    DomainEventPublisher.publish("TestableDomainEvent", {})
    DomainEventPublisher.publish("TestableDomainEvent2", {})

    Promise.all([p1, p2]).then(() => {
      done()
    })
  })

  it("Should allow for a global subscription", function(done) {
    let numEvents = 0

    let callback = (aDomainEvent, aDomainEventName) => {
      if (numEvents === 0) {
        aDomainEventName.should.equal("TestableDomainEvent")
        numEvents++
      } else if (numEvents === 1) {
        aDomainEventName.should.equal("TestableDomainEvent2")
        done()
      } else {
        done("Should never get here")
      }
    }

    DomainEventPublisher.subscribe("*", callback)

    DomainEventPublisher.publish("TestableDomainEvent", {})
    DomainEventPublisher.publish("TestableDomainEvent2", {})

    DomainEventPublisher._ee.removeListener("*", callback)
  })
})
