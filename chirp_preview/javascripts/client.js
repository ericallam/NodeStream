(function() {
    window.twttr = window.twttr || {
        anywhere: {}
    };
    twttr.anywhere.isDevMode = (window._VERSION.indexOf("_dev") === 0);
    twttr.anywhere.assetPath = function() {
        var P = parent.twttr.anywhere._assetUrl();
        var Q = twttr.anywhere.isDevMode ? "": window._VERSION;
        return [P, Q].join((twttr.anywhere.isDevMode ? "": "/"))
    };
    var N = twttr.anywhere.assetPath,
    F,
    A,
    J;
    if (twttr.anywhere.isDevMode) {
        F = [parent.twttr.anywhere._proto() + "://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js", N() + "/javascripts/base_lite.js", N() + "/javascripts/lib/json2.js", N() + "/javascripts/api/init.js"];
        A = [N() + "/javascripts/api/utilities/base_collection.js", N() + "/javascripts/api/utilities/cache.js", N() + "/javascripts/api/utilities/helpers.js", N() + "/javascripts/api/models/base.js", N() + "/javascripts/api/mixins/status_actions.js"];
        J = [N() + "/javascripts/common.js", N() + "/javascripts/basefeatures.js", N() + "/javascripts/styles.js", N() + "/javascripts/api/models/user.js", N() + "/javascripts/api/models/direct_message.js", N() + "/javascripts/api/models/saved_search.js", N() + "/javascripts/api/models/list.js", N() + "/javascripts/api/models/status.js", N() + "/javascripts/api/models/search_result.js", N() + "/javascripts/api/models/place.js"]
    } else {
        F = [parent.twttr.anywhere._proto() + "://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"];
        A = [];
        J = [N() + "/javascripts/client.bundle.js", N() + "/javascripts/api.bundle.js"]
    }
    var D = {
        connect: [N() + "/javascripts/connect.js"],
        follow: [N() + "/javascripts/follow.js"]
    };
    if (twttr.anywhere.isDevMode) {
        D.hovercards = [N() + "/javascripts/bubble.js", N() + "/javascripts/user_card.js", N() + "/javascripts/hovercards.js"];
        D.tweetBox = [N() + "/javascripts/tweet_box.js"]
    } else {
        D.hovercards = [N() + "/javascripts/hovercards.bundle.js"];
        D.tweetBox = [N() + "/javascripts/tweet_box.bundle.js"]
    }
    var I = parent.twttr.anywhere._serverUrl(true);
    var B = "a.twitter-anywhere-user";
    function M(Q, R) {
        for (var P in R) {
            Q[P] = R[P]
        }
        return Q
    }
    var O = function(Q, P) {
        this.path = Q;
        this.context = P;
        this.loaded = false;
        this.callbacks = []
    };
    O.prototype.registerCallback = function(P) {
        this.callbacks.push(P);
        return this
    };
    O.prototype.finishedLoading = function() {
        this.loaded = true;
        for (var Q = 0, P = this.callbacks.length; Q < P; ++Q) {
            this.callbacks[Q]()
        }
    };
    O.prototype.load = function() {
        var Q = this.context.document.createElement("script");
        Q.type = "text/javascript";
        Q.src = this.path;
        this.context.document.getElementsByTagName("head")[0].appendChild(Q);
        var P = this;
        if (this.context.attachEvent) {
            Q.onreadystatechange = function() {
                var R = this.readyState;
                if (R === "loaded" || R === "complete") {
                    this.onreadystatechange = null;
                    P.finishedLoading()
                }
            }
        } else {
            Q.onload = Q.onerror = function() {
                P.finishedLoading()
            }
        }
    };
    var L = function(Q, W, P) {
        this.context = P;
        if (!this.context.Manifesto) {
            this.context.Manifesto = {}
        }
        var Y,
        T;
        var U = this;
        T = Q.length;
        if (T === 0) {
            W();
            return
        }
        function V() {
            T--;
            if (T === 0) {
                W()
            }
        }
        for (var R = 0, S = Q.length; R < S; ++R) {
            Y = Q[R];
            if (this.hasFinishedLoading(Y)) {
                V()
            } else {
                if (this.isCurrentlyLoading(Y)) {
                    this.context.Manifesto[Y].registerCallback(V)
                } else {
                    var X = new O(Y, this.context);
                    this.context.Manifesto[Y] = X;
                    X.registerCallback(V).load()
                }
            }
        }
    };
    L.prototype.hasFinishedLoading = function(P) {
        return this.context.Manifesto[P] && this.context.Manifesto[P].loaded
    };
    L.prototype.isCurrentlyLoading = function(P) {
        return this.context.Manifesto[P] && !this.context.Manifesto[P].loaded
    };
    twttr.fetch = function(P, R, Q) {
        new L(P, R, (Q || window))
    };
    twttr.fetchSerial = function(P, U) {
        var Q = 0;
        var R = P.length;
        if (R === 0) {
            U();
            return
        }
        function T() {
            if (Q == R) {
                U()
            } else {
                S()
            }
        }
        function S() {
            twttr.fetch([P[Q]],
            function() {
                Q++;
                T()
            })
        }
        S()
    };
    twttr.callComplete = function(Q) {
        var R = Q.complete;
        var P = Array.prototype.slice.call(arguments, 1);
        if (R) {
            R.apply(this, P)
        }
    };
    function C(R) {
        if (parent.twttr.anywhere._signedOutCookiePresent()) {
            return
        }
        var Q = {
            oauth_callback_url: window.top.location.href,
            oauth_mode: "flow_web_client",
            headless: true,
            _: (new Date()).getTime(),
            oauth_client_identifier: window.parent.twttr.anywhere._config.clientID
        };
        if (!parent.twttr.anywhere._headlessAuthWindow) {
            var P = twttr.IFrame.create({
                content: window.parent.twttr.anywhere._oauthUrl(true) + "/authorize?" + $.param(Q),
                css: {
                    position: "absolute",
                    top: "-9999em"
                }
            });
            parent.twttr.anywhere._headlessAuthWindow = P
        }
    }
    function K(P, R, Q) {
        this.selector = P;
        this.window = R;
        this.client = Q
    }
    K.setOptions = function(P, Q) {
        return twttr.merge({},
        P, Q, true)
    };
    M(K.prototype, {
        connectButton: function(P) {
            P = twttr.merge({
                size: "medium",
                explanation: false
            },
            P);
            twttr.fetch(D.connect, twttr.bind(this,
            function() {
                twttr.anywhere.connectButton(this, P)
            }), window)
        },
        linkifyUsers: function(P) {
            P = P || {};
            twttr.anywhere.linkify(this, P);
            twttr.callComplete(P)
        },
        followButton: function(Q, P) {
            P = twttr.merge({
                screenName: Q
            },
            P);
            twttr.fetch(D.follow, twttr.bind(this,
            function() {
                twttr.anywhere.followButton(this, P)
            }))
        },
        hovercards: function(P) {
            P = twttr.merge({
                infer: false,
                linkify: true,
                selector: B
            },
            P);
            if (P.infer || P.username) {
                P.linkify = false
            }
            function Q() {
                twttr.fetch(D.hovercards, twttr.bind(this,
                function() {
                    twttr.anywhere.hoverCards(this, P)
                }), window)
            }
            if (P.linkify) {
                this.linkifyUsers({
                    complete: twttr.bind(this,
                    function() {
                        this.selector = jQuery.map(this.selector.split(","),
                        function(S, R) {
                            return S + " " + P.selector
                        }).join(",");
                        Q.call(this, Q)
                    })
                })
            } else {
                Q.call(this)
            }
        },
        tweetBox: function(P) {
            P = twttr.merge({
                counter: true,
                defaultContent: "",
                height: 65,
                width: 515,
                label: "What's happening?",
                onTweet: function(R, Q) {}
            },
            P);
            twttr.fetch(D.tweetBox, twttr.bind(this,
            function() {
                twttr.anywhere.tweetBox(this, P)
            }), window)
        }
    });
    var H = {
        isConnected: function() {
            return !! this.currentUser
        },
        linkifyUsers: function(P) {
            this("body").linkifyUsers(P)
        },
        hovercards: function(Q) {
            var R = this;
            Q = twttr.merge({
                linkify: true,
                selector: B
            },
            Q);
            function P() {
                Q.linkify = false;
                R(Q.selector).hovercards(Q)
            }
            if (Q.linkify) {
                this.linkifyUsers({
                    complete: P
                })
            } else {
                P()
            }
        },
        requireConnect: function(P) {
            return twttr.anywhere.requireConnect(P, this)
        },
        _fireSignOut: function() {
            var P = this;
            twttr.anywhere.remote.call("signOut", [],
            function() {
                parent.twttr.anywhere._removeToken();
                P.currentUser = null;
                P.trigger("signOut")
            })
        },
        _fireAuthComplete: function() {
            twttr.anywhere.api.models.User.current(twttr.bind(this,
            function(P) {
                this.currentUser = P;
                this.trigger("authComplete", [P])
            }))
        }
    };
    function E(Q) {
        var P = function(R) {
            return new K(R, Q, P)
        };
        twttr.merge(P, H);
        twttr.merge(P, twttr.EventProvider);
        twttr.merge(P, twttr.anywhere.api.models);
        parent.twttr.anywhere._clients.push(P);
        return P
    }
    window._init = function(R, P) {
        var Q = E(P.window);
        Q.bind("authComplete",
        function() {
            twttr.anywhere.remote.call("clearCache", [],
            function() {})
        });
        if (parent.twttr.anywhere.token) {
            twttr.anywhere.api.models.User.current(function(S) {
                Q.currentUser = S;
                R(Q)
            })
        } else {
            R(Q)
        }
        return Q
    };
    function G(P) {
        twttr.anywhere.remote.call(P.method, P.args, P.uuid)
    }
    twttr.fetch(F,
    function() {
        twttr.fetch(A,
        function() {
            twttr.fetch(J,
            function() {
                var P;
                twttr.anywhere.api.initialize();
                if (!parent.twttr.anywhere.token) {
                    C()
                }
                twttr.anywhere.remote.createClient(I,
                function() {
                    window._ready = true;
                    $.each(window._initCallbacks,
                    function(R, S) {
                        var T = S[0],
                        Q = S[1];
                        P = _init(T, Q);
                        twttr.anywhere.remote.bind("authRequired",
                        function(U) {
                            P.unbind("authComplete");
                            if (U) {
                                P.one("authComplete",
                                function() {
                                    G(U)
                                })
                            }
                            if (parent.twttr.anywhere.token) {
                                parent.twttr.anywhere._removeToken();
                                C()
                            } else {
                                twttr.anywhere.requireConnect(jQuery.noop, P)
                            }
                        })
                    })
                })
            })
        })
    })
} ());