const AssertionConcern = require("../../common/AssertionConcern")
const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

const FullName = ValueObjectGenerator.generate({
  name: "FullName",
  super: AssertionConcern,
  props: [{
    name: "firstName",
    required: true,
    validate: function(aFirstName) {
      this.assertArgumentNotEmpty(aFirstName, "First name is required.")
      this.assertArgumentLength(aFirstName, 1, 50,
        "First name must be 50 characters or less.")
      this.assertArgumentTrue(
        /^[A-Z][a-z]*/.test(aFirstName),
        "First name must be at least one character in length," +
        "starting with a capital letter.")
    }
  }, {
    name: "lastName",
    required: true,
    validate: function(aLastName) {
      this.assertArgumentNotEmpty(aLastName, "The last name is required.")
      this.assertArgumentLength(aLastName, 1, 50,
        "The last name must be 50 characters or less.")
      this.assertArgumentTrue(
        /^[a-zA-Z'][ a-zA-Z'-]*[a-zA-Z']?/.test(aLastName),
        "Last name must be at least one character in length.")
    }
  }],
  methods: {
    asFormattedName: function() {
      return this.firstName + " " + this.lastName
    },

    withChangedFirstName: function(aFirstName) {
      return new FullName(aFirstName, this.lastName)
    },

    withChangedLastName: function(aLastName) {
      return new FullName(this.firstName, aLastName)
    }
  }
})

module.exports = FullName
