const Parser = require('jison').Parser;

var eventGrammar = {
  "lex": {
    "rules": [
      ["\\s+",      "/* skip whitespace */"],
      ["when",    "return 'WHEN'"],
      ["then",    "return 'THEN'"],
      ["$",         "return 'EOF'"],
      ["\\w*",     "return 'WORD'"],
      [".",        "return 'INVALID'"]
      
    ]
  },

  "bnf": {
    "events": [
      ["events event",    "var arr = $1; arr.push($2); $$ = arr"],
      ["event",           "$$ = $1"],
      ["events EOF",      "return $1"]
    ],

    "event": [
        ["WHEN WORD THEN WORD",     "$$ = [$2, $4]"]
    ]
  }
};

var parser = new Parser(eventGrammar);

// generate source, ready to be written to disk
//var parserSource = parser.generate();

// you can also use the parser directly from memory

console.log(parser.parse("when event1 then action1"));
// returns true

//parser.parse("adfe34bc zxg");
// throws lexical error