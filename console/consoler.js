"use strict";

const Events = require("events").EventEmitter;
const { Readable, Writable } = require("stream");

const Consoler = function(ins, input, output, prompt = ">") {
    if (!(ins instanceof Object) && typeof ins !== "object") {
        throw new TypeError("Consoler.constructor: ins of argument isn't instance of Object.");
    }
    if (!(input instanceof Readable) || !(output instanceof Writable)) {
        throw new TypeError("Consoler.constructor: input or output of argument isn't vaild stream.");
    }
    if (typeof prompt !== "string") {
        prompt = ">";
    }
    this.Instance = ins;
    this.Input = input;
    this.Output = output;
    this.PromptChar = prompt;
    Events.apply(this, Array.prototype.slice.call(arguments, 4));
};

Consoler.prototype = {
    constructor: Consoler,
    __proto__: Events.prototype,
    Print: function(menu, encode = "utf8") {
        if (typeof menu !== "string") {
            throw new TypeError("Consoler.prototype.Print: menu of argument need be string.");
        }
        const cur = this;
        this.Input._events["data"] = [];
        this.Input.on("data", (chunk) => {
            chunk = chunk.toString(encode);
            const ins = JSON.parse(chunk);
            if (ins.hasOwnProperty("cmd") && ins.hasOwnProperty("args")) {
                Consoler.ExecuteCommand(cur, ins.cmd, ins.args);
            } else {
                cur.Output.write(Buffer.from("Command instance hasn't cmd and args properties."));
                cur.Prompt();
            }
        });
        this.Output.write(Buffer.from(menu));
        this.Prompt();
    },
    Prompt: function() {
        this.Output.write(Buffer.from("\n\n" + this.PromptChar));
    }
};

Object.defineProperties(Consoler, {
    Events: {
        writable: false,
        enumerable: true,
        value: {
            BeforeExecute: "BEFORE_EXECUTE",
            AfterExecute: "AFTER_EXECUTE"
        }
    },
    Commands: {
        writable: false,
        enumerable: true,
        value: {}
    },
    ExecuteCommand: {
        writable: false,
        enumerable: true,
        value: function(cur, cmd, args) {
            const cmdExist = Consoler.Commands.hasOwnProperty(cmd);
            if (cmdExist) {
                const method = Consoler.Commands[cmd];
                cur.emit(Consoler.Events.BeforeExecute, method, cmd, args);
                method(cur.Instance, args, function() {
                    Array.prototype.forEach.call(arguments, (arg, index) => {
                        if (arg instanceof Object) {
                            try {
                                arg = JSON.stringify(arg);
                            } catch (err) {
                                arg = arg.toString();
                            }
                        } else if (typeof arg === "undefined") {
                            arg = "undefined";
                        } else if (arg === null) {
                            arg = "null";
                        } else {
                            arg = arg.toString();
                        }
                        arg = arg + ", ";
                        cur.Output.write(Buffer.from(arg));
                    });
                    cur.emit(Consoler.Events.AfterExecute, method, cmd, args);
                    cur.Prompt();
                });
            } else {
                cur.Output.write(Buffer.from(cmd + " of command not found."));
                cur.Prompt();
            }
        }
    }
});

module.exports = Consoler;

require("./config");