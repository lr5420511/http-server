"use strict";

const http = require("http");
const url = require("url");
const query = require("querystring");
const path = require("path");
const fs = require("fs");

Object.defineProperties(http.OutgoingMessage.prototype, {
    Send: {
        writable: false,
        enumerable: false,
        value: function(code, type, source, finished) {
            if (!(source instanceof Buffer) &&
                !(source instanceof fs.ReadStream)) {
                throw new TypeError("OutgoingMessage.prototype.Send: source isn't vaild");
            }
            let cur = this;
            this.once("finish", () => {
                if (finished instanceof Function) {
                    finished(cur);
                }
            });
            this.writeHead(code, { "Content-Type": type });
            if (source instanceof Buffer) {
                this.write(source);
                this.end();
            } else {
                source.pipe(this);
            }
        }
    }
});

Object.defineProperties(http.IncomingMessage.prototype, {
    Handle: {
        writable: true,
        enumerable: false,
        value: function(isUpperMethod = true) {
            if (typeof isUpperMethod !== "boolean") {
                isUpperMethod = true;
            }
            this.url = url.parse(this.url);
            this.url.query = query.parse(this.url.query);
            this.method = isUpperMethod ?
                this.method.toUpperCase() :
                this.method.toLowerCase();
        }
    },
    IsStaticRequest: {
        writable: false,
        enumerable: false,
        value: function() {
            if (typeof this.url === "string") {
                this.Handle();
            }
            return path.extname(this.url.pathname).length > 1;
        }
    },
    GetResourceExt: {
        writable: false,
        enumerable: false,
        value: function() {
            return this.IsStaticRequest() ?
                path.extname(this.url.pathname).toLowerCase().replace(".", "") :
                undefined;
        }
    },
    GetResourcePath: {
        writable: false,
        enumerable: false,
        value: function(publicDir = ".") {
            return this.IsStaticRequest() ?
                path.join(publicDir, this.url.pathname) :
                undefined;
        }
    }
});