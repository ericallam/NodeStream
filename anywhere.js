(function() {
    var C = "twttr_anywhere",
    U = "twttr_signed_out";
    var D,
    F = 0;
    function J() {
        var b = document.getElementsByTagName("script");
        var h,
        a = {};
        for (var f = 0; (h = b[f]); f++) {
            if (h.src.indexOf("/anywhere.js?") > -1) {
                var g = h.src.split("?").pop();
                if (g.indexOf("=") > 0) {
                    var Z = g.split("&"),
                    d;
                    for (var e = 0; (d = Z[e]); e++) {
                        var c = d.split("="),
                        l = c[0],
                        k = c[1];
                        if (l == "id") {
                            a.clientID = k
                        }
                        if (l == "v") {
                            a.version = k
                        }
                    }
                } else {
                    a.clientID = g
                }
                return a
            }
        }
        return {}
    }
    function L(c, d, a) {
        var Z;
        if (a) {
            var b = new Date();
            b.setTime(b.getTime() + (a * 60 * 60 * 1000));
            Z = "; expires=" + b.toGMTString()
        } else {
            Z = ""
        }
        document.cookie = c + "=" + d + Z + "; path=/"
    }
    function R(b) {
        var f = b + "=";
        var Z;
        try {
            Z = document.cookie.split(";")
        } catch(d) {
            Z = ""
        }
        var g;
        for (var a = 0; a < Z.length; a++) {
            g = Z[a];
            while (g.charAt(0) === " ") {
                g = g.substring(1, g.length)
            }
            if (g.indexOf(f) === 0) {
                return g.substring(f.length, g.length)
            }
        }
        return null
    }
    function O(Z) {
        var a = [twttr.anywhere._assetUrl()];
        if (Z.indexOf("_dev") !== 0) {
            a = a.concat([Z])
        }
        return a.concat("javascripts/client.js").join("/")
    }
    function X() {
        var a = location.href.split("#");
        var Z = a.pop();
        if (Z.indexOf("oauth_access_token") != -1) {
            return Z.match(/oauth_access_token\=(.+)(&|$)/)[1]
        }
    }
    function K() {
        var Z;
        if ((Z = R(C))) {
            return Z
        }
    }
    function P(c) {
        var a = c._clients;
        for (var b = 0, Z = a.length; b < Z; b++) {
            a[b]._fireAuthComplete()
        }
    }
    function I(c) {
        var a = c._clients;
        for (var b = 0, Z = a.length; b < Z; b++) {
            a[b]._fireSignOut()
        }
    }
    function Q() {
        var Z = null;
        if ((Z = X())) {
            if (window.opener && window.opener.parent.twttr) {
                window.opener.parent.twttr.anywhere._setToken(Z);
                P(window.opener.parent.twttr.anywhere);
                window.close();
                if (window.self) {
                    window.self.close()
                }
                return "callback_new_window"
            } else {
                if (window.parent != window && window.parent && window.parent.twttr) {
                    window.parent.parent.twttr.anywhere._setToken(Z);
                    window.parent.parent.twttr.anywhere._removeHeadlessAuth();
                    return "headless"
                } else {
                    twttr.anywhere._setToken(Z);
                    setTimeout(function() {
                        window.top.location.hash = ""
                    },
                    100);
                    return "callback_same_window"
                }
            }
        }
        try {
            window.parent.parent.twttr.anywhere._removeHeadlessAuth()
        } catch(a) {}
        if ((Z = K())) {
            twttr.anywhere._setToken(Z);
            return "cookie"
        }
    }
    function E(a, b) {
        for (var Z in b) {
            a[Z] = b[Z]
        }
        return a
    }
    function Y(a, Z) {
        return function() {
            return Z.apply(a, arguments)
        }
    }
    var W = navigator.userAgent.toLowerCase();
    var N = (/msie/gi.test(W) && !/opera/gi.test(W));
    var H = '<iframe tabindex="-1" role="presentation" style="position:absolute;top:-9999px;" ' + (N ? "src=\"javascript:''\"": "") + " />";
    function G(Z) {
        var c = document.createElement("div");
        c.innerHTML = H;
        var a = c.firstChild,
        b = Y(a, Z);
        if (N) {
            a.attachEvent("onload", b)
        } else {
            a.addEventListener("load", b, false)
        }
        document.body.insertBefore(a, document.body.firstChild);
        return a
    }
    function V(Z, b, a) {
        if (!Z._initCallbacks) {
            Z._initCallbacks = []
        }
        Z._initCallbacks.push([b, a])
    }
    function B(e, g, d) {
        var a = d.version,
        f = d.window;
        var Z = e.contentWindow;
        var b = Z.document.createElement("script");
        var c = O(a);
        e.id = "_twttr_anywhere_client_" + a;
        V(Z, g, d);
        Z._VERSION = a;
        Z._URL = c;
        b.type = "text/javascript";
        b.src = c;
        Z.document.getElementsByTagName("head")[0].appendChild(b);
        return b
    }
    function T(Z, b) {
        if (document.body) {
            var a = twttr.anywhere._instances;
            a[Z.version] = G(function() {
                B(this, b, Z)
            })
        } else {
            setTimeout(function() {
                T(Z, b)
            },
            20)
        }
    }
    window.twttr = window.twttr || {};
    twttr.anywhere = function(a, c) {
        if (typeof a == "function") {
            c = a;
            a = twttr.anywhere._config.defaultVersion
        }
        if (!twttr.anywhere._config.clientID) {
            return alert("To set up @anywhere, please provide a client ID")
        }
        if (D == "callback" || D == "headless") {
            return
        }
        var Z;
        var b = twttr.anywhere._instances;
        if (typeof a === "string" || typeof a === "number") {
            a = {
                version: a
            }
        }
        a.version = (a.version) ? a.version.toString() : twttr.anywhere._config.defaultVersion;
        a = E({
            window: window
        },
        a);
        if ((Z = b[a.version])) {
            if (Z.contentWindow._ready) {
                Z.contentWindow._init(c, a)
            } else {
                V(Z.contentWindow, c, a)
            }
        } else {
            T(a, c)
        }
    };
    E(twttr.anywhere, {
        _instances: {},
        _clients: [],
        _config: {
            defaultVersion: "pre",
            assetHost: "platform{i}.twitter.com",
            secureAssetHost: "twitter-anywhere.s3.amazonaws.com",
            baseHost: "twitter.com",
            serverHost: "api.twitter.com",
            serverPath: "xd_receiver.html",
            oauthHost: "oauth.twitter.com",
            ignoreSSL: false
        },
        config: function(Z) {
            if (typeof Z === "string") {
                this._config.clientID = Z;
                return this._config
            }
            return E(this._config, Z || {})
        },
        signOut: function() {
            I(this);
            L(U, "true", null)
        },
        _removeToken: function() {
            this.token = null;
            L(C, "", -1)
        },
        _setToken: function(a) {
            var Z;
            this.token = a;
            if (!R(C)) {
                L(C, a, 2);
                L(U, "", -1)
            }
        },
        _removeHeadlessAuth: function() {
            if (this._headlessAuthWindow) {
                this._headlessAuthWindow.parentNode.removeChild(this._headlessAuthWindow);
                this._headlessAuthWindow = null
            }
        },
        _signedOutCookiePresent: function() {
            return R(U) == "true"
        },
        _proto: function(Z) {
            return (window.location.protocol.match(/s\:$/) || Z) && !twttr.anywhere._config.ignoreSSL ? "https": "http"
        },
        _serverUrl: function(Z) {
            return this._proto(Z) + "://" + [twttr.anywhere._config.serverHost, twttr.anywhere._config.serverPath].join("/")
        },
        _assetUrl: function(a) {
            var c = this._proto(a);
            var b = (c == "https") ? twttr.anywhere._config.secureAssetHost: twttr.anywhere._config.assetHost;
            var Z = b.replace("{i}", F++);
            if (F == 3) {
                F = 0
            }
            return c + "://" + Z
        },
        _baseUrl: function(Z) {
            return this._proto(Z) + "://" + twttr.anywhere._config.baseHost
        },
        _oauthUrl: function(Z) {
            return this._proto(Z) + "://" + twttr.anywhere._config.oauthHost + "/2"
        }
    });
    D = Q();
    var S = J();
    var M = S.clientID;
    var A = S.version;
    if (M) {
        twttr.anywhere._config.clientID = M
    }
    if (A) {
        twttr.anywhere._config.defaultVersion = A
    }
} ());