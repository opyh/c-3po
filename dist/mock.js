'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.t = t;
exports.jt = jt;
exports.msgid = msgid;
exports.gettext = gettext;
exports.ngettext = ngettext;
exports.useLocale = useLocale;
exports.addLocale = addLocale;
exports.setDedent = setDedent;
exports.setDefaultHeaders = setDefaultHeaders;
var buildStr = exports.buildStr = function buildStr(strs, exprs) {
    return strs.reduce(function (r, s, i) {
        return r + s + (exprs[i] || '');
    }, '');
};

function t(strings) {
    if (strings && strings.reduce) {
        for (var _len = arguments.length, exprs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            exprs[_key - 1] = arguments[_key];
        }

        return buildStr(strings, exprs);
    }
    return strings;
}

function jt(strings) {
    for (var _len2 = arguments.length, exprs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        exprs[_key2 - 1] = arguments[_key2];
    }

    if (strings && strings.reduce) {
        return strings.slice(1).reduce(function (r, s, i) {
            return r.concat(exprs[i], s);
        }, [strings[0]]);
    }
    return strings;
}

function msgid(strings) {
    if (strings && strings.reduce) {
        for (var _len3 = arguments.length, exprs = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            exprs[_key3 - 1] = arguments[_key3];
        }

        return buildStr(strings, exprs);
    }
    return strings;
}

function gettext(text) {
    return text;
}

function ngettext(str) {
    return str;
}

function useLocale() {}

function addLocale() {}

function setDedent() {}

function setDefaultHeaders() {}