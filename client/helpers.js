'use strict';

angular.module('kick4fun.helpers', [])

    .factory('Uri', function () {
            return {
                parse: function (str) {
                    var o = {
                            strictMode: false,
                            key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
                            q: {
                                name: "queryKey",
                                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
                            },
                            parser: {
                                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                            }
                        },
                        m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
                        uri = {},
                        i = 14;

                    while (i--) uri[o.key[i]] = m[i] || "";

                    uri[o.q.name] = {};
                    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
                        if ($1) uri[o.q.name][$1] = $2;
                    });

                    return uri;
                }
            }
        }
    );

