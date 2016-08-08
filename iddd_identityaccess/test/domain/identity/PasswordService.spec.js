const chai = require("chai")
const should = chai.should()

const DomainRegistry = require("../../../domain/DomainRegistry")

describe("PasswordService", function() {
  
      it("GenerateStrongPassword", function() {
          let password =
                  DomainRegistry
                      .passwordService
                      .generateStrongPassword();

          DomainRegistry.passwordService.isStrong(password).should.be.true
          DomainRegistry.passwordService.isWeak(password).should.be.false
   })


  it("IsStrongPassword", function() {
    let password = "Th1sShudBStrong.";
    DomainRegistry.passwordService.isStrong(password).should.be.true
    DomainRegistry.passwordService.isVeryStrong(password).should.be.false
    DomainRegistry.passwordService.isWeak(password).should.be.false
  })

  it("IsVeryStrongPassword", function() {
    let password = "Th1sSh0uldBV3ryStrong!";
    DomainRegistry.passwordService.isVeryStrong(password).should.be.true
    DomainRegistry.passwordService.isStrong(password).should.be.true
    DomainRegistry.passwordService.isWeak(password).should.be.false
  })

  it("IsWeakPassword", function() {
    let password = "Weakness";
    DomainRegistry.passwordService.isVeryStrong(password).should.be.false
    DomainRegistry.passwordService.isStrong(password).should.be.false
    DomainRegistry.passwordService.isWeak(password).should.be.true
  })
})
