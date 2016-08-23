const _ = require("underscore")

module.exports = {
  generate(definition) {
    let name = definition.name
    let properties = definition.props
    let methods = definition.methods

    // FIXME Really shady here but want to move on with my life
    let sup = definition.super ? new definition.super() : null

    let Clazz = function() {
      if (arguments && arguments[0] && Object.getPrototypeOf(arguments[0]) && Object.getPrototypeOf(arguments[0]).name === name) {
        console.log("XXXX Copy constructor!")
        _.extendOwn(this, arguments[0])
        return this
      }
      let zipped = _.zip(properties, arguments)
      _.each(zipped, (zip) => {
        let [propDefinition, value] = zip

        if (!propDefinition) {
          throw new Error("InvalidArgument: " +
            "Too many arguments were passed to this constructor")
        }

        let required = propDefinition.required ? propDefinition.required : false
        let name = null

        if (_.isString(propDefinition)) {
          name = propDefinition
        } else {
          name = propDefinition.name
        }

        console.log(required, propDefinition, value)

        if (required && (value === null || value === undefined)) {
          throw new Error("InvalidArgument: " +
            name + " is a required parameter")
        }

        if (value !== null && value !== undefined &&
          propDefinition.type && toString.call(value) !==
          '[object ' + propDefinition.type.name + ']') {
          throw new Error("InvalidArgument: " +
            name + " must be of type " + propDefinition.type.name)
        }

        if (propDefinition.validate) {
          // FIXME so so so shady
          propDefinition.validate.apply(sup, [value, this])
        }

        this["_" + name] = value
      })
      console.log(this)
    }

    Object.defineProperty(Clazz.prototype,
      'name', {
        value: name,
        configurable: true
      })

    _.each(properties, (prop) => {
      let propName = _.isString(prop) ? prop : prop.name
      Object.defineProperty(Clazz.prototype, propName, {
        enumerable: false,
        get: function() {
          return this["_" + propName]
        }
      })
    })

    _.each(methods, (method, methodName) => {
      Clazz.prototype[methodName] = method
    })

    return Clazz
  }
}
