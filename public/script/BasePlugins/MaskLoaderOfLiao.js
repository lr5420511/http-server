/// <reference path="../jquery.min.js" />
/// <reference path="../jquery-ui.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.MaskLoaderOfLiao = function (option) {
        var maskLoaderObj = new Object();
        maskLoaderObj.IconOfLoader = "../../image/maskloader.gif";
        maskLoaderObj.TypeOfLoader = "Default"; //or Fall
        maskLoaderObj.OpacityOfLoader = 0.5;
        Liao.ExtendsObj(maskLoaderObj, option);
        maskLoaderObj.ClearLoader = function (cleared) {
            if (maskLoaderObj != null) {
                atMaskLoaderOfLiaoIcon.stop()
                .animate({ left: initIconPosition.left + "px", top: initIconPosition.top + "px" }, timeout, function () {
                    atMaskLoaderOfLiaoIcon.css({ display: "none" }).remove();
                    atMaskLoaderOfLiaoFourth.stop()
                    .animate({ left: initFourthPosition.left + "px", top: initFourthPosition.top + "px", opacity: initBlockOpacity }, timeout, function () {
                        atMaskLoaderOfLiaoFourth.css({ display: "none" }).remove();
                        atMaskLoaderOfLiaoThird.stop()
                        .animate({ left: initThirdPosition.left + "px", top: initThirdPosition.top + "px", opacity: initBlockOpacity }, timeout, function () {
                            atMaskLoaderOfLiaoThird.css({ display: "none" }).remove();
                            atMaskLoaderOfLiaoSecond.stop()
                            .animate({ left: initSecondPosition.left + "px", top: initSecondPosition.top + "px", opacity: initBlockOpacity }, timeout, function () {
                                atMaskLoaderOfLiaoSecond.css({ display: "none" }).remove();
                                atMaskLoaderOfLiaoFirst.stop()
                                .animate({ left: initFirstPosition.left + "px", top: initFirstPosition.top + "px", opacity: initBlockOpacity }, timeout, function () {
                                    atMaskLoaderOfLiaoFirst.css({ display: "none" }).remove();
                                    atMaskLoaderOfLiaoParent.css({ overflow: oldParentOverflow });
                                    maskLoaderObj = null;
                                    if (cleared != undefined) {
                                        cleared();
                                    }
                                });
                            });
                        });
                    });
                });
            }
        };
        var atMaskLoaderOfLiaoParent = $(this);

        atMaskLoaderOfLiaoParent.append("<div class = \"MaskLoaderOfLiaoFirst\"></div>");
        var atMaskLoaderOfLiaoFirst = atMaskLoaderOfLiaoParent.children("div.MaskLoaderOfLiaoFirst").first();
        atMaskLoaderOfLiaoParent.append("<div class = \"MaskLoaderOfLiaoSecond\"></div>");
        var atMaskLoaderOfLiaoSecond = atMaskLoaderOfLiaoParent.children("div.MaskLoaderOfLiaoSecond").first();
        atMaskLoaderOfLiaoParent.append("<div class = \"MaskLoaderOfLiaoThird\"></div>");
        var atMaskLoaderOfLiaoThird = atMaskLoaderOfLiaoParent.children("div.MaskLoaderOfLiaoThird").first();
        atMaskLoaderOfLiaoParent.append("<div class = \"MaskLoaderOfLiaoFourth\"></div>");
        var atMaskLoaderOfLiaoFourth = atMaskLoaderOfLiaoParent.children("div.MaskLoaderOfLiaoFourth").first();
        atMaskLoaderOfLiaoParent.append("<div class = \"MaskLoaderOfLiaoIcon\"></div>");
        var atMaskLoaderOfLiaoIcon = atMaskLoaderOfLiaoParent.children("div.MaskLoaderOfLiaoIcon").first();

        var oldParentOverflow = atMaskLoaderOfLiaoParent.css("overflow");
        atMaskLoaderOfLiaoParent.css({ overflow: "hidden" });
        var currentToTop = atMaskLoaderOfLiaoParent.scrollTop();
        var currentToLeft = atMaskLoaderOfLiaoParent.scrollLeft();
        var parentWidth = atMaskLoaderOfLiaoParent.prop("tagName") == "BODY" ?
        $(window).width() : parseFloat(atMaskLoaderOfLiaoParent.css("width"));
        var parentHeight = atMaskLoaderOfLiaoParent.prop("tagName") == "BODY" ?
        $(window).height() : parseFloat(atMaskLoaderOfLiaoParent.css("height"));
        var blockWidth = parseFloat(parentWidth / 2);
        var blockHeight = parseFloat(parentHeight / 2);
        atMaskLoaderOfLiaoFirst.css({ width: blockWidth + "px", height: blockHeight + "px" });
        atMaskLoaderOfLiaoSecond.css({ width: blockWidth + "px", height: blockHeight + "px" });
        atMaskLoaderOfLiaoThird.css({ width: blockWidth + "px", height: blockHeight + "px" });
        atMaskLoaderOfLiaoFourth.css({ width: blockWidth + "px", height: blockHeight + "px" });
        var initIconPosition =
        {
            left: currentToLeft + blockWidth - parseFloat(parseFloat(atMaskLoaderOfLiaoIcon.css("width")) / 2),
            top: currentToTop - parseFloat(atMaskLoaderOfLiaoIcon.css("height"))
        };
        atMaskLoaderOfLiaoIcon.css({
            "background-image": "url('" + maskLoaderObj.IconOfLoader + "')",
            left: initIconPosition.left + "px", top: initIconPosition.top + "px"
        });

        var timeout = 300;
        var initFirstPosition = { left: undefined, top: undefined };
        var initSecondPosition = { left: undefined, top: undefined };
        var initThirdPosition = { left: undefined, top: undefined };
        var initFourthPosition = { left: undefined, top: undefined };
        var initBlockOpacity = atMaskLoaderOfLiaoFirst.css("opacity");
        var loading = function () {
            if (maskLoaderObj.TypeOfLoader == "Fall") {
                $.extend(initFirstPosition, { left: currentToLeft, top: currentToTop - blockHeight });
                $.extend(initSecondPosition, { left: currentToLeft + blockWidth, top: currentToTop - blockHeight });
                $.extend(initThirdPosition, { left: currentToLeft + blockWidth, top: currentToTop - blockHeight * 2 });
                $.extend(initFourthPosition, { left: currentToLeft, top: currentToTop - blockHeight * 2 });
                atMaskLoaderOfLiaoFirst.css({ left: initFirstPosition.left + "px", top: initFirstPosition.top + "px" });
                atMaskLoaderOfLiaoSecond.css({ left: initSecondPosition.left + "px", top: initSecondPosition.top + "px" });
                atMaskLoaderOfLiaoThird.css({ left: initThirdPosition.left + "px", top: initThirdPosition.top + "px" });
                atMaskLoaderOfLiaoFourth.css({ left: initFourthPosition.left + "px", top: initFourthPosition.top + "px" });
                atMaskLoaderOfLiaoFirst.css({ display: "block" })
                .animate({ left: currentToLeft + "px", top: currentToTop + blockHeight + "px", opacity: maskLoaderObj.OpacityOfLoader }, timeout, function () {
                    atMaskLoaderOfLiaoSecond.css({ display: "block" })
                    .animate({ left: currentToLeft + blockWidth + "px", top: currentToTop + blockHeight + "px", opacity: maskLoaderObj.OpacityOfLoader }, timeout, function () {
                        atMaskLoaderOfLiaoThird.css({ display: "block" })
                        .animate({ left: currentToLeft + blockWidth + "px", top: currentToTop + "px", opacity: maskLoaderObj.OpacityOfLoader }, timeout, function () {
                            atMaskLoaderOfLiaoFourth.css({ display: "block" })
                            .animate({ left: currentToLeft + "px", top: currentToTop + "px", opacity: maskLoaderObj.OpacityOfLoader }, timeout, function () {
                                atMaskLoaderOfLiaoIcon.css({ display: "block" })
                                .animate({ left: currentToLeft + blockWidth - parseFloat(parseFloat(atMaskLoaderOfLiaoIcon.css("width")) / 2) + "px",
                                    top: currentToTop + blockHeight - parseFloat(parseFloat(atMaskLoaderOfLiaoIcon.css("height")) / 2 + "px")
                                }, timeout);
                            });
                        });
                    });
                });
            }
            else {
                $.extend(initFirstPosition, { left: currentToLeft - blockWidth, top: currentToTop - blockHeight });
                $.extend(initSecondPosition, { left: currentToLeft + blockWidth * 2, top: currentToTop - blockHeight });
                $.extend(initThirdPosition, { left: currentToLeft - blockWidth, top: currentToTop + blockHeight * 2 });
                $.extend(initFourthPosition, { left: currentToLeft + blockWidth * 2, top: currentToTop + blockHeight * 2 });
                atMaskLoaderOfLiaoFirst.css({ left: initFirstPosition.left + "px", top: initFirstPosition.top + "px" });
                atMaskLoaderOfLiaoSecond.css({ left: initSecondPosition.left + "px", top: initSecondPosition.top + "px" });
                atMaskLoaderOfLiaoThird.css({ left: initThirdPosition.left + "px", top: initThirdPosition.top + "px" });
                atMaskLoaderOfLiaoFourth.css({ left: initFourthPosition.left + "px", top: initFourthPosition.top + "px" });
                atMaskLoaderOfLiaoFirst.css({ display: "block" })
                .animate({ left: currentToLeft + "px", top: currentToTop + "px", opacity: maskLoaderObj.OpacityOfLoader }, timeout, function () {
                    atMaskLoaderOfLiaoSecond.css({ display: "block" })
                    .animate({ left: currentToLeft + blockWidth + "px", top: currentToTop + "px", opacity: maskLoaderObj.OpacityOfLoader }, timeout, function () {
                        atMaskLoaderOfLiaoThird.css({ display: "block" })
                        .animate({ left: currentToLeft + "px", top: currentToTop + blockHeight + "px", opacity: maskLoaderObj.OpacityOfLoader }, timeout, function () {
                            atMaskLoaderOfLiaoFourth.css({ display: "block" })
                            .animate({ left: currentToLeft + blockWidth + "px", top: currentToTop + blockHeight + "px", opacity: maskLoaderObj.OpacityOfLoader }, timeout, function () {
                                atMaskLoaderOfLiaoIcon.css({ display: "block" })
                                .animate({ left: currentToLeft + blockWidth - parseFloat(parseFloat(atMaskLoaderOfLiaoIcon.css("width")) / 2) + "px",
                                    top: currentToTop + blockHeight - parseFloat(parseFloat(atMaskLoaderOfLiaoIcon.css("height")) / 2 + "px")
                                }, timeout);
                            });
                        });
                    });
                });
            }
        };
        loading();
        return maskLoaderObj;
    }
})(jQuery, Liao)