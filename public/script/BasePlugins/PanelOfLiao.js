/// <reference path="../jquery.min.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.PanelOfLiao = function (option) {
        var panelObj = new Object();
        panelObj.CssClass = "PanelOfLiao";
        panelObj.WidthOfContent = 800;
        panelObj.HeightOfContent = 400;
        panelObj.ColorStyle = "#FFFFFF";
        panelObj.HasOperation = true;
        panelObj.Item = {
            Title: "PanelOfLiao插件默认标题", OperatorIcon: "../../image/paneloperat.png",
            OperatorDescription: "默认操作描述", OperatorClicked: function () { }, ContentHtml: ""
        };
        Liao.ExtendsObj(panelObj, option);
        panelObj.IsOpenState = function () {
            return isOpenState;
        };
        panelObj.ToggleStateOfPanel = function (toggled) {
            if (isOpenState) {
                ClosePanel(toggled);
            }
            else {
                OpenPanel(toggled);
            }
        };
        var atPanelOfLiao = $(this);
        atPanelOfLiao.addClass(panelObj.CssClass);

        atPanelOfLiao.append("<div class = \"PanelOfLiaoWrapper\"></div>");
        var atPanelOfLiaoWrapper = atPanelOfLiao.children("div.PanelOfLiaoWrapper").last();
        atPanelOfLiaoWrapper.append("<div class = \"PanelOfLiaoWrapperHead\"></div>");
        var atPanelOfLiaoWrapperHead = atPanelOfLiaoWrapper.children("div.PanelOfLiaoWrapperHead").first();
        atPanelOfLiaoWrapper.append("<div class = \"PanelOfLiaoWrapperContent\"></div>");
        var atPanelOfLiaoWrapperContent = atPanelOfLiaoWrapper.children("div.PanelOfLiaoWrapperContent").first();
        atPanelOfLiaoWrapperHead.append("<span class = \"PanelOfLiaoWrapperHeadTitle\"></span>");
        var atPanelOfLiaoWrapperHeadTitle = atPanelOfLiaoWrapperHead.children("span.PanelOfLiaoWrapperHeadTitle").first();
        atPanelOfLiaoWrapperContent.append("<div class = \"PanelOfLiaoWrapperContentHtml\"></div>");
        var atPanelOfLiaoWrapperContentHtml = atPanelOfLiaoWrapperContent.children("div.PanelOfLiaoWrapperContentHtml").first();
        var atPanelOfLiaoWrapperHeadOperat;
        if (panelObj.HasOperation) {
            atPanelOfLiaoWrapperHead.append("<span class = \"PanelOfLiaoWrapperHeadOperat\"></span>");
            atPanelOfLiaoWrapperHeadOperat = atPanelOfLiaoWrapperHead.children("span.PanelOfLiaoWrapperHeadOperat").first();
        }

        var timeout = 333;
        var widthOfPerTitle = 17;
        var isOpenState = true;
        var openState = { contentHeight: undefined, htmlDisplay: undefined, htmlOpacity: undefined };
        var closeState = { contentHeight: 0, htmlDisplay: "none", htmlOpacity: 0 };
        function OpenPanel(finished) {
            var currentTimeout = (panelObj.HeightOfContent - atPanelOfLiaoWrapperContent.height()) * timeout / panelObj.HeightOfContent;
            atPanelOfLiaoWrapperContent.stop().animate({ height: openState.contentHeight + "px" }, currentTimeout, function () {
                currentTimeout = (1 - parseFloat(atPanelOfLiaoWrapperContentHtml.css("opacity"))) * timeout;
                atPanelOfLiao.css({ height: atPanelOfLiaoWrapper.height() + "px" });
                atPanelOfLiaoWrapperContentHtml.stop().css({ display: openState.htmlDisplay })
                    .animate({ opacity: openState.htmlOpacity }, currentTimeout, function () {
                        isOpenState = true;
                        if (!Liao.IsUndefinedOrNull(finished)) {
                            finished(isOpenState);
                        }
                    });
            });
        }
        function ClosePanel(finished) {
            var currentTimeout = parseFloat(atPanelOfLiaoWrapperContentHtml.css("opacity")) * timeout;
            atPanelOfLiaoWrapperContentHtml.stop().animate({ opacity: closeState.htmlOpacity }, currentTimeout, function () {
                atPanelOfLiaoWrapperContentHtml.css({ display: closeState.htmlDisplay });
                currentTimeout = atPanelOfLiaoWrapperContent.height() * timeout / panelObj.HeightOfContent;
                atPanelOfLiaoWrapperContent.stop().animate({ height: closeState.contentHeight + "px" }, currentTimeout, function () {
                    atPanelOfLiao.css({ height: atPanelOfLiaoWrapper.height() + "px" });
                    isOpenState = false;
                    if (!Liao.IsUndefinedOrNull(finished)) {
                        finished(isOpenState);
                    }
                });
            });
        }
        atPanelOfLiao.bind("load", function () {
            var leftBorderWidthOfHead = parseFloat(atPanelOfLiaoWrapperHead.css("border-left-width"));
            var rightMarginOfTitle = parseFloat(atPanelOfLiaoWrapperHeadTitle.css("margin-right"));
            var widthOfOperat = 0, rightMarginOfOperat = 0;
            var minWidthOfContent = 0;
            minWidthOfContent += leftBorderWidthOfHead;
            minWidthOfContent += panelObj.Item.Title.length * widthOfPerTitle;
            minWidthOfContent += rightMarginOfTitle;
            if (panelObj.HasOperation) {
                widthOfOperat = parseFloat(atPanelOfLiaoWrapperHeadOperat.css("width"));
                rightMarginOfOperat = parseFloat(atPanelOfLiaoWrapperHeadOperat.css("margin-right"));
                minWidthOfContent += widthOfOperat;
                minWidthOfContent += rightMarginOfOperat;
            }
            panelObj.WidthOfContent = panelObj.WidthOfContent >= minWidthOfContent ? panelObj.WidthOfContent : minWidthOfContent;
            var minHeightOfPanel = parseFloat(atPanelOfLiao.css("min-height"));
            atPanelOfLiao.css({ width: panelObj.WidthOfContent + "px", height: (minHeightOfPanel + panelObj.HeightOfContent) + "px" });
            atPanelOfLiaoWrapper.css({ width: panelObj.WidthOfContent + "px", "background-color": panelObj.ColorStyle });
            atPanelOfLiaoWrapperContent.css({ width: panelObj.WidthOfContent + "px", height: panelObj.HeightOfContent + "px" });
            atPanelOfLiaoWrapperContentHtml.css({ width: panelObj.WidthOfContent + "px", height: panelObj.HeightOfContent + "px" });
            atPanelOfLiaoWrapperHead.css({ width: panelObj.WidthOfContent - leftBorderWidthOfHead + "px" });
            atPanelOfLiaoWrapperHeadTitle.css({
                width: panelObj.WidthOfContent - leftBorderWidthOfHead - rightMarginOfTitle - widthOfOperat - rightMarginOfOperat + "px"
            });
            Liao.SetBindingModel(panelObj.Item, function (property) {
                switch (property) {
                    case "Title":
                        {
                            atPanelOfLiaoWrapperHeadTitle.text(panelObj.Item.Title);
                        }; break;
                    case "OperatorIcon":
                        {
                            if (panelObj.HasOperation) {
                                atPanelOfLiaoWrapperHeadOperat.css({ "background-image": "url('" + panelObj.Item.OperatorIcon + "')" });
                            }
                        }; break;
                    case "OperatorDescription":
                        {
                            if (panelObj.HasOperation) {
                                atPanelOfLiaoWrapperHeadOperat.attr({ title: panelObj.Item.OperatorDescription });
                            }
                        }; break;
                    case "OperatorClicked":
                        {
                            if (panelObj.HasOperation) {
                                atPanelOfLiaoWrapperHeadOperat.unbind("click").bind("click", function () {
                                    panelObj.Item.OperatorClicked();
                                });
                            }
                        }; break;
                    case "ContentHtml":
                        {
                            atPanelOfLiaoWrapperContentHtml.html(panelObj.Item.ContentHtml);
                        }; break;
                }
            });
            panelObj.Item.OnAllPropertyChanged();
            Liao.ExtendsObj(openState, {
                contentHeight: panelObj.HeightOfContent,
                htmlDisplay: atPanelOfLiaoWrapperContentHtml.css("display"),
                htmlOpacity: atPanelOfLiaoWrapperContentHtml.css("opacity")
            });
        });
        atPanelOfLiao.load();
        return panelObj;
    }
})(jQuery, Liao)