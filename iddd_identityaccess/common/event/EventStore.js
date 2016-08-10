const _ = require("underscore")

class EventStore {
  constructor() {
    this.storedEvents = []
  }

  close() {
    this.clean()
  }

  countStoredEvents() {
    return this.storedEvents.length
  }


  clean() {
    this.storedEvents = []
  }


  append(name, aDomainEvent) {
    let storedEvent = {
      name: name,
      occurredOn: aDomainEvent.occurredOn || new Date(),
      domainEvent: aDomainEvent,
      eventId: this.storedEvents.length + 1
    }

    this.storedEvents.push(storedEvent)

    return storedEvent
  }

  allStoredEventsBetween(
    aLowStoredEventId,
    aHighStoredEventId) {

    return _.filter(this.storedEvents, (evt) => {
      return evt.eventId >= aLowStoredEventId && evt.eventId <= aHighStoredEventId
    })

  }

  allStoredEventsSince(aStoredEventId) {

    return _.filter(this.storedEvents, evt => {
      return evt.eventId > aStoredEventId
    })

  }

}

module.exports = EventStore
