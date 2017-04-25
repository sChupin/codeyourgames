/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
"when"                return 'WHEN'
"then"                return 'THEN'
<<EOF>>               return 'EOF'
\w*                   return 'WORD'
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
    : WHEN WORD THEN WORD
        {$$ = [$2, $4];}
    ;
