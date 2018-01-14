/// <reference path="../jquery.min.js" />
/// <reference path="../jquery-ui.js" />
/// <reference path="../LiaoComponent.js" />
/// <reference path="ButtonOfLiao.js" />

(function ($, Liao) {
    $.fn.DialogOfLiao = function (option) {
        var dialogObj = new Object();
        dialogObj.CssClass = "DialogOfLiao";
        dialogObj.MaxLengthOfTitle = 20;
        dialogObj.MinWidthOfContent = 300;
        dialogObj.HasMaskLayer = true;
        dialogObj.MaskLayerColor = "#CCCCCC";
        dialogObj.ColorStyle = "#999999";
        dialogObj.MaxCountOfButtons = 0;
        dialogObj.Buttons = [{ DisplayText: "取  消", Click: function () { Dispose(); } }, { DisplayText: "确  定", Click: function () { } }];
        dialogObj.Icon = "../../image/dialogicon.png";
        dialogObj.Item = { DisplayTitle: "DialogOfLiao插件默认标题", HtmlContent: "<br/><p>欢迎使用DialogOfLiao插件！</p><br/>",
            ContentScript: function () { }
        };
        dialogObj.ShowType = "Modal Slide"; // or Modal Fade,Message Fall,Message Push
        dialogObj.CloseClicked = function () { };
        dialogObj.CloseTimeout = 0;
        Liao.ExtendsObj(dialogObj, option);
        dialogObj.CloseDialog = function (closed) { Dispose(closed); };
        var atDialogOfLiaoParent = $(this);
        var atDocument = $(document);

        var atDialogOfLiaoMask = undefined;
        if (dialogObj.HasMaskLayer) {
            atDialogOfLiaoParent.append("<div class = \"DialogOfLiaoMask\"></div>");
            atDialogOfLiaoMask = atDialogOfLiaoParent.children("div.DialogOfLiaoMask").last();
        }
        atDialogOfLiaoParent.append("<div></div>");
        var atDialogOfLiao = atDialogOfLiaoParent.children("div").last();
        atDialogOfLiao.append("<div class = \"DialogOfLiaoHead\"></div>");
        var atDialogOfLiaoHead = atDialogOfLiao.children("div.DialogOfLiaoHead").first();
        atDialogOfLiao.append("<div class = \"DialogOfLiaoBody\"></div>");
        var atDialogOfLiaoBody = atDialogOfLiao.children("div.DialogOfLiaoBody").first();
        atDialogOfLiao.append("<div class = \"DialogOfLiaoFoot\"></div>");
        var atDialogOfLiaoFoot = atDialogOfLiao.children("div.DialogOfLiaoFoot").first();
        atDialogOfLiaoHead.append("<div class = \"DialogOfLiaoHeadTitle\"></div>");
        var atDialogOfLiaoHeadTitle = atDialogOfLiaoHead.children("div.DialogOfLiaoHeadTitle").first();
        atDialogOfLiaoHead.append("<div class = \"DialogOfLiaoHeadClose\"></div>");
        var atDialogOfLiaoHeadClose = atDialogOfLiaoHead.children("div.DialogOfLiaoHeadClose").first();
        atDialogOfLiaoBody.append("<div class = \"DialogOfLiaoBodyWrapper\"></div>");
        var atDialogOfLiaoBodyWrapper = atDialogOfLiaoBody.children("div.DialogOfLiaoBodyWrapper").first();

        var oldParentOverflow = undefined;
        if (dialogObj.HasMaskLayer) {
            oldParentOverflow = atDialogOfLiaoParent.css("overflow");
            atDialogOfLiaoParent.css({ overflow: "hidden" });
        }
        var parentWidth = undefined;
        var parentHeight = undefined;
        if (atDialogOfLiaoParent.prop("tagName") == "BODY") {
            parentWidth = $(window).width();
            parentHeight = $(window).height();
        }
        else {
            parentWidth = parseFloat(atDialogOfLiaoParent.css("width"));
            parentHeight = parseFloat(atDialogOfLiaoParent.css("height"));
        }
        var parentScrollPosition = { left: atDialogOfLiaoParent.scrollLeft(), top: atDialogOfLiaoParent.scrollTop() };
        var parentSize = { width: parentWidth, height: parentHeight };
        var dialogSize = { width: undefined, height: undefined };
        var timeout = 666;
        var dialogMoving = false;
        var initMaskOpacity = undefined;
        var showedMaskOpacity = 0.5;
        var initDialogState = {};
        var showedDialogState = {};
        var disposeDialogState = { contentHeight: 0, contentOpacity: 0, contentDisplay: "none", width: 0 };
        var mousePosition = {};
        var timer = undefined;
        function Dispose(disposed) {
            atDialogOfLiaoBody.stop().animate({ opacity: disposeDialogState.contentOpacity, height: disposeDialogState.contentHeight + "px" },
            timeout, function () {
                atDialogOfLiaoBody.css({ display: disposeDialogState.contentDisplay });
                atDialogOfLiao.stop().animate({ width: disposeDialogState.width + "px" }, timeout, function () {
                    atDialogOfLiao.remove();
                    if (dialogObj.HasMaskLayer) {
                        atDialogOfLiaoMask.stop().animate({ opacity: initMaskOpacity }, timeout, function () {
                            atDialogOfLiaoMask.remove();
                            if (atDialogOfLiaoParent.css("overflow") == "hidden") {
                                atDialogOfLiaoParent.css({ overflow: oldParentOverflow });
                            }
                            if (timer != undefined) {
                                clearTimeout(timer);
                            }
                            if (disposed != undefined) {
                                disposed();
                            }
                        });
                    }
                    else {
                        if (timer != undefined) {
                            clearTimeout(timer);
                        }
                        if (disposed != undefined) {
                            disposed();
                        }
                    }
                });
            });
        }
        function MaskFadeShow(showed) {
            if (dialogObj.HasMaskLayer) {
                atDialogOfLiaoMask.animate({ opacity: showedMaskOpacity }, timeout, function () {
                    if (showed != undefined) {
                        showed();
                    }
                });
            }
            else {
                if (showed != undefined) {
                    showed();
                }
            }
        }
        function ModalFadeShow(showed) {
            atDialogOfLiao.css({ display: showedDialogState.display }).animate({ opacity: showedDialogState.opacity }, timeout, function () {
                if (showed != undefined) {
                    showed();
                }
            });
        }
        function ModalSlideShow(showed) {
            atDialogOfLiao.css({ display: showedDialogState.display }).animate({ width: showedDialogState.width + "px" }, timeout, function () {
                atDialogOfLiaoBody.css({ display: showedDialogState.contentDisplay });
                atDialogOfLiaoBody.animate({ opacity: showedDialogState.contentOpacity, height: showedDialogState.contentHeighT + "px" },
                timeout, function () {
                    if (showed != undefined) {
                        showed();
                    }
                });
            });
        }
        var fallTimeout = 1;
        var currentFallHeight = 0;
        var addHeightInTimeout = 0.2;
        var lossHeight = 3;
        function MessageFallShow(showed) {
            currentFallHeight += addHeightInTimeout;
            atDialogOfLiao.animate({ top: "+=" + currentFallHeight + "px" }, fallTimeout, function () {
                var currentDialogTop = parseFloat(atDialogOfLiao.css("top"));
                if (currentDialogTop >= parentScrollPosition.top + parentSize.height - dialogSize.height) {
                    atDialogOfLiao.css({ top: (parentScrollPosition.top + parentSize.height - dialogSize.height) + "px" });
                    currentFallHeight -= lossHeight;
                    if (currentFallHeight <= 0) {
                        currentFallHeight = 0;
                        if (showed != undefined) {
                            showed();
                        }
                    }
                    else {
                        currentFallHeight = -currentFallHeight;
                        MessageFallShow(showed);
                    }
                }
                else {
                    MessageFallShow(showed);
                }
            });
        }
        function MessagePushShow(showed) {
            atDialogOfLiao.animate({ left: showedDialogState.left + "px", top: showedDialogState.top + "px" }, timeout, function () {
                if (showed != undefined) {
                    showed();
                }
            });
        }
        atDialogOfLiaoHeadClose.bind("click", function () {
            Dispose(function () { dialogObj.CloseClicked() });
        });
        atDialogOfLiaoHeadTitle.bind("mousedown", function (e) {
            $.extend(mousePosition, { left: e.pageX - atDialogOfLiao.offset().left, top: e.pageY - atDialogOfLiao.offset().top });
            dialogMoving = true;
        });
        atDocument.bind("mousemove", function (e) {
            if (dialogMoving) {
                atDialogOfLiao.css({ left: e.pageX - mousePosition.left - atDialogOfLiaoParent.offset().left + parentScrollPosition.left,
                    top: e.pageY - mousePosition.top - atDialogOfLiaoParent.offset().top + parentScrollPosition.top
                });
            }
        });
        atDocument.bind("mouseup", function () {
            dialogMoving = false;
        });
        var loading = function () {
            dialogObj.Item.DisplayTitle = dialogObj.Item.DisplayTitle.length > dialogObj.MaxLengthOfTitle ?
            dialogObj.Item.DisplayTitle.substr(0, dialogObj.MaxLengthOfTitle - 1) + "…" : dialogObj.Item.DisplayTitle;
            if (dialogObj.MaxCountOfButtons > 0 && dialogObj.Buttons.length > dialogObj.MaxCountOfButtons) {
                dialogObj.Buttons.splice(dialogObj.MaxCountOfButtons, dialogObj.Buttons.length - dialogObj.MaxCountOfButtons);
            }
            atDialogOfLiao.addClass(dialogObj.CssClass);
            if (dialogObj.HasMaskLayer) {
                atDialogOfLiaoMask.css({ "background-color": dialogObj.MaskLayerColor, width: parentSize.width + "px",
                    height: parentSize.height + "px", left: parentScrollPosition.left + "px", top: parentScrollPosition.top + "px"
                });
                initMaskOpacity = atDialogOfLiaoMask.css("opacity");
            }
            atDialogOfLiaoHeadTitle.text(dialogObj.Item.DisplayTitle);
            atDialogOfLiaoBodyWrapper.html(dialogObj.Item.HtmlContent);
            if (dialogObj.Item.ContentScript != undefined) {
                dialogObj.Item.ContentScript();
            }
            var contentWidth = parseFloat(atDialogOfLiaoBodyWrapper.css("width"));
            var contentHeight = parseFloat(atDialogOfLiaoBodyWrapper.css("height"));
            contentWidth = contentWidth < dialogObj.MinWidthOfContent ? dialogObj.MinWidthOfContent : contentWidth;
            var widthOfBodyLeftBorder = parseFloat(atDialogOfLiaoBody.css("border-left-width"));
            var widthOfBodyRightBorder = parseFloat(atDialogOfLiaoBody.css("border-right-width"));
            var headHeight = parseFloat(atDialogOfLiaoHead.css("height"));
            var footHeight = parseFloat(atDialogOfLiaoFoot.css("height"));
            $.extend(dialogSize, { width: contentWidth + widthOfBodyLeftBorder + widthOfBodyRightBorder,
                height: contentHeight + headHeight + footHeight
            });
            atDialogOfLiao.css({ width: dialogSize.width + "px", height: dialogSize.height + "px" });
            atDialogOfLiaoHead.css({ width: dialogSize.width + "px", "background-color": dialogObj.ColorStyle });
            atDialogOfLiaoBody.css({ width: contentWidth + "px", height: contentHeight + "px",
                "border-left-color": dialogObj.ColorStyle, "border-right-color": dialogObj.ColorStyle
            });
            atDialogOfLiaoFoot.css({ width: dialogSize.width + "px", "background-color": dialogObj.ColorStyle });
            var closeWidth = parseFloat(atDialogOfLiaoHeadClose.css("width"));
            atDialogOfLiaoHeadTitle.css({ width: dialogSize.width - closeWidth + "px", "background-image": "url('" + dialogObj.Icon + "')" });
            atDialogOfLiaoBodyWrapper.css({ width: contentWidth + "px", height: contentHeight + "px" });
            $.each(dialogObj.Buttons, function (index, buttonObj) {
                atDialogOfLiaoFoot.append("<div class = \"DialogOfLiaoFootButton\"></div>");
                var atCurrentButton = atDialogOfLiaoFoot.children("div.DialogOfLiaoFootButton").last();
                atCurrentButton.ButtonOfLiao({ DisplayText: buttonObj.DisplayText,
                    Click: function () { buttonObj.Click(); }
                });
            });
            var maskShowed = undefined;
            if (dialogObj.ShowType == "Modal Fade") {
                $.extend(initDialogState, { display: "none", opacity: 0,
                    left: parentScrollPosition.left + parseFloat(parentSize.width / 2) - parseFloat(dialogSize.width / 2),
                    top: parentScrollPosition.top + parseFloat(parentSize.height / 2) - parseFloat(dialogSize.height / 2)
                });
                $.extend(showedDialogState, { display: "block", opacity: 1, left: initDialogState.left, top: initDialogState.top });
                atDialogOfLiao.css({ display: initDialogState.display, opacity: initDialogState.opacity });
                maskShowed = ModalFadeShow;
            }
            else if (dialogObj.ShowType == "Message Fall") {
                $.extend(initDialogState, {
                    left: parentScrollPosition.left + parseFloat(parentSize.width / 2) - parseFloat(dialogSize.width / 2),
                    top: parentScrollPosition.top - dialogSize.height
                });
                $.extend(showedDialogState, {
                    left: parentScrollPosition.left + parseFloat(parentSize.width / 2) - parseFloat(dialogSize.width / 2),
                    top: parentScrollPosition.top + parentSize.height - dialogSize.height
                });
                maskShowed = MessageFallShow;
            }
            else if (dialogObj.ShowType == "Message Push") {
                $.extend(initDialogState, {
                    left: parentScrollPosition.left + parentSize.width - dialogSize.width,
                    top: parentScrollPosition.top + parentSize.height
                });
                $.extend(showedDialogState, {
                    left: parentScrollPosition.left + parentSize.width - dialogSize.width,
                    top: parentScrollPosition.top + parentSize.height - dialogSize.height
                });
                maskShowed = MessagePushShow;
            }
            else {
                $.extend(initDialogState, { display: "none", width: 0, contentDisplay: "none", contentOpacity: 0, contentHeighT: 0,
                    left: parentScrollPosition.left + parseFloat(parentSize.width / 2) - parseFloat(dialogSize.width / 2),
                    top: parentScrollPosition.top + parseFloat(parentSize.height / 2) - parseFloat(dialogSize.height / 2)
                });
                $.extend(showedDialogState, { display: "block", width: dialogSize.width, contentDisplay: "block", contentOpacity: 1,
                    contentHeighT: contentHeight, left: initDialogState.left, top: initDialogState.top
                });
                atDialogOfLiaoBody.css({ display: initDialogState.contentDisplay, opacity: initDialogState.contentOpacity,
                    height: initDialogState.contentHeighT + "px"
                });
                atDialogOfLiao.css({ display: initDialogState.display, width: initDialogState.width + "px" });
                maskShowed = ModalSlideShow;
            }
            atDialogOfLiao.css({ left: initDialogState.left + "px", top: initDialogState.top + "px" });
            MaskFadeShow(function () {
                maskShowed(function () {
                    if (dialogObj.CloseTimeout > 0) {
                        timer = setTimeout(function () { Dispose(); }, dialogObj.CloseTimeout);
                    }
                });
            });
        };
        loading();
        return dialogObj;
    }
})(jQuery, Liao)
