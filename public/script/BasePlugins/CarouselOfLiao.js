/// <reference path="../jquery.min.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    jQuery.fn.CarouselOfLiao = function (option) {
        var carouselObj = new Object();
        carouselObj.CssClass = "CarouselOfLiao";
        carouselObj.WidthOfCarousel = 400;
        carouselObj.HeightOfCarousel = 300;
        carouselObj.CarouselTimeout = 7000;
        carouselObj.HasNavigation = true;
        carouselObj.MaxCountOfItems = 0;
        carouselObj.Items = [
        { Scene: "../image/carouselA.jpg", Value: undefined },
        { Scene: "../image/carouselB.jpg", Value: undefined },
        { Scene: "../image/carouselC.jpg", Value: undefined}];
        carouselObj.IsAjaxMode = false;
        carouselObj.AjaxConfiguration = {
            TransferObj: null, Url: undefined, ClearCacheMinutes: 30,
            PropertyOfServer: {
                SceneProperty: function (item) { }, ValueProperty: function (item) { }
            }
        };
        carouselObj.ItemClicked = function (currentItem) { };
        carouselObj.CarouselCompleted = function (currentItem) { };
        Liao.ExtendsObj(carouselObj, option);
        carouselObj.CurrentItemIndex = function (currentItemIndex) {
            if (currentItemIndex == undefined) {
                return itemIndexOfDisplay.current;
            }
            else {
                if (currentItemIndex >= 0 && currentItemIndex < carouselObj.Items.length) {
                    clearTimeout(timer);
                    itemIndexOfDisplay.current = currentItemIndex;
                    SetIndexOfDisplay();
                    BindAllItem();
                    timer = setTimeout(function () { StartCarouselShow(); }, carouselObj.CarouselTimeout);
                }
            }
        };
        var atCarouselOfLiao = jQuery(this);
        atCarouselOfLiao.addClass(carouselObj.CssClass);

        atCarouselOfLiao.append("<div class = \"CarouselOfLiaoWrapper\"></div>");
        var atCarouselOfLiaoWrapper = atCarouselOfLiao.children("div.CarouselOfLiaoWrapper").last();
        atCarouselOfLiaoWrapper.append("<ul class = \"CarouselOfLiaoWrapperContent\"></ul>");
        var atCarouselOfLiaoWrapperContent = atCarouselOfLiaoWrapper.children("ul.CarouselOfLiaoWrapperContent").first();
        var atCarouselOfLiaoWrapperPrev = undefined;
        var atCarouselOfLiaoWrapperNext = undefined;
        if (carouselObj.HasNavigation) {
            atCarouselOfLiaoWrapper.append("<span class = \"CarouselOfLiaoWrapperPrev\"></span>");
            atCarouselOfLiaoWrapperPrev = atCarouselOfLiaoWrapper.children("span.CarouselOfLiaoWrapperPrev").first();
            atCarouselOfLiaoWrapper.append("<span class = \"CarouselOfLiaoWrapperNext\"></span>");
            atCarouselOfLiaoWrapperNext = atCarouselOfLiaoWrapper.children("span.CarouselOfLiaoWrapperNext").first();
        }

        var timeout = 1111;
        var timer = undefined;
        var defaultItemCountOfDisplay = 3;
        var itemIndexOfDisplay = { prev: -1, current: -1, next: -1 };
        var wrapperScrollPosition = {};
        var totalMilliseconds = 0;
        function SetIndexOfDisplay(rightToLeft) {
            switch (rightToLeft) {
                case true:
                    {
                        itemIndexOfDisplay.prev = itemIndexOfDisplay.current;
                        itemIndexOfDisplay.current = itemIndexOfDisplay.next;
                        var tempItemNextIndex = itemIndexOfDisplay.current + 1;
                        itemIndexOfDisplay.next = tempItemNextIndex < carouselObj.Items.length ? tempItemNextIndex : 0;
                    }; break;
                case false:
                    {
                        itemIndexOfDisplay.next = itemIndexOfDisplay.current;
                        itemIndexOfDisplay.current = itemIndexOfDisplay.prev;
                        var tempItemPrevIndex = itemIndexOfDisplay.current - 1;
                        itemIndexOfDisplay.prev = tempItemPrevIndex >= 0 ? tempItemPrevIndex : carouselObj.Items.length - 1;
                    }; break;
                case undefined:
                    {
                        if (itemIndexOfDisplay.current >= 0) {
                            var tempItemPrevIndex = itemIndexOfDisplay.current - 1;
                            itemIndexOfDisplay.prev = tempItemPrevIndex >= 0 ? tempItemPrevIndex : carouselObj.Items.length - 1;
                            var tempItemNextIndex = itemIndexOfDisplay.current + 1;
                            itemIndexOfDisplay.next = tempItemNextIndex < carouselObj.Items.length ? tempItemNextIndex : 0;
                        }
                    }; break;
            }
        }
        function InsertItemToContent() {
            atCarouselOfLiaoWrapperContent.append("<li class = \"CarouselOfLiaoWrapperContentItem\"></li>");
            var atCurrentCarouselItem = atCarouselOfLiaoWrapperContent.children("li.CarouselOfLiaoWrapperContentItem").last();
            atCurrentCarouselItem.append("<img class = \"CarouselOfLiaoWrapperContentItemScene\" alt = \"\" />");
            atCurrentCarouselItem.css({ width: carouselObj.WidthOfCarousel + "px", height: carouselObj.HeightOfCarousel + "px" })
            .bind("click", function () {
                var currentItem = atCurrentCarouselItem.data("value");
                carouselObj.ItemClicked(currentItem);
            });
        }
        function BindAllItem() {
            if (itemIndexOfDisplay.prev > -1) {
                BindItem(atCarouselOfLiaoWrapperContent.children("li.CarouselOfLiaoWrapperContentItem").eq(0),
                carouselObj.Items[itemIndexOfDisplay.prev]);
            }
            if (itemIndexOfDisplay.current > -1) {
                BindItem(atCarouselOfLiaoWrapperContent.children("li.CarouselOfLiaoWrapperContentItem").eq(1),
                carouselObj.Items[itemIndexOfDisplay.current]);
            }
            if (itemIndexOfDisplay.next > -1) {
                BindItem(atCarouselOfLiaoWrapperContent.children("li.CarouselOfLiaoWrapperContentItem").eq(2),
                carouselObj.Items[itemIndexOfDisplay.next]);
            }
        }
        function BindItem(atItem, item) {
            if (item.SetState == undefined) {
                Liao.SetBindingModel(item);
            }
            if (!Liao.IsUndefinedOrNull(item.IsBinded) && item.IsBinded()) {
                item.Unbind();
            }
            item.Bind(function (property) {
                switch (property) {
                    case "Scene":
                        {
                            atItem.children("img.CarouselOfLiaoWrapperContentItemScene").first().attr({ src: item.Scene });
                        }; break;
                    case "Value":
                        {
                            atItem.data("value", item);
                        }; break;
                }
            });
            item.OnAllPropertyChanged();
        }
        function UnbindItem(atItem) {
            var currentItem = atItem.data("value");
            if (!Liao.IsUndefinedOrNull(currentItem.IsBinded) && currentItem.IsBinded()) {
                currentItem.Unbind();
            }
            atItem.data("value", null).children("img.CarouselOfLiaoWrapperContentItemScene").first().attr({ src: null });
        }
        function AjaxDownload(downloaded) {
            var ranRequestValue = (new Date()).getTime();
            jQuery.ajax({ type: "get", url: carouselObj.AjaxConfiguration.Url + "?ranRequest=" + ranRequestValue,
                data: carouselObj.AjaxConfiguration.TransferObj, dataType: "json", async: true,
                success: function (datas) {
                    if (datas != null && datas.length > 0) {
                        jQuery.each(datas, function (index, data) {
                            carouselObj.Items.push({
                                Scene: carouselObj.AjaxConfiguration.PropertyOfServer.SceneProperty(data),
                                Value: carouselObj.AjaxConfiguration.PropertyOfServer.ValueProperty(data)
                            });
                        });
                        if (carouselObj.MaxCountOfItems > 0 && carouselObj.Items.length > carouselObj.MaxCountOfItems) {
                            carouselObj.Items.splice(carouselObj.MaxCountOfItems, carouselObj.Items.length - carouselObj.MaxCountOfItems);
                        }
                    }
                }, complete: function () {
                    if (!Liao.IsUndefinedOrNull(downloaded)) {
                        downloaded();
                    }
                }
            });
        }
        function CarouselToMove(rightToLeft, moved) {
            var endLeftPositionOfContent = rightToLeft ?
            (wrapperScrollPosition.left - carouselObj.WidthOfCarousel * 2) : wrapperScrollPosition.left;
            var currentLeftPositionOfContent = parseFloat(atCarouselOfLiaoWrapperContent.css("left"));
            var currentTimeout = (currentLeftPositionOfContent - endLeftPositionOfContent) * timeout / carouselObj.WidthOfCarousel;
            atCarouselOfLiaoWrapperContent.stop().animate({ left: endLeftPositionOfContent + "px" }, 
            currentTimeout >= 0 ? currentTimeout : -currentTimeout, function () {
                var tempCarouselItem = rightToLeft ?
                atCarouselOfLiaoWrapperContent.children("li.CarouselOfLiaoWrapperContentItem").first().detach() :
                atCarouselOfLiaoWrapperContent.children("li.CarouselOfLiaoWrapperContentItem").last().detach();
                atCarouselOfLiaoWrapperContent.css({ left: wrapperScrollPosition.left - carouselObj.WidthOfCarousel + "px" });
                if (rightToLeft) {
                    atCarouselOfLiaoWrapperContent.append(tempCarouselItem);
                }
                else {
                    atCarouselOfLiaoWrapperContent.prepend(tempCarouselItem);
                }
                var atTempCarouselItem = jQuery(tempCarouselItem);
                UnbindItem(atTempCarouselItem);
                SetIndexOfDisplay(rightToLeft);
                BindItem(atTempCarouselItem, rightToLeft ? carouselObj.Items[itemIndexOfDisplay.next] : carouselObj.Items[itemIndexOfDisplay.prev]);
                carouselObj.CarouselCompleted(carouselObj.Items[itemIndexOfDisplay.current]);
                if (!Liao.IsUndefinedOrNull(moved)) {
                    moved();
                }
            });
        }
        function StartCarouselShow() {
            if (carouselObj.IsAjaxMode && carouselObj.Items.length <= 0) {
                AjaxDownload(function () {
                    if (carouselObj.Items.length > 0) {
                        Liao.SetBindingModel(carouselObj.Items);
                        itemIndexOfDisplay.current = 0;
                        SetIndexOfDisplay();
                        BindAllItem();
                    }
                    timer = setTimeout(function () { StartCarouselShow(); }, carouselObj.CarouselTimeout);
                });
            }
            else {
                totalMilliseconds += carouselObj.CarouselTimeout;
                CarouselToMove(true, function () {
                    totalMilliseconds += timeout;
                    if (carouselObj.IsAjaxMode && totalMilliseconds >= carouselObj.AjaxConfiguration.ClearCacheMinutes * 60 * 1000) {
                        carouselObj.Items = [];
                        totalMilliseconds = 0;
                        Liao.ExtendsObj(itemIndexOfDisplay, { prev: -1, current: -1, next: -1 });
                        clearTimeout(timer);
                        StartCarouselShow();
                    }
                    timer = setTimeout(function () { StartCarouselShow(); }, carouselObj.CarouselTimeout);
                });
            }
        }
        if (carouselObj.HasNavigation) {
            atCarouselOfLiaoWrapperPrev.bind("click", function () {
                if (carouselObj.Items.length > 0) {
                    clearTimeout(timer);
                    CarouselToMove(true, function () {
                        totalMilliseconds += timeout;
                        timer = setTimeout(function () { StartCarouselShow(); }, carouselObj.CarouselTimeout);
                    });
                }
            });
            atCarouselOfLiaoWrapperNext.bind("click", function () {
                if (carouselObj.Items.length > 0) {
                    clearTimeout(timer);
                    CarouselToMove(false, function () {
                        totalMilliseconds += timeout;
                        timer = setTimeout(function () { StartCarouselShow(); }, carouselObj.CarouselTimeout);
                    });
                }
            });
        }
        atCarouselOfLiao.bind("load", function () {
            carouselObj.Items = carouselObj.IsAjaxMode ? [] : carouselObj.Items;
            if (carouselObj.MaxCountOfItems > 0 && carouselObj.Items.length > carouselObj.MaxCountOfItems) {
                carouselObj.Items.splice(carouselObj.MaxCountOfItems, carouselObj.Items.length - carouselObj.MaxCountOfItems);
            }
            var minSizeOfCarousel = { width: undefined, height: undefined };
            if (carouselObj.HasNavigation) {
                var prevWidth = parseFloat(atCarouselOfLiaoWrapperPrev.css("width"));
                minSizeOfCarousel.width = prevWidth * 2;
                minSizeOfCarousel.height = minSizeOfCarousel.width;
            }
            else {
                atCarouselOfLiaoWrapper.append("<span class = \"CarouselOfLiaoWrapperPrev\"></span>");
                var atTempCarouselPrev = atCarouselOfLiaoWrapper.children("span.CarouselOfLiaoWrapperPrev").first();
                var prevWidth = parseFloat(atTempCarouselPrev.css("width"));
                minSizeOfCarousel.width = prevWidth * 2;
                minSizeOfCarousel.height = minSizeOfCarousel.width;
                atTempCarouselPrev.remove();
            }
            carouselObj.WidthOfCarousel = carouselObj.WidthOfCarousel >= minSizeOfCarousel.width
            ? carouselObj.WidthOfCarousel : minSizeOfCarousel.width;
            carouselObj.HeightOfCarousel = carouselObj.HeightOfCarousel >= minSizeOfCarousel.height
            ? carouselObj.HeightOfCarousel : minSizeOfCarousel.height;
            atCarouselOfLiao.css({ width: carouselObj.WidthOfCarousel + "px", height: carouselObj.HeightOfCarousel + "px" });
            atCarouselOfLiaoWrapper.css({ width: carouselObj.WidthOfCarousel + "px", height: carouselObj.HeightOfCarousel + "px" });
            Liao.ExtendsObj(wrapperScrollPosition, {
                left: atCarouselOfLiaoWrapper.scrollLeft(), top: atCarouselOfLiaoWrapper.scrollTop()
            });
            atCarouselOfLiaoWrapperContent.css({
                width: carouselObj.WidthOfCarousel * defaultItemCountOfDisplay + "px", height: carouselObj.HeightOfCarousel + "px",
                top: wrapperScrollPosition.top + "px", left: wrapperScrollPosition.left - carouselObj.WidthOfCarousel + "px"
            });
            if (carouselObj.HasNavigation) {
                atCarouselOfLiaoWrapperPrev.css({ left: wrapperScrollPosition.left + "px", top: wrapperScrollPosition.top + "px" });
                atCarouselOfLiaoWrapperNext.css({ top: wrapperScrollPosition.top + "px" });
            }
            for (var index = 0; index < defaultItemCountOfDisplay; index++) {
                InsertItemToContent();
            }
            if (carouselObj.IsAjaxMode) {
                StartCarouselShow();
            }
            else {
                if (carouselObj.Items.length > 0) {
                    Liao.SetBindingModel(carouselObj.Items);
                    itemIndexOfDisplay.current = 0;
                    SetIndexOfDisplay();
                    BindAllItem();
                    timer = setTimeout(function () { StartCarouselShow(); }, carouselObj.CarouselTimeout);
                }
            }
        });
        atCarouselOfLiao.load();
        return carouselObj;
    }
})(jQuery, Liao)