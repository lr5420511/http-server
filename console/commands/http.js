"use strict";

const commands = require("../consoler").Commands;

commands["start http"] = function(ins, args, callBack) {
    let result;
    if (ins.hasOwnProperty("HttpInstance")) {
        try {
            result = ins.HttpInstance.Start();
        } catch (err) {
            result = err.message;
        }
    }
    callBack(result);
};

commands["pause http"] = function(ins, args, callBack) {
    let result;
    if (ins.hasOwnProperty("HttpInstance")) {
        try {
            result = ins.HttpInstance.Stop();
        } catch (err) {
            result = err.message;
        }
    }
    callBack(result);
};