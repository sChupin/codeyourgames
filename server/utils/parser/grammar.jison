/* lexical grammar */

%lex
%options flex
%x code


/* global variables */
%{
if (!('instructions' in yy)) {
  yy.instructions = "";
  yy.events = [];
  yy.functions = [];
  yy.types = [];
}

%}


%%

\s+                     /* skip whitespace */
[\/\/].*                /* skip comments */
[/][*][^*]*[*]+([^*/][^*]*[*]+)*[/] /* skip multiline comment */
";"                     return 'SEMICOLON'
"."                     return 'DOT'
","                     return 'COMMA'
"("                     return 'LPAR'
")"                     return 'RPAR'
"{"                     return 'LBRACE'
"}"                     return 'RBRACE'
"let"                   return 'LET'
"if"                    return 'IF'
"then"                  return 'THEN'
"else"                  return 'ELSE'
"repeat"                return 'REPEAT'
"forever"               return 'FOREVER'
"when"                  return 'WHEN'
"while"                 return 'WHILE'
"once"                  return 'ONCE'
"do"                    return 'DO'
"function"              return 'FUNCTION'
"return"                return 'RETURN'
"="                     return 'EQUAL'
"+"                     return 'PLUS'
"-"                     return 'MINUS'
"*"                     return 'TIMES'
"/"                     return 'DIV'
"and"                   return 'AND'
"or"                    return 'OR'
"not"                   return 'NOT'
"greater_than"          return 'GREATER'
"lower_than"            return 'LOWER'
"equals"                return 'EQUALS'
("true"|"false")        return 'BOOLEAN'
(\".*\"|\'.*\')         return 'TEXT'
"-"?[0-9]+("."[0-9]+)?  return 'NUMBER'
[a-zA-Z][a-zA-Z0-9_]*   return 'IDENTIFIER'
<<EOF>>                 return 'EOF'
.                       return 'INVALID'

/lex

/* operator associations and precedence */
%left 'AND' 'OR'
%right 'NOT'
%left 'PLUS' 'MINUS'
%left 'TIMES' 'DIV'
%nonassoc 'GREATER' 'LOWER' 'EQUALS' 

%start expressions

%% /* language grammar */

expressions
    : expressions p
    | p
    | expressions EOF
        { var ret = { 
            instructions: yy.instructions,
            events: yy.events,
            functions: yy.functions,
            types: yy.types
          };

          yy.instructions = "";
          yy.events = [];
          yy.functions = [];
          yy.types = [];
          
          return ret;
        }
;

p
    : instruction
        {yy.instructions += $1;}
    | event
        {yy.events.push($1);}
    | function
        {yy.functions.push($1);}
    | type
        {yy.types.push($1);}
;

instruction
    : expr SEMICOLON
        {$$ = $1 + $2 + "\n";}
    | assignment SEMICOLON
        {$$ = $1 + $2 + "\n";}
    | declaration SEMICOLON
        {$$ = $1 + $2 + "\n";}
    | control_flow
    | return_statement SEMICOLON
        {$$ = $1 + $2;}
;

instructions
    : instruction
    | instructions instruction
        {$$ = $1 + $2;}
;

expr
    : TEXT
    | NUMBER
    | BOOLEAN
    | field_access
    | method_call
    | expr PLUS expr
        {$$ = $1 + " + " + $3;}
    | expr MINUS expr
        {$$ = $1 + " - " + $3;}
    | expr TIMES expr
        {$$ = $1 + " * " + $3;}
    | expr DIV expr
        {$$ = $1 + " / " + $3;}
    | expr AND expr
        {$$ = $1 + " && " + $3;}
    | expr OR expr
        {$$ = $1 + " || " + $3;}
    | NOT expr
        {$$ = '!' + $2;}
    | expr GREATER expr
        {$$ = $1 + " > " + $3;}
    | expr LOWER expr
        {$$ = $1 + " < " + $3;}
    | expr EQUALS expr
        {$$ = $1 + " == " + $3;}
    | LPAR expr RPAR
        {$$ = $1 + $2 + $3;}
;

field_access
    : IDENTIFIER
    | field_access DOT IDENTIFIER
        {$$ = $1 + $2 + $3;}
;

method_call
    : field_access LPAR args RPAR
        {$$ = $1 + $2 + $3 + $4;}
;

args
    : %empty
        {$$ = "";}
    | expr more-args
        {$$ = $1 + $2;}
;

more-args
    : %empty
        {$$ = "";}
    | COMMA expr more-args
        {$$ = $1 + $2 + $3;}
;

assignment
    : IDENTIFIER EQUAL expr
        {$$ = $1 + " = " + $3;}
;

declaration
    : LET IDENTIFIER
        {$$ = "var " + $2;}
    | LET IDENTIFIER EQUAL expr
        {$$ = "var " + $2 + " = " + $4;}
;

control_flow
    : IF LPAR expr RPAR THEN block
        {$$ = $1 + " " + $2 + $3 + $4 + " " + $6;}
    | IF LPAR expr RPAR THEN block ELSE block
        {$$ = $1 + " " + $2 + $3 + $4 + " " + $6 + " " + $7 + " " + $8;}
    | REPEAT LPAR expr RPAR block
        {$$ = "for (let _i = 0; _i < " + $3 + "; _i++) " + $5;}
    | FOREVER block
        {$$ = "while (true) " + $2;}
;

return_statement
    : RETURN expr
        {$$ = $1 + " " + $2;}
;

block
    : LBRACE RBRACE
        {$$ = $1 + " " + $2;}
    | LBRACE instructions RBRACE
        {$$ = $1 + "\n" + $2 + $3;}
;

event
    : WHEN LPAR expr RPAR DO block
        {$$ = [$3, "() => " + $6, "when"];}
    | WHILE LPAR expr RPAR DO block
        {$$ = [$3, "() => " + $6, "while"];}
    | ONCE LPAR expr RPAR DO block
        {$$ = [$3, "() => " + $6, "once"];}
;

function
    : FUNCTION IDENTIFIER LPAR params RPAR block
        {$$ = $1 + " " + $2 + $3 + $4 + $5 + $6;}
;

params
    : %empty
        {$$ = "";}
    | IDENTIFIER more-params
        {$$ = $1 + $2;}
;

more-params
    : %empty
        {$$ = ""}
    | COMMA IDENTIFIER more-params
        {$$ = $1 + $2 + $3;}
;
