(function() {
    twttr.anywhere.api = {};
    var C = ["models", "util", "proxies", "mixins"];
    for (var B = 0, A = C.length; B < A; ++B) {
        twttr.anywhere.api[C[B]] = {}
    }
    twttr.anywhere.api.initialize = function() {
        for (var D in twttr.anywhere.api.models) {
            if (D == "Base") {
                continue
            } (function() {
                twttr.anywhere.api.proxies[D] = twttr.anywhere.api.util.proxyModel(twttr.anywhere.api.models[D],
                function(E) {
                    this.event = E
                })
            } ())
        }
        twttr.anywhere.api.util.BaseCollection._name = "twttr.anywhere.proxies.Collection";
        twttr.anywhere.api.proxies.Collection = twttr.anywhere.api.util.proxyModel(twttr.anywhere.api.util.BaseCollection,
        function(E) {
            this.event = E
        });
        delete twttr.anywhere.api.util.BaseCollection._name
    }
} ());
twttr.klass("twttr.anywhere.api.util.BaseCollection",
function() {
    this.array = []
}).methods({
    each: function(B) {
        for (var C = 0, A = this.array.length; C < A; ++C) {
            B(this.array[C], C)
        }
        return this
    },
    find: function(B) {
        for (var C = 0, A = this.array.length; C < A; ++C) {
            if (B(this.array[C], C)) {
                return this.array[C]
            }
        }
        return null
    },
    all: function(B) {
        var C = new twttr.anywhere.api.util.BaseCollection();
        for (var D = 0, A = this.array.length; D < A; ++D) {
            if (B(this.array[D], D)) {
                C.push(this.array[D])
            }
        }
        return C
    },
    filter: function(A) {
        return this.all(A)
    },
    some: function(C) {
        for (var B = 0, A = this.array.length; B < A; ++B) {
            if (C.call(this.array, this.array[B], B, this.array)) {
                return true
            }
        }
        return false
    },
    every: function(C) {
        for (var B = 0, A = this.array.length; B < A; ++B) {
            if (!C.call(this.array, this.array[B], B, this.array)) {
                return false
            }
        }
        return true
    },
    map: function(B) {
        var C = new twttr.anywhere.api.util.BaseCollection();
        for (var D = 0, A = this.array.length; D < A; ++D) {
            C.push(B(this.array[D], D))
        }
        return C
    },
    none: function(A) {
        var B = this.any(A);
        return ! B
    },
    length: function() {
        return this.array.length
    },
    get: function(C, A) {
        var B = this.array[C];
        if (A) {
            A(B)
        }
        return B
    },
    push: function(A) {
        this.array.push(A);
        return this
    },
    pop: function(A) {
        var B = this.array.pop();
        if (A) {
            A(B)
        }
        return B
    },
    first: function(B, A) {
        if (twttr.is.fn(B)) {
            A = B;
            B = 1
        }
        var C;
        if (B == 1) {
            C = this.array[0]
        } else {
            C = this.array.slice(0, B)
        }
        if (A) {
            A(C)
        }
        return C
    },
    last: function(B, A) {
        if (twttr.is.fn(B)) {
            A = B;
            B = 1
        }
        var C;
        if (B == 1) {
            C = this.array[this.array.length - 1]
        } else {
            C = this.array.slice(this.array.length - B)
        }
        if (A) {
            A(C)
        }
        return C
    }
}); (function() {
    var A = {
        "users/show": {},
        "account/verify_credentials": {},
        "users/lookup": {}
    };
    twttr.klass("twttr.anywhere.api.util.DefaultCache",
    function() {
        this.store = {}
    }).methods({
        clear: function() {
            this.store = {}
        },
        put: function(D, C, B) {
            if (D in A) {
                this.store[this._createKey(D, C)] = B;
                return true
            } else {
                return false
            }
        },
        get: function(E, C) {
            var D = this._createKey(E, C),
            B;
            if (B = this.store[D]) {
                return B
            } else {
                return null
            }
        },
        expire: function(C) {
            for (var B in this.store) {
                if (B.match(C)) {
                    delete this.store[B]
                }
            }
        },
        writeThroughCallback: function(D, C, B) {
            return twttr.bind(this,
            function(E) {
                this.put(D, C, E);
                B(E)
            })
        },
        _createKey: function(C, B) {
            return JSON.stringify([C, B])
        }
    });
    twttr.anywhere.api.cache = new twttr.anywhere.api.util.DefaultCache
} ()); (function() {
    twttr.klass("twttr.anywhere.api.util.EventChain",
    function() {}).methods(twttr.EventProvider);
    var A = ["cast", "success", "error", "eventName"];
    var B = twttr.anywhere.api.cache;
    twttr.augmentObject(twttr.anywhere.api.util, {
        chain: new twttr.anywhere.api.util.EventChain(),
        noop: function() {},
        camelize: function(C) {
            return C.replace(/_(.)/g,
            function(D, E) {
                return E.toUpperCase()
            })
        },
        underscore: function(C) {
            return C.replace(/([a-z])([A-Z])/g,
            function(D, F, E) {
                return F + "_" + E.toLowerCase()
            })
        },
        buildCollection: function(D, F) {
            var G = new twttr.anywhere.api.util.BaseCollection();
            for (var E = 0, C = F.length; E < C; ++E) {
                G.push(new D(F[E]))
            }
            return G
        },
        traverse: function(E, D) {
            if (!D.length) {
                return E
            }
            var C = D.shift();
            if (E[C]) {
                return twttr.anywhere.api.util.traverse(E[C], D)
            } else {
                return null
            }
        },
        cleanParams: function(D) {
            for (var C = A.length - 1; C >= 0; --C) {
                delete D[A[C]]
            }
        },
        optify: function(C) {
            var D = {
                success: twttr.anywhere.api.util.noop,
                error: twttr.anywhere.api.util.noop
            };
            if (!C) {
                return D
            }
            if (twttr.is.fn(C)) {
                return twttr.merge({},
                D, {
                    success: C
                })
            } else {
                return twttr.merge({},
                D, C)
            }
        },
        returnClassFromType: function(C) {
            if (twttr.is.array(C)) {
                return [twttr.anywhere.api.models[C[0]]]
            } else {
                return twttr.anywhere.api.models[C]
            }
        },
        genEventName: function() {
            return "chain_" + (new Date).getTime() + Math.random() * 1000
        },
        callMethod: function(F) {
            var E = F.options.cast || F.cast;
            twttr.anywhere.api.util.cleanParams(F.params);
            var C;
            delete F.options.cast;
            function D(I) {
                F.dataSource.shift();
                var H = F.dataSource.length ? twttr.anywhere.api.util.traverse(I, F.dataSource) : I;
                var G;
                if (twttr.is.array(E)) {
                    G = twttr.anywhere.api.util.buildCollection(E[0], H)
                } else {
                    G = new E(H)
                }
                setTimeout(function() {
                    F.options.success(G)
                },
                0)
            }
            if (B && (C = B.get(F.url, F.params))) {
                D(C)
            } else {
                twttr.anywhere.remote.call(F.url, F.params, {
                    success: (B) ? B.writeThroughCallback(F.url, F.params, D) : D,
                    error: F.options.error
                })
            }
        },
        chainable: function(E) {
            E = twttr.anywhere.api.util.optify(E);
            var D = E.success;
            var C;
            if (!E.eventName) {
                C = twttr.anywhere.api.util.genEventName()
            } else {
                C = E.eventName;
                delete E.eventName
            }
            function F(G) {
                twttr.anywhere.api.util.chain.trigger(C, [G]);
                if (D) {
                    D(G)
                }
            }
            F.event = C;
            E.success = F;
            return E
        },
        chainableMethod: function(D, F) {
            var C = twttr.is.array(D) ? "Collection": D;
            var E = function() {
                var J = twttr.anywhere.api.util.returnClassFromType(D);
                var I = Array.prototype.slice.call(arguments, 0);
                var K = I.pop();
                var H = {};
                if (K) {
                    if (twttr.is.array(K) || !twttr.is.object(K)) {
                        I.push(K)
                    } else {
                        H = K
                    }
                }
                var G = !!H.eventName;
                H = twttr.anywhere.api.util.chainable(H);
                H.cast = J;
                I.push(H);
                F.apply(this, I);
                if (!G) {
                    return new twttr.anywhere.api.proxies[C](H.success.event)
                }
            };
            E.proxyName = C;
            return E
        },
        aliasMethod: function(D, F) {
            var C = twttr.is.array(D) ? "Collection": D;
            var E = function() {
                F.apply(this, arguments)
            };
            E.proxyName = C;
            return E
        },
        proxyModel: function(E, F) {
            var G = E._name.replace("models", "proxies");
            var D = twttr.klass(G, F);
            for (var C in E.prototype) { (function() {
                    var H = C;
                    D.prototype[H] = function() {
                        var K = Array.prototype.slice.call(arguments, 0);
                        var L = this instanceof twttr.anywhere.api.proxies.Collection;
                        if (!L) {
                            var I = twttr.anywhere.api.util.genEventName();
                            var M = K.pop();
                            var J = {};
                            if (M) {
                                if (twttr.is.array(M) || !twttr.is.object(M)) {
                                    K.push(M)
                                } else {
                                    J = M
                                }
                            }
                            J = twttr.anywhere.api.util.optify(J);
                            J.eventName = I;
                            K.push(J)
                        }
                        twttr.anywhere.api.util.chain.bind(this.event,
                        function(O, N) {
                            E.prototype[H].apply(N, K)
                        });
                        if (!L) {
                            return new twttr.anywhere.api.proxies[E.prototype[H].proxyName](I)
                        }
                    }
                } ())
            }
            return D
        },
        model: function(D, G) {
            var C = twttr.klass(D, G).superclass(twttr.anywhere.api.models.Base);
            function E(H) {
                return twttr.anywhere.api.util.underscore(H).toLowerCase()
            }
            function F(I, H) {
                H = H || E(I);
                if (!C._registry) {
                    C._registry = {}
                }
                C._registry[H] = I
            }
            C.hasMany = function(I, H) {
                H = H || E(I);
                if (!C._registry) {
                    C._registry = {}
                }
                C._registry[H] = [I];
                return C
            };
            C.belongsTo = function(I, H) {
                F(I, H);
                return C
            };
            C.hasOne = function(I, H) {
                F(I, H);
                return C
            };
            return C
        }
    })
} ()); (function() {
    twttr.klass("twttr.anywhere.api.models.Base",
    function(E) {
        if (!E) {
            return null
        }
        if (E.superclass && E.superclass == twttr.anywhere.api.models.Base) {
            return E
        }
        this.attributes = {};
        var B = this.constructor._registry;
        var D;
        for (var C in E) {
            D = twttr.anywhere.api.util.camelize(C);
            debugger
            this.data(D, E[C]);
            //            if (!this[D]) {
            //                if (B && B[D]) {
            //                    var A = twttr.anywhere.api.models[B[D]];
            //                    if (B[D] instanceof Array) {
            //                        this[D] = twttr.anywhere.api.util.buildCollection(A, this.data(D))
            //                    } else {
            //                        this[D] = new A(this.data(D))
            //                    }
            //                } else {
            //                    this[D] = this.data(D)
            //                }
            //            }
        }
    }).methods({
        data: function(A, B) {
            if (typeof A == "string" && typeof B != "undefined") {
                this.attributes[A] = B;
                return B
            }
            if (typeof A == "object" && typeof B == "undefined") {
                return twttr.merge(this.attributes, A)
            }
            if (typeof A == "string" && typeof B == "undefined") {
                return this.attributes[A]
            }
            if (typeof A == "undefined" && typeof B == "undefined") {
                return this.attributes
            }
        }
    })
} ()); (function() {
    var B = twttr.anywhere.api.util.chainableMethod;
    var C = twttr.anywhere.api.util.aliasMethod;
    var A = twttr.anywhere.api.util.callMethod;
    twttr.augmentString("twttr.anywhere.api.mixins.StatusActions", {
        retweet: C("Status",
        function(D) {
            return twttr.anywhere.api.models.Status.retweet(this, D)
        }),
        favorite: C("Status",
        function(D) {
            return twttr.anywhere.api.models.Status.favorite(this, D)
        }),
        unfavorite: C("Status",
        function(D) {
            return twttr.anywhere.api.models.Status.unfavorite(this, D)
        }),
        reply: C("Status",
        function(E, D) {
            return twttr.anywhere.api.models.Status.reply(this, E, D)
        })
    })
} ()); (function() {
    var D = twttr.anywhere.api.util.chainableMethod;
    var F = twttr.anywhere.api.util.aliasMethod;
    var B = twttr.anywhere.api.util.callMethod;
    var C = twttr.anywhere.api.cache;
    function A(G) {
        if (C) {
            C.expire(new RegExp("\b" + G.screenName + "\b"));
            C.expire(new RegExp("\b" + G.id + "\b"))
        }
    }
    function E() {
        if (C) {
            C.expire(/verify_credentials/)
        }
    }
    twttr.anywhere.api.util.model("twttr.anywhere.api.models.User",
    function(G) {}).hasOne("Status").statics({
        identify: function(G) {
            var H = G;
            if (G instanceof this) {
                H = G.id
            }
            return H
        },
        find: D("User",
        function(H, G) {
            var I;
            if (twttr.is.string(H)) {
                I = {
                    screen_name: H
                }
            } else {
                I = {
                    user_id: H
                }
            }
            B({
                options: G,
                url: "users/show",
                params: [I],
                dataSource: ["user"]
            })
        }),
        findAll: D(["User"],
        function(H, I) {
            var L = [];
            var K = [];
            for (var J = 0, G = H.length; J < G; ++J) {
                if (twttr.is.string(H[J])) {
                    L.push(H[J])
                } else {
                    K.push(H[J])
                }
            }
            B({
                options: I,
                url: "users/lookup",
                params: [{
                    user_id: K.join(","),
                    screen_name: L.join(",")
                }],
                dataSource: ["users"]
            })
        }),
        current: D("CurrentUser",
        function(G) {
            B({
                options: G,
                url: "account/verify_credentials",
                params: [],
                dataSource: ["user"]
            })
        }),
        search: D(["User"],
        function(H, G) {
            B({
                options: G,
                url: "users/search",
                params: [twttr.merge(G, {
                    query: H
                })],
                dataSource: ["users"]
            })
        })
    }).methods({
        favorites: D(["Status"],
        function(G) {
            B({
                options: G,
                url: "favorites",
                params: [twttr.merge(G, {
                    id: this.id
                })],
                dataSource: ["statuses"]
            })
        }),
        timeline: D(["Status"],
        function(G) {
            B({
                options: G,
                url: "statuses/user_timeline",
                params: [twttr.merge(G, {
                    user_id: this.id
                })],
                dataSource: ["statuses"]
            })
        }),
        followers: D(["User"],
        function(G) {
            B({
                options: G,
                url: "statuses/followers",
                params: [twttr.merge(G, {
                    user_id: this.user_id
                })],
                dataSource: ["users"]
            })
        }),
        friends: D(["User"],
        function(G) {
            B({
                options: G,
                url: "statuses/friends",
                params: [twttr.merge(G, {
                    user_id: this.id
                })],
                dataSource: ["users"]
            })
        }),
        _isFollowing: function(I, H, G) {
            twttr.anywhere.remote.call("friendships/exists", [{
                user_a: I,
                user_b: H
            }], {
                success: G.success,
                error: G.error
            })
        },
        isFollowing: function(G, I) {
            I = twttr.anywhere.api.util.optify(I);
            var H = this.klass.identify(G);
            this._isFollowing(this.id, H, I)
        },
        isFriend: function(G, H) {
            this.isFollowing(G, H)
        },
        isFollowedBy: function(G, I) {
            I = twttr.anywhere.api.util.optify(I);
            var H = this.klass.identify(G);
            this._isFollowing(H, this.id, I)
        },
        isMutual: function(G, I) {
            I = twttr.anywhere.api.util.optify(I);
            var H = this.klass.identifier(G);
            twttr.anywhere.remote.call("friendships/show", [{
                source_id: this.id,
                target_id: H
            }], {
                success: function(J) {
                    I.success(J.relationship.source.following && J.relationship.source.followed_by)
                },
                error: I.error
            })
        },
        block: D("User",
        function(G) {
            B({
                options: G,
                url: "blocks/create",
                params: [twttr.merge(G, {
                    user_id: this.id
                })],
                dataSource: ["user"]
            })
        }),
        unblock: D("User",
        function(G) {
            B({
                options: G,
                url: "blocks/destroy",
                params: [twttr.merge(G, {
                    user_id: this.id
                })],
                dataSource: ["user"]
            })
        }),
        directMessage: D("DirectMessage",
        function(H, G) {
            B({
                options: G,
                url: "direct_messages/new",
                params: [{
                    user: this.id,
                    text: H
                }],
                dataSource: ["direct_message"]
            })
        }),
        dm: F("DirectMessage",
        function(H, G) {
            return this.directMessage(H, G)
        }),
        follow: D("User",
        function(G) {
            A(this);
            B({
                options: G,
                url: "friendships/create",
                params: [{
                    user_id: this.id
                }],
                dataSource: ["user"]
            })
        }),
        unfollow: D("User",
        function(G) {
            A(this);
            B({
                options: G,
                url: "friendships/destroy",
                params: [{
                    user_id: this.id
                }],
                dataSource: ["user"]
            })
        }),
        report: D("User",
        function(G) {
            B({
                options: G,
                url: "report_spam",
                params: [{
                    user_id: this.id
                }],
                dataSource: ["user"]
            })
        }),
        notifications: D("User",
        function(G, I) {
            A(this);
            var H = G == "on" ? "notifications/follow": "notifications/leave";
            B({
                options: I,
                url: H,
                params: [{
                    user_id: this.id
                }],
                dataSource: ["user"]
            })
        }),
        lists: D(["List"],
        function(G) {
            B({
                options: G,
                url: ":user/lists",
                params: [this.id, G],
                dataSource: ["lists_list", "lists"]
            })
        }),
        memberships: D(["List"],
        function(G) {
            G = twttr.anywhere.api.util.chainable(G);
            B({
                options: G,
                url: ":user/lists/memberships",
                params: [this.id, G],
                dataSource: ["lists_list", "lists"]
            })
        }),
        subscriptions: D(["List"],
        function(G) {
            G = twttr.anywhere.api.util.chainable(G);
            B({
                options: G,
                url: ":user/lists/subscriptions",
                params: [this.id, G],
                dataSource: ["lists_list", "lists"]
            })
        })
    });
    twttr.klass("twttr.anywhere.api.models.CurrentUser",
    function() {}).superclass(twttr.anywhere.api.models.User).methods({
        directMessages: D(["DirectMessage"],
        function(G) {
            B({
                options: G,
                url: "direct_messages",
                params: [G],
                dataSource: ["direct_messages"]
            })
        }),
        dms: F(["DirectMessage"],
        function(G) {
            return this.directMessages(G)
        }),
        receivedMessages: F(["DirectMessage"],
        function(G) {
            return this.directMessages(G)
        }),
        sentMessages: D(["DirectMesssage"],
        function(G) {
            B({
                options: G,
                url: "direct_messages/sent",
                params: [G],
                dataSource: ["direct_messages"]
            })
        }),
        homeTimeline: D(["Status"],
        function(H) {
            var G = "statuses/home_timeline";
            if (H.withoutRetweets) {
                G = "statuses/friends_timeline"
            }
            B({
                options: H,
                url: G,
                params: [H],
                dataSource: ["statuses"]
            })
        }),
        mentions: D(["Status"],
        function(G) {
            G = twttr.anywhere.api.util.chainable(G);
            B({
                options: G,
                url: "statuses/mentions",
                params: [G],
                dataSource: ["statuses"]
            })
        }),
        _retweets: D(["Status"],
        function(H, G) {
            B({
                options: G,
                url: H,
                params: [G],
                dataSource: ["statuses"]
            })
        }),
        retweeting: F(["Status"],
        function(G) {
            return this._retweets("statuses/retweeted_by_me", G)
        }),
        retweets: F(["Status"],
        function(G) {
            return this._retweets("statuses/retweeted_to_me", G)
        }),
        retweeted: F(["Status"],
        function(G) {
            return this._retweets("statuses/retweets_of_me", G)
        }),
        blocks: D(["User"],
        function(G) {
            B({
                options: G,
                url: "blocks/blocking",
                params: [G],
                dataSource: ["users"]
            })
        }),
        lists: F(["List"],
        function(G) {
            return this.uber.lists(G)
        }),
        isBlocking: function(G, I) {
            I = twttr.anywhere.api.util.optify(I);
            var H = this.klass.identify(G);
            twttr.anywhere.remote.call("blocks/exists", [{
                user_id: H
            }], {
                success: function(J) {
                    J.user ? I.success(true) : I.success(false)
                },
                error: function(J) {
                    J.status == 404 ? I.success(false) : I.error(J)
                }
            })
        },
        update: D("User",
        function(G) {
            A(this);
            E();
            B({
                options: G,
                url: "account/update",
                params: [G],
                dataSource: ["user"]
            })
        }),
        savedSearches: D(["SavedSearch"],
        function(G) {
            B({
                options: G,
                url: "saved_searches",
                params: [],
                dataSource: ["saved_searches"]
            })
        }),
        searches: F(["SavedSearch"],
        function(G) {
            return this.savedSearches(G)
        }),
        logout: function(G) {
            G = twttr.anywhere.api.util.optify(G);
            twttr.anywhere.remote.call("account/end_session", [], {
                success: function(H) {
                    G.success(H)
                },
                error: G.error
            })
        }
    });
    twttr.augmentObject(twttr.anywhere.api.models.CurrentUser.prototype.savedSearches, {
        create: D("SavedSearch",
        function(H, G) {
            B({
                options: G,
                url: "saved_searches/create",
                params: [{
                    query: H
                }],
                dataSource: ["saved_search"]
            })
        }),
        find: D("SavedSearch",
        function(H, G) {
            B({
                options: G,
                url: "saved_searches/show",
                params: [{
                    id: H
                }],
                dataSource: ["saved_search"]
            })
        })
    });
    twttr.augmentObject(twttr.anywhere.api.models.CurrentUser.prototype.lists, {
        find: D("List",
        function(H, G) {
            twttr.anywhere.api.models.User.current(function(I) {
                B({
                    options: G,
                    url: ":user/lists/:id",
                    params: [I.id, H],
                    dataSource: ["list"]
                })
            })
        }),
        create: D("List",
        function(H, G) {
            twttr.anywhere.api.models.User.current(function(I) {
                B({
                    options: G,
                    url: ":user/lists/create",
                    params: [I.id, twttr.merge(G, {
                        name: H
                    })],
                    dataSource: ["list"]
                })
            })
        })
    })
} ()); (function() {
    var B = twttr.anywhere.api.util.chainableMethod;
    var C = twttr.anywhere.api.util.aliasMethod;
    var A = twttr.anywhere.api.util.callMethod;
    twttr.anywhere.api.util.model("twttr.anywhere.api.models.DirectMessage",
    function(D) {}).belongsTo("User", "sender").belongsTo("User", "receipient").statics({
        send: B("DirectMessage",
        function(D, F, E) {
            A({
                options: E,
                url: "direct_messages/new",
                params: [{
                    user: twttr.anywhere.api.models.User.identify(D),
                    text: F
                }],
                dataSource: ["direct_message"]
            })
        })
    }).methods({
        destroy: B("DirectMessage",
        function(D) {
            A({
                options: D,
                url: "direct_messages/destroy",
                params: [{
                    id: this.id
                }],
                dataSource: ["direct_message"]
            })
        })
    })
} ()); (function() {
    var B = twttr.anywhere.api.util.chainableMethod;
    var C = twttr.anywhere.api.util.aliasMethod;
    var A = twttr.anywhere.api.util.callMethod;
    twttr.anywhere.api.util.model("twttr.anywhere.api.models.SavedSearch",
    function(D) {}).methods({
        destroy: B("SavedSearch",
        function(D) {
            A({
                options: D,
                url: "saved_searches/destroy",
                params: [{
                    id: this.id
                }],
                dataSource: ["saved_search"]
            })
        }),
        results: B(["SearchResult"],
        function(D) {
            D = twttr.anywhere.api.util.chainable(D);
            D.q = this.query;
            A({
                options: D,
                url: "search",
                params: [D],
                dataSource: ["", "results"]
            })
        })
    })
} ()); (function() {
    var B = twttr.anywhere.api.util.chainableMethod;
    var C = twttr.anywhere.api.util.aliasMethod;
    var A = twttr.anywhere.api.util.callMethod;
    twttr.anywhere.api.util.model("twttr.anywhere.api.models.List",
    function(D) {}).belongsTo("User").methods({
        subscribe: B("List",
        function(D) {
            A({
                options: D,
                url: ":user/:id/subscribers/create",
                params: [this.user.id, this.id],
                dataSource: ["list"]
            })
        }),
        follow: C("List",
        function(D) {
            return this.subscribe(D)
        }),
        unsubscribe: B("List",
        function(D) {
            A({
                options: D,
                url: ":user/:id/subscribers/destroy",
                params: [this.user.id, this.id],
                dataSource: ["list"]
            })
        }),
        unfollow: C("List",
        function(D) {
            return this.unsubscribe(D)
        }),
        add: B("List",
        function(D, E) {
            A({
                options: E,
                url: ":user/:list_id/members/create",
                params: [twttr.anywhere.api.models.User.identify(D), this.id],
                dataSource: ["list"]
            })
        }),
        remove: B("List",
        function(D, E) {
            A({
                options: E,
                url: ":user/:list_id/members/destroy",
                params: [twttr.anywhere.api.models.User.identify(D), this.id],
                dataSource: ["list"]
            })
        }),
        owner: function() {
            return this.user
        },
        isMember: function(D, F) {
            F = twttr.anywhere.api.util.optify(F);
            var E = F.success;
            F.success = function(G) {
                if (G.user) {
                    E(true)
                } else {
                    E(false)
                }
            };
            A({
                options: F,
                url: ":user/:list_id/members/:id",
                params: [this.user.id, this.id, twttr.anywhere.api.models.User.identify(D)],
                cast: twttr.anywhere.api.models.User,
                dataSource: ["user"]
            })
        },
        isSubscriber: function(D, F) {
            F = twttr.anywhere.api.util.optify(F);
            var E = F.success;
            F.success = function(G) {
                if (G.user) {
                    E(true)
                } else {
                    E(false)
                }
            };
            A({
                options: F,
                url: ":user/:list_id/subscribers/:id",
                params: [this.user.id, this.id, twttr.anywhere.api.models.User.identify(D)],
                cast: twttr.anywhere.api.models.User,
                dataSource: ["user"]
            })
        },
        destroy: B("List",
        function(D) {
            A({
                options: D,
                url: ":user/lists/:id/destroy",
                params: [this.user.id, this.id],
                dataSource: ["list"]
            })
        }),
        update: B("List",
        function(D) {
            A({
                options: D,
                url: ":user/lists/:id/create",
                params: [this.user.id, this.id, D],
                dataSource: ["list"]
            })
        }),
        statuses: B(["Status"],
        function(D) {
            A({
                options: D,
                url: ":user/lists/:id/statuses",
                params: [this.user.id, this.id, D],
                dataSource: ["statuses"]
            })
        }),
        subscribers: B(["User"],
        function(D) {
            A({
                options: D,
                url: ":user/:list_id/subscribers",
                params: [this.user.id, this.id, D],
                dataSource: ["users_list", "users"]
            })
        }),
        followers: C(["User"],
        function(D) {
            return this.subscribers(D)
        }),
        members: B(["User"],
        function(D) {
            A({
                options: D,
                url: ":user/:list_id/members",
                params: [this.user.id, this.id, D],
                dataSource: ["users_list", "users"]
            })
        }),
        following: C(["User"],
        function(D) {
            return this.members(D)
        })
    })
} ()); (function() {
    var B = twttr.anywhere.api.util.chainableMethod;
    var C = twttr.anywhere.api.util.aliasMethod;
    var A = twttr.anywhere.api.util.callMethod;
    twttr.anywhere.api.util.model("twttr.anywhere.api.models.Status",
    function(D) {}).belongsTo("User").belongsTo("Status", "retweeted_status").hasOne("Place").statics({
        identify: function(D) {
            var E = D;
            if (D instanceof this) {
                E = D.id
            }
            return E
        },
        find: B("Status",
        function(E, D) {
            A({
                options: D,
                url: "statuses/show",
                params: [{
                    id: E
                }],
                dataSource: ["status"]
            })
        }),
        update: B("Status",
        function(D, E) {
            A({
                options: E,
                url: "statuses/update",
                params: [twttr.merge({
                    status: D
                },
                E)],
                dataSource: ["status"]
            })
        }),
        publicTimeline: B(["Status"],
        function(D) {
            A({
                options: D,
                url: "statuses/public_timeline",
                params: [],
                dataSource: ["statuses"]
            })
        }),
        retweet: B("Status",
        function(D, F) {
            var E = this.identify(D);
            A({
                options: F,
                url: "statuses/retweet",
                params: [{
                    id: E
                }],
                dataSource: ["status"]
            })
        }),
        favorite: B("Status",
        function(D, F) {
            var E = this.identify(D);
            A({
                options: F,
                url: "favorites/create",
                params: [{
                    id: E
                }],
                dataSource: ["status"]
            })
        }),
        unfavorite: B("Status",
        function(D, F) {
            var E = this.identify(D);
            A({
                options: F,
                url: "favorites/destroy",
                params: [{
                    id: E
                }],
                dataSource: ["status"]
            })
        }),
        reply: C("Status",
        function(D, G, F) {
            var E = this.identify(D);
            F = twttr.merge(twttr.anywhere.api.util.optify(F), {
                in_reply_to_status_id: E
            });
            return this.update(G, F)
        }),
        search: B(["SearchResult"],
        function(E, D) {
            A({
                options: D,
                url: "search",
                params: [twttr.merge({
                    q: E
                },
                D)],
                dataSource: ["", "results"]
            })
        })
    }).methods(twttr.anywhere.api.mixins.StatusActions).methods({
        destroy: B("Status",
        function(D) {
            A({
                options: D,
                url: "statuses/destroy",
                params: [{
                    id: this.id
                }],
                dataSource: ["status"]
            })
        }),
        retweets: B(["Status"],
        function(D) {
            A({
                options: D,
                url: "statuses/retweets",
                params: [twttr.merge({
                    id: this.id
                },
                D)],
                dataSource: ["status"]
            })
        }),
        retweeters: B(["User"],
        function(D) {
            A({
                options: D,
                url: "statuses/:id/retweeted_by",
                params: [twttr.merge({
                    id: this.id
                },
                D)],
                dataSource: ["users"]
            })
        }),
        contributors: C(["User"],
        function(D) {
            return twttr.anywhere.api.models.User.findAll(this.contributors, D)
        }),
        inReplyTo: C("User",
        function(D) {
            D = twttr.anywhere.api.util.optify(D);
            if (this.in_reply_to_user_id) {
                return twttr.anywhere.api.models.User.find(this.in_reply_to_user_id, D)
            } else {
                D.success(null)
            }
        })
    })
} ()); (function() {
    var A = twttr.anywhere.api.util.aliasMethod;
    twttr.anywhere.api.util.model("twttr.anywhere.api.models.SearchResult",
    function(B) {}).methods(twttr.anywhere.api.mixins.StatusActions)
} ()); (function() {
    var B = twttr.anywhere.api.util.chainableMethod;
    var C = twttr.anywhere.api.util.aliasMethod;
    var A = twttr.anywhere.api.util.callMethod;
    twttr.anywhere.api.util.model("twttr.anywhere.api.models.Place",
    function(D) {}).belongsTo("Place", "contained_within").statics({
        find: B("Place",
        function(E, D) {
            A({
                options: D,
                url: "geo/id",
                params: [{
                    id: E
                }],
                dataSource: ["place"]
            })
        }),
        nearby: B(["Place"],
        function(D) {
            D = twttr.anywhere.api.util.chainable(D);
            A({
                options: D,
                url: "geo/reverse_geocode",
                params: [D],
                dataSource: ["", "result", "places"]
            })
        })
    })
} ());