/// <reference path="../jquery.min.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.GroupPanelOfLiao = function (option) {
        var groupPanelObj = new Object();
        groupPanelObj.CssClass = "GroupPanelOfLiao";
        groupPanelObj.DisplayTitle = "GroupPanelOfLiao组件默认标题文本";
        groupPanelObj.WidthOfGroup = 200;
        groupPanelObj.WidthOfContent = 700;
        groupPanelObj.HeightOfGroup = 40;
        groupPanelObj.BlockColor = "#CCCCCC";
        groupPanelObj.InitItemIndexOfSelected = 0;
        groupPanelObj.MaxCountOfItems = 0;
        groupPanelObj.Items =
        [
          { Summary: "ItemText1", Html: "<p>ItemContentHtml1</p>" },
          { Summary: "ItemText2", Html: "<p>ItemContentHtml2</p>" }
        ];
        groupPanelObj.ItemSelected = function (currentItem) { };
        Liao.ExtendsObj(groupPanelObj, option);
        groupPanelObj.CurrentItemIndex = function (currentItemIndex) {
            if (typeof currentItemIndex !== "number") {
                return currentItemIndexOfSelected;
            }
            else {
                if (currentItemIndex >= 0 && currentItemIndex < groupPanelObj.Items.length) {
                    groupObj.CurrentIndexOfItemSelected(currentItemIndex);
                }
                else {
                    throw new Error("currentItemIndex of argument isn't a vaild value!");
                }
            }
        };
        var atGroupPanelOfLiao = $(this);
        atGroupPanelOfLiao.addClass(groupPanelObj.CssClass);

        atGroupPanelOfLiao.append("<div class = \"GroupPanelOfLiaoPanel\"></div>");
        var atGroupPanelOfLiaoPanel = atGroupPanelOfLiao.children("div.GroupPanelOfLiaoPanel").last();

        var currentItemIndexOfSelected = -1;
        var itemContentState = { open: "block", close: undefined };
        var atPanelContent = undefined;
        var groupObj = undefined;
        var defaultSizeOfElement = { groupWidth: 200, groupHeight: 40, contentWidth: 700 };
        function LoadItemHtml(html) {
            atPanelContent.append("<div class = \"GroupPanelOfLiaoContentHtml\"></div>");
            var atCurrentPanelContentHtml = atPanelContent.children("div.GroupPanelOfLiaoContentHtml").last();
            atCurrentPanelContentHtml.html(html);
        }
        atGroupPanelOfLiao.bind("load", function () {
            groupPanelObj.WidthOfGroup = groupPanelObj.WidthOfGroup > 0 ? groupPanelObj.WidthOfGroup : defaultSizeOfElement.groupWidth;
            groupPanelObj.HeightOfGroup = groupPanelObj.HeightOfGroup > 0 ? groupPanelObj.HeightOfGroup : defaultSizeOfElement.groupHeight;
            groupPanelObj.WidthOfContent = groupPanelObj.WidthOfContent > 0 ? groupPanelObj.WidthOfContent : defaultSizeOfElement.contentWidth;
            if (groupPanelObj.MaxCountOfItems > 0 && groupPanelObj.MaxCountOfItems < groupPanelObj.Items.length) {
                groupPanelObj.Items.splice(groupPanelObj.MaxCountOfItems, groupPanelObj.Items.length - groupPanelObj.MaxCountOfItems);
            }
            if (groupPanelObj.InitItemIndexOfSelected < 0 || groupPanelObj.InitItemIndexOfSelected >= groupPanelObj.Items.length) {
                groupPanelObj.InitItemIndexOfSelected = groupPanelObj.Items.length == 0 ? -1 : 0;
            }
            atGroupPanelOfLiaoPanel.append("<div class = \"GroupPanelOfLiaoContent\"></div>");
            var atTempPanelContent = atGroupPanelOfLiaoPanel.children("div.GroupPanelOfLiaoContent").first();
            var leftBorderWidthOfContent = parseFloat(atTempPanelContent.css("border-left-width"));
            atTempPanelContent.remove();
            var panelObj = atGroupPanelOfLiaoPanel.PanelOfLiao({
                WidthOfContent: groupPanelObj.WidthOfGroup + groupPanelObj.WidthOfContent + leftBorderWidthOfContent,
                HeightOfContent: groupPanelObj.HeightOfGroup * groupPanelObj.Items.length,
                HasOperation: false,
                Item: { Title: groupPanelObj.DisplayTitle,
                    ContentHtml: "<div class = \"GroupPanelOfLiaoGroup\"></div>" +
                    "<div class = \"GroupPanelOfLiaoContent\"></div>"
                }
            });
            Liao.SetBindingModel(groupPanelObj, function (property) {
                switch (property) {
                    case "DisplayTitle": { panelObj.Item.SetState({ Title: groupPanelObj.DisplayTitle }); }; break;
                }
            });
            var atGroupPanelOfLiaoGroup = atGroupPanelOfLiaoPanel.find("div.GroupPanelOfLiaoGroup").last();
            atPanelContent = atGroupPanelOfLiaoPanel.find("div.GroupPanelOfLiaoContent").last();
            var borderColorOfPanel = atGroupPanelOfLiaoPanel.find("div.PanelOfLiaoWrapperHead").first().css("border-bottom-color");
            atPanelContent.css({ width: groupPanelObj.WidthOfContent + "px", height: panelObj.HeightOfContent + "px",
                "border-left-color": borderColorOfPanel
            });
            var groupItems = [];
            $.each(groupPanelObj.Items, function (index, item) {
                LoadItemHtml(item.Html);
                var atCurrentItemHtml = atPanelContent.children("div.GroupPanelOfLiaoContentHtml").last();
                groupItems.push({ Name: item.Summary,
                    Selected: function (currentItemIndex) {
                        if (currentItemIndexOfSelected >= 0 && currentItemIndexOfSelected < groupPanelObj.Items.length) {
                            atPanelContent.children("div.GroupPanelOfLiaoContentHtml").eq(currentItemIndexOfSelected)
                            .css({ display: itemContentState.close });
                        }
                        atPanelContent.children("div.GroupPanelOfLiaoContentHtml").eq(currentItemIndex)
                        .css({ display: itemContentState.open });
                        currentItemIndexOfSelected = currentItemIndex;
                        if (!Liao.IsUndefinedOrNull(groupPanelObj.ItemSelected)) {
                            groupPanelObj.ItemSelected(groupPanelObj.Items[currentItemIndexOfSelected]);
                        }
                    }
                });
                Liao.SetBindingModel(item, function (property) {
                    switch (property) {
                        case "Summary": { groupObj.Items[index].SetState({ Name: item.Summary }); }; break;
                        case "Html": { atCurrentItemHtml.html(item.Html); }; break;
                    }
                });
            });
            itemContentState.close = atPanelContent.children("div.GroupPanelOfLiaoContentHtml").length > 0 ?
            atPanelContent.children("div.GroupPanelOfLiaoContentHtml").first().css("display") : "none";
            groupObj = atGroupPanelOfLiaoGroup.GroupOfLiao({
                IsRowType: false,
                HeightOfGroup: groupPanelObj.HeightOfGroup,
                WidthOfItem: groupPanelObj.WidthOfGroup,
                ColorOfBlock: groupPanelObj.BlockColor,
                InitColorOfText: "#333333",
                VisitColorOfText: borderColorOfPanel,
                MaxLengthOfText: 20,
                Items: groupItems,
                InitIndexOfItemSelected: groupPanelObj.InitItemIndexOfSelected
            });
        });
        atGroupPanelOfLiao.load();
        return groupPanelObj;
    }
})(jQuery, Liao)