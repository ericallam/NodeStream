(function() {
    var A = function(E, C) {
        var F = E.window,
        B = E.selector;
        this.options = C;
        this.fnComplete = function() {
            if (C.complete) {
                C.complete()
            }
            this.fnComplete = function() {}
        };
        this.sizes = {
            connect: {
                small: {
                    width: 129,
                    height: 19
                },
                medium: {
                    width: 146,
                    height: 23
                },
                large: {
                    width: 170,
                    height: 26
                },
                xlarge: {
                    width: 236,
                    height: 38
                }
            },
            connected: {
                small: {
                    width: 137,
                    height: 19
                },
                medium: {
                    width: 159,
                    height: 23
                },
                large: {
                    width: 182,
                    height: 26
                },
                xlarge: {
                    width: 258,
                    height: 38
                }
            }
        };
        var D = {
            verticalAlign: "middle"
        };
        function G(H, I) {
            H.$node.css({
                width: I.outerWidth(),
                height: I.outerHeight()
            })
        }
        twttr.IFrame.create({
            window: F,
            parentNode: B,
            content: {
                styles: twttr.stylesheets["connect_button.css"],
                body: '<span class="twitter-connect-init twitter-connect-init-' + C.size + '"><span>Loading...</span></span>'
            },
            css: twttr.merge(D, this.sizes.connected[C.size])
        },
        twttr.bind(this,
        function(H) {
            this.button = H;
            this.button.tabIndex = 0;
            H.jQuery("body").css({
                margin: 0,
                padding: 0
            });
            G(H, H.jQuery(".twitter-connect-init"));
            this.renderButton();
            H.jQuery("body").delegate("a", "click",
            function(I) {
                twttr.anywhere.authWindow();
                I.preventDefault()
            });
            E.client.bind("authComplete", twttr.bind(this,
            function(J, I) {
                this.renderButton();
                if (C.authComplete) {
                    C.authComplete(I)
                }
            }));
            E.client.bind("signOut", twttr.bind(this,
            function() {
                this.renderButton();
                if (C.signOut) {
                    C.signOut()
                }
            }))
        }))
    };
    A.prototype = {
        renderButton: function() {
            if (this.options.explanation && false) {
                twttr.anywhere.remote.call("connectExplanation", [], twttr.bind(this,
                function(B) {
                    this.button.jQuery("body").html(B);
                    twttr.anywhere.remote.call("connectButton", [], twttr.bind(this,
                    function(C) {
                        this.button.node.tabIndex = 0;
                        this.button.jQuery(".twitter-connect-box").append(C);
                        this.setSize();
                        this.fnComplete()
                    }))
                }))
            } else {
                twttr.anywhere.remote.call("connectButton", [], twttr.bind(this,
                function(B) {
                    this.button.node.tabIndex = 0;
                    this.button.jQuery("body").html(B);
                    this.setSize();
                    this.fnComplete()
                }))
            }
        },
        setSize: function() {
            this.button.jQuery(".twitter-connect-box").addClass("twitter-connect-box-" + this.options.size);
            this.button.jQuery("a.twitter-connect").addClass("twitter-connect-" + this.options.size);
            this.button.jQuery("span.twitter-connect").addClass("twitter-connected-" + this.options.size);
            var B = this.button.jQuery("body > *");
            if (this.options.explanation) {
                this.button.$node.css({
                    width: B.innerWidth() + 2 + "px",
                    height: B.innerHeight() + 2 + "px"
                })
            } else {
                if (this.button.jQuery("a.twitter-connect").length > 0) {
                    this.button.$node.css(this.sizes.connect[this.options.size])
                } else {
                    this.button.$node.css(this.sizes.connected[this.options.size])
                }
            }
        }
    };
    twttr.anywhere.connectButton = function(B, E, C) {
        var D = new A(B, E, C)
    }
} ());