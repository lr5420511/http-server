"use strict";

const server = require("./server/svr.core");

const httpSvr = new server.HttpServer(8000);

httpSvr.Start();