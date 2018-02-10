"use strict";

const server = require("./server/svr.core");
const Consoler = require("./console/consoler");

const httpSvr = new server.HttpServer(8000);

httpSvr.on(server.HttpServer.ServerEvents.Throwed, (err) => {
    console.log(err.message);
});

httpSvr.Start();

const con = new Consoler({ HttpInstance: httpSvr },
    process.stdin,
    process.stdout
);

const menu =
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" +
    "~                                                                             ~\n" +
    "~             execute code: exec simply javascript code.                      ~\n" +
    "~             start http: start http server.                                  ~\n" +
    "~             pause http: pause http server.                                  ~\n" +
    "~             command: { 'cmd': [cmdname], 'args': [args] }                   ~\n" +
    "~                                                                             ~\n" +
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";

con.Print(menu);