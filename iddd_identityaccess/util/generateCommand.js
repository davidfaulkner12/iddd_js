// node util/generateCommand.js ./application/command/ ../../IDDD_Samples/iddd_identityaccess/src/main/java/com/saasovation/identityaccess/application/command/*
// node util/generateCommand.js ./application/command/ ../../IDDD_Samples/iddd_identityaccess/src/main/java/com/saasovation/identityaccess/application/command/AssignUserToRoleCommand.java

const path = require("path")
const fs = require("fs")
const _ = require("underscore")
const handlebars = require("handlebars")

let args = process.argv.slice(2)

let dir = args.shift()


// Empty out file and close it

let commandFile = path.join(dir, "Commands.js")

fs.writeFileSync(commandFile, "")

_.each(args, (arg) => {
  let filename = path.basename(arg, ".java")
  fs.readFile(arg, "utf8", (err, data) => {
    console.log(filename + ":", data.length)
    let matches = []
    let match = null
    let bigRe = new RegExp("public " + filename + "\((.*)\)")
    data = bigRe.exec(data)[1]
    let re = /(\w+) (\w+)/g
      while((match = re.exec(data)) != null) {
        matches.push(match)
      }
    // Now we can transform the data
    let fields = _.map(matches, (match) => {

      let name = match[2]
      if (name.startsWith("a") && name.charAt(1).toUpperCase() == name.charAt(1)) {
        console.log("Found one!", name)
        let firstLetter = name.charAt(1)
        name = firstLetter.toLowerCase() + name.slice(2)
        console.log("Fixed it", name)
      }
      return {
        name: name,
        type: match[1],
        // Need to do this to make the template simple
        isString: match[1] == "String",
        isDate: match[1] == "Date",
        isBoolean: match[1] == "boolean"
      }
    })
    createJsFile({filename: filename, fields: fields})
  })
})

let createJsFile = (obj) => {
  console.log("Creating JS file for", obj.filename, obj.fields)
  let jsFile = template(obj)
  //console.log(jsFile)
  fs.writeFile(path.join(dir, obj.filename + ".js"), jsFile)
  fs.appendFile(commandFile, "module.exports." + obj.filename + " = require(\"./" + obj.filename + "\")\n")
}

let template = handlebars.compile(
`const _ = require("underscore")
const AssertionConcern = require("../../common/AssertionConcern")


class {{filename}} extends AssertionConcern {
  constructor(
    {{#each fields}}

      {{this.name}}{{#unless @last}},{{/unless}}
    {{/each}}
  ) {
    super()

    {{#each fields}}
    this.assertArgumentNotNull({{this.name}}, "{{this.name}} must be provided.")
    {{#if this.isString}}
    this.assertArgumentTrue(_.isString({{this.name}}), "{{this.name}} must be a String")
    {{/if}}
    {{#if this.isDate}}
    this.assertArgumentTrue(_.isDate({{this.name}}), "{{this.name}} must be a Date")
    {{/if}}
    {{#if this.isBoolean}}
    this.assertArgumentTrue(_.isBoolean({{this.name}}), "{{this.name}} must be a boolean")
    {{/if}}
    this._{{this.name}} = {{this.name}}

    {{/each}}
  }

  {{#each fields}}
  get {{this.name}}() {
    return this._{{this.name}}
  }
  {{/each}}
}

module.exports = {{filename}}
`)
