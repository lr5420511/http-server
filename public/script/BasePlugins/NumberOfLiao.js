/// <reference path="../jquery.min.js" />
/// <reference path="../jquery-ui.js" />
/// <reference path="../LiaoComponent.js" />

(function ($, Liao) {
    $.fn.NumberOfLiao = function (option) {
        var numberObj = new Object();
        numberObj.CssClass = "NumberOfLiao";
        numberObj.WidthOfValue = 300;
        numberObj.WidthOfPerValue = 10;
        numberObj.ValueType = "Int"; // or Float
        numberObj.DecimalCount = 2;
        numberObj.MinValue = 0;
        numberObj.MaxValue = 100;
        numberObj.InitValue = numberObj.MinValue;
        numberObj.ValueChanged = function (currentValue) { };
        Liao.ExtendsObj(numberObj, option);
        numberObj.RealValue = numberObj.InitValue;
        numberObj.CurrentValue = function (currentValue) {
            if (currentValue == undefined) {
                return numberObj.ValueType == "Float" ? parseFloat(numberObj.RealValue) : parseInt(numberObj.RealValue);
            }
            else {
                if (currentValue >= numberObj.MinValue && currentValue <= numberObj.MaxValue && currentValue != numberObj.RealValue) {
                    currentValue = numberObj.ValueType == "Float" ?
                    parseFloat(currentValue).toFixed(numberObj.DecimalCount) : parseInt(currentValue);
                    var vernierPositionLeft = MapValueToPositionLeft(currentValue);
                    VernierMove(vernierPositionLeft, function () {
                        BindValue(currentValue);
                    });
                }
            }
        };
        var atNumberOfLiao = $(this);
        var atDocument = $(document);
        atNumberOfLiao.addClass(numberObj.CssClass);

        atNumberOfLiao.append("<div class = \"NumberOfLiaoWrapper\"></div>");
        var atNumberOfLiaoWrapper = atNumberOfLiao.children("div.NumberOfLiaoWrapper").first();
        atNumberOfLiaoWrapper.append("<div class = \"NumberOfLiaoWrapperRoute\"></div>");
        var atNumberOfLiaoWrapperRoute = atNumberOfLiaoWrapper.children("div.NumberOfLiaoWrapperRoute").first();
        atNumberOfLiaoWrapper.append("<span class = \"NumberOfLiaoWrapperValue\"></span>");
        var atNumberOfLiaoWrapperValue = atNumberOfLiaoWrapper.children("span.NumberOfLiaoWrapperValue").first();
        atNumberOfLiaoWrapper.append("<div class = \"NumberOfLiaoWrapperVernier\"></div>");
        var atNumberOfLiaoWrapperVernier = atNumberOfLiaoWrapper.children("div.NumberOfLiaoWrapperVernier").first();

        var timeout = 222;
        var routeState = {};
        var vernierState = {};
        var positionLeftOfMaxValue = undefined;
        var positionLeftOfMinValue = undefined;
        var vernierIsMoving = false;
        var mouseToVernierLeft = undefined;
        var sizeOfValue = undefined;
        var defaultDecimalCount = 2;
        function MapPositionLeftToValue(positionLeft) {
            var currentValuePercent = (positionLeft - parseFloat(positionLeftOfMinValue)) / parseFloat(numberObj.WidthOfValue);
            var currentValue = parseFloat(currentValuePercent * sizeOfValue) + parseFloat(numberObj.MinValue);
            currentValue = numberObj.ValueType == "Float" ? parseFloat(currentValue).toFixed(numberObj.DecimalCount) : parseInt(currentValue);
            return currentValue;
        }
        function MapValueToPositionLeft(value) {
            var currentPositionPercent = parseFloat(value - numberObj.MinValue) / parseFloat(sizeOfValue);
            var currentPosition = parseFloat(currentPositionPercent * numberObj.WidthOfValue) + parseFloat(positionLeftOfMinValue);
            return currentPosition;
        }
        function BindValue(value) {
            if (value != numberObj.RealValue) {
                numberObj.RealValue = value;
                atNumberOfLiaoWrapperValue.text(numberObj.RealValue);
                numberObj.ValueChanged(numberObj.RealValue);
            }
        }
        function VernierMove(positionLeft, moved) {
            atNumberOfLiaoWrapperVernier.stop().animate({ left: positionLeft + "px" }, timeout, function () {
                vernierState.positionLeft = positionLeft;
                if (moved != undefined) {
                    moved();
                }
            });
        }
        atNumberOfLiaoWrapperRoute.bind("click", function (e) {
            var moveToPositionLeft = e.pageX - atNumberOfLiaoWrapper.offset().left + routeState.positionLeft;
            if (moveToPositionLeft >= positionLeftOfMinValue && moveToPositionLeft <= positionLeftOfMaxValue + vernierState.width) {
                moveToPositionLeft = moveToPositionLeft <= positionLeftOfMaxValue ? moveToPositionLeft : positionLeftOfMaxValue;
                if (moveToPositionLeft != vernierState.positionLeft) {
                    VernierMove(moveToPositionLeft, function () {
                        var currentValue = MapPositionLeftToValue(moveToPositionLeft);
                        if (numberObj.ValueType != "Float") {
                            VernierMove(MapValueToPositionLeft(currentValue), function () {
                                BindValue(currentValue);
                            });
                        }
                        else {
                            BindValue(currentValue);
                        }
                    });
                }
            }
        });
        atNumberOfLiaoWrapperVernier.bind("mousedown", function (e) {
            vernierIsMoving = true;
            mouseToVernierLeft = e.pageX - atNumberOfLiaoWrapperVernier.offset().left;
        });
        atDocument.bind("mousemove", function (e) {
            if (vernierIsMoving) {
                var vernierPositionLeft = e.pageX - mouseToVernierLeft - atNumberOfLiaoWrapper.offset().left + routeState.positionLeft;
                vernierPositionLeft = vernierPositionLeft < positionLeftOfMinValue ? positionLeftOfMinValue : vernierPositionLeft;
                vernierPositionLeft = vernierPositionLeft > positionLeftOfMaxValue ? positionLeftOfMaxValue : vernierPositionLeft;
                if (vernierPositionLeft != vernierState.positionLeft) {
                    atNumberOfLiaoWrapperVernier.css({ left: vernierPositionLeft + "px" });
                    vernierState.positionLeft = vernierPositionLeft;
                    var currentValue = MapPositionLeftToValue(vernierPositionLeft);
                    BindValue(currentValue);
                }
            }
        });
        atDocument.bind("mouseup", function () {
            vernierIsMoving = false;
            if (numberObj.ValueType != "Float") {
                VernierMove(MapValueToPositionLeft(numberObj.RealValue));
            }
        });
        atNumberOfLiao.bind("load", function () {
            if (numberObj.MaxValue < numberObj.MinValue) {
                var tempValue = numberObj.MaxValue;
                numberObj.MaxValue = numberObj.MinValue;
                numberObj.MinValue = tempValue;
            }
            if (numberObj.InitValue < numberObj.MinValue || numberObj.InitValue > numberObj.MaxValue) {
                numberObj.InitValue = numberObj.MinValue;
                numberObj.RealValue = numberObj.InitValue;
            }
            numberObj.DecimalCount = numberObj.DecimalCount <= 0 ? defaultDecimalCount : numberObj.DecimalCount;
            if (numberObj.ValueType == "Float") {
                numberObj.MinValue = parseFloat(numberObj.MinValue).toFixed(numberObj.DecimalCount);
                numberObj.MaxValue = parseFloat(numberObj.MaxValue).toFixed(numberObj.DecimalCount);
                numberObj.InitValue = parseFloat(numberObj.InitValue).toFixed(numberObj.DecimalCount);
                numberObj.RealValue = parseFloat(numberObj.RealValue).toFixed(numberObj.DecimalCount);
            }
            else {
                numberObj.MinValue = parseInt(numberObj.MinValue);
                numberObj.MaxValue = parseInt(numberObj.MaxValue);
                numberObj.InitValue = parseInt(numberObj.InitValue);
                numberObj.RealValue = parseInt(numberObj.RealValue);
            }
            sizeOfValue = numberObj.MaxValue - numberObj.MinValue;
            var maxValueLength = numberObj.MaxValue.toString().length;
            var minValueLength = numberObj.MinValue.toString().length;
            var maxLengthOfValue = maxValueLength > minValueLength ? maxValueLength : minValueLength;
            $.extend(routeState, {
                widthOfLeftBorder: parseFloat(atNumberOfLiaoWrapperRoute.css("border-left-width")),
                widthOfRightBorder: parseFloat(atNumberOfLiaoWrapperRoute.css("border-right-width"))
            });
            var vernierWidth = parseFloat(atNumberOfLiaoWrapperVernier.css("width"));
            var valueWidth = maxLengthOfValue * numberObj.WidthOfPerValue;
            var numberWidth = numberObj.WidthOfValue + vernierWidth + routeState.widthOfLeftBorder
            + routeState.widthOfRightBorder + valueWidth;
            atNumberOfLiao.css({ width: numberWidth + "px" });
            atNumberOfLiaoWrapper.css({ width: numberWidth + "px" });
            atNumberOfLiaoWrapperRoute.css({ width: numberObj.WidthOfValue + vernierWidth + "px" });
            atNumberOfLiaoWrapperValue.css({ width: valueWidth + "px" });
            routeState.positionLeft = atNumberOfLiaoWrapperRoute.position().left;
            positionLeftOfMinValue = routeState.positionLeft + routeState.widthOfLeftBorder;
            positionLeftOfMaxValue = routeState.positionLeft + routeState.widthOfLeftBorder + parseFloat(numberObj.WidthOfValue);
            atNumberOfLiaoWrapperValue.text(numberObj.InitValue);
            var initPositionLeftOfVernier = MapValueToPositionLeft(numberObj.InitValue);
            atNumberOfLiaoWrapperVernier.css({ left: initPositionLeftOfVernier + "px" });
            $.extend(vernierState, {
                positionLeft: initPositionLeftOfVernier,
                width: vernierWidth
            });
        });
        atNumberOfLiao.load();
        return numberObj;
    }
})(jQuery, Liao)