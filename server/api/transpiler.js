var parser = require('../utils/parser/parser');

let parseEvent = function(req, res) {
    let code = req.body.code;
    let eventActionPairs = [];
    if (code) {
        try {
            eventActionPairs = parser.eventParser.parse(code);    
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
            // func == "" if several \n
            if (func) {
                let pair = func.split(/ = (.+)/);
                pair.pop();
                functionPairs.push(pair);
            }
        }, this);
    }
    res.type('application/json').status(200).json(functionPairs);
}
exports.parseFunction = parseFunction;

let parseCollision = function(req, res) {
    let code = req.body.code;
    let collisionTuple = [];
    if (code) {
        try {
            collisionTuple = parser.collisionParser.parse(code);    
        } catch (e) {
            console.log(e);
        }
    }

    res.type('application/json').status(200).json(collisionTuple);
}
exports.parseCollision = parseCollision;