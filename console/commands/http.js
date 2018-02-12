"use strict";

const commands = require("../consoler").Commands;

commands["start-http"] = function(context, args, callBack) {
    const svr = context.Http;
    svr.Start();
    return svr.once("HTTP_SERVER_STARTED",
        (server) => {
            callBack("Http server is running at tcp " + server.TcpPoint + " point.");
        }
    );
};

commands["pause-http"] = function(context, args, callBack) {
    const svr = context.Http;
    svr.Stop();
    return svr.once("HTTP_SERVER_STOPED",
        (server) => {
            callBack("Http server has stoped at tcp " + server.TcpPoint + " point.");
        }
    );
};