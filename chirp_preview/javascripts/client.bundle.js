window.twttr = window.twttr || {};
function replaceParams(B, A) {
    if (A) {
        for (var C in A) {
            B = B.replace(new RegExp("\\%\\{" + C + "\\}", "gi"), A[C])
        }
    }
    return B
}
function _(C, A) {
    if (twttr.i18n) {
        var B = twttr.i18n[C];
        if (B) {
            C = B
        }
    }
    return replaceParams(C, A)
}
twttr.augmentObject = function(B, C) {
    for (var A in C) {
        B[A] = C[A]
    }
    return B
};
twttr.statics = function(A) {
    return twttr.augmentObject(this, A)
};
twttr.augmentObject(twttr, {
    namespaceOf: function(A) {
        return twttr.is.object(A) ? A: window
    },
    util: {
        linkify: {
            _link: function(A) {
                return A.replace(/\b(((https*\:\/\/)|www\.).+?)(([!?,.\)]+)?(\s|$))/g,
                function(G, F, D, C, B) {
                    var E = D.match(/w/) ? "http://": "";
                    return '<a class="twitter-hyperlink" target="_blank" href="' + E + F + '">' + ((F.length > 25) ? F.substr(0, 24) + "...": F) + "</a>" + B
                })
            },
            _at: function(A) {
                return A.replace(/\B\@([a-zA-Z0-9_]{1,20})/g,
                function(B, C) {
                    return '@<a target="_blank" class="twitter-atreply" href="http://twitter.com/' + C + '">' + C + "</a>"
                })
            },
            _list: function(A) {
                return A.replace(/\B\@([a-zA-Z0-9_]{1,20}\/\w+)/g,
                function(B, C) {
                    return '@<a target="_blank" class="twitter-listname" href="http://twitter.com/' + C + '">' + C + "</a>"
                })
            },
            _hash: function(A) {
                return A.replace(/\B\#(\w+)/gi,
                function(B, C) {
                    return '<a target="_blank" class="twitter-hashtag" href="http://twitter.com/search?q=%23' + C + '">#' + C + "</a>"
                })
            },
            clean: function(A) {
                return this._hash(this._at(this._list(this._link(A))))
            }
        }
    },
    merge: function() {
        var C = arguments;
        var F = arguments[arguments.length - 1];
        var B = false;
        if (twttr.is.nil(C[0]) || !twttr.is.def(C[0])) {
            if (C.length < 2) {
                return {}
            } [].shift.call(C);
            return this.merge.apply(this, C)
        }
        if (twttr.is.bool(F)) {
            B = F; [].pop.call(C)
        }
        for (var E = 0, A = C.length - 1; E < A; E++) {
            for (var D in C[E + 1]) {
                if (B && C[0][D] && twttr.is.object(C[0][D]) && !twttr.is.fn(C[0][D]) && twttr.is.object(C[E + 1][D]) && !twttr.is.fn(C[E + 1][D]) && !twttr.is.element(C[0][D]) && !twttr.is.element(C[E + 1][D])) {
                    this.merge(C[0][D], C[E + 1][D], B)
                } else {
                    if (twttr.is.object(C[E + 1][D]) && !twttr.is.fn(C[E + 1][D]) && !twttr.is.element(C[E + 1][D])) {
                        C[0][D] = this.merge({},
                        C[E + 1][D], B)
                    } else {
                        C[0][D] = C[E + 1][D]
                    }
                }
            }
        }
        return C[0]
    },
    extend: function(B, C) {
        var A = function() {};
        A.prototype = C.prototype;
        B.prototype = new A();
        B.prototype.constructor = B;
        B.uber = C.prototype;
        if (C.prototype.constructor == Object.prototype.constructor) {
            C.prototype.constructor = C
        }
    },
    method: function(A, B) {
        this.prototype[A] = B;
        return this
    },
    methods: function(B) {
        if(B.data) { debugger }
        for (var A in B) {
          if(B.data) { debugger }
            this.prototype[A] = B[A]
        }
        if(B.data) { debugger }
        return this
    },
    _uberWrapper: function(B, A) {
        return function() {
            return B.apply(A, arguments)
        }
    },
    klass: function(B, C) {
        var D = twttr.magic(B, C);
        D.method = twttr.method;
        D.methods = twttr.methods;
        D.statics = twttr.statics;
        D._name = B;
        var A;
        D.superclass = function(E) {
            twttr.extend(D, E);
            A = function() {
                D.uber.constructor.apply(this, arguments);
                C.apply(this, arguments);
                var F = this;
                this.uber = (function() {
                    var H = twttr.merge({},
                    F.constructor.uber);
                    for (var G in H) {
                        H[G] = twttr._uberWrapper(F.constructor.uber[G], F)
                    }
                    return H
                })()
            };
            twttr.merge(A, D);
            A.prototype.klass = A.prototype.constructor = A;
            A.prototype.superclass = D.uber.constructor;
            twttr.augmentString(B, A, true);
            return A
        };
        return D
    },
    augmentAndExtend: function(B, C, D) {
        var A = twttr.namespaceOf(B);
        A[C] = function() {
            A[C].uber.constructor.apply(this, arguments)
        };
        twttr.extend(A[C], D);
        return A[C]
    },
    auxo: function(C, D, B) {
        var A = twttr.is.object(B) ? B: twttr;
        return twttr.augmentAndExtend(A, C, D)
    },
    augmentString: function(G, E, C) {
        var F = window;
        var D = G.split(".");
        for (var B = 0, A = D.length; B < A; ++B) {
            if (C) {
                F = twttr.is.def(D[B + 1]) ? (F[D[B]] || {}) : (F[D[B]] = E)
            } else {
                F = F[D[B]] = F[D[B]] || (twttr.is.def(D[B + 1]) ? {}: E)
            }
        }
        return F
    },
    magic: function(B, A) {
        if (twttr.is.string(B)) {
            return twttr.augmentString(B, A)
        } else {
            return twttr.augmentObject(B, A)
        }
    },
    bind: function(B, A) {
        return function() {
            return A.apply(B, arguments)
        }
    },
    is: {
        element: function(A) {
            return this.def(A.nodeType) || (A.document && A.document.nodeType)
        },
        bool: function(A) {
            return typeof A === "boolean"
        },
        nil: function(A) {
            return A === null
        },
        def: function(A) {
            return ! (typeof A === "undefined")
        },
        number: function(A) {
            return typeof A === "number" && isFinite(A)
        },
        fn: function(A) {
            return typeof A === "function"
        },
        array: function(A) {
            return A ? this.number(A.length) && this.fn(A.splice) : false
        },
        string: function(A) {
            return typeof A === "string"
        },
        blank: function(A) {
            return A === ""
        },
        falsy: function(A) {
            return A === false || A === null || A === undefined
        },
        object: function(A) {
            return (A && (typeof A === "object" || this.fn(A))) || false
        }
    },
    templates: {},
    timeouts: {},
    wait: (function() {
        var A = {};
        twttr.clearWait = function(B) {
            if (twttr.is.def(A[B])) {
                clearTimeout(B);
                delete A[B]
            }
        };
        return function(E, C) {
            var B = "TIMER_" + (new Date()).getTime();
            var D = setTimeout(function() {
                if (!twttr.is.def(A[B])) {
                    return
                }
                E()
            },
            C);
            A[B] = D;
            return B
        }
    } ()),
    loadTemplate: function(A, B) {
        if (twttr.templates[A]) {
            return twttr.templates[A]
        }
        B = B ||
        function() {};
        $.get("/mustaches/anywhere/" + A + ".html", null,
        function(D) {
            var C = {
                templates: {}
            };
            C.templates[A] = D;
            twttr.merge(twttr, C, true);
            B(twttr.templates)
        },
        "html")
    },
    loadTemplates: function(C, E) {
        E = E ||
        function() {};
        for (var B = 0, A = C.length; B < A; ++B) {
            var D = C[B];
            twttr.loadTemplate(D,
            function(G) {
                var I = true;
                for (var H = 0, F = C.length; H < F; ++H) {
                    if (!twttr.is.def(G[C[H]])) {
                        I = false;
                        break
                    }
                }
                if (I) {
                    E(twttr.templates)
                }
            })
        }
    }
});
twttr.klass("twttr.Validator",
function(A, C, B) {
    this.$field = $(A);
    this.value = this.$field.val();
    if (twttr.is.string(this.value)) {
        this.value = jQuery.trim(this.value)
    }
    this.fieldName = "";
    if (twttr.is.object(C)) {
        B = C
    } else {
        this.fieldName = C
    }
    this.valid = B.valid;
    this.invalid = B.invalid
}).methods({
    is: function() {
        var A = null;
        var B = this;
        $.each(arguments,
        function(D, C) {
            if (!C._decorated) {
                C = C()
            }
            if (!C(B.value)) {
                A = C;
                return false
            }
        });
        if (A) {
            this.invalid(this.$field, this.fieldName, A.errorMessage)
        } else {
            this.valid(this.$field, this.fieldName)
        }
    }
});
twttr.validate = function(B, A) {
    function C(D, F, E) {
        return new twttr.Validator(D, F, E)
    }
    twttr.augmentObject(C, B);
    return A(C)
}; (function() {
    twttr.EventProvider = {
        events: null,
        _createEvent: function(A) {
            if (!this.events) {
                this.events = {}
            }
            if (!this.events[A]) {
                this.events[A] = new $.Event(A)
            }
        },
        trigger: function() {
            this._createEvent(arguments[0]);
            var A = $(this);
            A.trigger.apply(A, arguments)
        },
        bind: function() {
            this._createEvent(arguments[0]);
            var A = $(this);
            A.bind.apply(A, arguments)
        },
        one: function() {
            this._createEvent(arguments[0]);
            var A = $(this);
            A.one.apply(A, arguments)
        },
        unbind: function() {
            var A = $(this);
            A.unbind.apply(A, arguments)
        }
    }
} ());
if (!this.JSON) {
    this.JSON = {}
} (function() {
    function f(n) {
        return n < 10 ? "0" + n: n
    }
    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function(key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z": null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
            return this.valueOf()
        }
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    },
    rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable,
        function(a) {
            var c = meta[a];
            return typeof c === "string" ? c: "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice( - 4)
        }) + '"': '"' + string + '"'
    }
    function str(key, holder) {
        var i,
        k,
        v,
        length,
        mind = gap,
        partial,
        value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key)
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value)
        }
        switch (typeof value) {
        case "string":
            return quote(value);
        case "number":
            return isFinite(value) ? String(value) : "null";
        case "boolean":
        case "null":
            return String(value);
        case "object":
            if (!value) {
                return "null"
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === "[object Array]") {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null"
                }
                v = partial.length === 0 ? "[]": gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]": "[" + partial.join(",") + "]";
                gap = mind;
                return v
            }
            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === "string") {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": ": ":") + v)
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": ": ":") + v)
                        }
                    }
                }
            }
            v = partial.length === 0 ? "{}": gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}": "{" + partial.join(",") + "}";
            gap = mind;
            return v
        }
    }
    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " "
                }
            } else {
                if (typeof space === "string") {
                    indent = space
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify")
            }
            return str("", {
                "": value
            })
        }
    }
    if (typeof JSON.parse !== "function") {
        JSON.parse = function(text, reviver) {
            var j;
            function walk(holder, key) {
                var k,
                v,
                value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v
                            } else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx,
                function(a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice( - 4)
                })
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({
                    "": j
                },
                "") : j
            }
            throw new SyntaxError("JSON.parse")
        }
    }
} ());
if (!window.twttr) {
    window.twttr = {}
}
twttr.augmentString("twttr.messaging", {
    setup: function(D, C) {
        twttr.messaging.MESSAGING_TARGET_DOMAIN = D;
        twttr.messaging.MESSAGE_POLLS_PER_SECOND = 20;
        var B = 1;
        var A = window.postMessage && !(jQuery.browser.msie && jQuery.browser.version < 8);
        if (A) {
            this.transport = "postMessage"
        } else {
            if ($.browser.msie) {
                this.transport = "name"
            } else {
                this.transport = "hash"
            }
        }
        twttr.postMessage = function(E, F) {
            E = twttr.messaging.encode(E);
            switch (twttr.messaging.transport) {
            case "postMessage":
                F.postMessage(E, twttr.messaging.MESSAGING_TARGET_DOMAIN);
                break;
            case "name":
                F.name = (new Date()).getTime() + (B++) + "^" + document.domain + "&" + window.escape(E);
                break;
            case "hash":
                var G = F.location;
                F.location = G.replace(/#.*$/, "") + "#" + (new Date()).getTime() + (B++) + "^" + document.domain + "&" + window.escape(E);
                break
            }
        };
        twttr._messageHandler = function(F) {
            var E = twttr.messaging.decode(F.data);
            C(E)
        };
        twttr._messagePoll = function(E, I) {
            var G = "";
            function F(J) {
                var K = J.split("^").pop().split("&");
                return {
                    domain: K[0],
                    data: window.unescape(K[1])
                }
            }
            function H() {
                var J = E[I];
                if (J != G) {
                    G = J;
                    twttr._messageHandler(F(J))
                }
            }
            setInterval(H, 1000 / twttr.messaging.MESSAGE_POLLS_PER_SECOND)
        };
        if (A) {
            if (window.attachEvent) {
                window.attachEvent("onmessage", twttr._messageHandler)
            } else {
                window.addEventListener("message", twttr._messageHandler, false)
            }
        } else {
            if ($.browser.msie) {
                twttr._messagePoll(window, "name")
            } else {
                twttr._messagePoll(window.location, "hash")
            }
        }
    },
    encode: function(A) {
        return JSON.stringify(A)
    },
    decode: function(A) {
        return JSON.parse(A)
    }
}); (function() {
    var D,
    E,
    K,
    C;
    var A = 0,
    H = {},
    F = [],
    L = {};
    function G() {
        if (!C) {
            C = F.shift();
            if (C) {
                twttr.postMessage(C, D)
            }
        }
    }
    function J(N) {
        if (twttr.messaging.transport != "postMessage") {
            F.push(N);
            G()
        } else {
            twttr.postMessage(N, D)
        }
    }
    function B(P) {
        var O = P.event;
        var Q = P.data;
        var N;
        if ((N = L[O])) {
            $.each(N,
            function(R, S) {
                S(Q)
            })
        }
    }
    function I(N) {
        if (N.status == 401) {
            B({
                event: "authRequired",
                data: N.originalMessage
            })
        }
    }
    function M(N) {
        if (N.ready && !K.executed) {
            J({
                ready: true,
                uuid: 999
            });
            K.executed = true;
            K();
            return
        }
        if (twttr.messaging.transport != "postMessage") {
            C = null;
            G()
        }
        var O;
        if (typeof N.uuid != "undefined" && (O = H[N.uuid])) {
            if (N.data.error) {
                I(N.data);
                if (O.error) {
                    O.error(N.data)
                }
            } else {
                if (O.success) {
                    O.success(N.data)
                }
                delete H[N.uuid];
                H[N.uuid] = null
            }
        }
    }
    twttr.augmentString("twttr.anywhere.remote", {
        init: function(N, O) {
            D = N.contentWindow;
            K = O;
            twttr.messaging.setup("*", M)
        },
        bind: function(O, N) {
            if (!L[O]) {
                L[O] = []
            }
            L[O].push(N);
            return N
        },
        call: function(R, O, N) {
            var P,
            Q;
            if (typeof N == "number") {
                Q = N
            } else {
                if (typeof N == "function") {
                    P = {
                        success: N
                    }
                } else {
                    P = N
                }
            }
            if (typeof Q == "undefined") {
                Q = A++;
                H[Q] = P
            }
            J({
                uuid: Q,
                method: R,
                args: O,
                token: parent.twttr.anywhere.token
            })
        },
        createClient: function(N, O) {
            twttr.IFrame.create({
                content: N
            },
            function() {
                twttr.anywhere.remote.init(this.node,
                function() {
                    O()
                })
            })
        }
    })
} ()); (function() {
    twttr.IFrame = (function() {
        var C = "<!DOCTYPE html><html><head>",
        A = "</head><body>",
        E = "</body></html>";
        var D = function(I, J) {
            for (var H in J) {
                I[H] = J[H]
            }
            return I
        };
        var G = function(H) {
            return jQuery.map(H || [],
            function(J, I) {
                return '<link rel="stylesheet" href="' + J + '" type="text/css">'
            }).join("")
        };
        var B = function(H) {
            return jQuery.map(H || [],
            function(J, I) {
                return '<script type="text/javascript" src="' + J + '"><\/script>'
            }).join("")
        };
        var F = function(P) {
            var H = P.window.document,
            O = $('<iframe allowtransparency="true" frameborder="0" tabindex="-1" role="presentation" scrolling="no"/>', H),
            K = O[0],
            J = P.complete,
            N = P.content,
            M = $.browser;
            if (P.css) {
                O.css(P.css)
            }
            this.node = K;
            var I = function() {
                this.window = this.contentWindow = K.contentWindow;
                this.$node = O;
                var R = D(function(S) {
                    return $(S, K.contentWindow.document)
                },
                $);
                this.jQuery = R;
                try {
                    if (!this.window.jQuery) {
                        this.window.jQuery = R;
                        this.window.$ = R
                    }
                } catch(Q) {}
                J.call(this, this)
            };
            if (twttr.is.string(N)) {
                if (J) {
                    O.bind("load", twttr.bind(this,
                    function() {
                        O.unbind("load");
                        I.call(this)
                    }))
                }
                K.src = N
            } else {
                if (M.mozilla || M.msie) {
                    K.src = "javascript:" + (new Date()).getTime() + ";'';"
                }
                O.bind("load", twttr.bind(this,
                function(T) {
                    O.unbind("load");
                    var S = K.contentWindow.document,
                    Q = C + G(N.css) + (N.styles ? ('<base href="' + twttr.anywhere.assetPath() + '/stylesheets/"><style type="text/css">' + N.styles + "</style>") : "") + B(N.js) + A + (N.body || "") + '<script type="text/javascript" defer="defer">if(window.fnComplete){window.fnComplete()};<\/script>' + E;
                    S.open();
                    var R = this;
                    K.contentWindow.fnComplete = function() {
                        I.call(R)
                    };
                    S.write(Q);
                    S.close()
                }))
            }
            var L = P.parentNode;
            if (typeof P.parentNode == "string") {
                L = $(P.parentNode, H)
            } else {
                L = P.parentNode
            }
            O.appendTo(L || H.body)
        };
        return {
            create: function(H, I) {
                H = D({
                    window: window,
                    complete: I
                },
                H);
                return (new F(H)).node
            }
        }
    } ())
} ()); (function() {
    var A = {
        A: 1,
        SCRIPT: 1,
        NOSCRIPT: 1,
        OBJECT: 1,
        IFRAME: 1,
        TEXTAREA: 1,
        INPUT: 1,
        SELECT: 1,
        BUTTON: 1,
        STYLE: 1,
        PRE: 1,
        TITLE: 1
    };
    twttr.anywhere.constants = {
        matchers: {
            screen_name: /\B@([a-zA-Z0-9_]{1,20})\b/g,
            single_name: /\B@([a-zA-Z0-9_]{1,20})\b/
        }
    };
    var B = twttr.anywhere.constants.matchers.screen_name;
    var C = 0;
    twttr.anywhere.linkify = function(H, F) {
        var I = H.window,
        D = H.selector,
        J = I.document.createElement("div"),
        G = F.className || "twitter-anywhere-user";
        function E(N) {
            var L = $.makeArray(N.childNodes);
            $.each(L,
            function(P, Q) {
                E(Q)
            });
            if (N.nodeType == 3 && !A[N.parentNode.tagName]) {
                if (!N.nodeValue.match(B)) {
                    return
                }
                var K = N.nodeValue.replace(B, "@<a class='" + G + "' href='" + window.parent.twttr.anywhere._baseUrl() + "/$1'>$1</a>");
                J.innerHTML = K;
                var O = N.parentNode;
                var M = J.lastChild;
                O.replaceChild(M, N);
                while (J.firstChild) {
                    O.insertBefore(J.firstChild, M)
                }
            }
        }
        $(D, I.document).each(function(K, L) {
            E(L)
        })
    };
    twttr.anywhere.requireConnect = function(E, D) {
        E = E ||
        function() {};
        if (window.parent.twttr.anywhere.token) {
            twttr.anywhere.api.models.User.current(function(F) {
                D.currentUser = F;
                E(F)
            });
            return true
        } else {
            D.one("authComplete",
            function() {
                E()
            });
            twttr.anywhere.authWindow();
            return false
        }
    };
    twttr.anywhere.authWindow = function() {
        var I = {
            oauth_callback_url: window.top.location.href.split("#").shift(),
            oauth_mode: "flow_web_client",
            oauth_client_identifier: window.parent.twttr.anywhere._config.clientID
        };
        var D = window.parent.twttr.anywhere._oauthUrl(true) + "/authorize?" + $.param(I);
        var E,
        L;
        E = L = 500;
        var H = screen.height;
        var G = screen.width;
        var F = Math.round((G / 2) - (E / 2));
        var K = 0;
        if (H > L) {
            K = Math.round((H / 2) - (L / 2))
        }
        var J = false;
        J = window.open(D, "twitter_anywhere_auth", "left=" + F + ",top=" + K + ",width=" + E + ",height=" + L + ",personalbar=no,toolbar=no,resizable=no,scrollbars=yes");
        if (!J) {
            window.top.location.href = D
        }
    }
} ());
window.twttr = window.twttr || {};
window.twttr.stylesheets = {};
twttr.stylesheets["tweet_box_base.css"] = "* {\n  margin: 0;\n  padding: 0;\n}\n\n#tweet-box-container label {\n  float: left;\n  color:#333333;\n  font-family:'Helvetica Neue','Helvetica','Arial',sans-serif;\n  font-size:20px;\n  font-weight:normal;\n  line-height:1.1;\n  margin: 3px 45px 5px 0;\n}\n\n#tweeting-controls {\n  text-align: right;\n  /* 1px right margin prevents the button from triggering a scroll on\n  the parent iframe when it is focused */\n  margin: 8px 1px 1px 0;\n}\n\n#tweet-box-header {\n  zoom:1;\n}\n\n#tweet-box-header:after {\n  content: \".\";\n  display: block;\n  height: 0;\n  clear: both;\n  visibility: hidden;\n}\n\n#tweeting-controls a {\n  line-height: 13px;\n}\n\n#counter {\n  float: right;\n  font-family: 'Helvetica Neue','Helvetica','Arial',sans-serif;\n  background: none repeat scroll 0 0 transparent;\n  color: #ccc;\n  font-size: 24px;\n  font-weight: 500;\n}\n\n#counter.warning {\n  color: #5C0002;\n}\n\n#counter.danger {\n  color: #D40D12;\n}\n\n.loading #counter {\n  display: none;\n}\n\n#spinner {\n  width: 14px;\n  height: 14px;\n  margin: 5px 0;\n  background: url(../images/spinner.gif) no-repeat;\n  display: none;\n  float: right;\n}\n\n.loading #spinner {\n  display: block;\n}\n\n\n.btn {\n  background: #ddd url(../images/bg-btn.gif) repeat-x scroll 0 0;\n  cursor: pointer;\n  border-color: #ddd #ddd #ccc;\n  border-style: solid;\n  border-width: 1px;\n  padding: 0 8px;\n  display: inline-block;\n  -moz-border-radius: 4px;\n  -webkit-border-radius: 4px;\n  border-radius: 4px;\n}\n\n.btn button {\n  overflow: visible;\n  padding: 0;\n  margin: 0;\n  border: none;\n  background: transparent;\n  text-shadow: 1px 1px 0 #fff;\n  color: #333;\n  font-size: 11px;\n  font-family: \"lucida grande\", helvetica, tahoma, arial;\n}\n\n.btn-hover,\n.btn-focus {\n  border-color: #999 #999 #888 !important;\n  color: #000;\n}\n\n.btn-focus button {\n  outline: none;\n  -moz-outline-style: none;\n}\n\n.btn-active {\n  background-image: none;\n  outline: none;\n}\n\n:focus {\n  -moz-outline-style: none;\n}\n\n.btn-m {\n  padding: 2px 15px 3px;\n  -moz-border-radius: 5px;\n  -webkit-border-radius: 5px;\n  border-radius: 5px;\n  background-position: 0 -200px;\n}\n\n.btn-m button {\n  font-size: 15px;\n  font-family: \"helvetica neue\", arial, sans-serif;\n}\n\n.btn-disabled {\n  opacity: 0.6;\n  filter: alpha(opacity=60);\n  background-image: none;\n}";
twttr.stylesheets["bubble.css"] = ".twitter-bubble {\n  position: absolute;\n  top: 0;\n  left: 0;\n  overflow: hidden;\n  z-index: 99999;\n}\n\n.twitter-bubble-content {\n  margin: 10px 0 11px 0;\n  border: 4px solid #ddd;\n  border-width: 5px 4px 4px 4px;\n  border-radius: 5px;\n  -moz-border-radius: 5px;\n  -webkit-border-radius: 5px;\n  background: #fff;\n  overflow: hidden;\n  -moz-box-shadow: #aaa 0 1px 0;\n  -webkit-box-shadow: #aaa 0 1px 0;\n}\n\n.twitter-bubble-divot {\n/*  left: 24px;*/\n  left: 16px;\n  width: 27px;\n  height: 15px;\n  background-repeat: no-repeat;\n}\n\n.twitter-bubble-divot-bottom {\n  position: absolute;\n  bottom: 0px;\n  background-image: url(../images/divvy.png);\n}\n\n/*\n  TO DO: Opera will likely need the alternate divot as well, should\n  we decide to support Opera.\n*/\n.ie .twitter-bubble-divot-bottom,\n.ff3 .twitter-bubble-divot-bottom {\n  background-image: url(../images/divvy.gif);\n}\n\n.twitter-bubble-divot-top {\n  position: absolute;\n  top: 0px;\n  background-image: url(../images/divvy-up.gif);\n}";
twttr.stylesheets["tweet_box_simple.css"] = "\n#tweet-box {\n  border-radius: 3px;\n  -moz-border-radius: 3px;\n  -webkit-border-radius: 3px;\n  border: 1px solid #AAA;\n  padding: 4px;\n  font-size: 14px;\n  font-family: 'Lucida Grande', sans-serif;\n  overflow: auto;\n}\n\n#link-shortening-button {\n  display: none;\n}";
twttr.stylesheets["follow_button.css"] = "body {\n  /* Prevent the button from being wrapped by the parent iframe  */\n  width: 500px;\n}\n\na {\n\tcolor: #196698;\n\tfont-weight: normal;\n\ttext-decoration: none;\n}\n\na:hover {\n\ttext-decoration: underline;\n}\n\n\n\n/* Basic structure */\n\n.twitter-follow-btn {\n  font: 12px Arial, sans-serif;\n  display: inline-block;\n  white-space: nowrap;\n  -moz-border-radius: 4px;\n  -webkit-border-radius: 4px;\n  -border-radius: 4px;\n  min-height: 22px;\n  *height: 22px;\n  line-height: 22px;\n}\n\n\n/* Default and in-progress states */\n\n.twitter-follow-btn-default,\n.twitter-follow-btn-inprog {\n  background: #1D6B9C url(../images/gradient-background.png) repeat-x;\n  border: 1px solid #18566A;\n  padding: 0 7px 0 2px;\n}\n\n.twitter-follow-btn-default i,\n.twitter-follow-btn-inprog i {\n  float: left;\n  height: 22px;\n  width: 23px;\n  border-right: 1px solid #73AFD5;\n}\n\n.twitter-follow-btn-default i b {\n  display: block;\n  background: url(../images/t_170px.png) no-repeat 3px 3px;\n  height: 22px;\n  width: 22px;\n  border-right: 1px solid #094B60;\n}\n\n.twitter-follow-btn-default button,\n.twitter-follow-btn-inprog button {\n  *display: inline-block;\n  *height: 22px;\n  *vertical-align: middle;\n  font: 12px Arial, sans-serif;\n  text-shadow: 0 -1px 0 #18566A;\n  padding: 0 0 0 4px;\n  overflow: visible;\n  border: 0;\n  background: transparent;\n  color: #fff;\n}\n\n.twitter-follow-btn-default:hover {\n  border: 1px solid #00242C;\n  background-position: left -23px;\n}\n\n.twitter-follow-btn-default:active {\n  border: 1px solid #044D77;\n  background-position: left -46px;\n  color: rgba(255,255,255,0.8);\n}\n\n\n.twitter-follow-btn-inprog i b {\n  background: url(../images/spinner.gif) no-repeat 3px 3px;\n  display: block;\n  height: 22px;\n  width: 22px;\n  border-right: 1px solid #094B60;\n}\n\n\n/* Initializing (placeholder) */\n\n.twitter-follow-btn-init {\n\tcolor: #fff;\n\tbackground: #eee;\n\tborder: 1px solid #ccc;\n\tcolor: #333;\n\ttext-shadow: 0 1px 0 #fff;\n  padding: 0 0 0 8px;\n  width: 152px;\n}\n\n.twitter-follow-btn-init span {\n  background: url(../images/spinner.gif) no-repeat 0 center;\n  padding-left: 20px;\n}\n\n\n/* Following and Pending */\n\n.twitter-follow-btn-following,\n.twitter-follow-btn-pending {\n  display: none;\n\tcolor: #fff;\n\tbackground: #eee;\n\tborder: 1px solid #ccc;\n\tcolor: #333;\n\ttext-shadow: 0 1px 0 #fff;\n  padding: 0 8px;\n}\n\n.twitter-follow-btn-following span,\n.twitter-follow-btn-pending span {\n  background: url(../images/t_170px.png) no-repeat 0 center;\n  padding-left: 20px;\n}\n\n\n/* Error */\n\n.twitter-follow-btn-alert {\n  display: none;\n\tcolor: #fff;\n\tbackground: #eee;\n\tborder: 1px solid #ccc;\n\tcolor: #333;\n\ttext-shadow: 0 1px 0 #fff;\n  padding: 0 8px;\n}\n\n.twitter-follow-btn-alert span {\n  background: url(../images/alert.png) no-repeat 0 center;\n  padding-left: 20px;\n}";
twttr.stylesheets["hovercards.css"] = '* {\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  font-family: "lucida grande", "Helvetica Neue", Helvetica, Arial, sans-serif;\n  color: #333;\n  font-size: 11px;\n}\n\n.twitter-bubble-wrapper {\n/*  display: inline-block;*/\n  position: absolute;\n}\n\na {\n  cursor: pointer;\n  color: #2276bb;\n  text-decoration: none;\n}\n\na img {\n  border: 0;\n}\n\n#follow-frame {\n  width: 282px;\n  height: 39px;\n}\n\n.bd .loading-inline-spinner img {\n  display: block;\n  width: 14px;\n  height: 14px;\n  margin: 17px auto;\n}\n\n.loading-msg {\n  background: url(../images/spinner.gif) no-repeat left center;\n  padding: 5px 20px 5px 20px;\n  margin: 0 10px;\n  width: 50px;\n}\n\n.user-dne {\n  display: inline-block;\n  padding: 5px;\n  width: 165px;\n}\n\n.hovercard-inner .bd {\n  padding: 10px;\n  overflow: hidden;\n}\n\n.hovercard-inner a:visited {\n  color: #2276bb;\n}\n\n.hovercard-inner p.location {\n  height: 16px;\n}\n\n.hovercard-inner .avatar,\n.loading-inline-graphic {\n  float: left;\n  display: block;\n  width: 48px;\n  height: 48px;\n}\n\n.loading-inline-graphic {\n  background-repeat: none;\n  background-position: 0 0;\n  background-color: transparent;\n}\n\n.hovercard-inner .bio {\n  margin-left: 56px;\n}\n\n.hovercard-inner .bio span em {\n  display: block;\n  font-style: normal;\n}\n\n.hovercard-inner .bio p {\n  line-height: 16px;\n}\n\n.hovercard-inner .fn-above { /* FULL NAME above durr*/\n  font-weight: bold;\n  font-family: "helvetica neue", helvetica, arial, sans-serif;\n  font-size: 15px;\n  color: #333;\n}\n\n.hovercard-inner .sn a {\n  font-size: 11px;\n  line-height: 14px;\n  font-weight: normal;\n}\n\n.inline .hovercard-inner .at_symbol {\n  display: none;\n}\n\n.hovercard-inner .sn img {\n  position: relative;\n  top: 2px;\n}\n\n.hovercard-inner .user i {\n  display: inline-block;\n  background-position: -176px -32px;\n  width: 15px;\n  background-image:url(../images/sprite-icons.png);\n  background-repeat: no-repeat;\n  height: 13px;\n  outline-color: -moz-use-text-color;\n  overflow: hidden;\n  margin: 0 3px -3px 0;\n}\n\n.hovercard-inner .user b {\n  background-image:url(../images/sprite-icons.png);\n  background-repeat: no-repeat;\n  background-position: 0 -64px;\n}\n\n.hovercard-inner .description {\n  color: #656565;\n  clear: left;\n  overflow: hidden;\n  height: auto;\n  padding-top: 3px;\n}\n\n.hovercard-inner .description-inactive {\n  height: 0;\n}\n\n.hovercard-inner ul.user_stats {\n  overflow: hidden;\n  zoom:1; /* Self clear the UL for IE since its LI\'s are floated */\n}\n\n.hovercard-inner ul.user_stats,\n.hovercard-inner .user_stats li {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.hovercard-inner .description p,\n.hovercard-inner .description ul {\n  padding: 3px 0;\n  color: #333;\n}\n\n.hovercard-inner .user_stats li {\n  float: left;\n  border-right: 1px solid #eee;\n  padding: 1px 12px;\n  letter-spacing: -0.5px;\n}\n\n.hovercard-inner .user_stats li.last {\n  border-right-width: 0;\n}\n\n.hovercard-inner .user_stats li.first {\n  padding-left: 0;\n}\n\n.hovercard-inner .user_stats .stat {\n  font-weight: bold;\n  display: block;\n  color: #333;\n  font-size: 12px;\n  font-family: "Helvetica Neue", Arial, sans-serif;\n  letter-spacing: 0.5px;\n}\n\n.hovercard-inner .user_stats .type {\n  color: #666;\n}\n\n.hovercard-inner .hovercard-inner-footer {\n  background: #f6f6f6;\n  height: 39px;\n}\n\n.hovercard-inner .hovercard-inner-footer .loading-msg {\n  height: 39px;\n  line-height: 39px;\n  vertical-align: middle;\n  background: url(../images/spinner.gif) no-repeat left center;\n  padding: 0 0 0 20px;\n}\n\n.follow-controls,\n.following-controls {\n  float: left;\n  _display: inline;\n  margin-left: 10px;\n  height: 39px;\n  line-height: 39px;\n  vertical-align: middle;\n}\n\n.action-dropdowns {\n  float: right;\n  _display: inline;\n  margin-right: 7px;\n  height: 39px;\n  line-height: 39px;\n  vertical-align: middle;\n}\n\n.follow-controls a,\n.action-dropdowns a {\n  _margin: 7px 0;\n}\n\n\n\n.hovercard-inner .setting {\n  background: url(../images/sprite-icons.png) -96px -48px no-repeat;\n  width: 16px;\n  height: 16px;\n  display: inline-block;\n  _overflow: hidden;\n  cursor: pointer;\n  margin-left: 5px;\n  margin-bottom: -5px;\n}\n\n.hovercard-inner .sms-setting-off {\n  background-position: -160px -48px;\n}\n\n.hovercard-inner .sms-setting-not-off {\n  background-position: -48px -48px;\n}\n\n.hovercard-inner .replies-setting-off {\n  background-position: -144px -48px;\n}\n\n.hovercard-inner .replies-setting-not-off {\n  background-position: 0 -48px;\n}\n\n.hovercard-inner .shares-setting-off {\n  background-position: -176px -48px;\n}\n\n.hovercard-inner .shares-setting-not-off {\n  background-position: -96px -48px;\n}\n\n.hovercard-inner .is-following {\n  background: url(../images/sprite-icons.png) -160px -16px;\n  width: 10px;\n  height: 9px;\n  display: inline-block;\n  _overflow: hidden;\n  margin-right: 3px;\n\n  /* Helps IE 6 position the checkmark correctly */\n  _border-bottom: 2px solid #f6f6f6;\n}\n\n.follow-alert .alert,\n.follow-pending .pending,\n.is-you {\n  height: 39px;\n  line-height: 39px;\n  vertical-align: middle;\n  margin-left: 10px;\n}\n\n.hovercard-inner .following-controls,\n.hovercard-inner .is-you,\n.hovercard-inner .pending,\n.hovercard-inner .alert {\n  font-weight: bold;\n}\n\n.hovercard-inner .alert i {\n  background: transparent url(../images/alert.png) no-repeat;\n  height: 13px;\n  width: 14px;\n  margin-right: 5px;\n  margin-bottom: -2px;\n  display: inline-block;\n  _display: inline;\n}\n\n.hovercard-inner .following-controls .you-follow-user {\n  /* Helps IE 8 prevent the SMS icon from overlapping with the following */\n  border-right: solid 1px #f6f6f6;\n  display: inline-block;\n}\n\n.hovercard .not-following .following-controls,\n.hovercard .following .follow-controls,\n.hovercard .blocking .follow-controls,\n.hovercard .follow-pending .follow-controls,\n.hovercard .follow-pending .following-controls,\n.hovercard .follow-alert .follow-controls,\n.hovercard .follow-alert .following-controls,\n.hovercard .pending,\n.hovercard .is-you,\n.hovercard .alert,\n.hovercard .you .follow-controls,\n.hovercard .not-following .unfollow,\n.hovercard .follow-pending .unfollow,\n.hovercard .follow-alert .unfollow,\n.hovercard .following .follow,\n.hovercard .not-blocking .unblock,\n.hovercard .blocking .block,\n.hovercard .blocking .direct-message,\n.hovercard .blocking .follow,\n.hovercard .blocking .report-for-spam {\n  display: none;\n}\n\n.hovercard .you .is-you,\n.hovercard .follow-pending .pending,\n.hovercard .follow-alert .alert {\n  display: block;\n}\n\n.profile-pic {\n  width: 48px;\n  height: 48px;\n  float: left;\n  position: relative;\n}\n\n.profile-pic .icon {\n  background: url(../images/t_170px.png) no-repeat 0 0;\n  width: 14px;\n  height: 17px;\n  position: absolute;\n  _overflow: hidden;\n  bottom: -5px;\n  right: -5px;\n}';
twttr.stylesheets["generic_buttons.css"] = '/* =Individual Button Styles\n----------------------------------------------- */\na.a-btn {\n  zoom: 1;\n  background: #ddd url(../images/bg-btn.gif) repeat-x scroll 0 0;\n  cursor: pointer;\n  text-shadow: 1px 1px 0 #fff !important;\n  border-color: #ddd #ddd #ccc !important;\n  border-style: solid;\n  border-width: 1px !important;\n  text-decoration: none;\n  padding: 4px 8px 5px;\n  line-height: 14px;\n  font-size: 11px;\n  font-family: "lucida grande", helvetica, tahoma, arial;\n  display: inline-block;\n  _display: inline;\n  -moz-border-radius: 4px;\n  -webkit-border-radius: 4px;\n  border-radius: 4px;\n}\n\na.a-btn,\na.a-btn:visited {\n  color: #333 !important;\n}\na.a-btn:hover,\na.a-btn:focus {\n  text-decoration: none;\n  border-color: #999 #999 #888 !important;\n  color: #000;\n  outline: none;\n}\na.a-btn:active {\n  background-image: none;\n  outline: none;\n}\n:focus {\n  -moz-outline-style: none;\n}\n\na.a-btn-m {\n  font-size: 15px;\n  font-family: "helvetica neue", arial, sans-serif;\n  padding: 5px 15px 6px;\n  line-height: 20px;\n  -moz-border-radius: 5px;\n  -webkit-border-radius: 5px;\n  border-radius: 5px;\n  background-position: 0 -200px;\n}\na.a-btn-l {\n  font-size: 20px;\n  line-height: 26px;\n  padding: 7px 20px 8px;\n  -moz-border-radius: 6px;\n  -webkit-border-radius: 6px;\n  border-radius: 6px;\n  font-family: "helvetica neue", arial, sans-serif;\n  background-position: 0 -400px;\n}\na.btn-disabled {\n  opacity: 0.6;\n  filter: alpha(opacity=60);\n  background-image: none;\n}';
twttr.stylesheets["connect_button.css"] = '/* global class for buttons */\n\n/* Initializing (placeholder) */\n\n.twitter-connect-init {\n  font: 12px Arial, sans-serif;\n  display: inline-block;\n  white-space: nowrap;\n  -moz-border-radius: 4px;\n  -webkit-border-radius: 4px;\n  -border-radius: 4px;\n\tcolor: #fff;\n\tbackground: #eee;\n\tborder: 1px solid #ccc;\n\tcolor: #333;\n\ttext-shadow: 0 1px 0 #fff;\n  padding: 0 0 0 8px;\n}\n\n.twitter-connect-init-small {\n  min-height: 19px;\n  *height: 19px;\n  line-height: 19px;\n  width: 121px;\n}\n\n.twitter-connect-init-medium {\n  min-height: 22px;\n  *height: 22px;\n  line-height: 22px;\n  width: 138px;\n}\n.twitter-connect-init-large {\n  min-height: 26px;\n  *height: 26px;\n  line-height: 26px;\n  width: 162px;\n}\n\n.twitter-connect-init-xlarge {\n  min-height: 38px;\n  *height: 38px;\n  line-height: 38px;\n  width: 228px;\n}\n\n.twitter-connect-init span {\n  background: url(../images/spinner.gif) no-repeat 0 center;\n  padding-left: 20px;\n}\n\n\n\n.twitter-connect {\n  border: 0;\n  display: inline-block;\n  background-repeat: no-repeat;\n  background-position: top left;\n}\n\n.twitter-connect span {\n  position: absolute;\n  left: -9999px;\n}\n\n.twitter-button {\n  font: 12px Arial, sans-serif;\n  color: #fff;\n  background: #1D6B9C url(../images/gradient-background.png) repeat-x;\n  text-indent: 0;\n  border: 1px solid #18566A;\n  display: inline-block;\n  -moz-border-radius: 4px;\n  -webkit-border-radius: 4px;\n  -border-radius: 4px;\n  text-shadow: 0 -1px 0 #18566A;\n}\n\n.twitter-button:hover {\n  border: 1px solid #00242C;\n  background-position: left -23px;\n  text-decoration: none;\n}\n\n.twitter-button:active {\n  border: 1px solid #044D77;\n  background-position: left -46px;\n  text-decoration: none;\n  color: rgba(255,255,255,0.8);\n}\n\n\n/* 129px */\n\n.twitter-connect-small {\n  background: url(../images/connect_129px.png) no-repeat;\n  width: 129px;\n  height: 19px;\n}\n.twitter-connect-small:hover {\n  background-position: left -19px;\n}\n.twitter-connect-small:active {\n  background-position: left -38px;\n}\n\n.twitter-connected-small {\n  background: url(../images/connected_129px.png) no-repeat;\n  width: 137px;\n  height: 23px;\n}\n\n/* 146px */\n\n.twitter-connect-medium {\n  background: url(../images/connect_146px.png) no-repeat;\n  width: 146px;\n  height: 23px;\n}\n.twitter-connect-medium:hover {\n  background-position: left -23px;\n}\n.twitter-connect-medium:active {\n  background-position: left -46px;\n}\n\n.twitter-connected-medium {\n  background: url(../images/connected_146px.png) no-repeat;\n  width: 159px;\n  height: 23px;\n}\n\n/* 170px */\n\n.twitter-connect-large {\n  background: url(../images/connect_170px.png) no-repeat;\n  width: 170px;\n  height: 26px;\n}\n.twitter-connect-large:hover {\n  background-position: left -26px;\n}\n.twitter-connect-large:active {\n  background-position: left -52px;\n}\n\n.twitter-connected-large {\n  background: url(../images/connected_170px.png) no-repeat;\n  width: 182px;\n  height: 26px;\n}\n\n/* 236px */\n\n.twitter-connect-xlarge {\n  background: url(../images/connect_236px.png) no-repeat;\n  width: 236px;\n  height: 38px;\n}\n.twitter-connect-xlarge:hover {\n  background-position: left -38px;\n}\n.twitter-connect-xlarge:active {\n  background-position: left -76px;\n}\n\n.twitter-connected-xlarge {\n  background: url(../images/connected_236px.png) no-repeat;\n  width: 258px;\n  height: 38px;\n}\n\n\n\n/* boxes */\n.twitter-connect-box {\n  font: 13px/17px Lucida Grande, "Lucida Grande", Arial, Helvetica, sans-serif;\n  padding: 8px 10px 9px 10px;\n  width: 200px;\n  background: #C7E0EC url(../images/rays-box.jpg) no-repeat center top;\n  color: #001F33;\n  text-shadow: 0 1px 0 #E5F0F6;\n  border-radius: 5px;\n  -moz-border-radius: 4px;\n  -webkit-border-radius: 4px;\n  -webkit-box-shadow: 0 1px 0 rgba(0,0,0,.3);\n  -moz-box-shadow: 0 1px 0 rgba(0,0,0,.3);\n  box-shadow: 0 1px 0 rgba(0,0,0,.3);\n  display: inline-block;\n  vertical-align: top;\n}\n\n.twitter-connect-box p {\n  margin: 0 0 8px 0;\n  padding: 0;\n}\n\n.twitter-connect-box-small {\n  font-size: 10px;\n  line-height: 14px;\n  width: 129px;\n}\n\n.twitter-connect-box-medium {\n  font-size: 11px;\n  line-height: 15px;\n  width: 146px;\n}\n\n.twitter-connect-box-large {\n  font-size: 11px;\n  line-height: 15px;\n  width: 170px;\n}\n\n.twitter-connect-box-xlarge {\n  font-size: 12px;\n  line-height: 17px;\n  width: 236px;\n}';