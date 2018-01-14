(function (window) {

    window.LiaoComponent = function() { };

    window.LiaoComponent.prototype = {
        IsUndefinedOrNull: function (item) {
            return (typeof item === "undefined") || (typeof item === "object" && item == null);
        },
        ExtendsObj: function (currentObj, sourceObj, propertyChangeds) {
            if (this.IsUndefinedOrNull(currentObj)) {
                throw new Error("Argument of currentObj isn't a vaild type or vaild value!");
            }
            if (sourceObj === null) {
                throw new Error("Argument of sourceObj isn't a vaild value!");
            }
            if (typeof currentObj === "object" && typeof sourceObj === "object") {
                for (var property in sourceObj) {
                    if (currentObj[property] === sourceObj[property]) {
                        continue;
                    }
                    else {
                        currentObj[property] = sourceObj[property];
                        if (!this.IsUndefinedOrNull(propertyChangeds)) {
                            for (var i = 0; i < propertyChangeds.length; i++) {
                                if (!this.IsUndefinedOrNull(propertyChangeds[i])) {
                                    propertyChangeds[i](property);
                                }
                            }
                        }
                    }
                }
            }
        },
        SetBindingModel: function (sourceModel, propertyChanged) {
            if (this.IsUndefinedOrNull(sourceModel)) {
                throw new Error("Argument of sourceModel isn't a vaild value!");
            }
            var sourceType = typeof sourceModel;
            if (sourceType === "object") {
                if (sourceModel instanceof Array) {
                    for (var i = 0; i < sourceModel.length; i++) {
                        var currentSourceModel = sourceModel[i];
                        if (typeof currentSourceModel === "object" && !this.IsUndefinedOrNull(currentSourceModel)) {
                            ToViewModel(currentSourceModel);
                        }
                        else {
                            continue;
                        }
                    }
                }
                else {
                    ToViewModel(sourceModel);
                }
            }
            else {
                throw new Error("Argument of sourceModel isn't a vaild type!");
            }
            function ToViewModel(source) {
                source.SetState = function (newModelState) {
                    LiaoComponent.prototype.ExtendsObj(this, newModelState, this.PropertyChangeds);
                };

                source.Views = [];

                source.PropertyChangeds = (propertyChanged instanceof Function) ? [propertyChanged] : [];

                source.IsBinded = function () {
                    return this.PropertyChangeds.length > 0;
                };

                source.Bind = function (propertyChanged) {
                    if (propertyChanged instanceof Function) {
                        this.PropertyChangeds.push(propertyChanged);
                    }
                };

                source.Unbind = function () {
                    this.PropertyChangeds = [];
                };

                source.OnAllPropertyChanged = function () {
                    for (var i = 0; i < this.PropertyChangeds.length; i++) {
                        this.OnCurrentPropertyChanged(i);
                    }
                };

                source.OnCurrentPropertyChanged = function (index) {
                    if (this.IsBinded() && index >= 0 && this.PropertyChangeds.length > index) {
                        for (var property in this) {
                            if (property === "SetState" || property === "PropertyChangeds" || property === "IsBinded" || property === "Bind" ||
                            property === "Unbind" || property === "OnAllPropertyChanged") {
                                continue;
                            }
                            else {
                                this.PropertyChangeds[index](property);
                            }
                        }
                    }
                };
            }
        },
        SetBindingList: function (sourceList, listChanged) {
            if (LiaoComponent.prototype.IsUndefinedOrNull(sourceList)) {
                throw new Error("Argument of sourceList isn't a vaild value!");
            }
            if (!(sourceList instanceof Array)) {
                throw new Error("Argument of sourceList isn't a vaild type!");
            }

            sourceList.PushItem = function (newItem) {
                this.push(newItem);
                this.OnListChangeds(newItem, true);
            };

            sourceList.RemoveItem = function (currentItem) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] === currentItem) {
                        this.splice(i, 1);
                        this.OnListChangeds(currentItem, false);
                    }
                    else {
                        continue;
                    }
                }
            };

            sourceList.ListChangeds = (listChanged instanceof Function) ? [listChanged] : [];

            sourceList.OnListChangeds = function (operatItem, isPush) {
                for (var i = 0; i < this.ListChangeds.length; i++) {
                    this.ListChangeds[i](operatItem, i, isPush);
                }
            };

            sourceList.IsBinded = function () {
                return this.ListChangeds.length > 0;
            };

            sourceList.Bind = function (listChanged) {
                if (listChanged instanceof Function) {
                    this.ListChangeds.push(listChanged);
                }
            };

            sourceList.Unbind = function () {
                this.ListChangeds = [];
            };
        }
    };

    window.Liao = new LiaoComponent();

})(window)