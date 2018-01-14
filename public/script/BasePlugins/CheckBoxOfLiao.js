/// <reference path="../jquery.min.js" />
/// <reference path="../jquery-ui.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.CheckBoxOfLiao = function (option) {
        var checkBoxObj = new Object();
        checkBoxObj.CssClass = "CheckBoxOfLiao";
        checkBoxObj.MaxTextLength = 10;
        checkBoxObj.PerTextWidth = 20;
        checkBoxObj.DisplayText = "默认标题文本";
        checkBoxObj.InitValue = false;
        checkBoxObj.ValueChanged = function (currentValue) { };
        Liao.ExtendsObj(checkBoxObj, option);
        checkBoxObj.CurrentValue = checkBoxObj.InitValue;
        checkBoxObj.Value = function (newValue) {
            if (newValue == undefined) {
                return checkBoxObj.CurrentValue;
            }
            else {
                if (checkBoxObj.CurrentValue != newValue) {
                    atCheckBoxOfLiaoWrapperCheckArea.click();
                }
            }
        };
        var atCheckBoxOfLiao = $(this);
        atCheckBoxOfLiao.addClass(checkBoxObj.CssClass);

        atCheckBoxOfLiao.append("<div class = \"CheckBoxOfLiaoWrapper\"></div>");
        var atCheckBoxOfLiaoWrapper = atCheckBoxOfLiao.children("div.CheckBoxOfLiaoWrapper").first();
        atCheckBoxOfLiaoWrapper.append("<div class = \"CheckBoxOfLiaoWrapperCheckArea\"></div>");
        var atCheckBoxOfLiaoWrapperCheckArea = atCheckBoxOfLiaoWrapper.children("div.CheckBoxOfLiaoWrapperCheckArea").first();
        atCheckBoxOfLiaoWrapper.append("<span class = \"CheckBoxOfLiaoWrapperTextArea\"></span>");
        var atCheckBoxOfLiaoWrapperTextArea = atCheckBoxOfLiaoWrapper.children("span.CheckBoxOfLiaoWrapperTextArea").first();
        atCheckBoxOfLiaoWrapperCheckArea.append("<div class = \"CheckBoxOfLiaoWrapperCheckAreaWrapper\"></div>");
        var atCheckBoxOfLiaoWrapperCheckAreaWrapper = atCheckBoxOfLiaoWrapperCheckArea.children("div.CheckBoxOfLiaoWrapperCheckAreaWrapper").first();
        atCheckBoxOfLiaoWrapperCheckAreaWrapper.append("<div class = \"CheckBoxOfLiaoWrapperCheckAreaWrapperIcon\"></div>");
        var atCheckBoxOfLiaoWrapperCheckAreaWrapperIcon = atCheckBoxOfLiaoWrapperCheckAreaWrapper.children("div.CheckBoxOfLiaoWrapperCheckAreaWrapperIcon").first();

        var timeout = 300;
        var initOpacity = undefined;
        var checkedOpacity = 1;
        var initIconPosition = { left: undefined, top: undefined };
        var checkedIconPosition = { left: 0, top: 0 };
        atCheckBoxOfLiaoWrapperCheckArea.bind("click", function () {
            checkBoxObj.CurrentValue = !checkBoxObj.CurrentValue;
            if (checkBoxObj.CurrentValue) {
                atCheckBoxOfLiaoWrapperCheckAreaWrapperIcon.css({ display: "block" }).stop()
                .animate({ left: checkedIconPosition.left + "px", top: checkedIconPosition.top + "px", opacity: checkedOpacity }, timeout,
                function () {
                    checkBoxObj.ValueChanged(checkBoxObj.CurrentValue);
                });
            }
            else {
                atCheckBoxOfLiaoWrapperCheckAreaWrapperIcon.stop().animate(
                {
                    left: initIconPosition.left + "px", top: initIconPosition.top + "px", opacity: initOpacity
                }, timeout, function () {
                    atCheckBoxOfLiaoWrapperCheckAreaWrapperIcon.css({ display: "none" });
                    checkBoxObj.ValueChanged(checkBoxObj.CurrentValue);
                });
            }
        });
        atCheckBoxOfLiao.bind("load", function () {
            var checkAreaWidth = parseFloat(atCheckBoxOfLiaoWrapperCheckArea.css("width"))
            + parseFloat(atCheckBoxOfLiaoWrapperCheckArea.css("border-left-width"))
            + parseFloat(atCheckBoxOfLiaoWrapperCheckArea.css("border-right-width"));
            if (!(checkBoxObj.SetState instanceof Function)) {
                Liao.SetBindingModel(checkBoxObj);
            }
            if (checkBoxObj.IsBinded()) {
                checkBoxObj.Unbind();
            }
            checkBoxObj.Bind(function (property) {
                switch (property) {
                    case "DisplayText":
                        {
                            if (checkBoxObj.DisplayText.length > checkBoxObj.MaxTextLength) {
                                checkBoxObj.DisplayText = checkBoxObj.DisplayText.substr(0, checkBoxObj.MaxTextLength - 1) + "…";
                            }
                            var displayTextWidth = checkBoxObj.DisplayText.length * checkBoxObj.PerTextWidth;
                            var checkBoxWidth = displayTextWidth + checkAreaWidth;
                            atCheckBoxOfLiao.css({ width: checkBoxWidth + "px" });
                            atCheckBoxOfLiaoWrapper.css({ width: checkBoxWidth + "px" });
                            atCheckBoxOfLiaoWrapperTextArea.css({ width: displayTextWidth + "px" });
                            atCheckBoxOfLiaoWrapperTextArea.text(checkBoxObj.DisplayText);
                        }; break;
                }
            });
            checkBoxObj.OnAllPropertyChanged();
            initOpacity = atCheckBoxOfLiaoWrapperCheckAreaWrapperIcon.css("opacity");
            Liao.ExtendsObj(initIconPosition,
            {
                left: parseFloat(atCheckBoxOfLiaoWrapperCheckAreaWrapperIcon.css("left")),
                top: parseFloat(atCheckBoxOfLiaoWrapperCheckAreaWrapperIcon.css("top"))
            });
            if (checkBoxObj.InitValue) {
                atCheckBoxOfLiaoWrapperCheckAreaWrapperIcon.css({
                    display: "block", opacity: checkedOpacity, left: checkedIconPosition.left, top: checkedIconPosition.top
                });
            }
        });
        atCheckBoxOfLiao.load();
        return checkBoxObj;
    }
})(jQuery, Liao)