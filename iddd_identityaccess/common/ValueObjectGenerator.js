const _ = require("underscore")

module.exports = {
  generate(definition) {
    let name = definition.name
    let properties = definition.props
    let methods = definition.methods
    let sup = definition.super ? definition.super : null

    // This is the generated constructor function
    let Clazz = function() {
      // This is pretty fun -- we always have a copy constructor
      if (arguments && arguments[0] &&
        Object.getPrototypeOf(arguments[0]) &&
        Object.getPrototypeOf(arguments[0]).name === name) {
        _.extendOwn(this, arguments[0])
        return this
      }

      // Otherwise, we assume the arguments to the constructor are in the same
      // order as the property definitions
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
          propDefinition.validate.apply(this, [value, this])
        }

        this["_" + name] = value
      })
    }

    // Doing the mixin thing to copy over the super prototype properties
    if (sup) {
      Clazz.prototype = Object.create(sup.prototype)
    }

    // Here we set the name, since we're generating an "anonymous" class
    Object.defineProperty(Clazz.prototype,
      'name', {
        value: name,
        configurable: true
      })

    // Now I create the getters, note no setters
    _.each(properties, (prop) => {
      let propName = _.isString(prop) ? prop : prop.name
      Object.defineProperty(Clazz.prototype, propName, {
        enumerable: false,
        get: function() {
          return this["_" + propName]
        }
      })
    })

    // Finally we put the methods in
    _.each(methods, (method, methodName) => {
      Clazz.prototype[methodName] = method
    })

    return Clazz
  }
}
