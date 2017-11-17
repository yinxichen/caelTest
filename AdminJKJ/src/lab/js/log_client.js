!function (w) {
    function extendDeep(a, b) {
        var c,
            d = Object.prototype.toString,
            e = "[object Array]";
        b = b || {};
        for (c in a)
            a.hasOwnProperty(c) && ("object" == typeof a[c] ? (b[c] = d.call(a[c]) === e ? [] : {}, extendDeep(a[c], b[c])) : b[c] = a[c]);
        return b
    }
    function getCookie(a) {
        var b = new RegExp("(^| )" + a + "(?:=([^;]*))?(;|$)"),
            c = document.cookie.match(b);
        return c ? c[2] ? c[2] : "" : ""
    }
    function getFeatureSign() {
        var featureMap = [
            { appname: "sogou", apptest: "!!navigator.userAgent.match(/metaSr/i);" },
            { appname: "baidu", apptest: "!!navigator.userAgent.match(/bidubrowser/i);" },
            { appname: "uc", apptest: "!!navigator.userAgent.match(/ubrowser/i);" },
            { appname: "2345", apptest: "!!navigator.userAgent.match(/2345explorer/i);" },
            { appname: "maxthon", apptest: "!!navigator.userAgent.match(/maxthon/i);" },
            { appname: "liebao", apptest: "!!navigator.userAgent.match(/lbbrowser/i);" },
            { appname: "qq", apptest: "!!navigator.userAgent.match(/qqbrowser/i);" },
            { appname: "360", apptest: "!!navigator.userAgent.match(/360se/i) || (window.chrome && navigator.mediaDevices == undefined);" },
            { appname: "chrome", apptest: "!!window.chrome && !!!/opera|opr/i.test(navigator.userAgent) && !!window.chrome.runtime;" },
            { appname: "firefox", apptest: "!!navigator.userAgent.match(/firefox/i);" },
            { appname: "opera", apptest: "!!/opera|opr/i.test(navigator.userAgent);" },
            { appname: "safari", apptest: "/constructor/i.test(window.HTMLElement);" },
            { appname: "ie6", apptest: "document.all && !window.XMLHttpRequest" },
            { appname: "ie7", apptest: "document.all && window.XMLHttpRequest && !document.querySelector" },
            { appname: "ie8", apptest: "document.all && document.querySelector && !document.addEventListener" },
            { appname: "ie9", apptest: "document.all && document.addEventListener && !window.atob;" },
            { appname: "ie10", apptest: "document.all && window.atob;" },
            { appname: "ie11", apptest: "'-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;" }
        ];
        for (var key in featureMap) {
            var reslut = eval(featureMap[key].apptest);
            if (reslut)
                return featureMap[key].appname
        }
        return "other"
    }
    function getResolution() {
        return screen.width + "*" + screen.height
    }
    function getPlatform() {
        return navigator.platform
    }
    function getCurrentPageUrl() {
        return location.href
    }
    function ErrorTracker(a) {
        var b = { delay: 1e4, interval: 1e4, logUrl: "//fm.3.cn/log?", max: 5 };
        this.config = extendDeep(w.__FE_Monitor_Config || a, b),
            this.map = {}, this.errors = [],
            this.timer = null,
            this.interval = null,
            this.currentBorwser = getFeatureSign(),
            w.__FE_Monitor_Config && this.init()
    }
    ErrorTracker.prototype = {
        init: function () {
            if ("function" == typeof w.onerror)
                throw new Error("The Error event has been registed.");
            this.isTargetBrowser() && (this.bindError(), this.checkError())
        },
        bindError: function () {
            var a = this; 
            w.onerror = function (b, c, d, e, f) {
                a.onError(b, c, d, e, f)
            }
        },
        onError: function (a, b) {
            a && -1 == a.indexOf("Script error") && !this.map[a] && this.errors.length < this.config.max && this.errors.push({ message: a, filename: b })
        },
        isTargetBrowser: function () {
            var a = 0,
                b = __FE_Monitor_Config.browsers.length;
            if (!__FE_Monitor_Config.browsers.length)
                return !0; for (; b > a; a++)
                if (this.currentBorwser == __FE_Monitor_Config.browsers[a])
                    return !0;
            return !1
        },
        checkError: function () {
            var a = this;
            this.timer = setTimeout(function () { a.errors.length && a.sendError() }, this.config.delay)
        },
        serializeParams: function () {
            var a = [], b = this;
            function e(a) {
                return a.lastIndexOf("/") > -1 ? a.substr(a.lastIndexOf("/")) : a
            }
            function f(a) {
                return encodeURIComponent(a)
            }
            function g() {
                return f(document.referrer)
            }
            function h() {
                var a = getCookie("__jda");
                return a ? a.split(".").length ? a.split(".")[1] : "" : ""
            }
            function i() {
                return f(navigator.userAgent)
            }
            function j() {
                var a = h(),
                    b = getCookie("pin");
                return "uuid=" + a + "; pin=" + b
            }
            function k(a) {
                var c = [];
                for (var d in a)
                    if (a.hasOwnProperty(d)) {
                        var k = a[d];
                        "filename" === d && (k = e(a[d])),
                            c.push(d + "=" + f(k))
                    }
                return c.join("&") + "&uid=" + h() + "&sid=" + w.__FE_Monitor_Config.sid + "&useragent=" + i() + "&cookies=" + j() + "&feature=" + b.currentBorwser + "&referer=" + g() + "&resolution=" + getResolution() + "&platform=" + getPlatform() + "&uri=" + getCurrentPageUrl() + "&level=0"
            }
            if (0 == !!arguments.length)
                for (var l = 0; l < this.errors.length; l++)
                    a.push(k(this.errors[l]));
            else
                a.push("message=" + arguments[0].message + "&filename=" + arguments[0].filename + "&uid=" + h() + "&sid=" + w.__FE_Monitor_Config.sid + "&useragent=" + i() + "&cookies=" + j() + "&feature=" + b.currentBorwser + "&referer=" + g() + "&resolution=" + getResolution() + "&platform=" + getPlatform() + "&uri=" + getCurrentPageUrl() + "&level=" + arguments[1]);
            return a
        },
        sendError: function () {
            var a, b = this.config.logUrl;
            a = 2 == arguments.length ? this.serializeParams(arguments[0], arguments[1]) : this.serializeParams();
            for (var c = 0; c < a.length; c++) {
                var d = new Image; d.src = b + a[c]
            }
        },
        log: function (a) {
            this.isTargetBrowser() && this.sendError(a, 3)
        },
        info: function (a) {
            this.isTargetBrowser() && this.sendError(a, 2)
        },
        warn: function (a) {
            this.isTargetBrowser() && this.sendError(a, 1)
        },
        error: function (a) {
            this.isTargetBrowser() && this.sendError(a, 0)
        }
    },
    w.errortracker = new ErrorTracker
}(window);