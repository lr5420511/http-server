"use strict";

const server = require("./server/svr.core");

const httpSvr = new server.HttpServer(8000);

httpSvr.on(server.HttpServer.ServerEvents.Throwed, (err) => {
    console.log(err.message);
});

httpSvr.Start();