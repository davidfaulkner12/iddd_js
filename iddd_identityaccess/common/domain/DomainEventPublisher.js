const _ = require("underscore")

const EventEmitter = require('events')



module.exports = {

  _ee: new EventEmitter(),

  instance() {
    return this
  },

  reset() {
    this._ee.removeAllListeners()
  },

  subscribe(evtName, callback) {
    this._ee.on("evtName", callback)
  },

  publish(evtName, evtData) {
    this._ee.emit("evtName", evtData)
  },

  publishAll(eventArray) {
    _.map(eventArray, event => { this.publish(event[0], event[1]) })
  }
}
