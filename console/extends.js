"use strict";

const replaceMethod = String.prototype.replace;

String.prototype.replace = function(oldstr, newstr, isAll = false) {
    isAll = typeof isAll === "boolean" ? isAll : false;
    let cur = this;
    while (cur.includes(oldstr)) {
        cur = replaceMethod.call(cur, oldstr, newstr);
        if (!isAll) break;
    }
    return cur;
};