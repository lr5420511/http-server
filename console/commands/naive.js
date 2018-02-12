"use strict";

const commands = require("../consoler").Commands;

commands["execute-code"] = function(context, args) {
    return eval(args.join(" "));
};