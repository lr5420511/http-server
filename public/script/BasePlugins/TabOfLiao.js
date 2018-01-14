/// <reference path="../jquery.min.js" />
/// <reference path="../jquery-ui.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.TabOfLiao = function (option) {
        var tabObj = new Object();
        tabObj.CssClass = "TabOfLiao";
        tabObj.WidthOfHtml = 600;
        tabObj.HeightOfHtml = 400;
        tabObj.MaxLengthOfTitle = 10;
        tabObj.WidthOfPerTitle = 22;
        tabObj.MaxCountOfItems = 0;
        tabObj.Items = [];
        tabObj.ItemRemoveAble = false;
        Liao.ExtendsObj(tabObj, option);
        if (tabObj.Items.length <= 0) {
            tabObj.Items.push({ ID: undefined, DisplayTitle: "默认选项卡", HtmlContent: "" });
        }
        tabObj.CurrentItemIndex = function (newItemIndex) {
            if (newItemIndex == undefined) {
                return GetItemIndexByID(currentItemId);
            }
            else {
                if (newItemIndex < tabObj.Items.length && newItemIndex > -1) {
                    atTabOfLiaoHeadWrapperContent.children("li.TabOfLiaoHeadWrapperContentItem").eq(newItemIndex)
                    .children("div.TabOfLiaoHeadWrapperContentItemTitle").first().click();
                }
            }
        };
        tabObj.AddNewItem = function (newItem) {
            if (tabObj.MaxCountOfItems <= 0 || tabObj.Items.length < tabObj.MaxCountOfItems) {
                newItem.ID = ++maxItemId;
                newItem.DisplayTitle = newItem.DisplayTitle.length > tabObj.MaxLengthOfTitle ?
                newItem.DisplayTitle.substr(0, tabObj.MaxLengthOfTitle - 1) + "…" : newItem.DisplayTitle;
                tabObj.Items.push(newItem);
                BindItem(newItem);
            }
        };
        var atTabOfLiao = $(this);
        atTabOfLiao.addClass(tabObj.CssClass);

        atTabOfLiao.append("<div class = \"TabOfLiaoHead\"></div>");
        var atTabOfLiaoHead = atTabOfLiao.children("div.TabOfLiaoHead").first();
        atTabOfLiao.append("<div class = \"TabOfLiaoBody\"></div>");
        var atTabOfLiaoBody = atTabOfLiao.children("div.TabOfLiaoBody").first();
        atTabOfLiaoHead.append("<div class = \"TabOfLiaoHeadWrapper\"></div>");
        var atTabOfLiaoHeadWrapper = atTabOfLiaoHead.children("div.TabOfLiaoHeadWrapper").first();
        atTabOfLiaoHeadWrapper.append("<ul class = \"TabOfLiaoHeadWrapperContent\"></ul>");
        var atTabOfLiaoHeadWrapperContent = atTabOfLiaoHeadWrapper.children("ul.TabOfLiaoHeadWrapperContent").first();
        atTabOfLiaoHeadWrapper.append("<span class = \"TabOfLiaoHeadWrapperFocus\"></span>");
        var atTabOfLiaoHeadWrapperFocus = atTabOfLiaoHeadWrapper.children("span.TabOfLiaoHeadWrapperFocus").first();

        var timeout = 300;
        var maxItemId = -1;
        var currentItemId = maxItemId + 1;
        var bodyColor = undefined;
        var titleColor = undefined;
        var titleClicked = function () { };
        function GetItemIndexByID(itemId) {
            var itemIndex = -1;
            $.each(tabObj.Items, function (index, item) {
                if (item.ID == itemId) {
                    itemIndex = index;
                    return;
                }
            });
            return itemIndex;
        }
        function BindItem(item) {
            var titleWidth = item.DisplayTitle.length * tabObj.WidthOfPerTitle;
            atTabOfLiaoHeadWrapperContent.append("<li class = \"TabOfLiaoHeadWrapperContentItem\"></li>");
            var atTabOfLiaoHeadWrapperContentItem = atTabOfLiaoHeadWrapperContent.children("li.TabOfLiaoHeadWrapperContentItem").last();
            atTabOfLiaoHeadWrapperContentItem.append("<div class = \"TabOfLiaoHeadWrapperContentItemTitle\"></div>");
            var atTabOfLiaoHeadWrapperContentItemTitle = atTabOfLiaoHeadWrapperContentItem.children("div.TabOfLiaoHeadWrapperContentItemTitle")
            .first();
            atTabOfLiaoBody.append("<div class = \"TabOfLiaoBodyItemHtml\"></div>");
            var atTabOfLiaoBodyItemHtml = atTabOfLiaoBody.children("div.TabOfLiaoBodyItemHtml").last();
            var itemMargin = parseFloat(atTabOfLiaoHeadWrapperContentItem.css("margin-right"));
            var widthOfRemove = 0;
            if (tabObj.ItemRemoveAble) {
                atTabOfLiaoHeadWrapperContentItem.append("<div class = \"TabOfLiaoHeadWrapperContentItemRemove\"></div>");
                var atTabOfLiaoHeadWrapperContentItemRemove = atTabOfLiaoHeadWrapperContentItem
                .children("div.TabOfLiaoHeadWrapperContentItemRemove").first();
                widthOfRemove += parseFloat(atTabOfLiaoHeadWrapperContentItemRemove.css("width"));
                atTabOfLiaoHeadWrapperContentItemRemove.bind("click", function () {
                    if (tabObj.Items.length > 1) {
                        var itemRemove = function () {
                            atTabOfLiaoHeadWrapperContentItem.stop().animate({ width: 0 + "px" }, timeout, function () {
                                tabObj.Items.splice(GetItemIndexByID(atTabOfLiaoHeadWrapperContentItem.data("id")), 1);
                                atTabOfLiaoHeadWrapperContentItem.data("content").remove();
                                atTabOfLiaoHeadWrapperContentItem.remove();
                                atTabOfLiaoHeadWrapperContent.css({ width: parseFloat(atTabOfLiaoHeadWrapperContent.css("width"))
                                - titleWidth - widthOfRemove - itemMargin + "px"
                                });
                                var atCurrentItem = atTabOfLiaoHeadWrapperContent.children("li.TabOfLiaoHeadWrapperContentItem")
                                    .eq(GetItemIndexByID(currentItemId));
                                atTabOfLiaoHeadWrapperFocus.animate({
                                    left: atCurrentItem.position().left + parseFloat(atCurrentItem.css("width")) + "px"
                                }, timeout);
                            });
                        };
                        if (atTabOfLiaoHeadWrapperContentItem.data("id") == currentItemId) {
                            var atNextItem = atTabOfLiaoHeadWrapperContentItem.prevAll("li.TabOfLiaoHeadWrapperContentItem").length > 0 ?
                            atTabOfLiaoHeadWrapperContentItem.prevAll("li.TabOfLiaoHeadWrapperContentItem").first() :
                            atTabOfLiaoHeadWrapperContentItem.nextAll("li.TabOfLiaoHeadWrapperContentItem").first();
                            titleClicked = itemRemove;
                            atNextItem.children("div.TabOfLiaoHeadWrapperContentItemTitle").first().click();
                        }
                        else {
                            itemRemove();
                        }
                    }
                });
            }
            widthOfRemove += parseFloat(atTabOfLiaoHeadWrapperContentItemTitle.css("margin-right"));
            atTabOfLiaoHeadWrapperContentItemTitle.css({ width: titleWidth + "px" });
            atTabOfLiaoHeadWrapperContentItem.css({ width: titleWidth + widthOfRemove + "px" });
            atTabOfLiaoHeadWrapperContent.css({ width: parseFloat(atTabOfLiaoHeadWrapperContent.css("width"))
            + titleWidth + widthOfRemove + itemMargin + "px"
            });
            atTabOfLiaoBodyItemHtml.css({ width: tabObj.WidthOfHtml + "px", height: tabObj.HeightOfHtml + "px" });
            atTabOfLiaoHeadWrapperContentItemTitle.text(item.DisplayTitle);
            atTabOfLiaoBodyItemHtml.html(item.HtmlContent);
            atTabOfLiaoHeadWrapperContentItem.data("id", item.ID).data("content", atTabOfLiaoBodyItemHtml);
            atTabOfLiaoHeadWrapperContentItemTitle.bind("click", function () {
                if (atTabOfLiaoHeadWrapperContentItem.data("id") != currentItemId) {
                    var afterLeftOfFocus = atTabOfLiaoHeadWrapperContentItem.position().left
                    + parseFloat(atTabOfLiaoHeadWrapperContentItem.css("width"));
                    atTabOfLiaoHeadWrapperFocus.stop().animate({ left: afterLeftOfFocus + "px" }, timeout, function () {
                        var currentItemIndex = GetItemIndexByID(currentItemId);
                        atTabOfLiaoHeadWrapperContent.children("li.TabOfLiaoHeadWrapperContentItem").eq(currentItemIndex)
                        .css({ "background-color": titleColor }).data("content").css({ display: "none" });
                        currentItemId = atTabOfLiaoHeadWrapperContentItem.data("id");
                        atTabOfLiaoHeadWrapperContentItem.css({ "background-color": bodyColor }).data("content").css({ display: "block" });
                        titleClicked();
                        titleClicked = function () { };
                    });
                }
            });
        }
        atTabOfLiao.bind("load", function () {
            if (tabObj.MaxCountOfItems > 0 && tabObj.Items.length > tabObj.MaxCountOfItems) {
                tabObj.Items.splice(tabObj.MaxCountOfItems, tabObj.Items.length - tabObj.MaxCountOfItems);
            }
            var headHeight = parseFloat(atTabOfLiaoHead.css("height"));
            bodyColor = atTabOfLiaoBody.css("background-color");
            atTabOfLiao.css({ width: tabObj.WidthOfHtml + "px", height: tabObj.HeightOfHtml + headHeight + "px" });
            atTabOfLiaoHead.css({ width: tabObj.WidthOfHtml + "px" });
            atTabOfLiaoBody.css({ width: tabObj.WidthOfHtml + "px", height: tabObj.HeightOfHtml + "px" });
            atTabOfLiaoHeadWrapper.css({ width: tabObj.WidthOfHtml + "px" });
            $.each(tabObj.Items, function (index, item) {
                item.ID = ++maxItemId;
                item.DisplayTitle = item.DisplayTitle.length > tabObj.MaxLengthOfTitle ?
                item.DisplayTitle.substr(0, tabObj.MaxLengthOfTitle - 1) + "…" : item.DisplayTitle;
                BindItem(item);
            });
            var currentItemIndex = GetItemIndexByID(currentItemId);
            var atCurrentItem = atTabOfLiaoHeadWrapperContent.children("li.TabOfLiaoHeadWrapperContentItem").eq(currentItemIndex);
            titleColor = atCurrentItem.css("background-color");
            atCurrentItem.css({ "background-color": bodyColor }).data("content").css({ display: "block" });
            atTabOfLiaoHeadWrapperFocus.css({ left: atCurrentItem.position().left + parseFloat(atCurrentItem.css("width")) + "px" });
        });
        atTabOfLiao.load();
        return tabObj;
    }
})(jQuery, Liao)