/// <reference path="../jquery.min.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.OperatOfLiao = function (option) {
        var operatObj = new Object();
        operatObj.CssClass = "OperatOfLiao";
        operatObj.WidthOfOperat = 350;
        operatObj.Title = "欢迎使用OperatOfLiao插件，请选择：";
        operatObj.MaxLengthOfTitle = 25;
        operatObj.MaxCountOfItems = 0;
        operatObj.Items = [
        { Name: "OperatOfLiao插件默认选项一", Clicked: function () { } },
        { Name: "OperatOfLiao插件默认选项二", Clicked: function () { } }];
        operatObj.OperatClosed = function (currentItemOfClicked) { };
        Liao.ExtendsObj(operatObj, option);
        if (operatObj.Items.length <= 0) {
            operatObj.Items.push({ Name: " ", Clicked: function () { } });
        }
        var atOperatOfLiaoParent = $(this);

        atOperatOfLiaoParent.append("<div class = \"OperatOfLiaoMask\"></div>");
        var atOperatOfLiaoMask = atOperatOfLiaoParent.children("div.OperatOfLiaoMask").last();
        atOperatOfLiaoParent.append("<div></div>");
        var atOperatOfLiao = atOperatOfLiaoParent.children("div").last();
        atOperatOfLiao.append("<div class = \"OperatOfLiaoHead\"></div>");
        var atOperatOfLiaoHead = atOperatOfLiao.children("div.OperatOfLiaoHead").first();
        atOperatOfLiao.append("<ul class = \"OperatOfLiaoContent\"></ul>");
        var atOperatOfLiaoContent = atOperatOfLiao.children("ul.OperatOfLiaoContent").first();

        var timeout = 200;
        var atTempOperatParent = atOperatOfLiaoParent.prop("tagName") == "BODY" ? $(window) : atOperatOfLiaoParent;
        var oldOverflowOfParent = atOperatOfLiaoParent.css("overflow");
        atOperatOfLiaoParent.css({ overflow: "hidden" });
        var parentState = { width: atTempOperatParent.width(), height: atTempOperatParent.height(),
            scrollLeft: atTempOperatParent.scrollLeft(), scrollTop: atTempOperatParent.scrollTop()
        };
        var maskState = { initOpacity: atOperatOfLiaoMask.css("opacity"), showedOpacity: 0.5 };
        var hiddenElementState = { open: "block", close: atOperatOfLiao.css("display") };
        function Dispose(disposed) {
            atOperatOfLiao.css({ display: hiddenElementState.close });
            atOperatOfLiaoMask.stop().animate({ opacity: maskState.initOpacity }, timeout, function () {
                atOperatOfLiaoMask.css({ display: hiddenElementState.close }).remove();
                atOperatOfLiao.remove();
                atOperatOfLiaoParent.css({ overflow: oldOverflowOfParent });
                if (disposed != undefined) {
                    disposed();
                }
            });
        }
        function BindItem(item) {
            atOperatOfLiaoContent.append("<li class = \"OperatOfLiaoContentItem\"></li>");
            var atCurrentOperatItem = atOperatOfLiaoContent.children("li.OperatOfLiaoContentItem").last();
            atCurrentOperatItem.css({ width: operatObj.WidthOfOperat + "px" }).text(item.Name).bind("click", function () {
                Dispose(function () {
                    operatObj.OperatClosed(item);
                    if (item.Clicked != undefined) {
                        item.Clicked();
                    }
                });
            });
        }
        atOperatOfLiaoMask.bind("click", function () {
            Dispose(function () { operatObj.OperatClosed(null); });
        });
        atOperatOfLiao.bind("load", function () {
            operatObj.Title = operatObj.Title.length > operatObj.MaxLengthOfTitle ?
            operatObj.Title.substr(0, operatObj.MaxLengthOfTitle - 1) + "…" : operatObj.Title;
            if (operatObj.MaxCountOfItems > 0 && operatObj.MaxCountOfItems < operatObj.Items.length) {
                operatObj.Items.splice(operatObj.MaxCountOfItems, operatObj.Items.length - operatObj.MaxCountOfItems);
            }
            atOperatOfLiao.addClass(operatObj.CssClass);
            $.each(operatObj.Items, function (index, item) {
                BindItem(item);
            });
            var atFirstOperatItem = atOperatOfLiaoContent.children("li.OperatOfLiaoContentItem").first();
            var itemHeight = parseFloat(atFirstOperatItem.css("height"));
            var itemBottomBorderWidth = parseFloat(atFirstOperatItem.css("border-bottom-width"));
            var headHeight = parseFloat(atOperatOfLiaoHead.css("height"));
            var headBottomBorderWidth = parseFloat(atOperatOfLiaoHead.css("border-bottom-width"));
            var contentHeight = (itemHeight + itemBottomBorderWidth) * operatObj.Items.length;
            var operatHeight = headHeight + headBottomBorderWidth + contentHeight;
            var operatLeftBorderWidth = parseFloat(atOperatOfLiao.css("border-left-width"));
            var operatRightBorderWidth = parseFloat(atOperatOfLiao.css("border-right-width"));
            var operatTopBorderWidth = parseFloat(atOperatOfLiao.css("border-top-width"));
            var operatBottomBorderWidth = parseFloat(atOperatOfLiao.css("border-bottom-width"));
            atOperatOfLiaoMask.css({ width: parentState.width + "px", height: parentState.height + "px",
                top: parentState.scrollTop + "px", left: parentState.scrollLeft + "px"
            });
            atOperatOfLiao.css({ width: operatObj.WidthOfOperat + "px", height: operatHeight + "px",
                left: parseFloat(parentState.width / 2) - parseFloat((operatObj.WidthOfOperat + operatLeftBorderWidth + operatRightBorderWidth) / 2)
                + parentState.scrollLeft + "px",
                top: parseFloat(parentState.height / 2) - parseFloat((operatHeight + operatTopBorderWidth + operatBottomBorderWidth) / 2)
                + parentState.scrollTop + "px"
            });
            atOperatOfLiaoHead.css({ width: operatObj.WidthOfOperat + "px" }).text(operatObj.Title);
            atOperatOfLiaoContent.css({ width: operatObj.WidthOfOperat + "px", height: contentHeight + "px" });
            atOperatOfLiaoMask.css({ display: hiddenElementState.open }).animate({ opacity: maskState.showedOpacity }, timeout, function () {
                atOperatOfLiao.css({ display: hiddenElementState.open });
            });
        });
        atOperatOfLiao.load();
        return operatObj;
    }
})(jQuery, Liao)