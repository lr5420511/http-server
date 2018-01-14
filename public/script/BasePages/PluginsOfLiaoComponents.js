/// <reference path="../jquery.min.js" />
/// <reference path="../LiaoComponent.js" />

(function (win, $, Liao) {
    var LoadItemsCount = function (url, finished) {
        if (typeof url !== "string" || url.length <= 0) {
            throw new Error("LoadItemsCount(): url of argument isn't a vaild argument");
        }
        var completed = function () { };
        $.ajax({ type: "get", url: url + "?ranRequest=" + (new Date()).getTime(), dataType: "json", async: true,
            success: function (datas) {
                var count;
                if (datas instanceof Array) {
                    count = datas.length;
                }
                else {
                    count = 1;
                }
                completed = function () {
                    if (finished instanceof Function) {
                        finished(count);
                    }
                };
            }, error: function (xmlRequest) {
                completed = function () { throw new Error("LoadItemsCount():" + xmlRequest.responseText); };
            }, complete: function () {
                completed();
            }
        });
    };

    win.InitComponents = function (sourceObj, inited, itemClicked) {
        if (typeof sourceObj !== "object") {
            throw new Error("window.InitComponents(): sourceObj of argument isn't a vaild argument");
        }
        LoadItemsCount(sourceObj.Url, function (itemsCount) {
            var atComponentsView = $("div.ComponentsView").first();
            atComponentsView.ViewOfLiao({ ColorStyle: "#FFFFFF", WidthOfText: 700, RowCountOfItems: itemsCount, ColumnCountOfItems: 1,
                PagerVisible: false, ItemClick: function (currentItem) {
                    if (itemClicked instanceof Function) {
                        itemClicked(currentItem);
                    }
                },
                AjaxConfiguration: { TransferObj: null, Url: sourceObj.Url + "?ranRequest=" + (new Date()).getTime(),
                    PropertyOfServer: {
                        NameProperty: { GetValue: sourceObj.GetNameValue },
                        ValueProperty: { GetValue: sourceObj.GetValueValue },
                        SceneProperty: { GetValue: sourceObj.GetSceneValue, IsExist: true },
                        DescriptionProperty: { GetValue: sourceObj.GetDescriptionValue, IsExist: true },
                        OtherProperty: { GetValue: sourceObj.GetOtherValue, IsExist: true, Filter: "Ajax组件" }
                    }
                }
            });
            if (inited instanceof Function) {
                inited();
            }
        });
    };
})(window, jQuery, Liao)