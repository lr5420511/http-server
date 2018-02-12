"use strict";

const server = require("./server/svr.core");
const Consoler = require("./console/consoler");

const httpSvr = new server.HttpServer(8000);

httpSvr.on(server.HttpServer.ServerEvents.Throwed, (err) => {
    console.log(err.message);
});

const menuConsole = new Consoler({ Http: httpSvr },
    process.stdin,
    process.stdout
);

menuConsole.Print(
    "******************************************************************************************************\n" +
    "*                                                                                                    *\n" +
    "*  exec-code [code]: Execute simply javascript code, async operat call asyncCaller.                  *\n" +
    "*  exit-node: Exit current nodejs process.                                                           *\n" +
    "*  start-http: Start http server at server side.                                                     *\n" +
    "*  pause-http: Pause http server at server side.                                                     *\n" +
    "*                                                                                                    *\n" +
    "*  Add more commands to /console/commands directory.                                                 *\n" +
    "*                                                                                                    *\n" +
    "******************************************************************************************************"
);

menuConsole.Accept();