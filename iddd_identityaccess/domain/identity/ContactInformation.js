const AssertionConcern = require("../../common/AssertionConcern")

class ContactInformation extends AssertionConcern {

  constructor(anEmailAddress, aPostalAddress, aPrimaryTelephone, aSecondaryTelephone) {
    super();

    // TODO Weird stuff
    if (anEmailAddress instanceof ContactInformation) {
      let copy = anEmailAddress
      anEmailAddress = copy.emailAddress
      aPostalAddress = copy.postalAddress
      aPrimaryTelephone = copy.primaryTelephone
      aSecondaryTelephone = copy.secondaryTelephone
    }

    this.emailAddress = anEmailAddress
    this.postalAddress = aPostalAddress
    this.primaryTelephone = aPrimaryTelephone
    this.secondaryTelephone = aSecondaryTelephone
  }

  changeEmailAddress(anEmailAddress) {
    return new ContactInformation(
      anEmailAddress,
      this.postalAddress,
      this.primaryTelephone,
      this.secondaryTelephone);
  }

  changePostalAddress(aPostalAddress) {
    return new ContactInformation(
      this.emailAddress,
      aPostalAddress,
      this.primaryTelephone,
      this.secondaryTelephone);
  }

  changePrimaryTelephone(aTelephone) {
    return new ContactInformation(
      this.emailAddress,
      this.postalAddress,
      aTelephone,
      this.secondaryTelephone);
  }

  changeSecondaryTelephone(aTelephone) {
    return new ContactInformation(
      this.emailAddress,
      this.postalAddress,
      this.primaryTelephone,
      aTelephone);
  }


}
