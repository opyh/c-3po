'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.tWithLocale = tWithLocale;
exports.t = t;
exports.jtWithLocale = jtWithLocale;
exports.jt = jt;
exports.msgid = msgid;
exports.gettext = gettext;
exports.ngettextWithLocale = ngettextWithLocale;
exports.ngettext = ngettext;
exports.addLocale = addLocale;
exports.useLocale = useLocale;
exports.setDedent = setDedent;
exports.setDefaultHeaders = setDefaultHeaders;
exports.setHeaders = setHeaders;

var _utils = require('./utils');

var config = {
    locales: {},
    currentLocale: 'en',
    dedent: true,
    headers: _utils.defaultHeaders
};

function isFuzzy(translationObj) {
    return translationObj && translationObj.comments && translationObj.comments.flag === 'fuzzy';
}

function findTransObj(locale, str) {
    var locales = config.locales;

    var translation = locales[locale] && locales[locale].translations[''][str];
    return translation && !isFuzzy(translation) ? translation : null;
}

function maybeDedent(str) {
    return config.dedent ? (0, _utils.dedentIfConfig)(config, str) : str;
}

function tWithLocale(locale, strings) {
    var result = strings;
    if (strings && strings.reduce) {
        for (var _len = arguments.length, exprs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            exprs[_key - 2] = arguments[_key];
        }

        var id = maybeDedent((0, _utils.getMsgid)(strings, exprs));
        var transObj = findTransObj(locale, id);
        result = transObj ? (0, _utils.msgid2Orig)(transObj.msgstr[0], exprs) : (0, _utils.buildStr)(strings, exprs);
    }
    return maybeDedent(result);
}

function t(strings) {
    for (var _len2 = arguments.length, exprs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        exprs[_key2 - 1] = arguments[_key2];
    }

    return tWithLocale.apply(undefined, [config.currentLocale, strings].concat(exprs));
}

var separator = /(\${\s*\d+\s*})/g;
var slotIdRegexp = /\${\s*(\d+)\s*}/;

function jtWithLocale(locale, strings) {
    for (var _len3 = arguments.length, exprs = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        exprs[_key3 - 2] = arguments[_key3];
    }

    if (strings && strings.reduce) {
        var id = (0, _utils.getMsgid)(strings, exprs);
        var transObj = findTransObj(locale, id);
        if (!transObj) return (0, _utils.buildArr)(strings, exprs);

        // splits string & capturing group into tokens
        //
        var translatedTokens = transObj.msgstr[0].split(separator);

        return translatedTokens.map(function (token) {
            var slotIdMatch = token.match(slotIdRegexp);
            // slotIdMatch is not null only when the token is a variable slot (${xx})
            return slotIdMatch ? exprs[+slotIdMatch[1]] : token;
        });
    }
    return strings;
}

function jt(strings) {
    for (var _len4 = arguments.length, exprs = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        exprs[_key4 - 1] = arguments[_key4];
    }

    return jtWithLocale.apply(undefined, [config.currentLocale, strings].concat(exprs));
}

function msgid(strings) {
    /* eslint-disable no-new-wrappers */
    if (strings && strings.reduce) {
        for (var _len5 = arguments.length, exprs = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
            exprs[_key5 - 1] = arguments[_key5];
        }

        var result = new String((0, _utils.buildStr)(strings, exprs));
        result._strs = strings;
        result._exprs = exprs;
        return result;
    }

    return strings;
}

function gettext(id) {
    var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var transObj = findTransObj(locale || config.currentLocale, id);
    return transObj ? transObj.msgstr[0] : id;
}

function ngettextWithLocale(_ref) {
    var currentLocale = _ref.currentLocale,
        locales = _ref.locales;

    for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        args[_key6 - 1] = arguments[_key6];
    }

    var id = maybeDedent((0, _utils.getMsgid)(args[0]._strs, args[0]._exprs));
    var n = args[args.length - 1];
    var trans = findTransObj(currentLocale, id);
    var headers = trans ? locales[currentLocale].headers : config.headers;
    var pluralStr = (0, _utils.getPluralFunc)(headers);
    var pluralFn = (0, _utils.makePluralFunc)(pluralStr);
    var result = void 0;
    if (!trans) {
        var forms = args.slice(1, -1);
        forms.unshift(args[0].toString());
        result = pluralFn(n, forms);
    } else {
        result = (0, _utils.msgid2Orig)(pluralFn(n, trans.msgstr), args[0]._exprs);
    }

    return maybeDedent(result);
}

function ngettext() {
    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
    }

    return ngettextWithLocale.apply(undefined, [config].concat(args));
}

function addLocale(locale, data) {
    var replaceVariablesNames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    if (replaceVariablesNames) {
        data = (0, _utils.transformTranslateObj)(data);
    }
    config.locales[locale] = data;
}

function useLocale(locale) {
    config.currentLocale = locale;
}

function setDedent(value) {
    config.dedent = Boolean(value);
}

function setDefaultHeaders(headers) {
    config.headers = headers;
}

function setHeaders(headers) {
    /* eslint-disable no-console */
    (console.warn || console.log)('[DEPRECATED] setHeaders is deprecated, and will be removed in the' + ' next minor version 0.6, use setDefaultHeaders instead');
    setDefaultHeaders(headers);
}