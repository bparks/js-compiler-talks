var parser = require('./part1_5');

//**** THE NEW PART ****//

function handleExpr (model, expr) {
    var parts = expr.split(".");
    var obj = model;
    for (var i = 0; i < parts.length; i++) {
        if (typeof obj === 'undefined') break;
        obj = obj[parts[i]];
    }
    return obj || "(null)";
}

//**** END THE NEW PART ****//

var model = {
    name: "Brian",
    employer: {
        company: "Cherwell Software",
        role: "Senior Software Engineer",
        department: "Research & Development"
    },
    favoriteLanguages: [
        "C",
        "Javascript",
        "C#",
        "PHP"
    ]
};
var doc = "Hello, {{name}}. You are a {{employer.role}} at \n" +
          "  {{employer.company}} in the {{employer.department}}\n" +
          "  department. Your favorite language is {{favoriteLanguages.0}}.";

var ast = parser.parse(doc);

console.log(ast);

for (var i = 0; i < ast.length; i++) {
    if (ast[i].type == "expr") {
        process.stdout.write(handleExpr(model, ast[i].val));
    } else {
        process.stdout.write(ast[i].val);
    }
}

console.log();
