var fs = require("fs");
var jison = require("jison");

// Event Parser
var eventBNF = fs.readFileSync(__dirname + "/eventGrammar.jison", "utf8");
var eventParser = new jison.Parser(eventBNF);
exports.eventParser = eventParser;

// Function Parser
// var functionBNF = fs.readFileSync(__dirname + "/functionGrammar.jison", "utf8");
// var functionParser = new jison.Parser(functionBNF);
// module.exports = functionParser;

// Collision Parser
var collisionBNF = fs.readFileSync(__dirname + "/collisionGrammar.jison", "utf8");
var collisionParser = new jison.Parser(collisionBNF);
exports.collisionParser = collisionParser;