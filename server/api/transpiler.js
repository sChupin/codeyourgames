var eventParser = require('../utils/parser/parser');

let parseEvent = function(req, res) {
    let code = req.body.code;
    let eventActionPairs = [];
    if (code) {
        try {
            eventActionPairs = eventParser.parse(code);    
        } catch (e) {
            console.log(e);
        }
    }

    res.type('application/json').status(200).json(eventActionPairs);
}
exports.parseEvent = parseEvent;

let parseFunction = function(req, res) {
    let code = req.body.code;
    let functionPairs = [];
    if (code) {
        code.split("\n").forEach(function(func) {
            functionPairs.push(func.split(" = "));
        }, this);
    }
    res.type('application/json').status(200).json(functionPairs);
}
exports.parseFunction = parseFunction;