"use strict";

const commands = require("../consoler").Commands;

commands["execute code"] = function(ins, args, callBack) {
    let result;
    try {
        result = eval(args.code);
    } catch (err) {
        result = err.message;
    }
    callBack(result);
};