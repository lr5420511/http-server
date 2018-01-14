/// <reference path="../jquery.min.js" />
/// <reference path="../jquery-ui.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.ButtonOfLiao = function (option) {
        var buttonObj = new Object();
        buttonObj.CssClass = "ButtonOfLiao";
        buttonObj.DisplayText = "默认按钮";
        buttonObj.MaxTextLength = 10;
        buttonObj.WidthOfPerText = 22;
        buttonObj.InitColor = "#6666FF";
        buttonObj.HoverColor = "#9999FF";
        buttonObj.Click = function () { alert("欢迎使用ButtonOfLiao插件！"); };
        Liao.ExtendsObj(buttonObj, option);
        var atButtonOfLiao = $(this);
        atButtonOfLiao.addClass(buttonObj.CssClass);

        atButtonOfLiao.append("<div class = \"ButtonOfLiaoWrapper\"></div>");
        var atButtonOfLiaoWrapper = atButtonOfLiao.children("div.ButtonOfLiaoWrapper").first();
        atButtonOfLiaoWrapper.append("<div class = \"ButtonOfLiaoWrapperContent\"></div>");
        var atButtonOfLiaoWrapperContent = atButtonOfLiaoWrapper.children("div.ButtonOfLiaoWrapperContent").first();
        atButtonOfLiaoWrapper.append("<div class = \"ButtonOfLiaoWrapperMask\"></div>");
        var atButtonOfLiaoWrapperMask = atButtonOfLiaoWrapper.children("div.ButtonOfLiaoWrapperMask").first();

        var initFontColor = undefined;
        var hoverFontColor = "#999999";
        var timeout = 1000;
        atButtonOfLiao.bind("load", function () {
            if (!(buttonObj.SetState instanceof Function)) {
                Liao.SetBindingModel(buttonObj);
            }
            if (buttonObj.IsBinded()) {
                buttonObj.Unbind();
            }
            buttonObj.Bind(function (property) {
                switch (property) {
                    case "DisplayText":
                        {
                            if (buttonObj.DisplayText.length > buttonObj.MaxTextLength) {
                                buttonObj.DisplayText = buttonObj.DisplayText.substr(0, buttonObj.MaxTextLength - 1) + "…";
                            }
                            var buttonWidth = buttonObj.DisplayText.length * buttonObj.WidthOfPerText;
                            atButtonOfLiao.css({ width: buttonWidth + "px" });
                            atButtonOfLiaoWrapper.css({ width: buttonWidth + "px" });
                            atButtonOfLiaoWrapperContent.css({ width: buttonWidth + "px" });
                            atButtonOfLiaoWrapperMask.css({ width: buttonWidth + "px" });
                            atButtonOfLiaoWrapperContent.text(buttonObj.DisplayText);
                        }; break;
                }
            });
            buttonObj.OnAllPropertyChanged();
            atButtonOfLiaoWrapper.css({ "background-color": buttonObj.InitColor });
            atButtonOfLiaoWrapperMask.css({ "background-color": buttonObj.InitColor });
            initFontColor = atButtonOfLiaoWrapperContent.css("color");
        });
        atButtonOfLiao.bind("mouseenter", function () {
            atButtonOfLiaoWrapper.stop().animate({ "background-color": buttonObj.HoverColor }, timeout);
            atButtonOfLiaoWrapperContent.stop().animate({ color: hoverFontColor }, timeout);
        });
        atButtonOfLiao.bind("mouseleave", function () {
            atButtonOfLiaoWrapperContent.stop().animate({ color: initFontColor }, timeout);
            atButtonOfLiaoWrapper.stop().animate({ "background-color": buttonObj.InitColor }, timeout);
        });
        atButtonOfLiao.bind("click", function () {
            buttonObj.Click();
        });
        atButtonOfLiao.load();
        return buttonObj;
    }
})(jQuery, Liao)