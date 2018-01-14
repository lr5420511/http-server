/// <reference path="../jquery.min.js" />

(function (win, $, Liao) {
    win.InitMain = function () {
        var atMainBody = $("body.MainBody").first();
        var scrollPositionOfBody = { mainY: atMainBody.scrollTop(), otherY: undefined };
        var mainUrl = "../../html/PluginsOfLiaoMainContent.htm";
        var componentUrl = "../../html/PluginsOfLiaoComponents.htm";
        var documentUrl = "../../html/PluginsOfLiaoDocument.htm";
        var downloadUrl = "../../html/PluginsOfLiaoDownload.htm";
        var aboutUrl = "../../html/PluginsOfLiaoAbout.htm";
        var atMainContent = $("div.MainContent").first();
        atMainContent.RequestHtml = function (url, responsed) {
            if (typeof url !== "string" || url.length <= 0) {
                throw new Error("url of argument isn't a vaild argument");
            }
            var currentContent = this;
            $.ajax({ type: "get", url: url + "?ranRequest=" + (new Date()).getTime(), dataType: "text",
                async: true, success: function (datas) {
                    currentContent.html(datas);
                }, error: function (request) {
                    throw new Error(request.responseText);
                }, complete: function () {
                    if (responsed instanceof Function) {
                        responsed();
                    }
                }
            });
        };
        var atGroupHeadMenu = $("div.MainHeadGroup#GroupHeadMenu").first();
        var groupObj = atGroupHeadMenu.GroupOfLiao({ HeightOfGroup: atGroupHeadMenu.height(), MaxCountOfItems: 6, MaxLengthOfText: 15,
            Items:
        [
          { Name: " 主 页 ", Selected: function (currentItemIndex) {
              atMainContent.RequestHtml(mainUrl, function () {
                  atMainBody.scrollTop(scrollPositionOfBody.mainY);
              });
          }
          },
          { Name: " 组 件 ", Selected: function (currentItemIndex) {
              atMainContent.RequestHtml(componentUrl, function () {
                  atMainBody.scrollTop(scrollPositionOfBody.otherY);
              });
          }
          },
          { Name: " 文 档 ", Selected: function (currentItemIndex) {
              atMainContent.RequestHtml(documentUrl, function () {
                  atMainBody.scrollTop(scrollPositionOfBody.otherY);
              });
          }
          },
          { Name: " 下 载 ", Selected: function (currentItemIndex) {
              atMainContent.RequestHtml(downloadUrl, function () {
                  atMainBody.scrollTop(scrollPositionOfBody.otherY);
              });
          }
          },
          { Name: " 关 于 我 ", Selected: function (currentItemIndex) {
              atMainContent.RequestHtml(aboutUrl, function () {
                  atMainBody.scrollTop(scrollPositionOfBody.otherY);
              });
          }
          }
        ]
        });
        var atCarouselSceneShow = $("div.MainSceneCarousel#CarouselSceneShow").first();
        var carouselObj = atCarouselSceneShow.CarouselOfLiao({ WidthOfCarousel: atCarouselSceneShow.width(), HeightOfCarousel: atCarouselSceneShow.height(),
            CarouselTimeout: 6666, IsAjaxMode: true, AjaxConfiguration: {
                TransferObj: null, Url: "../../json/MainCarousel.json", ClearCacheMinutes: 60,
                PropertyOfServer: {
                    SceneProperty: function (item) { return item["Photo"]; },
                    ValueProperty: function (item) { return item["Id"]; }
                }
            }
        });
        scrollPositionOfBody.otherY = $("div.MainScene").first().height() + scrollPositionOfBody.mainY;
    }
})(window, jQuery, Liao)