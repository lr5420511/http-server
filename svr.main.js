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
    "*  execute-code [code]: Execute simply javascript code.                                              *\n" +
    "*  start-http-server: Start http server at server side.                                              *\n" +
    "*  pause-http-server: Pause http server at server side.                                              *\n" +
    "*                                                                                                    *\n" +
    "*  Add more commands to /console/commands directory.                                                 *\n" +
    "*                                                                                                    *\n" +
    "******************************************************************************************************"
);

menuConsole.Accept();