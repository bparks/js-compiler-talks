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
  / T_OPEN_EXPR expr:expr T_CLOSE_EXPR { return ast_expr(expr); }

expr
  = first:T_EXPR_PART rest:(subexpr)* { rest.unshift(first); return rest; }

subexpr
  = "." expr:T_EXPR_PART { return expr; }

//TERMINALS (TOKENS)

T_OPEN_EXPR
  = "{{"

T_CLOSE_EXPR
  = "}}"

T_EXPR_PART
  = expr:[^{}.]+ { return text(); } //Add a . to the disallowed characters

T_OTHER
  = [^{}]+ { return ast_other(text()); }
