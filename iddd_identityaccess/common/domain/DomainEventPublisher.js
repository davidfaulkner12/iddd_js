const _ = require("underscore")
const EventEmitter = require('events')

module.exports = {

  _ee: new EventEmitter(),

  instance() {
    return this
  },

  reset() {
    let starListeners = this._ee.listeners("*")
    this._ee.removeAllListeners()
    _.each(starListeners, (listener) => {
      this._ee.on("*", listener)
    })
  },


  resetAll() {
    this._ee.removeAllListeners()
  },


  subscribe(evtName, callback) {
    this._ee.on(evtName, callback)
  },

  publish(evtName, evtData) {
    evtData.eventVersion = evtData.eventVersion || 1
    evtData.occurredOn = evtData.occurredOn || new Date()
    //console.log("Publishing event", evtName, evtData)

    this._ee.emit(evtName, evtData, evtName)
    this._ee.emit("*", evtData, evtName)
  },

  publishAll(eventArray) {
    _.map(eventArray, event => {
      this.publish(event[0], event[1])
    })
  }
}
