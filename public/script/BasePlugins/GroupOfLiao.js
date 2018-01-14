/// <reference path="../jquery.min.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.GroupOfLiao = function (option) {
        var groupObj = new Object();
        groupObj.CssClass = "GroupOfLiao";
        groupObj.IsRowType = true;
        groupObj.HeightOfGroup = 50;
        groupObj.WidthOfItem = 150;
        groupObj.ColorOfBlock = "#333333";
        groupObj.InitColorOfText = "#CCCCCC";
        groupObj.VisitColorOfText = "#FFFFFF";
        groupObj.MaxLengthOfText = 10;
        groupObj.MaxCountOfItems = 0;
        groupObj.Items =
        [{ Name: "GroupItem1", Selected: function (currentItemIndex) { } },
        { Name: "GroupItem2", Selected: function (currentItemIndex) { } }];
        groupObj.InitIndexOfItemSelected = 0;
        Liao.ExtendsObj(groupObj, option);
        if (groupObj.Items.length <= 0) {
            groupObj.Items.push({ Name: " ", Selected: function (currentItemIndex) { } });
            groupObj.InitIndexOfItemSelected = 0;
        }
        groupObj.CurrentItemIndex = groupObj.InitIndexOfItemSelected;
        groupObj.CurrentIndexOfItemSelected = function (currentItemIndex) {
            if (currentItemIndex == undefined) {
                return groupObj.CurrentItemIndex;
            }
            else {
                if (currentItemIndex >= 0 && currentItemIndex < groupObj.Items.length) {
                    atGroupOfLiaoWrapperContent.children("li.GroupOfLiaoWrapperContentItem").eq(currentItemIndex).click();
                }
            }
        };
        var atGroupOfLiao = $(this);
        atGroupOfLiao.addClass(groupObj.CssClass);

        atGroupOfLiao.append("<div class = \"GroupOfLiaoWrapper\"></div>");
        var atGroupOfLiaoWrapper = atGroupOfLiao.children("div.GroupOfLiaoWrapper").last();
        atGroupOfLiaoWrapper.append("<div class = \"GroupOfLiaoWrapperBlock\"></div>");
        var atGroupOfLiaoWrapperBlock = atGroupOfLiaoWrapper.children("div.GroupOfLiaoWrapperBlock").first();
        atGroupOfLiaoWrapper.append("<ul class = \"GroupOfLiaoWrapperContent\"></ul>");
        var atGroupOfLiaoWrapperContent = atGroupOfLiaoWrapper.children("ul.GroupOfLiaoWrapperContent").first();

        var timeout = 222;
        var defaultInitItemIndex = 0;
        var wrapperScrollPosition = { scrollTop: undefined, scrollLeft: undefined };
        var textSizePercentOfHeight = 0.4;
        function BindItem(item) {
            atGroupOfLiaoWrapperContent.append("<li class = \"GroupOfLiaoWrapperContentItem\"></li>");
            var atCurrentGroupItem = atGroupOfLiaoWrapperContent.children("li.GroupOfLiaoWrapperContentItem").last();
            atCurrentGroupItem.data("index", atGroupOfLiaoWrapperContent.children("li.GroupOfLiaoWrapperContentItem").length - 1)
            .css({ width: groupObj.WidthOfItem + "px", height: groupObj.HeightOfGroup + "px", color: groupObj.InitColorOfText,
                "font-size": groupObj.HeightOfGroup * textSizePercentOfHeight + "px", "line-height": groupObj.HeightOfGroup + "px"
            }).bind("mouseenter", function () {
                var currentItemIndex = atCurrentGroupItem.data("index");
                if (currentItemIndex != groupObj.CurrentItemIndex) {
                    atCurrentGroupItem.css({ color: groupObj.VisitColorOfText });
                }
            }).bind("mouseleave", function () {
                var currentItemIndex = atCurrentGroupItem.data("index");
                if (currentItemIndex != groupObj.CurrentItemIndex) {
                    atCurrentGroupItem.css({ color: groupObj.InitColorOfText });
                }
            }).bind("click", function () {
                var currentItemIndex = atCurrentGroupItem.data("index");
                if (currentItemIndex != groupObj.CurrentItemIndex) {
                    BlockToCurrentItem(currentItemIndex, function () {
                        atGroupOfLiaoWrapperContent.children("li.GroupOfLiaoWrapperContentItem").eq(groupObj.CurrentItemIndex)
                        .css({ color: groupObj.InitColorOfText });
                        atCurrentGroupItem.css({ color: groupObj.VisitColorOfText });
                        groupObj.CurrentItemIndex = currentItemIndex;
                        if (item.Selected != undefined) {
                            item.Selected(currentItemIndex);
                        }
                    });
                }
            });
            if (!(item.SetState instanceof Function)) {
                Liao.SetBindingModel(item);
            }
            if (item.IsBinded()) {
                item.Unbind();
            }
            item.Bind(function (property) {
                switch (property) {
                    case "Name":
                        {
                            atCurrentGroupItem.text(item.Name);
                        }; break;
                }
            });
            item.OnAllPropertyChanged();
        }
        function BlockToCurrentItem(itemIndex, moved) {
            var atMoveToGroupItem = atGroupOfLiaoWrapperContent.children("li.GroupOfLiaoWrapperContentItem").eq(itemIndex);
            var moveToPosition = { left: atMoveToGroupItem.position().left, top: atMoveToGroupItem.position().top };
            atGroupOfLiaoWrapperBlock.stop().animate({ left: moveToPosition.left + "px", top: moveToPosition.top + "px" }, timeout, function () {
                if (moved != undefined) {
                    moved();
                }
            });
        }
        atGroupOfLiao.bind("load", function () {
            if (groupObj.MaxCountOfItems > 0 && groupObj.Items.length > groupObj.MaxCountOfItems) {
                groupObj.Items.splice(groupObj.MaxCountOfItems, groupObj.Items.length - groupObj.MaxCountOfItems);
            }
            if (groupObj.InitIndexOfItemSelected < 0 || groupObj.InitIndexOfItemSelected >= groupObj.Items.length) {
                groupObj.InitIndexOfItemSelected = defaultInitItemIndex;
                groupObj.CurrentItemIndex = groupObj.InitIndexOfItemSelected;
            }
            var groupSize = {
                width: groupObj.IsRowType ? groupObj.WidthOfItem * groupObj.Items.length : groupObj.WidthOfItem,
                height: groupObj.IsRowType ? groupObj.HeightOfGroup : groupObj.HeightOfGroup * groupObj.Items.length
            };
            atGroupOfLiao.css({ width: groupSize.width + "px", height: groupSize.height + "px" });
            atGroupOfLiaoWrapper.css({ width: groupSize.width + "px", height: groupSize.height + "px" });
            atGroupOfLiaoWrapperContent.css({ width: groupSize.width + "px", height: groupSize.height + "px" });
            $.extend(wrapperScrollPosition, {
                scrollLeft: atGroupOfLiaoWrapper.scrollLeft(), scrollTop: atGroupOfLiaoWrapper.scrollTop()
            });
            atGroupOfLiaoWrapperBlock.css({ width: groupObj.WidthOfItem + "px",
                height: groupObj.HeightOfGroup + "px", "background-color": groupObj.ColorOfBlock
            });
            for (var index = 0; index < groupObj.Items.length; index++) {
                var currentItem = groupObj.Items[index];
                if (currentItem.Name.length > groupObj.MaxLengthOfText) {
                    currentItem.Name = currentItem.Name.substr(0, groupObj.MaxLengthOfText - 1) + "…";
                }
                Liao.SetBindingModel(currentItem);
                BindItem(currentItem);
            }
            atGroupOfLiaoWrapperBlock.css({
                top: (groupObj.IsRowType ? wrapperScrollPosition.scrollTop :
                (wrapperScrollPosition.scrollTop + groupObj.HeightOfGroup * groupObj.InitIndexOfItemSelected)) + "px",
                left: (groupObj.IsRowType ? (wrapperScrollPosition.scrollLeft + groupObj.WidthOfItem * groupObj.InitIndexOfItemSelected) :
                wrapperScrollPosition.scrollLeft) + "px"
            });
            atGroupOfLiaoWrapperContent.children("li.GroupOfLiaoWrapperContentItem").eq(groupObj.InitIndexOfItemSelected)
            .css({ color: groupObj.VisitColorOfText });
            if (groupObj.Items[groupObj.InitIndexOfItemSelected].Selected != undefined) {
                groupObj.Items[groupObj.InitIndexOfItemSelected].Selected(groupObj.InitIndexOfItemSelected);
            }
        });
        atGroupOfLiao.load();
        return groupObj;
    }
})(jQuery, Liao)