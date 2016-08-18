module.exports = {
  generateExternalRepresentation: (thing) => {
    return JSON.stringify(thing).replace(/"_(\w+)"/g, "\"$1\"")
  }
}
