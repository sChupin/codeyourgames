/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
"Collision"           return 'COLLISION'
"Overlap"             return 'OVERLAP'
"("                   return 'BEGIN_ARGS'
")"                   return 'END_ARGS'
","                   return 'SEPARATOR'
"="                   return 'EQUAL'
\w*(\.\w*)+(\(.*\))?    return 'COMPOSED_WORD'
[a-z]\w*              return 'WORD'
[{]                   return 'BEGIN_CODE'
[}]                   return 'END_CODE'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */
%start expressions

%% /* language grammar */

expressions
    : expressions definition
        {
         var arr = $1;
         arr.push($2);
         $$ = arr;
        }
    | definition
        {$$ = [$1];}
  
    | expressions EOF
        {return $1;}
    ;

definition
    : type BEGIN_ARGS COMPOSED_WORD SEPARATOR COMPOSED_WORD END_ARGS
        {$$ = [$1, $3, $5];}
    | type BEGIN_ARGS COMPOSED_WORD SEPARATOR COMPOSED_WORD END_ARGS EQUAL body
        {$$ = [$1, $3, $5, $8];}
    ;

type
    : COLLISION
        {$$ = "collision";}
    | OVERLAP
        {$$ = "overlap";}
    ;

body
    : WORD
        {$$ = "Functions." + $1 + "(obj1, obj2)";}
    | BEGIN_CODE code END_CODE
        {$$ = $2;}
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
    ;