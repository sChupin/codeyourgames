/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
"when"                return 'WHEN'
"while"               return 'WHILE'
"once"                return 'ONCE'
"then"                return 'THEN'
"and"                 return 'AND'
"or"                  return 'OR'
<<EOF>>               return 'EOF'
\w*(\.\w*)+(\(\))?    return 'COMPOSED_WORD'
[a-z]\w*              return 'WORD'
"("                   return '('
")"                   return ')'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%start expressions

%% /* language grammar */

expressions
    : expressions event
        {
         var arr = $1;
         arr.push($2);
         $$ = arr;
        }
    | event
        {$$ = [$1];}
  
    | expressions EOF
        {return $1;}
    ;

event
    : type composed_condition THEN WORD
        {$$ = [$2, $4, $1];}
    ;

condition
    : WORD
        {$$ = $1}
    | COMPOSED_WORD
        {$$ = $1}
    ;

composed_condition
    : condition
        {$$ = $1}
    | composed_condition AND condition
        {$$ = $1 + " && " + $3}
    | composed_condition OR condition
        {$$ = $1 + " || " + $3}
    ;

type
    : WHEN
        {$$ = "when"}
    | WHILE
        {$$ = "while"}
    | ONCE
        {$$ = "once"}
    ;