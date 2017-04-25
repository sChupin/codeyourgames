var eventParser = require('../utils/parser/parser');

let parseEvent = function(req, res) {
    let code = req.body.code;
    let eventActionPairs = [];
    try {
        eventActionPairs = eventParser.parse(code);    
    } catch (e) {
        console.log(e);
    }

    res.type('application/json').status(200).json(eventActionPairs);
}
exports.parseEvent = parseEvent;