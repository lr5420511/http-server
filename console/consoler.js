"use strict";

const Events = require("events").EventEmitter;
const { Readable, Writable } = require("stream");

const Consoler = function(ctx, input, output, prompt = ">") {
    if (!(input instanceof Readable) || !(output instanceof Writable)) {
        throw new TypeError("Consoler.constructor: input or output isn't vaild stream.");
    }
    ctx = ctx instanceof Object ? ctx : {};
    prompt = typeof prompt === "string" ? prompt : ">";
    this.Context = ctx;
    this.Inner = input;
    this.Outer = new console.__proto__.constructor(output);
    this.Outer.src = output;
    this.Prompt = prompt;
    Events.apply(this, Array.prototype.slice.call(arguments, 4));
};

Consoler.prototype = {
    constructor: Consoler,
    __proto__: Events.prototype,
    Print: function(ctn) {
        this.Outer.log(ctn);
        this.Outer.src.write("\n" + this.Prompt);
    },
    Accept: function(decode = "utf8") {
        decode = typeof decode === "string" ? decode : "utf8";
        const cur = this;
        this.Inner._events["data"] = [];
        this.Inner.on("data", (chunk) => {
            chunk = chunk.toString(decode);
            const cmdArray = Consoler.HandleCommand(chunk);
            if (cmdArray[0] === "") {
                const message = "Input command can't be empty.";
                cur.Print(message);
                cur.emit(Consoler.Events.BeforeExec, new Error(message));
            } else {
                Consoler.Execute(cur, cmdArray[0], cmdArray.slice(1));
            }
        });
    }
};

Object.defineProperties(Consoler, {
    Events: {
        writable: false,
        enumerable: true,
        value: {
            BeforeExec: "BEFORE_EXECUTE",
            AfterExec: "AFTER_EXECUTE"
        }
    },
    Commands: {
        writable: false,
        enumerable: true,
        value: {}
    },
    HandleCommand: {
        writable: false,
        enumerable: true,
        value: function(cmd) {
            cmd = cmd.trim();
            const single = " ";
            const double = "  ";
            while (cmd.includes(double)) {
                cmd = cmd.replace(double, single);
            }
            return cmd.split(single);
        }
    },
    Execute: {
        writable: false,
        enumerable: true,
        value: function(cur, cmd, args) {
            const cmdExist = Consoler.Commands.hasOwnProperty(cmd);
            if (cmdExist) {
                cur.emit(Consoler.Events.BeforeExec, undefined, cmd, args);
                const method = Consoler.Commands[cmd];
                let result;
                try {
                    result = method(cur.Context, args, function() {
                        cur.Print(Array.prototype.slice.call(arguments, 0));
                    });
                } catch (err) {
                    result = err;
                }
                cur.Print(result);
                cur.emit(Consoler.Events.AfterExec, result, cmd, args);
            } else {
                const message = cmd + " command not found.";
                cur.Print(message);
                cur.emit(Consoler.Events.BeforeExec, new Error(message));
            }
        }
    }
});

module.exports = Consoler;
require("./cmd-config");