/// <reference path="jquery.min.js" />

(function (win, $) {
    $.SetInitSizeOfHtml = function (atHtml) {
        var initWidth = $(win).width();
        var initHeight = $(win).height();
        atHtml.css({ width: initWidth + "px", height: initHeight + "px" });
    }

    $.CreatPanelOfLiao = function (atCurrentPanel, contentWidth, contentHeight, title, htmlContent) {
        if (typeof contentWidth !== "number" || contentWidth <= 0) {
            throw new Error("contentWidth of argument isn't a vaild argument");
        }
        if (typeof contentHeight !== "number" || contentHeight <= 0) {
            throw new Error("contentHeight of argument isn't a vaild argument");
        }
        if (typeof title !== "string" || title.length <= 0) {
            throw new Error("title of argument isn't a vaild argument");
        }
        if (typeof htmlContent !== "string") {
            throw new Error("htmlContent of argument isn't a vaild argument");
        }
        atCurrentPanel.PanelOfLiao({ WidthOfContent: contentWidth, HeightOfContent: contentHeight, HasOperation: false,
            Item: { Title: title, ContentHtml: htmlContent }
        });
    };
})(window, jQuery)