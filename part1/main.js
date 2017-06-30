/*
 * scanner -> lexer -> parser -> compiler
 */

/* provided a string, returns a function that returns one character at a time, or -1 at EOF */
function scanner(source) {
    var idx = -1;
    return function () {
        idx++;
        if (idx >= source.length)
            return -1;
        return source[idx];
    }
}

/*
//Test the scanner
var next = scanner("Hello, {{name}}");
var c = next();
while (c != -1) {
    console.log(c);
    c = next();
}
*/

/*
//First pass at lexer
function lexer(next) {
    return function() {
        var c = next();
        switch(c) {
            case '{':
                return "T_OPENBRACE";
            case '}':
                return "T_CLOSEBRACE";
            case -1:
                return "T_EOF";
            default:
                return "T_OTHER";
        }
    }
}
*/

/*
//Introduce multiple-character terminals
function lexer(next) {
    var peek = next();
    return function() {
        switch(peek) {
            case '{':
                peek = next();
                if (peek != '{') {
                    return "T_OPENBRACE";
                }
                peek = next();
                return "T_OPEN_EXPR";
            case '}':
                peek = next();
                if (peek != '}') {
                    return "T_CLOSEBRACE";
                }
                peek = next();
                return "T_CLOSE_EXPR";
            case -1:
                peek = next();
                return "T_EOF";
            default:
                peek = next();
                while (peek != '{' && peek != '}' && peek != -1) {
                    peek = next();
                }
                return "T_OTHER";
        }
    }
}
*/

/*
//Introduce states
function lexer(next) {
    var peek = next();
    var state = "initial";
    return function() {
        switch(peek) {
            case '{':
                peek = next();
                if (peek != '{') {
                    return "T_OPENBRACE";
                }
                state = "expr"
                peek = next();
                return "T_OPEN_EXPR";
            case '}':
                peek = next();
                if (peek != '}') {
                    return "T_CLOSEBRACE";
                }
                state = "initial";
                peek = next();
                return "T_CLOSE_EXPR";
            case -1:
                peek = next();
                return "T_EOF";
            default:
                peek = next();
                while (peek != '{' && peek != '}' && peek != -1) {
                    peek = next();
                }
                if (state == "initial") {
                    return "T_OTHER";
                } else if (state == "expr") {
                    return "T_EXPR";
                }
        }
    }
}
*/

/*
var next = lexer(scanner("Hello, {{name}}"));
var c = next();
var i = 0;
while (c != "T_EOF" && i < 300) {
    console.log(c);
    c = next();
    i++;
}
*/

function token(type, value) {
    return {
        type: type,
        value: value
    }
}

function lexer(next) {
    var peek = next();
    var state = "initial";
    return function() {
        switch(peek) {
            case '{':
                peek = next();
                if (peek != '{') {
                    return token("T_OPENBRACE", '{');
                }
                state = "expr"
                peek = next();
                return token("T_OPEN_EXPR");
            case '}':
                peek = next();
                if (peek != '}') {
                    return token("T_CLOSEBRACE", '}');
                }
                state = "initial";
                peek = next();
                return token("T_CLOSE_EXPR");
            case -1:
                peek = next();
                return token("T_EOF");
            default:
                var value = peek;
                peek = next();
                while (peek != '{' && peek != '}' && peek != -1) {
                    value += peek;
                    peek = next();
                }
                if (state == "initial") {
                    return token("T_OTHER", value);
                } else if (state == "expr") {
                    return token("T_EXPR", value);
                }
        }
    }
}

var next = lexer(scanner("Hello, {{name}}\n"));
var c = next();
var i = 0;
var model = {
    name: 'Brian'
};
while (c.type != "T_EOF" && i < 300) {
    //console.log(c.type);
    switch(c.type) {
        case "T_OPEN_EXPR":
        case "T_CLOSE_EXPR":
            break;
        case "T_OPENBRACE":
        case "T_CLOSEBRACE":
        case "T_OTHER":
            process.stdout.write(c.value);
            break;
        case "T_EXPR":
            process.stdout.write(model[c.value]);
            break;
        default:
            console.log('unknown type');
            console.log(c);
    }
    c = next();
    i++;
}
