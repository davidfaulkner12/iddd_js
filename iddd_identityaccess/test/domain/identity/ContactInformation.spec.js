let chai = require("chai")
let should = chai.should()

let _ = require("underscore")

let ContactInformation = require("../../../domain/identity/ContactInformation.js")
let EmailAddress = require("../../../domain/identity/EmailAddress.js")
let PostalAddress = require("../../../domain/identity/PostalAddress.js")
let Telephone = require("../../../domain/identity/Telephone.js")

let fixture = require("../IdentityAccessFixtures.js")

describe("ContactInformation", function() {
  it("ContactInformation", function() {
      let contactInformation = fixture.contactInformation();

      fixture.USER_EMAIL_ADDRESS.should.equal(contactInformation.emailAddress.address)
      "Boulder".should.equal(contactInformation.postalAddress.city)
      "CO".should.equal(contactInformation.postalAddress.stateProvince)
 })

  it("ChangeEmailAddress", function() {
      let contactInformation = fixture.contactInformation();
      let contactInformationCopy = new ContactInformation(contactInformation);

      let contactInformation2 =
              contactInformation
                  .changeEmailAddress(
                          new EmailAddress(fixture.USER_EMAIL_ADDRESS2));

      _.isEqual(contactInformationCopy, contactInformation).should.be.true
      _.isEqual(contactInformation, contactInformation2).should.be.false
      _.isEqual(contactInformationCopy, contactInformation2).should.be.false

      fixture.USER_EMAIL_ADDRESS.should.equal(contactInformation.emailAddress.address)
      fixture.USER_EMAIL_ADDRESS2.should.equal(contactInformation2.emailAddress.address)
      "Boulder".should.equal(contactInformation.postalAddress.city)
      "CO".should.equal(contactInformation.postalAddress.stateProvince)
 })

  it("ChangePostalAddress", function() {
      let contactInformation = fixture.contactInformation();
      let contactInformationCopy = new ContactInformation(contactInformation);

      let contactInformation2 =
              contactInformation
                  .changePostalAddress(
                          new PostalAddress("321 Mockingbird Lane", "Denver", "CO", "81121", "US"));

      _.isEqual(contactInformationCopy, contactInformation).should.be.true
      _.isEqual(contactInformation, contactInformation2).should.be.false
      _.isEqual(contactInformationCopy, contactInformation2).should.be.false

      "321 Mockingbird Lane".should.equal(contactInformation2.postalAddress.streetAddress)
      "Denver".should.equal(contactInformation2.postalAddress.city)
      "CO".should.equal(contactInformation2.postalAddress.stateProvince)
 })

  it("ChangePrimaryTelephone", function() {
      let contactInformation = fixture.contactInformation();
      let contactInformationCopy = new ContactInformation(contactInformation);

      let contactInformation2 =
              contactInformation
                  .changePrimaryTelephone(
                          new Telephone("720-555-1212"));

      _.isEqual(contactInformationCopy, contactInformation).should.be.true
      _.isEqual(contactInformation, contactInformation2).should.be.false
      _.isEqual(contactInformationCopy, contactInformation2).should.be.false


      "720-555-1212".should.equal(contactInformation2.primaryTelephone.number)
      "Boulder".should.equal(contactInformation2.postalAddress.city)
      "CO".should.equal(contactInformation2.postalAddress.stateProvince)
 })

  it("ChangeSecondaryTelephone", function() {
      let contactInformation = fixture.contactInformation();
      let contactInformationCopy = new ContactInformation(contactInformation);

      let contactInformation2 =
              contactInformation
                  .changeSecondaryTelephone(
                          new Telephone("720-555-1212"));

      _.isEqual(contactInformationCopy, contactInformation).should.be.true
      _.isEqual(contactInformation, contactInformation2).should.be.false
      _.isEqual(contactInformationCopy, contactInformation2).should.be.false

      "720-555-1212".should.equal(contactInformation2.secondaryTelephone.number)
      "Boulder".should.equal(contactInformation2.postalAddress.city)
      "CO".should.equal(contactInformation2.postalAddress.stateProvince)
 })

})
