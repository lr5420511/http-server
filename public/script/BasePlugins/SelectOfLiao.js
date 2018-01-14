/// <reference path="../jquery.min.js" />
/// <reference path="../jquery-ui.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.SelectOfLiao = function (option) {
        var selectObj = new Object();
        selectObj.CssClass = "SelectOfLiao";
        selectObj.WidthOfSelected = 222;
        selectObj.InitTextOfSelected = "欢迎使用SelectOfLiao插件,请选择:";
        selectObj.CountOfPerPage = 5;
        selectObj.Items = [
        { DisplayName: "SelectOfLiao插件默认选项一", Value: undefined },
        { DisplayName: "SelectOfLiao插件默认选项二", Value: undefined}];
        selectObj.ItemSelected = function (currentItemValue) { };
        selectObj.IsAjaxMode = false;
        selectObj.AjaxConfiguration = {
            TransferObj: null, Url: undefined, PropertyOfServer: { NameProperty: function (item) { }, ValueProperty: function (item) { } }
        };
        Liao.ExtendsObj(selectObj, option);
        selectObj.CurrentItemOfSelected = null;
        selectObj.GetCurrentItemValue = function () {
            return selectObj.CurrentItemOfSelected == null ? undefined : selectObj.CurrentItemOfSelected.Value;
        };
        var atSelectOfLiao = $(this);
        atSelectOfLiao.addClass(selectObj.CssClass);

        atSelectOfLiao.append("<div class = \"SelectOfLiaoHeader\"></div>");
        var atSelectOfLiaoHeader = atSelectOfLiao.children("div.SelectOfLiaoHeader").first();
        atSelectOfLiao.append("<div class = \"SelectOfLiaoPager\"></div>");
        var atSelectOfLiaoPager = atSelectOfLiao.children("div.SelectOfLiaoPager").first();
        atSelectOfLiao.append("<ul class = \"SelectOfLiaoContent\"></ul>");
        var atSelectOfLiaoContent = atSelectOfLiao.children("ul.SelectOfLiaoContent").first();
        atSelectOfLiaoHeader.append("<span class = \"SelectOfLiaoHeaderText\"></span>");
        var atSelectOfLiaoHeaderText = atSelectOfLiaoHeader.children("span.SelectOfLiaoHeaderText").first();
        atSelectOfLiaoHeader.append("<div class = \"SelectOfLiaoHeaderToggle\"></div>");
        var atSelectOfLiaoHeaderToggle = atSelectOfLiaoHeader.children("div.SelectOfLiaoHeaderToggle").first();
        atSelectOfLiaoPager.append("<div class = \"SelectOfLiaoPagerBack\"></div>");
        var atSelectOfLiaoPagerBack = atSelectOfLiaoPager.children("div.SelectOfLiaoPagerBack").first();
        atSelectOfLiaoPager.append("<div class = \"SelectOfLiaoPagerRefresh\"></div>");
        var atSelectOfLiaoPagerRefresh = atSelectOfLiaoPager.children("div.SelectOfLiaoPagerRefresh").first();

        var timeout = 350;
        var isAsyncShow = true;
        var currentPageIndex = -1;
        var continueDownload = true;
        var defaultCountOfPerPage = 2;
        var widthOfSelect = undefined;
        var leftPercentOfBlock = 0.7;
        var timeoutPercentOfShow = 0.2;
        var currentBlockLeft = undefined;
        var selectOpen = false;
        var blockIconState = { width: undefined, rightMargin: undefined };
        var hiddenElementState = { open: "block", close: undefined };
        var blockState = { init: {}, showed: { display: "block", opacity: 1, left: 0} };
        var toggleIconState = { init: undefined, showed: "url('../../image/selectup.png')" };
        function IsAsyncMode() {
            var ranNumber = parseInt(Math.random() * 10);
            return ranNumber > 4 && ranNumber < 10;
        }
        function GetItemsOfCurrentPage() {
            var items = [];
            var startItemIndex = currentPageIndex * selectObj.CountOfPerPage;
            var endItemIndex = (currentPageIndex + 1) * selectObj.CountOfPerPage - 1;
            for (var index = startItemIndex; index <= endItemIndex; index++) {
                var currentItem = selectObj.Items[index];
                if (currentItem != undefined && currentItem != null) {
                    items.push(currentItem);
                }
            }
            return items;
        }
        function AjaxDownload(downloaded) {
            var ranNumber = (new Date()).getTime();
            var ajaxObj = {
                transferObj: selectObj.AjaxConfiguration.TransferObj, pageIndex: currentPageIndex,
                pageCount: selectObj.CountOfPerPage
            };
            $.ajax({ type: "get", url: selectObj.AjaxConfiguration.Url + "?requestRan=" + ranNumber, data: ajaxObj, dataType: "json",
                async: true, success: function (datas) {
                    if (datas != null) {
                        continueDownload = datas.length >= selectObj.CountOfPerPage;
                        $.each(datas, function (index, data) {
                            if (data != null) {
                                selectObj.Items.push({
                                    DisplayName: selectObj.AjaxConfiguration.PropertyOfServer.NameProperty(data),
                                    Value: selectObj.AjaxConfiguration.PropertyOfServer.ValueProperty(data)
                                });
                            }
                        });
                    }
                }, complete: function () {
                    if (downloaded != undefined) {
                        downloaded();
                    }
                }
            });
        }
        function BindItem(item) {
            var atFirstItemOfHidden = atSelectOfLiaoContent.children("li.SelectOfLiaoContentItem:hidden").first();
            var atFirstItemBlock = atFirstItemOfHidden.find("div.SelectOfLiaoContentItemWrapperBlock").first();
            var atFirstItemBlockText = atFirstItemBlock.children("span.SelectOfLiaoContentItemWrapperBlockText").first();
            atFirstItemBlock.data("item", item);
            atFirstItemBlockText.text(item.DisplayName);
            atFirstItemOfHidden.css({ display: hiddenElementState.open });
        }
        function UnbindItem(atItem) {
            var atCurrentItemBlock = atItem.find("div.SelectOfLiaoContentItemWrapperBlock").first();
            var atCurrentItemBlockText = atCurrentItemBlock.children("span.SelectOfLiaoContentItemWrapperBlockText").first();
            atCurrentItemBlock.data("item", null);
            atCurrentItemBlockText.text("");
            atItem.css({ display: hiddenElementState.close });
        }
        function AddNewItem() {
            atSelectOfLiaoContent.append("<li class = \"SelectOfLiaoContentItem\"></li>");
            var atCurrentItem = atSelectOfLiaoContent.children("li.SelectOfLiaoContentItem").last();
            atCurrentItem.append("<div class = \"SelectOfLiaoContentItemWrapper\"></div>");
            var atCurrentItemWrapper = atCurrentItem.children("div.SelectOfLiaoContentItemWrapper").first();
            atCurrentItemWrapper.append("<div class = \"SelectOfLiaoContentItemWrapperBlock\"></div>");
            var atCurrentItemWrapperBlock = atCurrentItemWrapper.children("div.SelectOfLiaoContentItemWrapperBlock").first();
            atCurrentItemWrapperBlock.append("<i class = \"SelectOfLiaoContentItemWrapperBlockIcon\"></i>");
            var atCurrentItemWrapperBlockIcon = atCurrentItemWrapperBlock.children("i.SelectOfLiaoContentItemWrapperBlockIcon").first();
            atCurrentItemWrapperBlock.append("<span class = \"SelectOfLiaoContentItemWrapperBlockText\"></span>");
            var atCurrentItemWrapperBlockText = atCurrentItemWrapperBlock.children("span.SelectOfLiaoContentItemWrapperBlockText").first();
            if (blockIconState.width == undefined || blockIconState.rightMargin == undefined) {
                $.extend(blockIconState, {
                    width: parseFloat(atCurrentItemWrapperBlockIcon.css("width")),
                    rightMargin: parseFloat(atCurrentItemWrapperBlockIcon.css("margin-right"))
                });
            }
            atCurrentItem.css({ width: widthOfSelect + "px" });
            atCurrentItemWrapper.css({ width: widthOfSelect + "px" });
            atCurrentItemWrapperBlock.css({ width: widthOfSelect + "px", left: currentBlockLeft + "px" }).data("initleft", currentBlockLeft);
            atCurrentItemWrapperBlockText.css({ width: widthOfSelect - blockIconState.width - blockIconState.rightMargin + "px" });
            atCurrentItemWrapperBlock.bind("click", function () {
                selectObj.CurrentItemOfSelected = atCurrentItemWrapperBlock.data("item");
                selectOpen = false;
                currentPageIndex = -1;
                UnloadItems(function () {
                    atSelectOfLiaoContent.css({ display: hiddenElementState.close });
                    atSelectOfLiaoPager.css({ display: hiddenElementState.close });
                    atSelectOfLiaoHeaderText.text(selectObj.CurrentItemOfSelected.DisplayName);
                    atSelectOfLiaoHeaderToggle.css({ "background-image": toggleIconState.init });
                    selectObj.ItemSelected(selectObj.CurrentItemOfSelected.Value);
                });
            });
            currentBlockLeft = -currentBlockLeft;
        }
        function ItemToShowed(atItem, allFinished) {
            var atCurrentItemBlock = atItem.find("div.SelectOfLiaoContentItemWrapperBlock").first();
            var atNextItem = atItem.nextAll("li.SelectOfLiaoContentItem:visible").length > 0 ?
            atItem.nextAll("li.SelectOfLiaoContentItem:visible").first() : undefined;
            atCurrentItemBlock.stop().css({ display: blockState.showed.display }).animate({
                opacity: blockState.showed.opacity, left: blockState.showed.left + "px"
            }, timeout, function () {
                if (atNextItem == undefined && allFinished != undefined) {
                    allFinished();
                }
            });
            if (atNextItem != undefined) {
                if (isAsyncShow) {
                    setTimeout(function () { ItemToShowed(atNextItem, allFinished); }, timeout * timeoutPercentOfShow);
                }
                else {
                    ItemToShowed(atNextItem, allFinished);
                }
            }
        }
        function ItemToInit(atItem, allFinished) {
            var atCurrentItemBlock = atItem.find("div.SelectOfLiaoContentItemWrapperBlock").first();
            var atPrevItem = atItem.prevAll("li.SelectOfLiaoContentItem:visible").length > 0 ?
            atItem.prevAll("li.SelectOfLiaoContentItem:visible").first() : undefined;
            atCurrentItemBlock.stop().animate({
                opacity: blockState.init.opacity, left: atCurrentItemBlock.data("initleft") + "px"
            }, timeout, function () {
                atCurrentItemBlock.css({ display: blockState.init.display });
                if (atPrevItem == undefined && allFinished != undefined) {
                    allFinished();
                }
            });
            if (atPrevItem != undefined) {
                if (isAsyncShow) {
                    setTimeout(function () { ItemToInit(atPrevItem, allFinished); }, timeout * timeoutPercentOfShow);
                }
                else {
                    ItemToInit(atPrevItem, allFinished);
                }
            }
        }
        function LoadItems(loaded, geted) {
            isAsyncShow = IsAsyncMode();
            var itemsOfLoad = GetItemsOfCurrentPage();
            if (itemsOfLoad.length > 0) {
                if (geted != undefined) {
                    geted(function () {
                        $.each(itemsOfLoad, function (index, item) {
                            BindItem(item);
                        });
                        ItemToShowed(atSelectOfLiaoContent.children("li.SelectOfLiaoContentItem:visible").first(), loaded);
                    });
                }
                else {
                    $.each(itemsOfLoad, function (index, item) {
                        BindItem(item);
                    });
                    ItemToShowed(atSelectOfLiaoContent.children("li.SelectOfLiaoContentItem:visible").first(), loaded);
                }
            }
            else {
                if (selectObj.IsAjaxMode && continueDownload) {
                    AjaxDownload(function () {
                        LoadItems(loaded, geted);
                    });
                }
                else {
                    currentPageIndex--;
                    if (loaded != undefined) {
                        loaded();
                    }
                }
            }
        }
        function UnloadItems(unloaded) {
            var atItemsOfLoaded = atSelectOfLiaoContent.children("li.SelectOfLiaoContentItem:visible");
            if (atItemsOfLoaded.length > 0) {
                ItemToInit(atItemsOfLoaded.last(), function () {
                    $.each(atItemsOfLoaded, function (index, item) {
                        var atItem = $(item);
                        UnbindItem(atItem);
                    });
                    if (unloaded != undefined) {
                        unloaded();
                    }
                });
            }
            else {
                if (unloaded != undefined) {
                    unloaded();
                }
            }
        }
        atSelectOfLiaoHeaderToggle.bind("click", function () {
            selectOpen = !selectOpen;
            if (selectOpen) {
                currentPageIndex = 0;
                atSelectOfLiaoContent.css({ display: hiddenElementState.open });
                LoadItems(function () {
                    atSelectOfLiaoPager.css({ display: hiddenElementState.open });
                    atSelectOfLiaoHeaderToggle.css({ "background-image": toggleIconState.showed });
                }, undefined);
            }
            else {
                currentPageIndex = -1;
                UnloadItems(function () {
                    atSelectOfLiaoContent.css({ display: hiddenElementState.close });
                    atSelectOfLiaoPager.css({ display: hiddenElementState.close });
                    atSelectOfLiaoHeaderToggle.css({ "background-image": toggleIconState.init });
                });
            }
        });
        atSelectOfLiaoPagerBack.bind("click", function () {
            if (currentPageIndex > 0) {
                currentPageIndex--;
                LoadItems(undefined, UnloadItems);
            }
        });
        atSelectOfLiaoPagerRefresh.bind("click", function () {
            currentPageIndex++;
            LoadItems(undefined, UnloadItems);
        });
        atSelectOfLiao.bind("load", function () {
            selectObj.Items = selectObj.IsAjaxMode ? [] : selectObj.Items;
            selectObj.CountOfPerPage = selectObj.CountOfPerPage <= 0 ? defaultCountOfPerPage : selectObj.CountOfPerPage;
            var pagerBackWidth = parseFloat(atSelectOfLiaoPagerBack.css("width"));
            var pagerRefreshWidth = parseFloat(atSelectOfLiaoPagerRefresh.css("width"));
            var pagerBackLeftMargin = parseFloat(atSelectOfLiaoPagerBack.css("margin-left"));
            var pagerRefreshRightMargin = parseFloat(atSelectOfLiaoPagerRefresh.css("margin-right"));
            var minWidthOfSelected = pagerBackWidth + pagerRefreshWidth + pagerBackLeftMargin + pagerRefreshRightMargin;
            selectObj.WidthOfSelected = selectObj.WidthOfSelected < minWidthOfSelected ? minWidthOfSelected : selectObj.WidthOfSelected;
            var headerToggleWidth = parseFloat(atSelectOfLiaoHeaderToggle.css("width"));
            var headerToggleLeftBorderWidth = parseFloat(atSelectOfLiaoHeaderToggle.css("border-left-width"));
            widthOfSelect = selectObj.WidthOfSelected + headerToggleWidth + headerToggleLeftBorderWidth;
            atSelectOfLiao.css({ width: widthOfSelect + "px" });
            atSelectOfLiaoHeader.css({ width: widthOfSelect + "px" });
            atSelectOfLiaoPager.css({ width: selectObj.WidthOfSelected + "px" });
            atSelectOfLiaoContent.css({ width: widthOfSelect + "px" });
            atSelectOfLiaoHeaderText.css({ width: selectObj.WidthOfSelected + "px" }).text(selectObj.InitTextOfSelected);
            currentBlockLeft = widthOfSelect * leftPercentOfBlock;
            $.extend(toggleIconState, {
                init: atSelectOfLiaoHeaderToggle.css("background-image")
            });
            $.extend(hiddenElementState, {
                close: atSelectOfLiaoContent.css("display")
            });
            for (var index = 0; index < selectObj.CountOfPerPage; index++) {
                AddNewItem();
            }
            var atFirstItemBlock = atSelectOfLiaoContent.find("div.SelectOfLiaoContentItemWrapperBlock").first();
            $.extend(blockState.init, {
                display: atFirstItemBlock.css("display"), opacity: atFirstItemBlock.css("opacity")
            });
        });
        atSelectOfLiao.load();
        return selectObj;
    }
})(jQuery, Liao)