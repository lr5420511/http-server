/// <reference path="../jquery.min.js" />
/// <reference path="../jquery-ui.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.ViewOfLiao = function (option) {
        var viewObj = new Object();
        viewObj.CssClass = "ViewOfLiao";
        viewObj.ColorStyle = "#C0C0C0";
        viewObj.WidthOfText = 200;
        viewObj.RowCountOfItems = 4;
        viewObj.ColumnCountOfItems = 3;
        viewObj.PagerVisible = true;
        viewObj.ItemClick = function (currentItem) { };
        viewObj.Items = [];
        viewObj.AjaxConfiguration = {
            TransferObj: null, Url: undefined,
            PropertyOfServer: {
                NameProperty: { GetValue: function (item) { } }, ValueProperty: { GetValue: function (item) { } },
                SceneProperty: { GetValue: function (item) { }, IsExist: true },
                DescriptionProperty: { GetValue: function (item) { }, IsExist: true },
                OtherProperty: { GetValue: function (item) { }, IsExist: true, Filter: undefined }
            }
        };
        Liao.ExtendsObj(viewObj, option);
        viewObj.Restart = function (newTransferObj) {
            InitView(function () {
                viewObj.AjaxConfiguration.TransferObj = newTransferObj;
                atViewOfLiaoWrapperPagerNext.click();
            });
        };
        viewObj.Refresh = function (refreshed) {
            LoadItems(UnloadItems, refreshed);
        };
        var atViewOfLiao = $(this);
        atViewOfLiao.addClass(viewObj.CssClass);

        atViewOfLiao.append("<div class = \"ViewOfLiaoWrapper\"></div>");
        var atViewOfLiaoWrapper = atViewOfLiao.children("div.ViewOfLiaoWrapper").first();
        atViewOfLiaoWrapper.append("<ul class = \"ViewOfLiaoWrapperContent\"></ul>");
        var atViewOfLiaoWrapperContent = atViewOfLiaoWrapper.children("ul.ViewOfLiaoWrapperContent").first();
        atViewOfLiaoWrapper.append("<div class = \"ViewOfLiaoWrapperPager\"></div>");
        var atViewOfLiaoWrapperPager = atViewOfLiaoWrapper.children("div.ViewOfLiaoWrapperPager").first();
        atViewOfLiaoWrapperPager.append("<div class = \"ViewOfLiaoWrapperPagerPrev\"></div>");
        var atViewOfLiaoWrapperPagerPrev = atViewOfLiaoWrapperPager.children("div.ViewOfLiaoWrapperPagerPrev").first();
        atViewOfLiaoWrapperPager.append("<div class = \"ViewOfLiaoWrapperPagerNext\"></div>");
        var atViewOfLiaoWrapperPagerNext = atViewOfLiaoWrapperPager.children("div.ViewOfLiaoWrapperPagerNext").first();
        atViewOfLiaoWrapperPager.append("<div class = \"ViewOfLiaoWrapperPagerRefresh\"></div>");
        var atViewOfLiaoWrapperPagerRefresh = atViewOfLiaoWrapperPager.children("div.ViewOfLiaoWrapperPagerRefresh").first();

        var timeout = 666;
        var pageCount = undefined;
        var defaultPageIndex = -1;
        var pageIndex = defaultPageIndex;
        var continueDownload = true;
        var defaultRowCount = 4;
        var defaultColumnCount = 3;
        var hoverColorOfBlock = "#A0A0A0";
        var timeoutPercentOfBlock = 0.1;
        var itemState = { open: "block", close: undefined, Size: {} };
        var initStateOfBlock = {};
        var showedStateOfBlock = { display: "block", opacity: 1 };
        function GetItemSize() {
            var itemSize = { width: 0, height: 0 };
            atViewOfLiaoWrapperContent
            .append("<li class = \"ViewOfLiaoWrapperContentItem\"><div class = \"ViewOfLiaoWrapperContentItemBlock\"></div></li>");
            var atTempItemBlock = atViewOfLiaoWrapperContent.find("div.ViewOfLiaoWrapperContentItemBlock").first();
            atTempItemBlock.append("<div class = \"ViewOfLiaoWrapperContentItemBlockTitle\"></div>");
            var atTempItemBlockTitle = atTempItemBlock.children("div.ViewOfLiaoWrapperContentItemBlockTitle").first();
            var realWidthOfText = 0;
            var titleHeight = viewObj.AjaxConfiguration.PropertyOfServer.SceneProperty.IsExist ?
            0 : parseFloat(atTempItemBlockTitle.css("height")) + parseFloat(atTempItemBlockTitle.css("margin-top"))
            + parseFloat(atTempItemBlockTitle.css("margin-bottom"));
            realWidthOfText = viewObj.WidthOfText + parseFloat(atTempItemBlockTitle.css("margin-left"))
            + parseFloat(atTempItemBlockTitle.css("margin-right"));
            itemSize.height += titleHeight;
            if (viewObj.AjaxConfiguration.PropertyOfServer.DescriptionProperty.IsExist) {
                atTempItemBlock.append("<div class = \"ViewOfLiaoWrapperContentItemBlockDiscription\"></div>");
                var atTempItemBlockDescription = atTempItemBlock.children("div.ViewOfLiaoWrapperContentItemBlockDiscription").first();
                var descriptionHeight = viewObj.AjaxConfiguration.PropertyOfServer.SceneProperty.IsExist ?
                0 : parseFloat(atTempItemBlockDescription.css("height")) + parseFloat(atTempItemBlockDescription.css("margin-top"))
                + parseFloat(atTempItemBlockDescription.css("margin-bottom"));
                var descriptionWidth = viewObj.WidthOfText + parseFloat(atTempItemBlockDescription.css("margin-left"))
                + parseFloat(atTempItemBlockDescription.css("margin-right"));
                itemSize.height += descriptionHeight;
                realWidthOfText = realWidthOfText >= descriptionWidth ? realWidthOfText : descriptionWidth;
            }
            if (viewObj.AjaxConfiguration.PropertyOfServer.OtherProperty.IsExist) {
                atTempItemBlock.append("<div class = \"ViewOfLiaoWrapperContentItemBlockOther\"></div>");
                var atTempItemBlockOther = atTempItemBlock.children("div.ViewOfLiaoWrapperContentItemBlockOther").first();
                var otherHeight = viewObj.AjaxConfiguration.PropertyOfServer.SceneProperty.IsExist ?
                0 : parseFloat(atTempItemBlockOther.css("height")) + parseFloat(atTempItemBlockOther.css("margin-top"))
                + parseFloat(atTempItemBlockOther.css("margin-bottom"));
                var otherWidth = viewObj.WidthOfText + parseFloat(atTempItemBlockOther.css("margin-left"))
                + parseFloat(atTempItemBlockOther.css("margin-right"));
                itemSize.height += otherHeight;
                realWidthOfText = realWidthOfText >= otherWidth ? realWidthOfText : otherWidth;
            }
            itemSize.width += realWidthOfText;
            if (viewObj.AjaxConfiguration.PropertyOfServer.SceneProperty.IsExist) {
                atTempItemBlock.append("<img alt = \"\" class = \"ViewOfLiaoWrapperContentItemBlockScene\" />");
                var atTempItemBlockScene = atTempItemBlock.children("img.ViewOfLiaoWrapperContentItemBlockScene").first();
                var sceneHeight = parseFloat(atTempItemBlockScene.css("height")) + parseFloat(atTempItemBlockScene.css("margin-top"))
                + parseFloat(atTempItemBlockScene.css("margin-bottom"));
                var sceneWidth = parseFloat(atTempItemBlockScene.css("width")) + parseFloat(atTempItemBlockScene.css("margin-left"))
                + parseFloat(atTempItemBlockScene.css("margin-right"));
                itemSize.height += sceneHeight;
                itemSize.width += sceneWidth;
            }
            atViewOfLiaoWrapperContent.children("li.ViewOfLiaoWrapperContentItem").remove();
            return itemSize;
        }
        function InsertItemToContent() {
            atViewOfLiaoWrapperContent.append("<li class = \"ViewOfLiaoWrapperContentItem\"></li>");
            var atCurrentItem = atViewOfLiaoWrapperContent.children("li.ViewOfLiaoWrapperContentItem").last();
            atCurrentItem.append("<div class = \"ViewOfLiaoWrapperContentItemBlock\"></div>");
            var atCurrentItemBlock = atCurrentItem.children("div.ViewOfLiaoWrapperContentItemBlock").first();
            atCurrentItemBlock.append("<div class = \"ViewOfLiaoWrapperContentItemBlockTitle\"></div>");
            var atCurrentItemBlockTitle = atCurrentItemBlock.children("div.ViewOfLiaoWrapperContentItemBlockTitle").first();
            if (viewObj.AjaxConfiguration.PropertyOfServer.SceneProperty.IsExist) {
                atCurrentItemBlock.append("<img alt = \"\" class = \"ViewOfLiaoWrapperContentItemBlockScene\" />");
            }
            var atCurrentItemBlockDiscription = undefined;
            if (viewObj.AjaxConfiguration.PropertyOfServer.DescriptionProperty.IsExist) {
                atCurrentItemBlock.append("<div class = \"ViewOfLiaoWrapperContentItemBlockDiscription\"></div>");
                atCurrentItemBlockDiscription = atCurrentItemBlock.children("div.ViewOfLiaoWrapperContentItemBlockDiscription").first();
            }
            var atCurrentItemBlockOther = undefined;
            if (viewObj.AjaxConfiguration.PropertyOfServer.OtherProperty.IsExist) {
                atCurrentItemBlock.append("<div class = \"ViewOfLiaoWrapperContentItemBlockOther\"></div>");
                atCurrentItemBlockOther = atCurrentItemBlock.children("div.ViewOfLiaoWrapperContentItemBlockOther").first();
            }
            atCurrentItem.css({ width: itemState.Size.width + "px", height: itemState.Size.height + "px" });
            atCurrentItemBlock.css({ width: itemState.Size.width + "px", height: itemState.Size.height + "px",
                "background-color": viewObj.ColorStyle
            });
            atCurrentItemBlockTitle.css({ width: viewObj.WidthOfText + "px" });
            if (atCurrentItemBlockDiscription != undefined) {
                atCurrentItemBlockDiscription.css({ width: viewObj.WidthOfText + "px" });
            }
            if (atCurrentItemBlockOther != undefined) {
                atCurrentItemBlockOther.css({ width: viewObj.WidthOfText + "px" });
            }
            atCurrentItemBlock.bind("mouseenter", function () {
                atCurrentItemBlock.css({ "background-color": hoverColorOfBlock });
            });
            atCurrentItemBlock.bind("mouseleave", function () {
                atCurrentItemBlock.css({ "background-color": viewObj.ColorStyle });
            });
            atCurrentItemBlock.bind("click", function () {
                var currentItem = atCurrentItemBlock.data("value");
                viewObj.ItemClick(currentItem);
            });
        }
        function GetItemsOfCurrentPage() {
            var items = [];
            var startIndex = pageIndex * pageCount;
            var endIndex = (pageIndex + 1) * pageCount - 1;
            for (var index = startIndex; index <= endIndex; index++) {
                var item = viewObj.Items[index];
                if (item != undefined && item != null) {
                    items.push(item);
                }
            }
            return items;
        }
        function AjaxDownload(downloaded) {
            var ranNumber = (new Date()).getTime();
            var ajaxObj = { transferObj: viewObj.AjaxConfiguration.TransferObj, pageIndex: pageIndex, pageCount: pageCount };
            $.ajax({ type: "get", url: viewObj.AjaxConfiguration.Url + "?ranNumber=" + ranNumber, data: ajaxObj, dataType: "json", async: true,
                success: function (datas) {
                    if (datas != null) {
                        continueDownload = datas.length >= pageCount;
                        $.each(datas, function (index, data) {
                            if (data != null) {
                                var item = new Object();
                                item.Name = viewObj.AjaxConfiguration.PropertyOfServer.NameProperty.GetValue(data);
                                item.Value = viewObj.AjaxConfiguration.PropertyOfServer.ValueProperty.GetValue(data);
                                if (viewObj.AjaxConfiguration.PropertyOfServer.DescriptionProperty.IsExist) {
                                    item.Description = viewObj.AjaxConfiguration.PropertyOfServer.DescriptionProperty.GetValue(data);
                                }
                                if (viewObj.AjaxConfiguration.PropertyOfServer.OtherProperty.IsExist) {
                                    item.Other = viewObj.AjaxConfiguration.PropertyOfServer.OtherProperty.GetValue(data);
                                }
                                if (viewObj.AjaxConfiguration.PropertyOfServer.SceneProperty.IsExist) {
                                    item.Scene = viewObj.AjaxConfiguration.PropertyOfServer.SceneProperty.GetValue(data);
                                }
                                Liao.SetBindingModel(item);
                                viewObj.Items.push(item);
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
            var atFirstItemOfHidden = atViewOfLiaoWrapperContent.children("li.ViewOfLiaoWrapperContentItem:hidden").first();
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
                            atFirstItemOfHidden.find("div.ViewOfLiaoWrapperContentItemBlockTitle").first().text(item.Name);
                        }; break;
                    case "Value":
                        {
                            atFirstItemOfHidden.children("div.ViewOfLiaoWrapperContentItemBlock").first().data("value", item);
                        }; break;
                    case "Scene":
                        {
                            if (viewObj.AjaxConfiguration.PropertyOfServer.SceneProperty.IsExist) {
                                atFirstItemOfHidden.find("img.ViewOfLiaoWrapperContentItemBlockScene").first().attr({ src: item.Scene });
                            }
                        }; break;
                    case "Description":
                        {
                            if (viewObj.AjaxConfiguration.PropertyOfServer.DescriptionProperty.IsExist) {
                                atFirstItemOfHidden.find("div.ViewOfLiaoWrapperContentItemBlockDiscription").first().text(item.Description);
                            }
                        }; break;
                    case "Other":
                        {
                            if (viewObj.AjaxConfiguration.PropertyOfServer.OtherProperty.IsExist) {
                                var otherText = item.Other + viewObj.AjaxConfiguration.PropertyOfServer.OtherProperty.Filter;
                                atFirstItemOfHidden.find("div.ViewOfLiaoWrapperContentItemBlockOther").first().text(otherText);
                            }
                        }; break;
                }
            });
            item.OnAllPropertyChanged();
            atFirstItemOfHidden.css({ display: itemState.open });
        }
        function UnbindItem(atItem) {
            atItem.find("div.ViewOfLiaoWrapperContentItemBlockTitle").first().text("");
            if (viewObj.AjaxConfiguration.PropertyOfServer.DescriptionProperty.IsExist) {
                atItem.find("div.ViewOfLiaoWrapperContentItemBlockDiscription").first().text("");
            }
            if (viewObj.AjaxConfiguration.PropertyOfServer.OtherProperty.IsExist) {
                atItem.find("div.ViewOfLiaoWrapperContentItemBlockOther").first().text("");
            }
            if (viewObj.AjaxConfiguration.PropertyOfServer.SceneProperty.IsExist) {
                atItem.find("img.ViewOfLiaoWrapperContentItemBlockScene").first().attr({ src: null });
            }
            var currentItem = atItem.children("div.ViewOfLiaoWrapperContentItemBlock").first().data("value");
            if (currentItem.IsBinded()) {
                currentItem.Unbind();
            }
            atItem.children("div.ViewOfLiaoWrapperContentItemBlock").first().data("value", null);
            atItem.css({ display: itemState.close });
        }
        function ItemToShow(atItem, showed, allFinished) {
            var atNextItem = atItem.nextAll("li.ViewOfLiaoWrapperContentItem:visible").length > 0 ?
            atItem.nextAll("li.ViewOfLiaoWrapperContentItem:visible").first() : undefined;
            var atItemBlock = atItem.children("div.ViewOfLiaoWrapperContentItemBlock").first();
            var currentItemPosition = atItem.position();
            if (currentItemPosition != undefined && currentItemPosition != null) {
                atItemBlock.stop().css({ display: showedStateOfBlock.display }).animate({ opacity: showedStateOfBlock.opacity,
                    left: atItem.position().left + "px", top: atItem.position().top + "px"
                }, timeout, function () {
                    if (showed != undefined) {
                        showed(atItem);
                    }
                    if (atNextItem == undefined && allFinished != undefined) {
                        allFinished();
                    }
                });
                if (atNextItem != undefined) {
                    setTimeout(function () { ItemToShow(atNextItem, showed, allFinished); }, timeout * timeoutPercentOfBlock);
                }
            }
        }
        function ItemToInit(atItem, inited, allFinished) {
            var atPrevItem = atItem.prevAll("li.ViewOfLiaoWrapperContentItem:visible").length > 0 ?
            atItem.prevAll("li.ViewOfLiaoWrapperContentItem:visible").first() : undefined;
            var atItemBlock = atItem.children("div.ViewOfLiaoWrapperContentItemBlock").first();
            atItemBlock.stop().animate({ opacity: initStateOfBlock.opacity,
                left: initStateOfBlock.position.left + "px", top: initStateOfBlock.position.top + "px"
            }, timeout, function () {
                atItemBlock.css({ display: initStateOfBlock.display });
                if (inited != undefined) {
                    inited(atItem);
                }
                if (atPrevItem == undefined && allFinished != undefined) {
                    allFinished();
                }
            });
            if (atPrevItem != undefined) {
                setTimeout(function () { ItemToInit(atPrevItem, inited, allFinished); }, timeout * timeoutPercentOfBlock);
            }
        }
        function LoadItems(geted, loaded) {
            var items = GetItemsOfCurrentPage();
            if (items.length > 0) {
                if (geted != undefined) {
                    geted(function () {
                        $.each(items, function (index, item) {
                            BindItem(item);
                        });
                        ItemToShow(atViewOfLiaoWrapperContent.children("li.ViewOfLiaoWrapperContentItem:visible").first(), undefined, loaded);
                    });
                }
                else {
                    $.each(items, function (index, item) {
                        BindItem(item);
                    });
                    ItemToShow(atViewOfLiaoWrapperContent.children("li.ViewOfLiaoWrapperContentItem:visible").first(), undefined, loaded);
                }
            }
            else {
                if (continueDownload) {
                    AjaxDownload(function () {
                        LoadItems(geted, loaded);
                    });
                }
                else {
                    pageIndex--;
                    if (loaded != undefined) {
                        loaded();
                    }
                }
            }
        }
        function UnloadItems(unloaded) {
            var itemCountOfVisible = atViewOfLiaoWrapperContent.children("li.ViewOfLiaoWrapperContentItem:visible").length;
            if (itemCountOfVisible > 0) {
                ItemToInit(atViewOfLiaoWrapperContent.children("li.ViewOfLiaoWrapperContentItem:visible").last(), function (atItem) {
                    UnbindItem(atItem);
                }, unloaded);
            }
            else {
                if (unloaded != undefined) {
                    unloaded();
                }
            }
        }
        function InitView(inited) {
            UnloadItems(function () {
                viewObj.Items = [];
                viewObj.AjaxConfiguration.TransferObj = null;
                pageIndex = defaultPageIndex;
                continueDownload = true;
                if (inited != undefined) {
                    inited();
                }
            });
        }
        atViewOfLiaoWrapperPagerPrev.bind("click", function () {
            if (pageIndex > 0) {
                pageIndex--;
                LoadItems(UnloadItems, undefined);
            }
        });
        atViewOfLiaoWrapperPagerNext.bind("click", function () {
            pageIndex++;
            LoadItems(UnloadItems, undefined);
        });
        atViewOfLiaoWrapperPagerRefresh.bind("click", function () {
            viewObj.Refresh();
        });
        atViewOfLiao.bind("load", function () {
            viewObj.Items = [];
            viewObj.RowCountOfItems = viewObj.RowCountOfItems > 0 ? viewObj.RowCountOfItems : defaultRowCount;
            viewObj.ColumnCountOfItems = viewObj.ColumnCountOfItems > 0 ? viewObj.ColumnCountOfItems : defaultColumnCount;
            pageCount = viewObj.RowCountOfItems * viewObj.ColumnCountOfItems;
            var prevWidth = parseFloat(atViewOfLiaoWrapperPagerPrev.css("width"));
            var nextWidth = parseFloat(atViewOfLiaoWrapperPagerNext.css("width"));
            var refreshWidth = parseFloat(atViewOfLiaoWrapperPagerRefresh.css("width"));
            var leftMarginOfPrev = parseFloat(atViewOfLiaoWrapperPagerPrev.css("margin-left"));
            var rightMarginOfNext = parseFloat(atViewOfLiaoWrapperPagerNext.css("margin-right"));
            var minWidthOfText = prevWidth + nextWidth + refreshWidth + leftMarginOfPrev + rightMarginOfNext;
            viewObj.WidthOfText = viewObj.WidthOfText >= minWidthOfText ? viewObj.WidthOfText : minWidthOfText;
            $.extend(itemState.Size, GetItemSize());
            for (var index = 0; index < pageCount; index++) {
                InsertItemToContent();
            }
            var atFirstItem = atViewOfLiaoWrapperContent.children("li.ViewOfLiaoWrapperContentItem").first();
            var xMarginOfItem = parseFloat(atFirstItem.css("margin-left")) + parseFloat(atFirstItem.css("margin-right"));
            var yMarginOfItem = parseFloat(atFirstItem.css("margin-top")) + parseFloat(atFirstItem.css("margin-bottom"));
            var contentWidth = (itemState.Size.width + xMarginOfItem) * viewObj.ColumnCountOfItems;
            var contentHeight = (itemState.Size.height + yMarginOfItem) * viewObj.RowCountOfItems;
            var pagerHeight = parseFloat(atViewOfLiaoWrapperPager.css("height"));
            var pagerWidth = contentWidth - parseFloat(atViewOfLiaoWrapperPager.css("margin-left"))
            - parseFloat(atViewOfLiaoWrapperPager.css("margin-right"));
            atViewOfLiaoWrapperPager.css({ width: pagerWidth + "px" });
            if (!viewObj.PagerVisible) {
                atViewOfLiaoWrapperPager.hide();
                pagerHeight = 0;
            }
            var viewHeight = contentHeight + pagerHeight;
            atViewOfLiao.css({ width: contentWidth + "px", height: viewHeight + "px" });
            atViewOfLiaoWrapper.css({ width: contentWidth + "px", height: viewHeight + "px" });
            atViewOfLiaoWrapperContent.css({ width: contentWidth + "px", height: contentHeight + "px" });
            $.extend(itemState, { close: atFirstItem.css("display") });
            var atFirstBlock = atFirstItem.children("div.ViewOfLiaoWrapperContentItemBlock").first();
            $.extend(initStateOfBlock, {
                display: atFirstBlock.css("display"), opacity: atFirstBlock.css("opacity"),
                position: {
                    left: parseFloat(contentWidth / 2) - parseFloat(itemState.Size.width / 2) + atViewOfLiaoWrapper.scrollLeft(),
                    top: atViewOfLiaoWrapper.scrollTop() - itemState.Size.height
                }
            });
            $.each(atViewOfLiaoWrapperContent.children("li.ViewOfLiaoWrapperContentItem"), function (index, item) {
                var atCurrentItem = $(item);
                atCurrentItem.children("div.ViewOfLiaoWrapperContentItemBlock").first().css({
                    left: initStateOfBlock.position.left + "px", top: initStateOfBlock.position.top + "px"
                });
            });
            atViewOfLiaoWrapperPagerNext.click();
        });
        atViewOfLiao.load();
        return viewObj;
    }
})(jQuery, Liao)