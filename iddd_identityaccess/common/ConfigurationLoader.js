const config = require("config")
const _ = require("underscore")
const path = require("path")

let instantiatedConfig = _.mapObject(config.objects, (val, key) => {
  return require(path.join(process.cwd(), val))
})

module.exports.objects = instantiatedConfig
