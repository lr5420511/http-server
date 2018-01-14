/// <reference path="../jquery.min.js" />
/// <reference path="../jquery-ui.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.SpyOfLiao = function (option) {
        var spyObj = new Object();
        spyObj.CssClass = "SpyOfLiao";
        spyObj.MaxLengthOfTitle = 15;
        spyObj.BackColorStyle = "#666666";
        spyObj.HoverColorStyle = "#999999";
        spyObj.RateIcon = "../../image/spyrate.png";
        spyObj.ValueOfPerRate = 1;
        spyObj.RateFilter = "颗星";
        spyObj.SpyTimeout = 7000;
        spyObj.ItemCountOfDisplay = 2;
        spyObj.MaxCountOfItems = 0;
        spyObj.ItemClick = function (currentItem) { };
        spyObj.Items = [{
            Scene: "../../image/spyA.jpg", Name: "Spy插件默认第一项标题", Description: "欢迎使用Spy插件，这是默认第一项的内容描述！",
            Rate: 10, Value: undefined
        }, {
            Scene: "../../image/spyB.jpg", Name: "Spy插件默认第二项标题", Description: "欢迎使用Spy插件，这是默认第二项的内容描述！",
            Rate: 10, Value: undefined
        }];
        spyObj.IsAjaxMode = false;
        spyObj.AjaxConfiguration = {
            TransferObj: null, Url: undefined, ClearCacheMinutes: 30,
            PropertyOfServer: { SceneProperty: function (item) { }, NameProperty: function (item) { }, DescriptionProperty: function (item) { },
                RateProperty: function (item) { }, ValueProperty: function (item) { }
            }
        };
        Liao.ExtendsObj(spyObj, option);
        var atSpyOfLiao = $(this);
        atSpyOfLiao.addClass(spyObj.CssClass);

        atSpyOfLiao.append("<div class = \"SpyOfLiaoWrapper\"></div>");
        var atSpyOfLiaoWrapper = atSpyOfLiao.children("div.SpyOfLiaoWrapper").first();
        atSpyOfLiaoWrapper.append("<ul class = \"SpyOfLiaoWrapperContent\"></ul>");
        var atSpyOfLiaoWrapperContent = atSpyOfLiaoWrapper.children("ul.SpyOfLiaoWrapperContent").first();

        var timeout = 1555;
        var currentIndexOfLastVisibleItem = -1;
        var nextIndexOfLastVisibleItem = currentIndexOfLastVisibleItem + 1;
        var initContentTop = undefined;
        var itemHeight = undefined;
        var initItemOpacity = undefined;
        var afterItemOpacity = 0;
        var initItemColor = undefined;
        var clearCahceTotal = 0;
        function InitItemsOfDisplay() {
            for (var index = 0; index < spyObj.ItemCountOfDisplay; index++) {
                if (spyObj.Items[index] != undefined && spyObj.Items[index] != null) {
                    InsertItemToContent();
                    BindLastItem(spyObj.Items[index]);
                }
            }
        }
        function InsertItemToContent() {
            atSpyOfLiaoWrapperContent.append("<li class = \"SpyOfLiaoWrapperContentItem\"></li>");
            var atSpyOfLiaoWrapperContentItem = atSpyOfLiaoWrapperContent.children("li.SpyOfLiaoWrapperContentItem").last();
            atSpyOfLiaoWrapperContentItem.append("<img class = \"SpyOfLiaoWrapperContentItemScene\" alt = \"\" />");
            atSpyOfLiaoWrapperContentItem.append("<div class = \"SpyOfLiaoWrapperContentItemTitle\"></div>");
            atSpyOfLiaoWrapperContentItem.append("<div class = \"SpyOfLiaoWrapperContentItemDescription\"></div>");
            atSpyOfLiaoWrapperContentItem.append("<div class = \"SpyOfLiaoWrapperContentItemRates\"></div>");
            atSpyOfLiaoWrapperContentItem.css({ "border-bottom-color": spyObj.HoverColorStyle });
            atSpyOfLiaoWrapperContentItem.bind("mouseenter", function () {
                atSpyOfLiaoWrapperContentItem.css({ "background-color": spyObj.HoverColorStyle });
            });
            atSpyOfLiaoWrapperContentItem.bind("mouseleave", function () {
                atSpyOfLiaoWrapperContentItem.css({ "background-color": initItemColor });
            });
            atSpyOfLiaoWrapperContentItem.bind("click", function () {
                var currentItem = atSpyOfLiaoWrapperContentItem.data("value");
                spyObj.ItemClick(currentItem);
            });
        }
        function BindLastItem(item) {
            item.Name = item.Name.length > spyObj.MaxLengthOfTitle ? item.Name.substr(0, spyObj.MaxLengthOfTitle - 1) + "…" : item.Name;
            var atLastItem = atSpyOfLiaoWrapperContent.children("li.SpyOfLiaoWrapperContentItem").last();
            currentIndexOfLastVisibleItem = nextIndexOfLastVisibleItem;
            atLastItem.css({ "background-color": initItemColor });
            if (item.SetState == undefined) {
                Liao.SetBindingModel(item);
            }
            if (item.IsBinded()) {
                item.Unbind();
            }
            item.Bind(function (property) {
                switch (property) {
                    case "Name":
                        {
                            atLastItem.children("div.SpyOfLiaoWrapperContentItemTitle").first().text(item.Name);
                        }; break;
                    case "Value":
                        {
                            atLastItem.data("value", item);
                        }; break;
                    case "Scene":
                        {
                            atLastItem.children("img.SpyOfLiaoWrapperContentItemScene").first().attr({ src: item.Scene });
                        }; break;
                    case "Description":
                        {
                            atLastItem.children("div.SpyOfLiaoWrapperContentItemDescription").first().text(item.Description);
                        }; break;
                    case "Rate":
                        {
                            var atLastItemRates = atLastItem.children("div.SpyOfLiaoWrapperContentItemRates").first();
                            atLastItemRates.attr({ title: item.Rate + spyObj.RateFilter }).children("i.SpyOfLiaoWrapperContentItemRatesIcon").remove();
                            var rateCount = parseInt(item.Rate / spyObj.ValueOfPerRate);
                            for (var index = 0; index < rateCount; index++) {
                                atLastItemRates.append("<i class = \"SpyOfLiaoWrapperContentItemRatesIcon\"></i>");
                                var atLastItemRatesIcon = atLastItemRates.children("i.SpyOfLiaoWrapperContentItemRatesIcon").last();
                                atLastItemRatesIcon.css({ "background-image": "url('" + spyObj.RateIcon + "')" });
                            }
                        }; break;
                }
            });
            item.OnAllPropertyChanged();
            nextIndexOfLastVisibleItem = currentIndexOfLastVisibleItem < spyObj.Items.length - 1 ? currentIndexOfLastVisibleItem + 1 : 0;
        }
        function AjaxDownload(downloaded) {
            var requestRan = (new Date()).getTime();
            $.ajax({ type: "get", url: spyObj.AjaxConfiguration.Url + "?requestrannum=" + requestRan,
                data: spyObj.AjaxConfiguration.TransferObj, dataType: "json", async: true,
                success: function (datas) {
                    if (datas != null) {
                        $.each(datas, function (index, data) {
                            spyObj.Items.push({
                                Scene: spyObj.AjaxConfiguration.PropertyOfServer.SceneProperty(data),
                                Name: spyObj.AjaxConfiguration.PropertyOfServer.NameProperty(data),
                                Description: spyObj.AjaxConfiguration.PropertyOfServer.DescriptionProperty(data),
                                Rate: spyObj.AjaxConfiguration.PropertyOfServer.RateProperty(data),
                                Value: spyObj.AjaxConfiguration.PropertyOfServer.ValueProperty(data)
                            });
                        });
                        Liao.SetBindingModel(spyObj.Items);
                    }
                }, complete: function () {
                    if (downloaded != undefined) {
                        downloaded();
                    }
                }
            });
        }
        function StartSpyShow() {
            if (spyObj.IsAjaxMode && spyObj.Items.length <= 0) {
                AjaxDownload(function () {
                    if (spyObj.MaxCountOfItems > 0 && spyObj.Items.length > spyObj.MaxCountOfItems) {
                        spyObj.Items.splice(spyObj.MaxCountOfItems, spyObj.Items.length - spyObj.MaxCountOfItems);
                    }
                    InitItemsOfDisplay();
                    setTimeout(function () { StartSpyShow(); }, spyObj.SpyTimeout);
                });
            }
            else {
                clearCahceTotal += spyObj.SpyTimeout;
                var atFirstItem = atSpyOfLiaoWrapperContent.children("li.SpyOfLiaoWrapperContentItem").first();
                atFirstItem.animate({ opacity: afterItemOpacity }, timeout, function () {
                    clearCahceTotal += timeout;
                    atFirstItem.children("img.SpyOfLiaoWrapperContentItemScene").first().attr({ src: null });
                    var firstItem = atFirstItem.data("value");
                    if (firstItem.IsBinded()) {
                        firstItem.Unbind();
                    }
                    var firstItem = atFirstItem.css({ display: "none" }).detach();
                    atSpyOfLiaoWrapperContent.append(firstItem);
                    atFirstItem = $(firstItem);
                    atSpyOfLiaoWrapperContent.css({ top: itemHeight + initContentTop + "px" })
                    .animate({ top: initContentTop + "px" }, timeout, function () {
                        clearCahceTotal += timeout;
                        BindLastItem(spyObj.Items[nextIndexOfLastVisibleItem]);
                        atFirstItem.css({ display: "block" }).animate({ opacity: initItemOpacity }, timeout, function () {
                            clearCahceTotal += timeout;
                            if (spyObj.IsAjaxMode && clearCahceTotal >= spyObj.AjaxConfiguration.ClearCacheMinutes * 60000) {
                                clearCahceTotal = 0;
                                currentIndexOfLastVisibleItem = -1;
                                nextIndexOfLastVisibleItem = currentIndexOfLastVisibleItem + 1;
                                spyObj.Items = [];
                                atSpyOfLiaoWrapperContent.children("li.SpyOfLiaoWrapperContentItem").remove();
                                StartSpyShow();
                            }
                            else {
                                setTimeout(function () { StartSpyShow(); }, spyObj.SpyTimeout);
                            }
                        });
                    });
                });
            }
        }
        atSpyOfLiao.bind("load", function () {
            spyObj.Items = spyObj.IsAjaxMode ? [] : spyObj.Items;
            if (spyObj.MaxCountOfItems > 0 && spyObj.Items.length > spyObj.MaxCountOfItems) {
                spyObj.Items.splice(spyObj.MaxCountOfItems, spyObj.Items.length - spyObj.MaxCountOfItems);
            }
            spyObj.ItemCountOfDisplay = spyObj.IsAjaxMode || spyObj.Items.length >= spyObj.ItemCountOfDisplay ?
            spyObj.ItemCountOfDisplay : spyObj.Items.length;
            atSpyOfLiaoWrapperContent.append("<li class = \"SpyOfLiaoWrapperContentItem\"></li>");
            var atTempSpyOfLiaoWrapperContentItem = atSpyOfLiaoWrapperContent.children("li.SpyOfLiaoWrapperContentItem").first();
            initItemColor = atTempSpyOfLiaoWrapperContentItem.css("background-color");
            initItemOpacity = atTempSpyOfLiaoWrapperContentItem.css("opacity");
            itemHeight = parseFloat(atTempSpyOfLiaoWrapperContentItem.css("height"))
            + parseFloat(atTempSpyOfLiaoWrapperContentItem.css("border-bottom-width"));
            atTempSpyOfLiaoWrapperContentItem.remove();
            atSpyOfLiao.css({ height: itemHeight * spyObj.ItemCountOfDisplay + "px" });
            atSpyOfLiaoWrapper.css({ height: itemHeight * spyObj.ItemCountOfDisplay + "px", "background-color": spyObj.BackColorStyle });
            atSpyOfLiaoWrapperContent.css({ height: itemHeight * spyObj.ItemCountOfDisplay + "px" });
            initContentTop = parseFloat(atSpyOfLiaoWrapperContent.css("top"));
            if (spyObj.IsAjaxMode) {
                AjaxDownload(function () {
                    if (spyObj.MaxCountOfItems > 0 && spyObj.Items.length > spyObj.MaxCountOfItems) {
                        spyObj.Items.splice(spyObj.MaxCountOfItems, spyObj.Items.length - spyObj.MaxCountOfItems);
                    }
                    InitItemsOfDisplay();
                    setTimeout(function () { StartSpyShow(); }, spyObj.SpyTimeout);
                });
            }
            else {
                Liao.SetBindingModel(spyObj.Items);
                InitItemsOfDisplay();
                if (spyObj.ItemCountOfDisplay > 0) {
                    setTimeout(function () { StartSpyShow(); }, spyObj.SpyTimeout);
                }
            }
        });
        atSpyOfLiao.load();
        return spyObj;
    }
})(jQuery, Liao)
