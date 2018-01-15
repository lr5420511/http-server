"use strict";

const fs = require("fs");
const path = require("path");

exports.Router = function(method, isStatic, pathnames) {
    if (typeof method !== "string" || typeof isStatic !== "boolean") {
        throw new TypeError("Router.prototype.constructor: method or isStatic hasn't vaild type");
    }
    if (isStatic &&
        (typeof pathnames !== "string" &&
            !(pathnames instanceof Array))
    ) {
        throw new TypeError("Router.prototype.constructor: pathnames hasn't vaild type");
    }
    if (!isStatic && !(pathnames instanceof Object)) {
        throw new TypeError("Router.prototype.constructor: pathnames hasn't vaild type");
    }
    this.Method = method;
    this.IsStatic = isStatic;
    this.PathNames = pathnames;
};

exports.Router.prototype = {
    constructor: exports.Router,
    AddRoute: function(pathname, isCreat, ...methods) {
        if (methods.length <= 0) {
            throw new RangeError("Router.prototype.AddRoute: methods cann't empty");
        }
        if (!this.IsStatic) {
            isCreat = typeof isCreat === "boolean" ?
                isCreat : true;
            if (typeof pathname !== "string" || pathname === "") {
                throw new Error("Router.prototype.AddRoute: pathname isn't vaild value");
            }
            if (!this.PathNames.hasOwnProperty(pathname) &&
                isCreat) {
                this.PathNames[pathname] = [];
            }
        }
        let routes = this.IsStatic ?
            this.PathNames : this.PathNames[pathname];
        if (!(routes instanceof Array)) {
            throw new TypeError("Router.prototype.AddRoute: route hasn't loaded");
        }
        routes.push(methods);
        return this;
    },
    Execute: function(pathname, req, res) {
        let route = this.IsStatic ?
            this.PathNames : this.PathNames[pathname];
        if (typeof route === "undefined") {
            throw new Error(exports.Router.WarnResponse.ROUTE_UN_FOUND);
        }
        if (typeof route === "string") {
            exports.Router.MakeModuleWrapper(this, pathname);
            route = this.IsStatic ?
                this.PathNames : this.PathNames[pathname];
        }
        if (route.length <= 0) {
            throw new RangeError(exports.Router.WarnResponse.ROUTE_NO_HANDLES);
        }
        exports.Router.ExecuteMethods(route, req, res);
    },
    RemoveRoute: function(pathname) {
        if (!this.IsStatic &&
            this.PathNames.hasOwnProperty(pathname)) {
            delete this.PathNames[pathname];
        }
    },
    ClearRoutes: function() {
        this.PathNames = this.IsStatic ? [] : {};
    }
};

Object.defineProperties(exports.Router, {
    WarnResponse: {
        writable: false,
        enumerable: true,
        value: {
            HTTP_METHOD_NON_SUPPORT: "HTTP_METHOD_NON_SUPPORT",
            RESOURCE_CLASS_NON_SUPPORT: "RESOURCE_CLASS_NON_SUPPORT",
            ROUTE_UN_FOUND: "ROUTE_UN_FOUND",
            RESOURCE_NO_EXIST: "RESOURCE_NO_EXIST",
            RESOURCE_EXIST: "RESOURCE_EXIST",
            RESOURCE_ERROR_STATUS: "RESOURCE_ERROR_STATUS",
            ROUTE_NO_HANDLES: "ROUTE_NO_HANDLES"
        }
    },
    MakeModuleWrapper: {
        writable: false,
        enumerable: false,
        value: function(router, pathname) {
            if (!(router instanceof exports.Router)) {
                throw new TypeError("Router.MakeModuleWrapper: router isn't vaild instance");
            }
            if (!router.IsStatic &&
                !router.PathNames.hasOwnProperty(pathname)) {
                throw new Error("Router.MakeModuleWrapper: pathname hasn't route");
            }
            let sourcePath = router.IsStatic ?
                router.PathNames : router.PathNames[pathname];
            sourcePath = path.resolve(sourcePath);
            let sourceDir = path.dirname(sourcePath);
            if (router.IsStatic) {
                router.PathNames = [];
            } else {
                router.PathNames[pathname] = [];
            }
            let targetCode = fs.readFileSync(sourcePath, "utf8");
            eval("(function(router, pathname, require, __dirname, __filename) { " + targetCode + " })")
                (
                    router,
                    pathname,
                    require,
                    sourceDir,
                    sourcePath
                )
        }
    },
    ExecuteMethods: {
        writable: false,
        enumerable: false,
        value: function(route, req, res) {
            if (!(route instanceof Array)) {
                throw new TypeError("Router.ExecuteMethods: route hasn't vaild type");
            }
            for (let rIndex = 0; rIndex < route.length; rIndex++) {
                let curMethods = route[rIndex];
                if (curMethods instanceof Array) {
                    let next = true;
                    for (let mIndex = 0; mIndex < curMethods.length; mIndex++) {
                        let curMethod = curMethods[mIndex];
                        if (curMethod instanceof Function) {
                            next = curMethod(req, res);
                            if (typeof next !== "boolean" || !next) {
                                break;
                            }
                        }
                    }
                    if (typeof next !== "boolean") {
                        break;
                    }
                }
            }
        }
    },
    StaticGetMethod: {
        writable: true,
        enumerable: false,
        value: function(req, res) {
            if (typeof req.url.publicDir !== "string") {
                throw new Error("Router.StaticGetMethod: public directory isn't vaild");
            }
            let resource = req.GetResourcePath(req.url.publicDir);
            try {
                resource = fs.realpathSync(resource);
            } catch (err) {
                throw new Error(exports.Router.WarnResponse.RESOURCE_NO_EXIST);
            }
            res.Send(200, req.url.contentType, fs.createReadStream(resource));
            return true;
        }
    }
});