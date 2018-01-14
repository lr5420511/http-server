/// <reference path="../jquery.min.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.ReportOfLiao = function (option) {
        var reportObj = new Object();
        reportObj.CssClass = "ReportOfLiao";
        reportObj.Surface = { ColorStyle: "#9999FF", DisplayTitle: "ReportOfLiao组件默认标题" };
        reportObj.RowCountOfReport = 5;
        reportObj.ColumnCountOfReport = 4;
        reportObj.WidthOfItem = 150;
        reportObj.TimeoutOfAuto = 10000;
        reportObj.IsAsyncRefresh = false;
        reportObj.Items = [];
        reportObj.ItemClicked = function (currentItem) { };
        reportObj.IsAjaxMode = false;
        reportObj.AjaxConfiguration = {
            TransferObj: null, Url: undefined, ClearCacheMinutes: 120,
            PropertyOfServer: { NameProperty: function (item) { }, ValueProperty: function (item) { } }
        };
        reportObj.Refreshed = function (isAuto, currentPageIndex) { };
        Liao.ExtendsObj(reportObj, option);
        reportObj.CurrentPageIndex = function (newPageIndex) {
            if (typeof newPageIndex === "undefined") {
                return pageIndex;
            }
            else {
                var newStartItemIndex = newPageIndex * pageCount;
                if (newStartItemIndex >= 0 && newStartItemIndex <= reportObj.Items.length - 1 && newPageIndex != pageIndex) {
                    clearTimeout(timer);
                    pageIndex = newPageIndex;
                    RefreshItemsOfCurrentPage(function (success) {
                        if (success && !Liao.IsUndefinedOrNull(reportObj.Refreshed)) {
                            reportObj.Refreshed(false, pageIndex);
                        }
                        timer = setTimeout(function () { StartReport(); }, reportObj.TimeoutOfAuto);
                    });
                }
                else {
                    throw new Error("newPageIndex of Argument isn't a vaild value!");
                }
            }
        };
        var atReportOfLiao = $(this);
        atReportOfLiao.addClass(reportObj.CssClass);

        atReportOfLiao.append("<div class = \"ReportOfLiaoHead\"></div>");
        var atReportOfLiaoHead = atReportOfLiao.children("div.ReportOfLiaoHead").last();
        atReportOfLiao.append("<div class = \"ReportOfLiaoBody\"></div>");
        var atReportOfLiaoBody = atReportOfLiao.children("div.ReportOfLiaoBody").last();
        atReportOfLiaoHead.append("<span class = \"ReportOfLiaoHeadTitle\"></span>");
        var atReportOfLiaoHeadTitle = atReportOfLiaoHead.children("span.ReportOfLiaoHeadTitle").first();
        atReportOfLiaoHead.append("<div class = \"ReportOfLiaoHeadRefresh\"></div>");
        var atReportOfLiaoHeadRefresh = atReportOfLiaoHead.children("div.ReportOfLiaoHeadRefresh").first();
        atReportOfLiaoBody.append("<ul class = \"ReportOfLiaoBodyContent\"></ul>");
        var atReportOfLiaoBodyContent = atReportOfLiaoBody.children("ul.ReportOfLiaoBodyContent").first();

        var timeout = 222;
        var timer = undefined;
        var refreshText = "刷新列表";
        var pageIndex = -1;
        var pageCount = undefined;
        var percentTimeOfAsync = 0.6;
        var continueDownload = true;
        var totalMilliSecond = 0;
        var itemState = { showed: { opacity: 1, display: "block" }, hidden: {} };
        var itemTextColor = undefined;
        var minWidthOfItem = 20;
        var defaultRowCount = 5;
        var defaultColumnCount = 4;
        var defaultItem = { Name: "ReportOfLiao默认项", Value: null };
        function GetItemsOfCurrentIndex() {
            var startItemIndex = pageIndex * pageCount;
            var endItemIndex = (pageIndex + 1) * pageCount - 1;
            var tempItems = [];
            for (var index = startItemIndex; index <= endItemIndex; index++) {
                if (Liao.IsUndefinedOrNull(reportObj.Items[index])) {
                    continue;
                }
                else {
                    tempItems.push(reportObj.Items[index]);
                }
            }
            return tempItems;
        }
        function InsertItemToContent() {
            atReportOfLiaoBodyContent.append("<li class = \"ReportOfLiaoBodyContentItem\"></li>");
            var atCurrentContentItem = atReportOfLiaoBodyContent.children("li.ReportOfLiaoBodyContentItem").last();
            atCurrentContentItem.css({ width: reportObj.WidthOfItem + "px" })
            .bind("mouseenter", function () {
                atCurrentContentItem.css({ "background-color": itemTextColor, "border-color": itemTextColor, color: reportObj.Surface.ColorStyle });
            }).bind("mouseleave", function () {
                atCurrentContentItem.css({ "background-color": "transparent", "border-color": reportObj.Surface.ColorStyle, color: itemTextColor });
            }).bind("click", function () {
                var currentItem = atCurrentContentItem.data("item");
                if (!Liao.IsUndefinedOrNull(reportObj.ItemClicked)) {
                    reportObj.ItemClicked(currentItem);
                }
            });
        }
        function BindItem(item, atItem) {
            if (typeof item.SetState === "undefined") {
                Liao.SetBindingModel(item);
            }
            if (!Liao.IsUndefinedOrNull(item.IsBinded) && item.IsBinded()) {
                item.Unbind();
            }
            item.Bind(function (property) {
                switch (property) {
                    case "Name": { atItem.text(item.Name); }; break;
                }
            });
            item.OnAllPropertyChanged();
            atItem.data("item", item).css({ display: itemState.showed.display });
        }
        function UnbindItem(atItem) {
            var currentItem = atItem.data("item");
            if (!Liao.IsUndefinedOrNull(currentItem.IsBinded) && currentItem.IsBinded()) {
                currentItem.Unbind();
            }
            atItem.text("").data("item", null).css({ display: itemState.hidden.display });
        }
        function AjaxDownload(downloaded) {
            var ajaxPara = { transferObj: reportObj.AjaxConfiguration.TransferObj, pageIndex: pageIndex, pageCount: pageCount };
            $.ajax({ type: "get", url: reportObj.AjaxConfiguration.Url + "?ranRequest=" + (new Date()).getTime(),
                data: ajaxPara, dataType: "json", async: true,
                success: function (datas) {
                    if (!Liao.IsUndefinedOrNull(datas)) {
                        continueDownload = datas.length >= pageCount;
                        $.each(datas, function (index, item) {
                            reportObj.Items.push({
                                Name: reportObj.AjaxConfiguration.PropertyOfServer.NameProperty(item),
                                Value: reportObj.AjaxConfiguration.PropertyOfServer.ValueProperty(item)
                            });
                        });
                    }
                }, complete: function () {
                    if (!Liao.IsUndefinedOrNull(downloaded)) {
                        downloaded();
                    }
                }
            });
        }
        function ItemsToShowed(atItem, currentFinished, allFinished) {
            if (typeof atItem === "undefined") {
                if (!Liao.IsUndefinedOrNull(allFinished)) {
                    allFinished();
                }
                return;
            }
            var atNextItem = (atItem.nextAll("li.ReportOfLiaoBodyContentItem").length > 0 &&
            atItem.nextAll("li.ReportOfLiaoBodyContentItem").first().css("display") === "block") ?
            atItem.nextAll("li.ReportOfLiaoBodyContentItem").first() : undefined;
            atItem.stop().animate({ opacity: itemState.showed.opacity }, timeout, function () {
                if (!Liao.IsUndefinedOrNull(currentFinished)) {
                    currentFinished(atItem);
                }
                if (typeof atNextItem === "undefined") {
                    totalMilliSecond += timeout;
                    if (!Liao.IsUndefinedOrNull(allFinished)) {
                        allFinished();
                    }
                }
            });
            if (typeof atNextItem !== "undefined") {
                if (reportObj.IsAsyncRefresh) {
                    var timeoutOfAsync = timeout * percentTimeOfAsync;
                    setTimeout(function () {
                        totalMilliSecond += timeoutOfAsync;
                        ItemsToShowed(atNextItem, currentFinished, allFinished);
                    }, timeoutOfAsync);
                }
                else {
                    ItemsToShowed(atNextItem, currentFinished, allFinished);
                }
            }
        }
        function ItemsToHidden(atItem, currentFinished, allFinished) {
            if (typeof atItem === "undefined") {
                if (!Liao.IsUndefinedOrNull(allFinished)) {
                    allFinished();
                }
                return;
            }
            var atPrevItem = (atItem.prevAll("li.ReportOfLiaoBodyContentItem").length > 0 &&
            atItem.prevAll("li.ReportOfLiaoBodyContentItem").first().css("display") === "block") ?
            atItem.prevAll("li.ReportOfLiaoBodyContentItem").first() : undefined;
            atItem.stop().animate({ opacity: itemState.hidden.opacity }, timeout, function () {
                if (!Liao.IsUndefinedOrNull(currentFinished)) {
                    currentFinished(atItem);
                }
                if (typeof atPrevItem === "undefined") {
                    totalMilliSecond += timeout;
                    if (!Liao.IsUndefinedOrNull(allFinished)) {
                        allFinished();
                    }
                }
            });
            if (typeof atPrevItem !== "undefined") {
                if (reportObj.IsAsyncRefresh) {
                    var timeoutOfAsync = timeout * percentTimeOfAsync;
                    setTimeout(function () {
                        totalMilliSecond += timeoutOfAsync;
                        ItemsToHidden(atPrevItem, currentFinished, allFinished);
                    }, timeoutOfAsync);
                }
                else {
                    ItemsToHidden(atPrevItem, currentFinished, allFinished);
                }
            }
        }
        function RefreshItemsOfCurrentPage(refreshed) {
            var itemsOfCurrentPageIndex = GetItemsOfCurrentIndex();
            if (itemsOfCurrentPageIndex.length > 0) {
                atLastItemOfBinded = atReportOfLiaoBodyContent.children("li.ReportOfLiaoBodyContentItem:visible").length > 0 ?
                atReportOfLiaoBodyContent.children("li.ReportOfLiaoBodyContentItem:visible").last() : undefined;
                ItemsToHidden(atLastItemOfBinded, function (atItem) { UnbindItem(atItem); },
                function () {
                    $.each(itemsOfCurrentPageIndex, function (index, item) {
                        var atCurrentBindItem = atReportOfLiaoBodyContent.children("li.ReportOfLiaoBodyContentItem:visible").length === index ?
                        atReportOfLiaoBodyContent.children("li.ReportOfLiaoBodyContentItem:hidden").first() :
                        atReportOfLiaoBodyContent.children("li.ReportOfLiaoBodyContentItem").eq(index);
                        BindItem(item, atCurrentBindItem);
                    });
                    var atFirstItemOfShow = atReportOfLiaoBodyContent.children("li.ReportOfLiaoBodyContentItem:visible").length > 0 ?
                    atReportOfLiaoBodyContent.children("li.ReportOfLiaoBodyContentItem:visible").first() :
                    atReportOfLiaoBodyContent.children("li.ReportOfLiaoBodyContentItem").first();
                    ItemsToShowed(atFirstItemOfShow, undefined,
                      function () {
                          if (!Liao.IsUndefinedOrNull(refreshed)) {
                              refreshed(true);
                          }
                      });
                });
            }
            else {
                if (reportObj.IsAjaxMode && continueDownload) {
                    AjaxDownload(function () {
                        RefreshItemsOfCurrentPage(refreshed);
                    });
                }
                else {
                    var prevPageIndex = pageIndex - 1;
                    if (prevPageIndex > 0) {
                        pageIndex = 0;
                        RefreshItemsOfCurrentPage(refreshed);
                    }
                    else {
                        pageIndex--;
                        if (!Liao.IsUndefinedOrNull(refreshed)) {
                            refreshed(false);
                        }
                    }
                }
            }
        }
        function StartReport() {
            totalMilliSecond += reportObj.TimeoutOfAuto;
            if (reportObj.IsAjaxMode && totalMilliSecond >= reportObj.AjaxConfiguration.ClearCacheMinutes * 60 * 1000) {
                reportObj.Items = [];
                pageIndex = -1;
                continueDownload = true;
                totalMilliSecond = 0;
            }
            pageIndex++;
            RefreshItemsOfCurrentPage(function (success) {
                if (success && !Liao.IsUndefinedOrNull(reportObj.Refreshed)) {
                    reportObj.Refreshed(true, pageIndex);
                }
                timer = setTimeout(function () { StartReport(); }, reportObj.TimeoutOfAuto);
            });
        }
        atReportOfLiaoHeadRefresh.bind("click", function () {
            clearTimeout(timer);
            pageIndex++;
            RefreshItemsOfCurrentPage(function (success) {
                if (success && !Liao.IsUndefinedOrNull(reportObj.Refreshed)) {
                    reportObj.Refreshed(typeof timer === "undefined", pageIndex);
                }
                timer = setTimeout(function () { StartReport(); }, reportObj.TimeoutOfAuto);
            });
        });
        atReportOfLiao.bind("load", function () {
            reportObj.RowCountOfReport = reportObj.RowCountOfReport > 0 ? reportObj.RowCountOfReport : defaultRowCount;
            reportObj.ColumnCountOfReport = reportObj.ColumnCountOfReport > 0 ? reportObj.ColumnCountOfReport : defaultColumnCount;
            reportObj.WidthOfItem = reportObj.WidthOfItem >= minWidthOfItem ? reportObj.WidthOfItem : minWidthOfItem;
            if (reportObj.Items.length <= 0) {
                reportObj.Items.push(defaultItem);
            }
            reportObj.Items = reportObj.IsAjaxMode ? [] : reportObj.Items;
            pageCount = reportObj.RowCountOfReport * reportObj.ColumnCountOfReport;
            atReportOfLiaoBodyContent.append("<li class = \"ReportOfLiaoBodyContentItem\"></li>");
            var atTempFirstItem = atReportOfLiaoBodyContent.children("li.ReportOfLiaoBodyContentItem").first();
            var heightOfItem = parseFloat(atTempFirstItem.css("height"));
            var topBorderWidthOfItem = parseFloat(atTempFirstItem.css("border-top-width"));
            var bottomBorderWidthOfItem = parseFloat(atTempFirstItem.css("border-bottom-width"));
            var leftBorderWidthOfItem = parseFloat(atTempFirstItem.css("border-left-width"));
            var rightBorderWidthOfItem = parseFloat(atTempFirstItem.css("border-right-width"));
            var topMarginOfItem = parseFloat(atTempFirstItem.css("margin-top"));
            var bottomMarginOfItem = parseFloat(atTempFirstItem.css("margin-bottom"));
            var leftMarginOfItem = parseFloat(atTempFirstItem.css("margin-left"));
            var rightMarginOfItem = parseFloat(atTempFirstItem.css("margin-right"));
            Liao.ExtendsObj(itemState.hidden, { opacity: atTempFirstItem.css("opacity"), display: atTempFirstItem.css("display") });
            itemTextColor = atTempFirstItem.css("color");
            atTempFirstItem.remove();
            var contentWidth = (reportObj.WidthOfItem + leftBorderWidthOfItem + rightBorderWidthOfItem + leftMarginOfItem + rightMarginOfItem)
            * reportObj.ColumnCountOfReport;
            var leftBorderWidthOfBody = parseFloat(atReportOfLiaoBody.css("border-left-width"));
            var rightBorderWidthOfBody = parseFloat(atReportOfLiaoBody.css("border-right-width"));
            var widthOfReport = contentWidth + leftBorderWidthOfBody + rightBorderWidthOfBody;
            var contentHeight = (heightOfItem + topBorderWidthOfItem + bottomBorderWidthOfItem + topMarginOfItem + bottomMarginOfItem)
            * reportObj.RowCountOfReport;
            var bottomBorderWidthOfBody = parseFloat(atReportOfLiaoBody.css("border-bottom-width"));
            var heightOfHead = parseFloat(atReportOfLiaoHead.css("height"));
            var heightOfReport = heightOfHead + contentHeight + bottomBorderWidthOfBody;
            atReportOfLiao.css({ width: widthOfReport + "px", height: heightOfReport + "px" });
            atReportOfLiaoHead.css({ width: widthOfReport + "px" });
            atReportOfLiaoBody.css({ width: contentWidth + "px", height: contentHeight + "px" });
            var widthOfRefresh = parseFloat(atReportOfLiaoHeadRefresh.css("width"));
            atReportOfLiaoHeadTitle.css({ width: widthOfReport - widthOfRefresh + "px" });
            for (var index = 0; index < pageCount; index++) {
                InsertItemToContent();
            }
            Liao.SetBindingModel(reportObj.Surface, function (property) {
                switch (property) {
                    case "ColorStyle":
                        {
                            atReportOfLiaoHead.css({ "background-color": reportObj.Surface.ColorStyle });
                            atReportOfLiaoBody.css({ "border-left-color": reportObj.Surface.ColorStyle,
                                "border-right-color": reportObj.Surface.ColorStyle,
                                "border-bottom-color": reportObj.Surface.ColorStyle
                            });
                            atReportOfLiaoBodyContent.children("li.ReportOfLiaoBodyContentItem").css({
                                "border-color": reportObj.Surface.ColorStyle
                            });
                        }; break;
                    case "DisplayTitle":
                        {
                            atReportOfLiaoHeadTitle.text(reportObj.Surface.DisplayTitle);
                        }; break;
                }
            });
            reportObj.Surface.OnAllPropertyChanged();
            atReportOfLiaoHeadRefresh.attr({ title: refreshText }).click();
        });
        atReportOfLiao.load();
        return reportObj;
    }
})(jQuery, Liao)