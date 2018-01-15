"use strict";

require("./mainifest/message");
const http = require("http");
const path = require("path");
const fs = require("fs");
const events = require("events");
const router = require("./mainifest/router");

const CORE_CONFIG_PATH = path.join(__dirname, "svr-core.json"),
    HTTP_SERVER_EVENTS = {
        Started: "HTTP_SERVER_STARTED",
        Paused: "HTTP_SERVER_STOPED",
        Received: "HTTP_SERVER_RECEIVED",
        Throwed: "HTTP_SERVER_THROWED",
        Executed: "HTTP_SERVER_SYNC_EXECUTED"
    };

exports.HttpServer = function(tcpPoint = 80) {
    if (typeof tcpPoint !== "number") {
        tcpPoint = 80;
    }
    let cur = this;
    this.TcpPoint = Number.parseInt(tcpPoint);
    this.ServerStatus = "Creat"; // Creat, Listen or Stop
    this.ServerEntry = http.createServer();
    this.Routers = [];
    events.EventEmitter.apply(this, []);
    this.ServerEntry.on("request", (req, res) => {
        try {
            exports.HttpServer.ReceiveRequest(cur, req, res);
        } catch (err) {
            let msg = err.message;
            cur.emit(HTTP_SERVER_EVENTS.Throwed, err, cur);
            if (core.WarnResponse.hasOwnProperty(msg)) {
                let warn = core.WarnResponse[msg];
                res.Send(
                    warn.Code,
                    warn.Type,
                    (
                        warn.Content.IsStatic ?
                        fs.createReadStream(warn.Content.Source) :
                        Buffer.from(warn.Content.Source)
                    )
                );
            } else {
                throw err;
            }
        }
    });
};

exports.HttpServer.prototype = {
    constructor: exports.HttpServer,
    __proto__: events.EventEmitter.prototype,
    Start: function() {
        if (this.ServerStatus === "Listen") {
            throw new Error("HttpServer.prototype.Start: Server cann't start listen");
        }
        let cur = this,
            routers = exports.HttpServer.UnSerializeToJson(ROUTERS_PATH);
        this.AddRouter("GET", true, [
            [router.Router.StaticGetMethod]
        ]);
        routers.forEach((r) => {
            cur.AddRouter(r.Method, r.IsStatic, r.Paths);
        });
        this.ServerEntry.listen(this.TcpPoint, () => {
            cur.ServerStatus = "Listen";
            cur.emit(HTTP_SERVER_EVENTS.Started, cur);
        });
    },
    Stop: function() {
        if (this.ServerStatus !== "Listen") {
            throw new Error("HttpServer.prototype.Stop: Server cann't stop listen");
        }
        let cur = this;
        this.ServerEntry.close(() => {
            cur.ServerStatus = "Stop";
            cur.ClearRouters();
            cur.emit(HTTP_SERVER_EVENTS.Paused, cur);
        });
    },
    GetRouterIndex: function(method, isStatic) {
        let rIndex;
        this.Routers.forEach((r, i) => {
            if (r.Method === method &&
                r.IsStatic === isStatic) {
                rIndex = i;
                return;
            }
        });
        return rIndex;
    },
    AddRouter: function(method, isStatic, paths) {
        let rIndex = this.GetRouterIndex(method, isStatic);
        if (typeof rIndex === "number") {
            throw new Error("HttpServer.prototype.AddRouter: router has exist");
        }
        this.Routers.push(
            new router.Router(method, isStatic, paths)
        );
    },
    RemoveRouter: function(method, isStatic) {
        let rIndex = this.GetRouterIndex(method, isStatic);
        if (typeof rIndex === "number") {
            this.Routers.splice(rIndex, 1);
        }
    },
    ClearRouters: function() {
        if (this.Routers.length > 0) {
            this.Routers = [];
        }
    }
};

Object.defineProperties(exports.HttpServer, {
    ServerEvents: {
        writable: false,
        enumerable: true,
        value: HTTP_SERVER_EVENTS
    },
    UnSerializeToJson: {
        writable: false,
        enumerable: false,
        value: function(source, decode = "utf8") {
            source = path.resolve(source);
            return JSON.parse(fs.readFileSync(source, decode));
        }
    },
    ReceiveRequest: {
        writable: true,
        enumerable: false,
        value: function(server, req, res) {
            let isStatic = req.IsStaticRequest(),
                rIndex = server.GetRouterIndex(
                    req.method,
                    isStatic
                );
            if (typeof rIndex !== "number") {
                throw new Error(
                    router.Router.WarnResponse.HTTP_METHOD_NON_SUPPORT
                );
            }
            if (isStatic) {
                let ext = req.GetResourceExt();
                if (!core.StaticResource.hasOwnProperty(ext)) {
                    throw new Error(
                        router.Router.WarnResponse.RESOURCE_CLASS_NON_SUPPORT
                    );
                }
                req.url.publicDir = core.StaticDirectory;
                req.url.contentType = core.StaticResource[ext];
            }
            let curRouter = server.Routers[rIndex];
            server.emit(HTTP_SERVER_EVENTS.Received, server, req, res);
            curRouter.Execute(req.url.pathname, req, res);
            server.emit(HTTP_SERVER_EVENTS.Executed, server, req, res);
        }
    }
});

const core = exports.HttpServer.UnSerializeToJson(
    CORE_CONFIG_PATH
);
const ROUTERS_PATH = path.join(
    __dirname,
    core.RoutersPath
);