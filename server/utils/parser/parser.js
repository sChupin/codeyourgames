var fs = require("fs");
var jison = require("jison");

// Event Parser
var eventBNF = fs.readFileSync(__dirname + "/eventGrammar.jison", "utf8");
var eventParser = new jison.Parser(eventBNF);
module.exports = eventParser;

// Function Parser
// var functionBNF = fs.readFileSync(__dirname + "/functionGrammar.jison", "utf8");
// var functionParser = new jison.Parser(functionBNF);
// module.exports = functionParser;