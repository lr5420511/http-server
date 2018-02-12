"use strict";

const commands = require("../consoler").Commands;

commands["exec-code"] = function(context, args, callBack) {
    const code = args.join(" ");
    return eval("(function(asyncCaller) { return " + code + " })")
        (
            callBack
        );
};

commands["exit-node"] = function(context, args, callBack) {
    process.exit(0);
};