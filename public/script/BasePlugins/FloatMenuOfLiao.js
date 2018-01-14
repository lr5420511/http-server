/// <reference path="../jquery.min.js" />
/// <reference path="../jquery-ui.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.FloatMenuOfLiao = function (option) {
        var floatMenuObj = new Object();
        floatMenuObj.CssClass = "FloatMenuOfLiao";
        floatMenuObj.MaxLengthOfTitle = 10;
        floatMenuObj.WidthOfPerTitle = 18;
        floatMenuObj.ScrollMode = "Default"; // or Translation
        floatMenuObj.InitToTop = 30;
        floatMenuObj.MaxCountOfItems = 0;
        floatMenuObj.Items = [];
        Liao.ExtendsObj(floatMenuObj, option);
        var toParentTopItem = {
            Icon: "../image/floatmenuup.png",
            DisplayText: "回到顶部",
            Click: function () {
                atFloatMenuOfLiaoParent.scrollTop(0);
            }
        };
        var atFloatMenuOfLiao = $(this);
        var atFloatMenuOfLiaoParent = atFloatMenuOfLiao.parent().first();
        atFloatMenuOfLiao.addClass(floatMenuObj.CssClass);

        atFloatMenuOfLiao.append("<ul class = \"FloatMenuOfLiaoContent\"></ul>");
        var atFloatMenuOfLiaoContent = atFloatMenuOfLiao.children("ul.FloatMenuOfLiaoContent").first();

        var timeout = 333;
        var initContentWidth = undefined;
        var itemLeftBorderWidth = undefined;
        var itemRightBorderWidth = undefined;
        var itemIconWidth = undefined;
        var initItemTitleWidth = undefined;
        var initToLeft = undefined;
        var atFloatMenuOfLiaoRealParent = atFloatMenuOfLiaoParent.prop("tagName") == "BODY" ? $(window) : atFloatMenuOfLiaoParent;
        function BindItem(item) {
            var itemTitleWidth = item.DisplayText.length * floatMenuObj.WidthOfPerTitle;
            atFloatMenuOfLiaoContent.append("<li class = \"FloatMenuOfLiaoContentItem\"></li>");
            var atFloatMenuOfLiaoContentItem = atFloatMenuOfLiaoContent.children("li.FloatMenuOfLiaoContentItem").last();
            atFloatMenuOfLiaoContentItem.append("<span class = \"FloatMenuOfLiaoContentItemTitle\"></span>");
            var atFloatMenuOfLiaoContentItemTitle = atFloatMenuOfLiaoContentItem.children("span.FloatMenuOfLiaoContentItemTitle").first();
            atFloatMenuOfLiaoContentItem.append("<img class = \"FloatMenuOfLiaoContentItemIcon\" alt = \"\" />");
            var atFloatMenuOfLiaoContentItemIcon = atFloatMenuOfLiaoContentItem.children("img.FloatMenuOfLiaoContentItemIcon").first();
            atFloatMenuOfLiaoContentItemTitle.text(item.DisplayText);
            atFloatMenuOfLiaoContentItemIcon.attr({ src: item.Icon });
            atFloatMenuOfLiaoContentItem.bind("mouseenter", function () {
                atFloatMenuOfLiaoContent.find("span.FloatMenuOfLiaoContentItemTitle").stop().css({ width: initItemTitleWidth + "px" });
                atFloatMenuOfLiaoContent.css({ width: itemIconWidth + itemTitleWidth + itemLeftBorderWidth + itemRightBorderWidth + "px" });
                atFloatMenuOfLiaoContentItemTitle.animate({ width: itemTitleWidth + "px" }, timeout);
            });
            atFloatMenuOfLiaoContentItem.bind("mouseleave", function () {
                atFloatMenuOfLiaoContentItemTitle.stop().animate({ width: initItemTitleWidth + "px" }, timeout, function () {
                    atFloatMenuOfLiaoContent.css({ width: initContentWidth + "px" });
                });
            });
            atFloatMenuOfLiaoContentItem.bind("click", function () {
                item.Click();
            });
        }
        atFloatMenuOfLiaoRealParent.bind("scroll", function () {
            var parentToTop = atFloatMenuOfLiaoParent.scrollTop();
            var parentToLeft = atFloatMenuOfLiaoParent.scrollLeft();
            if (floatMenuObj.ScrollMode == "Translation") {
                atFloatMenuOfLiao.stop().animate({ top: parentToTop + floatMenuObj.InitToTop + "px", left: parentToLeft + initToLeft + "px" }, timeout);
            }
            else {
                atFloatMenuOfLiao.css({ top: parentToTop + floatMenuObj.InitToTop + "px", left: parentToLeft + initToLeft + "px" });
            }
        });
        atFloatMenuOfLiao.bind("load", function () {
            if (floatMenuObj.MaxCountOfItems > 0 && floatMenuObj.Items.length > floatMenuObj.MaxCountOfItems) {
                floatMenuObj.Items.splice(floatMenuObj.MaxCountOfItems, floatMenuObj.Items.length - floatMenuObj.MaxCountOfItems);
            }
            floatMenuObj.Items.push(toParentTopItem);
            $.each(floatMenuObj.Items, function (index, item) {
                item.DisplayText = item.DisplayText.length > floatMenuObj.MaxLengthOfTitle ?
                "…" + item.DisplayText.substr(0, floatMenuObj.MaxLengthOfTitle - 1) : item.DisplayText;
                BindItem(item);
            });
            initContentWidth = parseFloat(atFloatMenuOfLiaoContent.css("width"));
            var atFirstItem = atFloatMenuOfLiaoContent.children("li.FloatMenuOfLiaoContentItem").first();
            itemLeftBorderWidth = parseFloat(atFirstItem.css("border-left-width"));
            itemRightBorderWidth = parseFloat(atFirstItem.css("border-right-width"));
            itemIconWidth = parseFloat(atFirstItem.children("img.FloatMenuOfLiaoContentItemIcon").first().css("width"));
            initItemTitleWidth = parseFloat(atFirstItem.children("span.FloatMenuOfLiaoContentItemTitle").first().css("width"));
            itemHeight = parseFloat(atFirstItem.css("height")) + parseFloat(atFirstItem.css("border-top-width")) +
            parseFloat(atFirstItem.css("border-bottom-width")) + parseFloat(atFirstItem.css("margin-top")) +
            parseFloat(atFirstItem.css("margin-bottom"));
            var menuHeight = itemHeight * floatMenuObj.Items.length;
            atFloatMenuOfLiao.css({ height: menuHeight + "px", top: floatMenuObj.InitToTop + "px" });
            atFloatMenuOfLiaoContent.css({ height: menuHeight + "px" }).attr({ dir: "rtl" });
            var parentWidth = parseFloat(atFloatMenuOfLiaoParent.css("width"));
            var floatWidth = parseFloat(atFloatMenuOfLiao.css("width"));
            var floatRightMargin = parseFloat(atFloatMenuOfLiao.css("right"));
            initToLeft = parentWidth - floatWidth - floatRightMargin;
            atFloatMenuOfLiao.css({ left: initToLeft + "px" });
        });
        atFloatMenuOfLiao.load();
        return floatMenuObj;
    }
})(jQuery, Liao)