var parser = require('../utils/parser/parser');

let parse = function(req, res) {
    let code = req.body.code;
    let parseResult = [];
    if (code) {
        try {
            parseResult = parser.parser.parse(code);
        } catch (e) {
            console.log(e);
        }
    }

    res.type('application/json').status(200).json(parseResult);
}
exports.parse = parse;
