/// <reference path="../jquery.min.js" />
/// <reference path="../jquery-ui.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.TextBoxOfLiao = function (option) {
        var textBoxObj = new Object();
        textBoxObj.CssClass = "TextBoxOfLiao";
        textBoxObj.MaxTitleLength = 9;
        textBoxObj.WidthOfPerTitle = 30;
        textBoxObj.DisplayTitle = "默认标题";
        textBoxObj.BoxType = "text"; //or password
        textBoxObj.ReadOnly = false;
        textBoxObj.InitValue = "";
        textBoxObj.EnterPressed = function () { };
        Liao.ExtendsObj(textBoxObj, option);
        textBoxObj.CurrentValue = textBoxObj.InitValue;
        textBoxObj.Value = function (newValue) {
            if (newValue == undefined) {
                textBoxObj.CurrentValue = atTextBoxOfLiaoWrapperContent.val();
                return textBoxObj.CurrentValue;
            }
            else {
                textBoxObj.CurrentValue = newValue;
                clicked = function () { atTextBoxOfLiaoWrapperContent.val(textBoxObj.CurrentValue); };
                atTextBoxOfLiaoWrapper.click();
            }
        };
        var atTextBoxOfLiao = $(this);
        atTextBoxOfLiao.addClass(textBoxObj.CssClass);

        atTextBoxOfLiao.append("<div class = \"TextBoxOfLiaoWrapper\"></div>");
        var atTextBoxOfLiaoWrapper = atTextBoxOfLiao.children("div.TextBoxOfLiaoWrapper").first();
        atTextBoxOfLiaoWrapper.append("<input class = \"TextBoxOfLiaoWrapperContent\" />");
        var atTextBoxOfLiaoWrapperContent = atTextBoxOfLiaoWrapper.children("input.TextBoxOfLiaoWrapperContent").first();
        atTextBoxOfLiaoWrapper.append("<span class = \"TextBoxOfLiaoWrapperTitle\"></span>");
        var atTextBoxOfLiaoWrapperTitle = atTextBoxOfLiaoWrapper.children("span.TextBoxOfLiaoWrapperTitle").first();

        var titleSplit = "：";
        var timeout = 300;
        var initBottomColor = undefined;
        var hoverBottomColor = "#9999FF";
        var titleWidth = undefined;
        var initBoxLeft = undefined;
        var clicked = function () { };
        atTextBoxOfLiao.bind("load", function () {
            if (!(textBoxObj.SetState instanceof Function)) {
                Liao.SetBindingModel(textBoxObj);
            }
            if (textBoxObj.IsBinded()) {
                textBoxObj.Unbind();
            }
            textBoxObj.Bind(function (property) {
                switch (property) {
                    case "DisplayTitle":
                        {
                            if (textBoxObj.DisplayTitle.length > textBoxObj.MaxTitleLength) {
                                textBoxObj.DisplayTitle = textBoxObj.DisplayTitle.substr(0, textBoxObj.MaxTitleLength);
                            }
                            var boxWidth = (textBoxObj.DisplayTitle.length + 1) * textBoxObj.WidthOfPerTitle;
                            atTextBoxOfLiao.css({ width: boxWidth + "px" });
                            atTextBoxOfLiaoWrapper.css({ width: boxWidth + "px" });
                            atTextBoxOfLiaoWrapperContent.css({ width: boxWidth + "px" });
                            atTextBoxOfLiaoWrapperTitle.text(textBoxObj.DisplayTitle + titleSplit);
                            titleWidth = parseFloat(atTextBoxOfLiaoWrapperTitle.css("width"));
                            initBoxLeft = parseFloat(atTextBoxOfLiaoWrapperContent.css("left"));
                            atTextBoxOfLiaoWrapperContent.css({ left: titleWidth + "px" });
                        }; break;
                    case "BoxType":
                        {
                            atTextBoxOfLiaoWrapperContent.attr({ type: textBoxObj.BoxType });
                        }; break;
                    case "ReadOnly":
                        {
                            if (textBoxObj.ReadOnly) {
                                atTextBoxOfLiaoWrapperContent.attr({ readonly: "readonly" });
                            }
                            else {
                                atTextBoxOfLiaoWrapperContent.removeAttr("readonly");
                            }
                        }; break;
                }
            });
            textBoxObj.OnAllPropertyChanged();
            if (textBoxObj.InitValue != "") {
                atTextBoxOfLiaoWrapperContent.val(textBoxObj.InitValue);
            }
            initBottomColor = atTextBoxOfLiaoWrapperContent.css("border-bottom-color");
        });
        atTextBoxOfLiaoWrapper.bind("mouseenter", function () {
            atTextBoxOfLiaoWrapperContent.css({ "border-bottom-color": hoverBottomColor });
        });
        atTextBoxOfLiaoWrapper.bind("mouseleave", function () {
            atTextBoxOfLiaoWrapperContent.css({ "border-bottom-color": initBottomColor });
        });
        atTextBoxOfLiaoWrapper.bind("click", function () {
            titleWidth = titleWidth == 0 ? parseFloat(atTextBoxOfLiaoWrapperTitle.css("width")) : titleWidth;
            atTextBoxOfLiaoWrapperContent.stop().animate({ left: titleWidth + "px" }, timeout, function () {
                atTextBoxOfLiaoWrapperContent.focus();
                clicked();
                clicked = function () { };
            });
        });
        atTextBoxOfLiaoWrapperContent.bind("focusout", function () {
            textBoxObj.CurrentValue = atTextBoxOfLiaoWrapperContent.val();
            if (textBoxObj.CurrentValue == "") {
                atTextBoxOfLiaoWrapperContent.stop().animate({ left: initBoxLeft + "px" }, timeout);
            }
        });
        atTextBoxOfLiaoWrapperContent.bind("keydown", function (e) {
            if (e.which == 13) {
                textBoxObj.EnterPressed();
            }
        });
        atTextBoxOfLiao.load();
        return textBoxObj;
    }
})(jQuery, Liao)