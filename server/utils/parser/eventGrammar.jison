/* description: Parses end executes mathematical expressions. */

/* lexical grammar */

%lex
%options flex
%x code

%%

\s+                   /* skip whitespace */
[\/\/].*              /* skip comments */
"when"                return 'WHEN'
"while"               return 'WHILE'
"once"                return 'ONCE'
"do"                  return 'DO'
"and"                 return 'AND'
"or"                  return 'OR'
"equals"              return 'EQUALS'
<<EOF>>               return 'EOF'
\w*(\.\w*)+(\(.*\))?.*    return 'COMPOSED_WORD'
[a-z]\w*              return 'WORD'
[0-9]+                return 'NUMBER'
[{]                   return 'BEGIN_CODE'
[}]                   return 'END_CODE'
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
    : type composed_condition DO procedure
        {$$ = [$2, "Functions." + $4 + "()", $1];}
    | type composed_condition DO BEGIN_CODE code END_CODE
        {$$ = [$2, $5, $1];}
    ;

procedure
    : WORD
        {$$ = $1}
    ;

code
    : code_line
        {$$ = $1}
    | code code_line
        {$$ = $1 + "\n" + $2}
    ;

code_line
    : WORD
        {$$ = $1}
    | COMPOSED_WORD
        {$$ = $1}
    | code_line INVALID
        {$$ = $1 + $2}
    | code_line NUMBER
        {$$ = $1 + $2}
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
    | composed_condition EQUALS condition
        {$$ = $1 + " == " + $3}
    | composed_condition EQUALS NUMBER
        {$$ = $1 + " == " + $3}
    ;

type
    : WHEN
        {$$ = "when"}
    | WHILE
        {$$ = "while"}
    | ONCE
        {$$ = "once"}
    ;