"use strict";

const commands = require("../consoler").Commands;

commands["start-http-server"] = function(context, args) {
    return context.Http.Start();
};

commands["pause-http-server"] = function(context, args) {
    return context.Http.Stop();
};