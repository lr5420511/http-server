"use strict";

const fs = require("fs");
const path = require("path");
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

commands["mk-dir"] = function(context, args, callBack) {
    args[0] = path.normalize(args[0]);
    return fs.mkdir(args[0], (err) => {
        const result = err instanceof Object ? err :
            (path.isAbsolute(args[0]) ? args[0] : path.resolve(args[0]));
        callBack(result);
    });
};

commands["mk-doc"] = function(context, args, callBack) {
    args[0] = path.normalize(args[0]);
    return fs.appendFile(args[0], args[2], args[1], (err) => {
        const result = err instanceof Object ? err :
            (path.isAbsolute(args[0]) ? args[0] : path.resolve(args[0]));
        callBack(result);
    });
};