var fs = require("fs");
var jison = require("jison");

// Event Parser
var bnf = fs.readFileSync(__dirname + "/eventGrammar.jison", "utf8");
var eventParser = new jison.Parser(bnf);
module.exports = eventParser;