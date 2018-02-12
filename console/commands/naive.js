"use strict";

const commands = require("../consoler").Commands;

commands["execute-code"] = function(cons, context, args) {
    return eval(args.join(" "));
};

commands["exit-node"] = function(cons, context, args) {
    process.exit(0);
};