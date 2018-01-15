"use strict";

router.AddRoute(pathname, false,
    (req, res) => {
        console.log("The request: " + req.method + "->" + req.url.pathname + "is coming");
        return false;
    },
    (req, res) => {
        console.log("The method is 1 on 2, cann't call");
    }
).AddRoute(pathname, false,
    (req, res) => {
        console.log("The method is 2 on 1, can call");
        return true;
    },
    (req, res) => {
        let receive = "";
        req.on("data", (chunk) => {
            receive += chunk.toString("utf8");
        });

        req.on("end", () => {
            console.log(receive);
            res.Send(200, "text/plain", Buffer.from("server received"));
        });
    },
    (req, res) => {
        console.log("The method is 2 on 3, cann't call");
    }
).AddRoute(pathname, false,
    (req, res) => {
        console.log("The method is 3 on 1, cann't call");
    }
);