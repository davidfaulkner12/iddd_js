const ValueObjectGenerator = require("../../common/ValueObjectGenerator")

const ContactInformation = ValueObjectGenerator.generate({
  name: "ContactInformation",
  props: ["emailAddress", "postalAddress",
    "primaryTelephone", "secondaryTelephone"
  ],
  methods: {
    changeEmailAddress(anEmailAddress) {
      return new ContactInformation(
        anEmailAddress,
        this.postalAddress,
        this.primaryTelephone,
        this.secondaryTelephone)
    },

    changePostalAddress(aPostalAddress) {
      return new ContactInformation(
        this.emailAddress,
        aPostalAddress,
        this.primaryTelephone,
        this.secondaryTelephone)
    },

    changePrimaryTelephone(aTelephone) {
      return new ContactInformation(
        this.emailAddress,
        this.postalAddress,
        aTelephone,
        this.secondaryTelephone)
    },

    changeSecondaryTelephone(aTelephone) {
      return new ContactInformation(
        this.emailAddress,
        this.postalAddress,
        this.primaryTelephone,
        aTelephone)
    }
  }
})

module.exports = ContactInformation
