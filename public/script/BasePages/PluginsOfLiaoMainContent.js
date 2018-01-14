/// <reference path="../jquery.min.js" />
/// <reference path="../LiaoComponent.js" />
/// <reference path="../Common.js" />

(function (win, $, liao) {
    win.InitMainContent = function (sourceObj, inited) {
        if (typeof sourceObj !== "object") {
            throw new Error("sourceObj of argument isn't a vaild argument");
        }
        var atMainContentWrapper = $("div.MainContentWrapper").first();
        $.ajax({ type: "get", url: sourceObj.Url + "?ranRequest=" + (new Date()).getTime(), dataType: "json", async: true,
            success: function (datas) {
                if (datas instanceof Array) {
                    for (var index = 0; index < datas.length; index++) {
                        atMainContentWrapper.append("<div class = \"MainContentPanel\"></div>");
                        var atCurrentPanel = atMainContentWrapper.children("div.MainContentPanel").last();
                        $.CreatPanelOfLiao(atCurrentPanel, 900, 450, sourceObj.GetTitle(datas[index]), sourceObj.GetContentHtml(datas[index]));
                    }
                }
            }, error: function (request) {
                throw new Error(request.responseText);
            }, complete: function () {
                if (inited instanceof Function) {
                    inited();
                }
            }
        });
    };
})(window, jQuery, Liao)