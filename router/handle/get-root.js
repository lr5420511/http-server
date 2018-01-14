"use strict";

const fs = require("fs");

router.AddRoute(pathname, false,
    function(req, res) {
        res.Send(200, "text/html", fs.createReadStream("./public/html/PluginsOfLiaoMain.htm"));
    }
);