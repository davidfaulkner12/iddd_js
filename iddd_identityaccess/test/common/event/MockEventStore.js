const configuration = require("../../../common/ConfigurationLoader")

const EventStore = configuration.objects.eventStore

class MockEventStore extends EventStore {

  constructor() {

    super()

    let START_ID = 789;

    // always start with at least 21 events

    this.storedEvents = []

    let numberOfStoredEvents =
      (new Date()).getMilliseconds() + 1; // 1-1000

    if (numberOfStoredEvents < 21) {
      numberOfStoredEvents = 21;
    }

    for (let idx = 0; idx < numberOfStoredEvents; ++idx) {
      let storedEvent = this.newStoredEvent(START_ID + idx, idx + 1);

      //this.storedEvents.push(storedEvent);
    }
  }

  newStoredEvent(domainEventId, storedEventId) {

    this.append("TestableDomainEvent", {
      eventId: domainEventId,
      name: "name" + domainEventId
    })

  }
}

module.exports = MockEventStore
