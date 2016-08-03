let _ = require("underscore")

class AssertionConcern {

    constructor() {}

    assertArgumentEquals(anObject1, anObject2, aMessage) {
        if (!_.isEqual(anObject1, anObject2)) {
            throw new Error("IllegalArgument: " + aMessage);
        }
    }

    assertArgumentNotEquals(anObject1, anObject2, aMessage) {
        if (_.isEqual(anObject1, anObject2)) {
            throw new Error("IllegalArgument: " + aMessage);
        }
    }

    /* Can't do it
    assertArgumentLength(aString, aMaximum, aMessage) {
        let length = aString.trim().length;
        if (length > aMaximum) {
            throw new Error("IllegalArgument: " + aMessage);
        }
    }
    */

    assertArgumentLength(aString, aMinimum, aMaximum, aMessage) {
      // For API compatibility we do some strange stuff here

      if (arguments.length == 3) {
        aMessage = aMaximum
        aMaximum = aMinimum
        aMinimum = 0
      }
        let length = aString.trim().length;
        if (length < aMinimum || length > aMaximum) {
            throw new Error("IllegalArgument: " + aMessage);
        }
    }

    assertArgumentNotEmpty(aString, aMessage) {
        if (aString == null || aString.trim() == "") {
            throw new Error("IllegalArgument: " + aMessage);
        }
    }


    assertArgumentNotNull(anObject, aMessage) {
        if (anObject === null) {
            throw new Error("IllegalArgument: " + aMessage);
        }
    }

    assertArgumentRange(aValue, aMinimum, aMaximum, aMessage) {
        if (aValue < aMinimum || aValue > aMaximum) {
            throw new Error("IllegalArgument: " + aMessage);
        }
    }

    assertArgumentFalse(aBoolean, aMessage) {
        if (aBoolean) {
            throw new Error("IllegalArgument: " + aMessage);
        }
    }

    assertArgumentTrue(aBoolean, aMessage) {
        if (!aBoolean) {
            throw new Error("IllegalArgument: " + aMessage);
        }
    }

    assertStateFalse(aBoolean, aMessage) {
        if (aBoolean) {
            throw new Error("IllegalState: " + aMessage);
        }
    }

    assertStateTrue(aBoolean, aMessage) {
        if (!aBoolean) {
            throw new Error("IllegalState: " + aMessage);
        }
    }
}


module.exports = AssertionConcern
