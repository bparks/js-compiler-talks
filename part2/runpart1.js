var parser = require('./part1');

var model = {
    name: "Brian"
};
var doc = "Hello, {{name}}";

var ast = parser.parse(doc);

console.log(ast);

for (var i = 0; i < ast.length; i++) {
    if (ast[i].type == "expr") {
        process.stdout.write(model[ast[i].val]);
    } else {
        process.stdout.write(ast[i].val);
    }
}

console.log();
