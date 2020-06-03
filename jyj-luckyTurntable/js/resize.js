!function (a) {
    "use strict";
    function f() {
        c = b.documentElement.getBoundingClientRect().width,
            c >= 768 ? c = 768 : 320 >= c && (c = 320),
            window.rootFontSize = 100 * (c / a),
            b.querySelector("html").style.fontSize = window.rootFontSize + "px"
    }
    var c, e, b = document;
    b.querySelector("html"),
        f(),
        window.addEventListener("resize", function () {
            clearTimeout(e),
                e = setTimeout(f, 150)
        }, !1),
        "complete" === b.readyState ? b.body.style.fontSize = ".24rem" : b.addEventListener("DOMContentLoaded", function () { b.body.style.fontSize = ".24rem" }, !1)
}(750);