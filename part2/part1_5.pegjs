{

function ast_other(other) {
    return {type: "literal", val: other};
}

function ast_expr(expr) {
    return {type: "expr", val: expr};
}

}

start
  = ast:term*
  / ""

term
  = T_OTHER
  / T_OPEN_EXPR expr:T_EXPR T_CLOSE_EXPR { return expr; }


//TERMINALS (TOKENS)

T_OPEN_EXPR
  = "{{"

T_CLOSE_EXPR
  = "}}"

T_EXPR
  = expr:[^{}]+ { return ast_expr(expr.join('')); }

T_OTHER
  = [^{}]+ { return ast_other(text()); }
