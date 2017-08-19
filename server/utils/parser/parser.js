var fs = require("fs");
var jison = require("jison");

// Event Parser
var BNF = fs.readFileSync(__dirname + "/grammar.jison", "utf8");
var parser = new jison.Parser(BNF);
exports.parser = parser;
