/// <reference path="../jQuery.min.js" />
/// <reference path="../jQuery-ui.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.MultiOfLiao = function (option) {
        var multiObj = new Object();
        multiObj.CssClass = "MultiOfLiao";
        multiObj.WidthOfMulti = 300;
        multiObj.MaxLengthOfText = 20;
        multiObj.WidthOfPerText = 16;
        multiObj.MaxCountOfSelected = 0;
        multiObj.ItemsOfSource = [
        { Name: "MultiOfLiao插件默认名称一", Value: undefined, Selected: false },
        { Name: "MultiOfLiao插件默认名称二", Value: undefined, Selected: false}];
        multiObj.ItemSelected = function (currentItemValue) { };
        multiObj.IsAjaxMode = false;
        multiObj.AjaxConfiguration = {
            TransferObj: null, Url: undefined, CountOfPerPage: 0,
            PropertyOfServer: { NameProperty: function (item) { }, ValueProperty: function (item) { } }
        };
        Liao.ExtendsObj(multiObj, option);
        multiObj.GetValuesOfSelected = function () {
            var itemValues = [];
            $.each(multiObj.ItemsOfSource, function (index, item) {
                if (item != null && item.Selected) {
                    itemValues.push(item.Value);
                }
            });
            return itemValues;
        };
        var atMultiOfLiao = $(this);
        atMultiOfLiao.addClass(multiObj.CssClass);

        atMultiOfLiao.append("<div class = \"MultiOfLiaoWrapper\"></div>");
        var atMultiOfLiaoWrapper = atMultiOfLiao.children("div.MultiOfLiaoWrapper").first();
        atMultiOfLiaoWrapper.append("<div class = \"MultiOfLiaoWrapperSelected\"></div>");
        var atMultiOfLiaoWrapperSelected = atMultiOfLiaoWrapper.children("div.MultiOfLiaoWrapperSelected").first();
        atMultiOfLiaoWrapper.append("<div class = \"MultiOfLiaoWrapperUnselected\"></div>");
        var atMultiOfLiaoWrapperUnselected = atMultiOfLiaoWrapper.children("div.MultiOfLiaoWrapperUnselected").first();
        atMultiOfLiaoWrapperSelected.append("<div class = \"MultiOfLiaoWrapperSelectedInsert\"></div>");
        var atMultiOfLiaoWrapperSelectedInsert = atMultiOfLiaoWrapperSelected.children("div.MultiOfLiaoWrapperSelectedInsert").first();
        var atMultiOfLiaoWrapperUnselectedLoad = undefined;
        if (multiObj.IsAjaxMode) {
            atMultiOfLiaoWrapperUnselected.append("<div class = \"MultiOfLiaoWrapperUnselectedLoad\"></div>");
            atMultiOfLiaoWrapperUnselectedLoad = atMultiOfLiaoWrapperUnselected.children("div.MultiOfLiaoWrapperUnselectedLoad").first();
        }

        var timeout = 333;
        var textOfAjaxLoad = { load: "Load More", complete: "Load Completed" };
        var currentPageIndex = -1;
        var continueLoad = true;
        var unselectedOpen = false;
        var minWidthOfItem = 0;
        var initBorderColor = undefined;
        var clickedBorderColor = "#000000";
        var initStateOfUnselected = { display: undefined, opacity: undefined };
        var showedStateOfUnselected = { display: "block", opacity: 1 };
        var insertIconState = { openState: "url('../../image/multiup.png')", closeState: undefined };
        function GetCountOfSelected() {
            var count = 0;
            $.each(multiObj.ItemsOfSource, function (index, item) {
                count = item.Selected ? count + 1 : count;
            });
            return count;
        }
        function ItemClickOfUnselected(atItem, clicked) {
            atItem.data("item").Selected = true;
            atItem.stop().animate({ width: minWidthOfItem + "px" }, timeout, function () {
                var currentItemPosition = { left: atItem.position().left, top: atItem.position().top };
                var bornPositionOfSelected = {
                    left: atMultiOfLiaoWrapperSelected.children().first().position().left,
                    top: atMultiOfLiaoWrapperSelected.children().first().position().top
                };
                atItem.css({ position: "absolute",
                    left: currentItemPosition.left + "px", top: currentItemPosition.top + "px", "border-color": clickedBorderColor
                }).animate({ left: bornPositionOfSelected.left + "px", top: bornPositionOfSelected.top + "px" }, timeout, function () {
                    var item = atItem.detach();
                    atMultiOfLiaoWrapperSelected.prepend(item);
                    atItem = $(item).css({ position: "static", "border-color": initBorderColor });
                    atItem.unbind().bind("click", function () {
                        ItemClickOfSelected(atItem, function () {
                            AdjustMultiHeight(false);
                        });
                    }).animate({ width: atItem.data("width") + "px" }, timeout, function () {
                        if (clicked != undefined) {
                            clicked();
                        }
                    });
                });
            });
        }
        function ItemClickOfSelected(atItem, clicked) {
            atItem.data("item").Selected = false;
            atItem.stop().animate({ width: minWidthOfItem + "px" }, timeout, function () {
                var currentItemPosition = { left: atItem.position().left, top: atItem.position().top };
                var bornPositionOfUnselected = {};
                var itemCountOfUnselected = atMultiOfLiaoWrapperUnselected.children().length;
                if (itemCountOfUnselected == 0) {
                    $.extend(bornPositionOfUnselected, {
                        left: atMultiOfLiaoWrapperUnselected.position().left,
                        top: atMultiOfLiaoWrapperUnselected.position().top
                    });
                }
                else {
                    $.extend(bornPositionOfUnselected, {
                        left: atMultiOfLiaoWrapperUnselected.children().first().position().left,
                        top: atMultiOfLiaoWrapperUnselected.children().first().position().top
                    });
                }
                atItem.css({ position: "absolute",
                    left: currentItemPosition.left + "px", top: currentItemPosition.top + "px", "border-color": clickedBorderColor
                }).animate({ left: bornPositionOfUnselected.left + "px", top: bornPositionOfUnselected.top + "px" }, timeout, function () {
                    var item = atItem.detach();
                    atMultiOfLiaoWrapperUnselected.prepend(item);
                    atItem = $(item).css({ position: "static", "border-color": initBorderColor });
                    atItem.unbind().bind("click", function () {
                        if (multiObj.MaxCountOfSelected <= 0 || GetCountOfSelected() < multiObj.MaxCountOfSelected) {
                            ItemClickOfUnselected(atItem, function () {
                                AdjustMultiHeight(false);
                                multiObj.ItemSelected(atItem.data("item").Value);
                            });
                        }
                    }).animate({ width: atItem.data("width") + "px" }, timeout, function () {
                        if (clicked != undefined) {
                            clicked();
                        }
                    });
                });
            });
        }
        function AdjustMultiHeight(isFirst) {
            var topBorderWidthOfSelected = parseFloat(atMultiOfLiaoWrapperSelected.css("border-top-width"));
            var bottomBorderWidthOfSelected = parseFloat(atMultiOfLiaoWrapperSelected.css("border-bottom-width"));
            var multiHeight = undefined;
            if (isFirst) {
                var insertIconHeight = parseFloat(atMultiOfLiaoWrapperSelectedInsert.css("height"));
                var insertIconTopMargin = parseFloat(atMultiOfLiaoWrapperSelectedInsert.css("margin-top"));
                var insertIconBottomMargin = parseFloat(atMultiOfLiaoWrapperSelectedInsert.css("margin-bottom"));
                multiHeight = insertIconHeight + insertIconTopMargin + insertIconBottomMargin + topBorderWidthOfSelected
                + bottomBorderWidthOfSelected;
            }
            else {
                var selectedHeight = parseFloat(atMultiOfLiaoWrapperSelected.css("height"));
                multiHeight = selectedHeight + topBorderWidthOfSelected + bottomBorderWidthOfSelected;
            }
            atMultiOfLiao.css({ height: multiHeight + "px" });
            atMultiOfLiaoWrapper.css({ height: multiHeight + "px" });
        }
        function BindItemOfUnselected(item) {
            if (!item.Selected) {
                var currentItemWidth = item.Name.length * multiObj.WidthOfPerText;
                if (multiObj.IsAjaxMode) {
                    atMultiOfLiaoWrapperUnselectedLoad.before("<span class = \"MultiOfLiaoWrapperItem\"></span>");
                }
                else {
                    atMultiOfLiaoWrapperUnselected.append("<span class = \"MultiOfLiaoWrapperItem\"></span>");
                }
                var atCurrentItem = atMultiOfLiaoWrapperUnselected.children("span.MultiOfLiaoWrapperItem").last();
                atCurrentItem.css({ width: currentItemWidth + "px" }).text(item.Name).data("item", item).data("width", currentItemWidth)
                .bind("click", function () {
                    if (multiObj.MaxCountOfSelected <= 0 || GetCountOfSelected() < multiObj.MaxCountOfSelected) {
                        ItemClickOfUnselected(atCurrentItem, function () {
                            AdjustMultiHeight(false);
                            multiObj.ItemSelected(item.Value);
                        });
                    }
                });
                initBorderColor = initBorderColor == undefined ? atCurrentItem.css("border-color") : initBorderColor;
            }
        }
        function AjaxDownload(downloaded) {
            var ajaxObj = {
                transferObj: multiObj.AjaxConfiguration.TransferObj, pageIndex: currentPageIndex,
                pageCount: multiObj.AjaxConfiguration.CountOfPerPage
            };
            var requestRan = (new Date()).getTime();
            $.ajax({ type: "get", url: multiObj.AjaxConfiguration.Url + "?requestRan=" + requestRan, data: ajaxObj, dataType: "json",
                async: true, success: function (datas) {
                    if (datas != null) {
                        var loadItemCount = datas.length;
                        if (loadItemCount < multiObj.AjaxConfiguration.CountOfPerPage) {
                            currentPageIndex = loadItemCount <= 0 ? currentPageIndex - 1 : currentPageIndex;
                            continueLoad = false;
                        }
                        $.each(datas, function (index, data) {
                            if (data != null) {
                                var tempItem = new Object();
                                tempItem.Name = multiObj.AjaxConfiguration.PropertyOfServer.NameProperty(data);
                                tempItem.Value = multiObj.AjaxConfiguration.PropertyOfServer.ValueProperty(data);
                                tempItem.Selected = false;
                                tempItem.Name = tempItem.Name.length > multiObj.MaxLengthOfText ?
                                tempItem.Name.substr(0, multiObj.MaxLengthOfText - 1) + "…" : tempItem.Name;
                                multiObj.ItemsOfSource.push(tempItem);
                            }
                        });
                    }
                    else {
                        currentPageIndex = currentPageIndex - 1;
                        continueLoad = false;
                    }
                }, error: function () {
                    currentPageIndex = currentPageIndex - 1;
                }, complete: function () {
                    if (downloaded != undefined) {
                        downloaded();
                    }
                }
            });
        }
        atMultiOfLiaoWrapperSelectedInsert.bind("click", function () {
            unselectedOpen = !unselectedOpen;
            if (unselectedOpen) {
                atMultiOfLiaoWrapperUnselected.stop().css({ display: showedStateOfUnselected.display })
                .animate({ opacity: showedStateOfUnselected.opacity }, timeout, function () {
                    atMultiOfLiaoWrapperSelectedInsert.css({ "background-image": insertIconState.openState });
                });
            }
            else {
                atMultiOfLiaoWrapperUnselected.stop().animate({ opacity: initStateOfUnselected.opacity }, timeout, function () {
                    atMultiOfLiaoWrapperUnselected.css({ display: initStateOfUnselected.display });
                    atMultiOfLiaoWrapperSelectedInsert.css({ "background-image": insertIconState.closeState });
                });
            }
        });
        atMultiOfLiao.bind("load", function () {
            multiObj.ItemsOfSource = multiObj.IsAjaxMode ? [] : multiObj.ItemsOfSource;
            $.each(multiObj.ItemsOfSource, function (index, item) {
                if (item != null) {
                    item.Selected = item.Selected ? false : item.Selected;
                    item.Name = item.Name.length > multiObj.MaxLengthOfText ?
                    item.Name.substr(0, multiObj.MaxLengthOfText - 1) + "…" : item.Name;
                }
                else {
                    multiObj.ItemsOfSource.splice(index, 1);
                }
            });
            var leftBorderWidthOfSelected = parseFloat(atMultiOfLiaoWrapperSelected.css("border-left-width"));
            var rightBorderWidthOfSelected = parseFloat(atMultiOfLiaoWrapperSelected.css("border-right-width"));
            var leftBorderWidthOfUnselected = parseFloat(atMultiOfLiaoWrapperUnselected.css("border-left-width"));
            var rightBorderWidthOfUnselected = parseFloat(atMultiOfLiaoWrapperUnselected.css("border-right-width"));
            atMultiOfLiao.css({ width: multiObj.WidthOfMulti + "px" });
            atMultiOfLiaoWrapper.css({ width: multiObj.WidthOfMulti + "px" });
            atMultiOfLiaoWrapperSelected.css({
                width: multiObj.WidthOfMulti - leftBorderWidthOfSelected - rightBorderWidthOfSelected + "px"
            });
            atMultiOfLiaoWrapperUnselected.css({
                width: multiObj.WidthOfMulti - leftBorderWidthOfUnselected - rightBorderWidthOfUnselected + "px"
            });
            if (multiObj.IsAjaxMode) {
                var leftMarginOfLoad = parseFloat(atMultiOfLiaoWrapperUnselectedLoad.css("margin-left"));
                var rightMarginOfLoad = parseFloat(atMultiOfLiaoWrapperUnselectedLoad.css("margin-right"));
                atMultiOfLiaoWrapperUnselectedLoad.css({
                    width: multiObj.WidthOfMulti - leftBorderWidthOfUnselected - rightBorderWidthOfUnselected
                    - leftMarginOfLoad - rightMarginOfLoad + "px"
                }).text(textOfAjaxLoad.load).bind("click", function () {
                    if (continueLoad) {
                        var tempPageIndex = ++currentPageIndex;
                        AjaxDownload(function () {
                            if (!continueLoad) {
                                atMultiOfLiaoWrapperUnselectedLoad.text(textOfAjaxLoad.complete);
                            }
                            for (var index = tempPageIndex * multiObj.AjaxConfiguration.CountOfPerPage;
                            index < (tempPageIndex + 1) * multiObj.AjaxConfiguration.CountOfPerPage; index++) {
                                var currentItem = multiObj.ItemsOfSource[index];
                                if (currentItem != undefined && currentItem != null) {
                                    BindItemOfUnselected(currentItem);
                                }
                                else
                                    break;
                            }
                        });
                    }
                });
            }
            AdjustMultiHeight(true);
            $.extend(initStateOfUnselected, {
                display: atMultiOfLiaoWrapperUnselected.css("display"), opacity: parseFloat(atMultiOfLiaoWrapperUnselected.css("opacity"))
            });
            insertIconState.closeState = atMultiOfLiaoWrapperSelectedInsert.css("background-image");
            if (multiObj.IsAjaxMode) {
                atMultiOfLiaoWrapperUnselectedLoad.click();
            }
            else {
                $.each(multiObj.ItemsOfSource, function (index, item) {
                    BindItemOfUnselected(item);
                });
            }
        });
        atMultiOfLiao.load();
        return multiObj;
    }
})(jQuery, Liao)