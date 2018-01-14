/// <reference path="../jquery.min.js" />
/// <reference path="../jquery-ui.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.SceneShowerOfLiao = function (option) {
        var sceneShowerObj = new Object();
        sceneShowerObj.CssClass = "SceneShowerOfLiao";
        sceneShowerObj.WidthOfScene = 400;
        sceneShowerObj.HeightOfScene = 300;
        sceneShowerObj.MaxCountOfItems = 0;
        sceneShowerObj.ItemClick = function (currentItem) { };
        sceneShowerObj.SceneTimeout = 7000;
        sceneShowerObj.Items = [{
            Name: "欢迎使用SceneShowerOfLiao插件，这是默认场景一！", Value: undefined, Scene: "../image/sceneshowerA.jpg"
        }, {
            Name: "欢迎使用SceneShowerOfLiao插件，这是默认场景二！", Value: undefined, Scene: "../image/sceneshowerB.jpg"
        }];
        sceneShowerObj.IsAjaxMode = false;
        sceneShowerObj.AjaxConfiguration = {
            TransferObj: null, Url: undefined, ClearCacheMinutes: 30,
            PropertyOfServer: { NameProperty: function (item) { }, ValueProperty: function (item) { }, SceneProperty: function (item) { } }
        };
        Liao.ExtendsObj(sceneShowerObj, option);
        sceneShowerObj.CurrentItemIndex = -1;
        var atSceneShowerOfLiao = $(this);
        atSceneShowerOfLiao.addClass(sceneShowerObj.CssClass);

        atSceneShowerOfLiao.append("<div class = \"SceneShowerOfLiaoWrapper\"></div>");
        var atSceneShowerOfLiaoWrapper = atSceneShowerOfLiao.children("div.SceneShowerOfLiaoWrapper").first();
        atSceneShowerOfLiaoWrapper.append("<ul class = \"SceneShowerOfLiaoWrapperContent\"></ul>");
        var atSceneShowerOfLiaoWrapperContent = atSceneShowerOfLiaoWrapper.children("ul.SceneShowerOfLiaoWrapperContent").first();
        atSceneShowerOfLiaoWrapperContent.append("<li class = \"SceneShowerOfLiaoWrapperContentItem\"></li>");
        var atSceneShowerOfLiaoWrapperContentItemFirst = atSceneShowerOfLiaoWrapperContent.children("li.SceneShowerOfLiaoWrapperContentItem")
        .first();
        atSceneShowerOfLiaoWrapperContent.append("<li class = \"SceneShowerOfLiaoWrapperContentItem\"></li>");
        var atSceneShowerOfLiaoWrapperContentItemSecond = atSceneShowerOfLiaoWrapperContent.children("li.SceneShowerOfLiaoWrapperContentItem")
        .last();
        atSceneShowerOfLiaoWrapperContentItemFirst.append("<div class = \"SceneShowerOfLiaoWrapperContentItemWrapper\"></div>");
        var atSceneShowerOfLiaoWrapperContentItemFirstWrapper = atSceneShowerOfLiaoWrapperContentItemFirst
        .children("div.SceneShowerOfLiaoWrapperContentItemWrapper").first();
        atSceneShowerOfLiaoWrapperContentItemSecond.append("<div class = \"SceneShowerOfLiaoWrapperContentItemWrapper\"></div>");
        var atSceneShowerOfLiaoWrapperContentItemSecondWrapper = atSceneShowerOfLiaoWrapperContentItemSecond
        .children("div.SceneShowerOfLiaoWrapperContentItemWrapper").first();
        atSceneShowerOfLiaoWrapperContentItemFirstWrapper
        .append("<img class = \"SceneShowerOfLiaoWrapperContentItemWrapperScene\" alt = \"\" />");
        var atSceneShowerOfLiaoWrapperContentItemFirstWrapperScene = atSceneShowerOfLiaoWrapperContentItemFirstWrapper
        .children("img.SceneShowerOfLiaoWrapperContentItemWrapperScene").first();
        atSceneShowerOfLiaoWrapperContentItemFirstWrapper
        .append("<div class = \"SceneShowerOfLiaoWrapperContentItemWrapperDescription\"></div>");
        var atSceneShowerOfLiaoWrapperContentItemFirstWrapperDescription = atSceneShowerOfLiaoWrapperContentItemFirstWrapper
        .children("div.SceneShowerOfLiaoWrapperContentItemWrapperDescription").first();
        atSceneShowerOfLiaoWrapperContentItemSecondWrapper
        .append("<img class = \"SceneShowerOfLiaoWrapperContentItemWrapperScene\" alt = \"\" />");
        var atSceneShowerOfLiaoWrapperContentItemSecondWrapperScene = atSceneShowerOfLiaoWrapperContentItemSecondWrapper
        .children("img.SceneShowerOfLiaoWrapperContentItemWrapperScene").first();
        atSceneShowerOfLiaoWrapperContentItemSecondWrapper
        .append("<div class = \"SceneShowerOfLiaoWrapperContentItemWrapperDescription\"></div>");
        var atSceneShowerOfLiaoWrapperContentItemSecondWrapperDescription = atSceneShowerOfLiaoWrapperContentItemSecondWrapper
        .children("div.SceneShowerOfLiaoWrapperContentItemWrapperDescription").first();

        var timeout = 1111;
        var descriptionPercent = 0.11;
        var cacheTotalTime = 0;
        var nextItemIndex = -1;
        var initContentPosition = { left: undefined, top: undefined };
        var showedContentPosition = { left: -sceneShowerObj.WidthOfScene, top: 0 };
        var initDescriptionPosition = { left: 0, top: sceneShowerObj.HeightOfScene };
        var showedDescriptionPosition = { left: 0, top: sceneShowerObj.HeightOfScene - sceneShowerObj.HeightOfScene * descriptionPercent };
        var ProccessItems = function () {
            if (sceneShowerObj.MaxCountOfItems > 0 && sceneShowerObj.Items.length > sceneShowerObj.MaxCountOfItems) {
                sceneShowerObj.Items
                .splice(sceneShowerObj.MaxCountOfItems, sceneShowerObj.Items.length - sceneShowerObj.MaxCountOfItems);
            }
            Liao.SetBindingModel(sceneShowerObj.Items);
            $.each(sceneShowerObj.Items, function (index, item) {
                if (index == 0) {
                    sceneShowerObj.CurrentItemIndex = index;
                    BindItem(item, atSceneShowerOfLiaoWrapperContent.children("li.SceneShowerOfLiaoWrapperContentItem").last());
                    BindItem(item, atSceneShowerOfLiaoWrapperContent.children("li.SceneShowerOfLiaoWrapperContentItem").first());
                }
                else if (index == 1) {
                    nextItemIndex = sceneShowerObj.CurrentItemIndex + 1;
                    BindItem(item, atSceneShowerOfLiaoWrapperContent.children("li.SceneShowerOfLiaoWrapperContentItem").last());
                }
                else {
                    return;
                }
            });
        };
        function BindItem(itemObj, atSceneShowerOfLiaoWrapperContentItem) {
            if (itemObj != undefined && itemObj != null) {
                if (itemObj.SetState == undefined) {
                    Liao.SetBindingModel(itemObj);
                }
                if (itemObj.IsBinded()) {
                    itemObj.Unbind();
                }
                itemObj.Bind(function (property) {
                    switch (property) {
                        case "Value":
                            {
                                atSceneShowerOfLiaoWrapperContentItem.children("div.SceneShowerOfLiaoWrapperContentItemWrapper").first()
                                .data("value", itemObj);
                            }; break;
                        case "Name":
                            {
                                atSceneShowerOfLiaoWrapperContentItem.find("div.SceneShowerOfLiaoWrapperContentItemWrapperDescription").first()
                                .text(itemObj.Name);
                            }; break;
                        case "Scene":
                            {
                                atSceneShowerOfLiaoWrapperContentItem.find("img.SceneShowerOfLiaoWrapperContentItemWrapperScene").first()
                                .attr({ src: itemObj.Scene });
                            }; break;
                    }
                });
                itemObj.OnAllPropertyChanged();
            }
        }
        function AjaxDownload(downloaded) {
            var requestRan = (new Date()).getTime();
            $.ajax({ type: "get", url: sceneShowerObj.AjaxConfiguration.Url + "?rannum=" + requestRan,
                data: sceneShowerObj.AjaxConfiguration.TransferObj, dataType: "json", async: true,
                success: function (datas) {
                    if (datas != null) {
                        $.each(datas, function (index, value) {
                            sceneShowerObj.Items.push({
                                Name: sceneShowerObj.AjaxConfiguration.PropertyOfServer.NameProperty(value),
                                Value: sceneShowerObj.AjaxConfiguration.PropertyOfServer.ValueProperty(value),
                                Scene: sceneShowerObj.AjaxConfiguration.PropertyOfServer.SceneProperty(value)
                            });
                        });
                    }
                }, complete: function () {
                    if (downloaded != undefined) {
                        downloaded();
                    }
                }
            });
        }
        function StartSceneShow() {
            cacheTotalTime += sceneShowerObj.SceneTimeout;
            atSceneShowerOfLiaoWrapperContent.find("div.SceneShowerOfLiaoWrapperContentItemWrapperDescription").first().stop()
            .animate({ left: initDescriptionPosition.left + "px", top: initDescriptionPosition.top + "px" }, timeout, function () {
                cacheTotalTime += timeout;
                atSceneShowerOfLiaoWrapperContent.stop()
                .animate({ left: showedContentPosition.left + "px", top: showedContentPosition.top + "px" }, timeout, function () {
                    cacheTotalTime += timeout;
                    var atContentFirstItem = atSceneShowerOfLiaoWrapperContent.children("li.SceneShowerOfLiaoWrapperContentItem").first();
                    var firstItem = atContentFirstItem.children("div.SceneShowerOfLiaoWrapperContentItemWrapper").first().data("value");
                    if (!Liao.IsUndefinedOrNull(firstItem.IsBinded) && firstItem.IsBinded()) {
                        firstItem.Unbind();
                    }
                    var removedItem = atContentFirstItem.detach();
                    atSceneShowerOfLiaoWrapperContent.css({ left: initContentPosition.left + "px", top: initContentPosition.top + "px" });
                    atSceneShowerOfLiaoWrapperContent.append(removedItem);
                    sceneShowerObj.CurrentItemIndex = nextItemIndex == -1 ? sceneShowerObj.CurrentItemIndex : nextItemIndex;
                    nextItemIndex = sceneShowerObj.CurrentItemIndex < sceneShowerObj.Items.length - 1 ?
                    sceneShowerObj.CurrentItemIndex + 1 : 0;
                    BindItem(sceneShowerObj.Items[nextItemIndex], $(removedItem));
                    atSceneShowerOfLiaoWrapperContent.find("div.SceneShowerOfLiaoWrapperContentItemWrapperDescription").first().stop()
                    .animate({ left: showedDescriptionPosition.left + "px", top: showedDescriptionPosition.top + "px" }, timeout, function () {
                        cacheTotalTime += timeout;
                        if (sceneShowerObj.IsAjaxMode && cacheTotalTime >= sceneShowerObj.AjaxConfiguration.ClearCacheMinutes * 60000) {
                            cacheTotalTime = 0;
                            nextItemIndex = -1;
                            sceneShowerObj.CurrentItemIndex = -1;
                            sceneShowerObj.Items = [];
                            AjaxDownload(function () {
                                ProccessItems();
                                setTimeout(function () { StartSceneShow(); }, sceneShowerObj.SceneTimeout);
                            });
                        }
                        else {
                            cacheTotalTime = sceneShowerObj.IsAjaxMode ? cacheTotalTime : 0;
                            setTimeout(function () { StartSceneShow(); }, sceneShowerObj.SceneTimeout);
                        }
                    });
                });
            });
        }
        atSceneShowerOfLiaoWrapperContentItemFirstWrapper.bind("click", function () {
            var currentItem = atSceneShowerOfLiaoWrapperContentItemFirstWrapper.data("value");
            sceneShowerObj.ItemClick(currentItem);
        });
        atSceneShowerOfLiaoWrapperContentItemSecondWrapper.bind("click", function () {
            var currentItem = atSceneShowerOfLiaoWrapperContentItemSecondWrapper.data("value");
            sceneShowerObj.ItemClick(currentItem);
        });
        atSceneShowerOfLiao.bind("load", function () {
            atSceneShowerOfLiao.css({ width: sceneShowerObj.WidthOfScene + "px", height: sceneShowerObj.HeightOfScene + "px" });
            atSceneShowerOfLiaoWrapper.css({ width: sceneShowerObj.WidthOfScene + "px", height: sceneShowerObj.HeightOfScene + "px" });
            atSceneShowerOfLiaoWrapperContent
            .css({ width: sceneShowerObj.WidthOfScene * 2 + "px", height: sceneShowerObj.HeightOfScene + "px" });
            atSceneShowerOfLiaoWrapperContentItemFirst
            .css({ width: sceneShowerObj.WidthOfScene + "px", height: sceneShowerObj.HeightOfScene + "px" });
            atSceneShowerOfLiaoWrapperContentItemSecond
            .css({ width: sceneShowerObj.WidthOfScene + "px", height: sceneShowerObj.HeightOfScene + "px" });
            atSceneShowerOfLiaoWrapperContentItemFirstWrapper
            .css({ width: sceneShowerObj.WidthOfScene + "px", height: sceneShowerObj.HeightOfScene + "px" });
            atSceneShowerOfLiaoWrapperContentItemSecondWrapper
            .css({ width: sceneShowerObj.WidthOfScene + "px", height: sceneShowerObj.HeightOfScene + "px" });
            atSceneShowerOfLiaoWrapperContentItemFirstWrapperScene
            .css({ width: sceneShowerObj.WidthOfScene + "px", height: sceneShowerObj.HeightOfScene + "px" });
            atSceneShowerOfLiaoWrapperContentItemSecondWrapperScene
            .css({ width: sceneShowerObj.WidthOfScene + "px", height: sceneShowerObj.HeightOfScene + "px" });
            atSceneShowerOfLiaoWrapperContentItemFirstWrapperDescription.css({
                width: sceneShowerObj.WidthOfScene + "px", height: sceneShowerObj.HeightOfScene * descriptionPercent + "px",
                top: showedDescriptionPosition.top + "px", left: showedDescriptionPosition.left + "px"
            });
            atSceneShowerOfLiaoWrapperContentItemSecondWrapperDescription.css({
                width: sceneShowerObj.WidthOfScene + "px", height: sceneShowerObj.HeightOfScene * descriptionPercent + "px",
                top: initDescriptionPosition.top + "px", left: initDescriptionPosition.left + "px"
            });
            $.extend(initContentPosition, {
                left: parseFloat(atSceneShowerOfLiaoWrapperContent.css("left")), top: parseFloat(atSceneShowerOfLiaoWrapperContent.css("top"))
            });
            if (sceneShowerObj.IsAjaxMode) {
                sceneShowerObj.Items = [];
                AjaxDownload(function () {
                    ProccessItems();
                    setTimeout(function () { StartSceneShow(); }, sceneShowerObj.SceneTimeout);
                });
            }
            else {
                ProccessItems();
                if (sceneShowerObj.Items.length > 1) {
                    setTimeout(function () { StartSceneShow(); }, sceneShowerObj.SceneTimeout);
                }
            }
        });
        atSceneShowerOfLiao.load();
        return sceneShowerObj;
    }
})(jQuery, Liao)